// app/api/admitly/feedback/route.ts
//
// This single route replaces the old separate getFeedback-in-Apps-Script +
// /record combo. The Anthropic key now lives ONLY here, in a server
// environment variable — never in Apps Script, never in the Chrome
// extension, never in the web app's client-side code.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyGoogleAccessToken, extractBearerToken } from '@/lib/verifyGoogleToken';
import { corsHeaders } from '@/lib/admitlyCors';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FREE_LIMIT = 2;
const MODEL = 'claude-sonnet-4-6';

function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { headers: corsHeaders(req.headers.get('origin')) });
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req.headers.get('origin'));

  // ---- 1. Verify identity server-side. Never trust a client-sent email. ----
  const token = extractBearerToken(req.headers.get('authorization'));
  const email = await verifyGoogleAccessToken(token);
  if (!email) {
    return NextResponse.json({ error: 'Not signed in or token expired.' }, { status: 401, headers });
  }

  const { essayText, essayType } = await req.json();
  if (!essayText || typeof essayText !== 'string' || essayText.trim().length < 50) {
    return NextResponse.json({ error: 'Essay text too short.' }, { status: 400, headers });
  }
  // Basic sanity cap so one request can't blow up token costs.
  const trimmedEssay = essayText.slice(0, 8000);

  // ---- 2. Check / roll over usage for this verified email. ----
  const thisMonth = currentMonthKey();
  let { data: user } = await supabase.from('admitly_users').select('*').eq('email', email).single();

  if (!user) {
    const { data: created } = await supabase
      .from('admitly_users')
      .insert({ email, month_key: thisMonth })
      .select()
      .single();
    user = created;
  }

  if (user.month_key !== thisMonth && user.subscription_status !== 'active') {
    const { data: updated } = await supabase
      .from('admitly_users')
      .update({ essays_used_this_month: 0, month_key: thisMonth })
      .eq('email', email)
      .select()
      .single();
    user = updated;
  }

  const isPaid = user.subscription_status === 'active';
  const remainingCount = Math.max(0, FREE_LIMIT - user.essays_used_this_month);

  if (!isPaid && remainingCount <= 0) {
    return NextResponse.json(
      { error: 'PAYWALL', message: 'Free reviews used up for this month.' },
      { status: 402, headers }
    );
  }

  // ---- 3. Call Claude. Key only ever lives in this server env var. ----
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return NextResponse.json({ error: 'Server misconfigured.' }, { status: 500, headers });
  }

  const systemPrompt =
    'You are an experienced college admissions reader giving direct, specific ' +
    `feedback on a student essay (type: ${essayType || 'personal statement'}). You read ` +
    'hundreds of essays a season and can spot clichés and vague generalities instantly. ' +
    'Respond ONLY with valid JSON, no markdown fences, no preamble, matching exactly ' +
    'this shape: {' +
    '"overall": "2-3 sentence honest overview of what is working and what is not", ' +
    '"strengths": ["short phrase", "short phrase"], ' +
    '"flags": [{"quote": "short exact phrase from the essay, under 12 words", ' +
    '"issue": "what is wrong with it, one sentence", ' +
    '"rewrite": "a specific, concrete alternative phrase or sentence"}], ' +
    '"nextStep": "one concrete instruction for the next revision round"' +
    '}. Include 3-6 flags. Never be generic ("great job!") — always specific.';

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: trimmedEssay }],
    }),
  });

  if (!anthropicRes.ok) {
    return NextResponse.json({ error: 'Feedback generation failed.' }, { status: 502, headers });
  }

  const data = await anthropicRes.json();
  const textBlock = data.content.find((b: any) => b.type === 'text');
  if (!textBlock) {
    return NextResponse.json({ error: 'No feedback returned.' }, { status: 502, headers });
  }

  let feedback;
  try {
    const cleaned = textBlock.text.trim().replace(/^```json\s*/i, '').replace(/```$/, '');
    feedback = JSON.parse(cleaned);
  } catch {
    return NextResponse.json({ error: 'Could not parse feedback.' }, { status: 502, headers });
  }

  // ---- 4. Record usage for free users only. ----
  if (!isPaid) {
    await supabase
      .from('admitly_users')
      .update({ essays_used_this_month: user.essays_used_this_month + 1 })
      .eq('email', email);
  }

  return NextResponse.json(
    { feedback, remaining: isPaid ? null : remainingCount - 1, isPaid },
    { headers }
  );
}

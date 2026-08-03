// app/api/admitly/rewrite/route.ts
//
// Produces a full rewrite of the essay — same paywall rules as a regular
// review (it's a real Claude call, so it counts as one use for free-plan
// students, same as /feedback).

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

  const token = extractBearerToken(req.headers.get('authorization'));
  const email = await verifyGoogleAccessToken(token);
  if (!email) {
    return NextResponse.json({ error: 'Not signed in or token expired.' }, { status: 401, headers });
  }

  const { essayId, essayText, essayType } = await req.json();
  if (!essayText || typeof essayText !== 'string' || essayText.trim().length < 50) {
    return NextResponse.json({ error: 'Essay text too short.' }, { status: 400, headers });
  }
  const trimmedEssay = essayText.slice(0, 8000);

  const thisMonth = currentMonthKey();
  let { data: user } = await supabase.from('admitly_users').select('*').eq('email', email).single();

  if (!user) {
    return NextResponse.json({ error: 'Get a regular review first.' }, { status: 400, headers });
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

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return NextResponse.json({ error: 'Server misconfigured.' }, { status: 500, headers });
  }

  const systemPrompt =
    'You are an expert writing coach. Read this student\'s draft carefully and rewrite it ' +
    'fixing structure, clarity, clichés, and weak openings. The most important thing: actually ' +
    'write in THIS student\'s specific voice. Notice their real sentence lengths, their word ' +
    'choices, their level of formality, their natural rhythm — and match it, rather than ' +
    'defaulting to generic "polished" writing. Preserve every specific detail, fact, and ' +
    'personal experience exactly as given; never invent new events, names, or details that ' +
    'were not in the original. ' +
    'Two hard rules on style: never use an em dash (—) anywhere, use commas, periods, or ' +
    'parentheses instead; and avoid writing that sounds AI-generated — no "it\'s not just X, ' +
    'it\'s Y" constructions, no overly tidy parallel structures, no words like "tapestry," ' +
    '"testament," "delve," or "boundless." Write the way this specific student would actually ' +
    'write it once they cleaned it up themselves, not the way a different, more polished ' +
    `writer would. Essay type: ${essayType || 'personal statement'}. ` +
    'Respond with ONLY the rewritten essay text, no preamble, no explanation, no markdown.';

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: trimmedEssay }],
    }),
  });

  if (!anthropicRes.ok) {
    return NextResponse.json({ error: 'Rewrite generation failed.' }, { status: 502, headers });
  }

  const data = await anthropicRes.json();
  const textBlock = data.content.find((b: any) => b.type === 'text');
  if (!textBlock) {
    return NextResponse.json({ error: 'No rewrite returned.' }, { status: 502, headers });
  }

  const rewrite = textBlock.text.trim();

  if (!isPaid) {
    await supabase
      .from('admitly_users')
      .update({ essays_used_this_month: user.essays_used_this_month + 1 })
      .eq('email', email);
  }

  if (essayId) {
    await supabase.from('admitly_essays').update({ rewrite }).eq('id', essayId).eq('email', email);
  }

  return NextResponse.json(
    { rewrite, remaining: isPaid ? null : remainingCount - 1, isPaid },
    { headers }
  );
}

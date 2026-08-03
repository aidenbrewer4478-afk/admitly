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
    'You are an expert writing coach. Rewrite the essay you are given, fixing structure, ' +
    'clarity, clichés, and weak openings — but you MUST preserve the writer\'s own voice, ' +
    'their specific details, facts, and personal experiences exactly as given. Do not invent ' +
    'new events, names, or details that were not in the original. Do not make it sound like a ' +
    'different person wrote it — tighten and sharpen their actual writing, don\'t replace it ' +
    `with generic polished prose. Essay type: ${essayType || 'personal statement'}. ` +
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

// app/api/admitly/usage/route.ts
// Read-only status check (used to show "X reviews left" without spending
// a Claude call). Same identity verification as /feedback.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyGoogleAccessToken, extractBearerToken } from '@/lib/verifyGoogleToken';
import { corsHeaders } from '@/lib/admitlyCors';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FREE_LIMIT = 2;

function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { headers: corsHeaders(req.headers.get('origin')) });
}

export async function GET(req: NextRequest) {
  const headers = corsHeaders(req.headers.get('origin'));

  const token = extractBearerToken(req.headers.get('authorization'));
  const email = await verifyGoogleAccessToken(token);
  if (!email) {
    return NextResponse.json({ error: 'Not signed in or token expired.' }, { status: 401, headers });
  }

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

  return NextResponse.json({ isPaid, remaining: isPaid ? 0 : remainingCount }, { headers });
}

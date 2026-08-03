// app/api/admitly/history/route.ts
//
// Returns the signed-in user's past essays, most recent first — this is
// what backs the "version history" feature promised on the paid plan.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyGoogleAccessToken, extractBearerToken } from '@/lib/verifyGoogleToken';
import { corsHeaders } from '@/lib/admitlyCors';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

  const essayId = req.nextUrl.searchParams.get('id');

  if (essayId) {
    const { data: essay, error } = await supabase
      .from('admitly_essays')
      .select('id, essay_type, essay_text, feedback, rewrite, created_at')
      .eq('email', email)
      .eq('id', essayId)
      .single();

    if (error || !essay) {
      return NextResponse.json({ error: 'Essay not found.' }, { status: 404, headers });
    }

    return NextResponse.json(
      {
        id: essay.id,
        essayType: essay.essay_type,
        essayText: essay.essay_text,
        feedback: essay.feedback,
        rewrite: essay.rewrite,
        createdAt: essay.created_at,
      },
      { headers }
    );
  }

  const { data: essays, error } = await supabase
    .from('admitly_essays')
    .select('id, essay_type, essay_text, feedback, rewrite, created_at')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: 'Could not load history.' }, { status: 500, headers });
  }

  // Send back a short preview of the essay text, not the whole thing, to
  // keep the list itself light — full text comes back if a specific one
  // is requested via essayId later.
  const list = (essays || []).map((e: any) => ({
    id: e.id,
    essayType: e.essay_type,
    preview: e.essay_text.slice(0, 80),
    score: e.feedback?.score ?? null,
    hasRewrite: !!e.rewrite,
    createdAt: e.created_at,
  }));

  return NextResponse.json({ essays: list }, { headers });
}

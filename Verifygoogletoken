// lib/verifyGoogleToken.ts
//
// Core security fix: we never trust an "email" field sent by the client.
// Instead, every request must include a real Google OAuth access token
// (Authorization: Bearer <token>), and THIS function asks Google directly
// "whose token is this, and is it still valid?" The email we get back from
// Google is the only email we ever use to check usage, record usage, or
// create a Stripe checkout. A client cannot forge this — they'd need an
// actual valid Google access token for the account they're claiming to be.

export async function verifyGoogleAccessToken(accessToken: string): Promise<string | null> {
  if (!accessToken) return null;

  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) return null; // expired/invalid/revoked token

    const data = await res.json();
    if (!data.email || data.email_verified !== true && data.email_verified !== 'true') {
      // Reject unverified email addresses on the Google account.
      return null;
    }
    return data.email as string;
  } catch {
    return null;
  }
}

/**
 * Pulls the bearer token out of a standard Authorization header.
 */
export function extractBearerToken(authHeader: string | null): string {
  if (!authHeader) return '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : '';
}

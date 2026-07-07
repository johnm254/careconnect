import { SignJWT, jwtVerify } from 'jose';

export type AuthKind = 'staff';

export interface SessionPayload {
  sub: string;
  kind: AuthKind;
  role: string;
  staffId: number;
  tv: number;
  [key: string]: unknown;
}

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
export const SESSION_RENEW_THRESHOLD_SECONDS = 3.5 * 24 * 60 * 60; // reissue when <3.5 days remain

export async function signSession(secret: string, payload: SessionPayload): Promise<string> {
  const key = new TextEncoder().encode(secret);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(key);
}

export async function verifySession(secret: string, token: string): Promise<(SessionPayload & { exp: number; iat: number }) | null> {
  try {
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key);
    return payload as SessionPayload & { exp: number; iat: number };
  } catch {
    return null;
  }
}

export function shouldRenew(exp: number): boolean {
  const remaining = exp - Math.floor(Date.now() / 1000);
  return remaining < SESSION_RENEW_THRESHOLD_SECONDS;
}

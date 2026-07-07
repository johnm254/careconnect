import type { Context, Next } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import type { Env } from '../index';
import { signSession, verifySession, shouldRenew, type SessionPayload } from '../lib/jwt';

export const SESSION_COOKIE = 'cc_session';

export async function issueSession(c: Context<{ Bindings: Env }>, payload: SessionPayload) {
  const token = await signSession(c.env.JWT_SECRET, payload);
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: c.env.APP_ENV !== 'development',
    sameSite: 'Lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function clearSession(c: Context<{ Bindings: Env }>) {
  deleteCookie(c, SESSION_COOKIE, { path: '/' });
}

declare module 'hono' {
  interface ContextVariableMap {
    auth: SessionPayload;
  }
}

export function requireAuth() {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const token = getCookie(c, SESSION_COOKIE);
    if (!token) return c.json({ error: 'Not authenticated' }, 401);

    const payload = await verifySession(c.env.JWT_SECRET, token);
    if (!payload) return c.json({ error: 'Invalid or expired session' }, 401);

    const userRow = await c.env.DB.prepare('SELECT token_version, is_active FROM users WHERE staff_id = ?')
      .bind(payload.staffId)
      .first<{ token_version: number; is_active: number }>();

    if (!userRow || userRow.token_version !== payload.tv) {
      return c.json({ error: 'Session no longer valid' }, 401);
    }
    if (!userRow.is_active) {
      return c.json({ error: 'Account disabled' }, 403);
    }

    c.set('auth', payload);

    if (shouldRenew(payload.exp)) {
      await issueSession(c, {
        sub: payload.sub,
        kind: payload.kind,
        role: payload.role,
        staffId: payload.staffId,
        tv: payload.tv,
      });
    }

    await next();
  };
}

export function requireRole(...roles: string[]) {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const auth = c.get('auth');
    if (!auth || !roles.includes(auth.role)) {
      return c.json({ error: 'Forbidden' }, 403);
    }
    await next();
  };
}

import { Hono } from 'hono';
import type { Env } from '../index';
import { hashPassword, verifyPassword } from '../lib/passwords';
import { issueSession, clearSession, requireAuth } from '../middleware/auth';

const auth = new Hono<{ Bindings: Env }>();

interface StaffUserRow {
  id: number;
  staff_id: number;
  email: string;
  password_hash: string;
  role: string;
  token_version: number;
  is_active: number;
}

interface StaffRow {
  id: number;
  staff_number: string;
  full_name: string;
  role: string;
  employment_status: string;
}

auth.post('/staff/login', async (c) => {
  const body = await c.req.json<{ email?: string; password?: string }>().catch(() => (({}) as { email?: string; password?: string }));
  const { email, password } = body;
  if (!email || !password) return c.json({ error: 'Email and password are required' }, 400);

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<StaffUserRow>();
  if (!user || !user.is_active) return c.json({ error: 'Invalid credentials' }, 401);

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return c.json({ error: 'Invalid credentials' }, 401);

  const staff = await c.env.DB.prepare('SELECT * FROM staff WHERE id = ?').bind(user.staff_id).first<StaffRow>();
  if (!staff || staff.employment_status === 'terminated') {
    return c.json({ error: 'Account is no longer active' }, 403);
  }

  await c.env.DB.prepare('UPDATE users SET last_login_at = datetime(\'now\') WHERE id = ?').bind(user.id).run();

  await issueSession(c, {
    sub: String(user.id),
    kind: 'staff',
    role: user.role,
    staffId: user.staff_id,
    tv: user.token_version,
  });

  return c.json({
    kind: 'staff',
    role: user.role,
    staff: { id: staff.id, staffNumber: staff.staff_number, fullName: staff.full_name },
  });
});

auth.get('/me', requireAuth(), async (c) => {
  const session = c.get('auth');

  const staff = await c.env.DB.prepare('SELECT * FROM staff WHERE id = ?').bind(session.staffId).first<StaffRow>();
  if (!staff) return c.json({ error: 'Not found' }, 404);
  return c.json({
    kind: 'staff',
    role: session.role,
    staff: { id: staff.id, staffNumber: staff.staff_number, fullName: staff.full_name, role: staff.role },
  });
});

auth.post('/logout', async (c) => {
  clearSession(c);
  return c.json({ success: true });
});

auth.post('/change-password', requireAuth(), async (c) => {
  const session = c.get('auth');
  const body = await c.req.json<{ currentPassword?: string; newPassword?: string }>().catch(() => (({}) as { currentPassword?: string; newPassword?: string }));
  const { currentPassword, newPassword } = body;
  if (!currentPassword || !newPassword) {
    return c.json({ error: 'Current and new password are required' }, 400);
  }
  if (newPassword.length < 8) {
    return c.json({ error: 'New password must be at least 8 characters' }, 400);
  }

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE staff_id = ?')
    .bind(session.staffId)
    .first<StaffUserRow>();
  if (!user || !(await verifyPassword(currentPassword, user.password_hash))) {
    return c.json({ error: 'Current password is incorrect' }, 401);
  }
  const newHash = await hashPassword(newPassword);
  await c.env.DB.prepare('UPDATE users SET password_hash = ?, token_version = token_version + 1 WHERE id = ?')
    .bind(newHash, user.id)
    .run();

  clearSession(c);
  return c.json({ success: true, message: 'Password changed, please log in again' });
});

export default auth;

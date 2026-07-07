import { Hono } from 'hono';
import type { Env } from '../index';
import { requireAuth, requireRole } from '../middleware/auth';
import { nextFormattedId } from '../lib/idCounters';
import { hashPassword } from '../lib/passwords';

const staff = new Hono<{ Bindings: Env }>();

const STAFF_ROLES = ['admin', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'accountant', 'other'];

interface StaffInput {
  fullName: string;
  role: string;
  specialization?: string;
  departmentId?: number;
  phone?: string;
  email?: string;
  hireDate?: string;
  contractType?: string;
  baseSalary?: number;
  emergencyContact?: string;
  address?: string;
  scheduleNote?: string;
  password?: string;
}

staff.get('/', requireAuth(), async (c) => {
  const search = c.req.query('search');
  const department = c.req.query('departmentId');
  const role = c.req.query('role');

  let query = 'SELECT * FROM staff WHERE 1=1';
  const binds: unknown[] = [];
  if (search) {
    query += ' AND (full_name LIKE ? OR staff_number LIKE ? OR email LIKE ?)';
    binds.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (department) {
    query += ' AND department_id = ?';
    binds.push(department);
  }
  if (role) {
    query += ' AND role = ?';
    binds.push(role);
  }
  query += ' ORDER BY full_name';

  const { results } = await c.env.DB.prepare(query).bind(...binds).all();
  return c.json(results);
});

staff.post('/', requireAuth(), requireRole('admin'), async (c) => {
  const body = await c.req.json<StaffInput>().catch(() => null);
  if (!body?.fullName || !body.role) return c.json({ error: 'Full name and role are required' }, 400);
  if (!STAFF_ROLES.includes(body.role)) return c.json({ error: 'Invalid role' }, 400);

  const staffNumber = await nextFormattedId(c.env.DB, 'STAFF');

  const staffRow = await c.env.DB.prepare(
    `INSERT INTO staff (staff_number, full_name, role, specialization, department_id, phone, email, hire_date, contract_type, base_salary, emergency_contact, address, schedule_note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
  )
    .bind(
      staffNumber,
      body.fullName,
      body.role,
      body.specialization ?? null,
      body.departmentId ?? null,
      body.phone ?? null,
      body.email ?? null,
      body.hireDate ?? null,
      body.contractType ?? null,
      body.baseSalary ?? null,
      body.emergencyContact ?? null,
      body.address ?? null,
      body.scheduleNote ?? null
    )
    .first<{ id: number }>();

  if (body.email && body.password) {
    const passwordHash = await hashPassword(body.password);
    await c.env.DB.prepare('INSERT INTO users (staff_id, email, password_hash, role) VALUES (?, ?, ?, ?)')
      .bind(staffRow!.id, body.email, passwordHash, body.role)
      .run();
  }

  return c.json(staffRow, 201);
});

staff.get('/:id', requireAuth(), async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM staff WHERE id = ?').bind(c.req.param('id')).first();
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(row);
});

staff.patch('/:id', requireAuth(), requireRole('admin'), async (c) => {
  const id = c.req.param('id');
  const existing = await c.env.DB.prepare('SELECT * FROM staff WHERE id = ?').bind(id).first<Record<string, unknown>>();
  if (!existing) return c.json({ error: 'Not found' }, 404);

  const body = await c.req.json<Partial<StaffInput> & { isAvailable?: boolean; employmentStatus?: string }>().catch(() => (({}) as Partial<StaffInput> & { isAvailable?: boolean; employmentStatus?: string }));

  const result = await c.env.DB.prepare(
    `UPDATE staff SET full_name = ?, role = ?, specialization = ?, department_id = ?, phone = ?, email = ?,
       contract_type = ?, base_salary = ?, emergency_contact = ?, address = ?, schedule_note = ?,
       is_available = ?, employment_status = ?, updated_at = datetime('now')
     WHERE id = ? RETURNING *`
  )
    .bind(
      body.fullName ?? existing.full_name,
      body.role ?? existing.role,
      body.specialization ?? existing.specialization,
      body.departmentId ?? existing.department_id,
      body.phone ?? existing.phone,
      body.email ?? existing.email,
      body.contractType ?? existing.contract_type,
      body.baseSalary ?? existing.base_salary,
      body.emergencyContact ?? existing.emergency_contact,
      body.address ?? existing.address,
      body.scheduleNote ?? existing.schedule_note,
      body.isAvailable !== undefined ? (body.isAvailable ? 1 : 0) : existing.is_available,
      body.employmentStatus ?? existing.employment_status,
      id
    )
    .first();

  return c.json(result);
});

staff.delete('/:id', requireAuth(), requireRole('admin'), async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare(
    "UPDATE staff SET employment_status = 'terminated', is_available = 0, updated_at = datetime('now') WHERE id = ?"
  )
    .bind(id)
    .run();
  await c.env.DB.prepare('UPDATE users SET is_active = 0, token_version = token_version + 1 WHERE staff_id = ?')
    .bind(id)
    .run();
  return c.json({ success: true });
});

export default staff;

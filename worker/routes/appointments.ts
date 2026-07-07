import { Hono } from 'hono';
import type { Env } from '../index';
import { requireAuth, requireRole } from '../middleware/auth';

const appointments = new Hono<{ Bindings: Env }>();

interface AppointmentInput {
  patientId: number;
  doctorId: number;
  departmentId?: number;
  scheduledDate: string;
  scheduledTime: string;
  reason?: string;
  notes?: string;
  status?: string;
}

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'];

appointments.get('/', requireAuth(), async (c) => {
  const date = c.req.query('date');
  const doctorId = c.req.query('doctorId');
  const patientId = c.req.query('patientId');
  const status = c.req.query('status');

  let query = `
    SELECT a.*, p.full_name AS patient_name, p.patient_number, s.full_name AS doctor_name
    FROM appointments a
    JOIN patients p ON p.id = a.patient_id
    JOIN staff s ON s.id = a.doctor_id
    WHERE 1=1`;
  const binds: unknown[] = [];
  if (date) {
    query += ' AND a.scheduled_date = ?';
    binds.push(date);
  }
  if (doctorId) {
    query += ' AND a.doctor_id = ?';
    binds.push(doctorId);
  }
  if (patientId) {
    query += ' AND a.patient_id = ?';
    binds.push(patientId);
  }
  if (status) {
    query += ' AND a.status = ?';
    binds.push(status);
  }
  query += ' ORDER BY a.scheduled_date DESC, a.scheduled_time DESC';

  const { results } = await c.env.DB.prepare(query).bind(...binds).all();
  return c.json(results);
});

appointments.post('/', requireAuth(), requireRole('admin', 'doctor', 'nurse', 'receptionist'), async (c) => {
  const body = await c.req.json<AppointmentInput>().catch(() => null);
  if (!body?.patientId || !body.doctorId || !body.scheduledDate || !body.scheduledTime) {
    return c.json({ error: 'Patient, doctor, date and time are required' }, 400);
  }

  const row = await c.env.DB.prepare(
    `INSERT INTO appointments (patient_id, doctor_id, department_id, scheduled_date, scheduled_time, reason, notes, status, booked_via)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'staff') RETURNING *`
  )
    .bind(
      body.patientId,
      body.doctorId,
      body.departmentId ?? null,
      body.scheduledDate,
      body.scheduledTime,
      body.reason ?? null,
      body.notes ?? null,
      body.status ?? 'pending'
    )
    .first();

  return c.json(row, 201);
});

appointments.get('/:id', requireAuth(), async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM appointments WHERE id = ?').bind(c.req.param('id')).first();
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(row);
});

appointments.patch('/:id', requireAuth(), requireRole('admin', 'doctor', 'nurse', 'receptionist'), async (c) => {
  const id = c.req.param('id');
  const existing = await c.env.DB.prepare('SELECT * FROM appointments WHERE id = ?')
    .bind(id)
    .first<Record<string, unknown>>();
  if (!existing) return c.json({ error: 'Not found' }, 404);

  const body = await c.req.json<Partial<AppointmentInput>>().catch(() => (({}) as Partial<AppointmentInput>));
  if (body.status && !STATUSES.includes(body.status)) return c.json({ error: 'Invalid status' }, 400);

  const result = await c.env.DB.prepare(
    `UPDATE appointments SET doctor_id = ?, department_id = ?, scheduled_date = ?, scheduled_time = ?, reason = ?, notes = ?, status = ?, updated_at = datetime('now')
     WHERE id = ? RETURNING *`
  )
    .bind(
      body.doctorId ?? existing.doctor_id,
      body.departmentId ?? existing.department_id,
      body.scheduledDate ?? existing.scheduled_date,
      body.scheduledTime ?? existing.scheduled_time,
      body.reason ?? existing.reason,
      body.notes ?? existing.notes,
      body.status ?? existing.status,
      id
    )
    .first();

  return c.json(result);
});

appointments.delete('/:id', requireAuth(), requireRole('admin', 'receptionist'), async (c) => {
  await c.env.DB.prepare('DELETE FROM appointments WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

export default appointments;

import { Hono } from 'hono';
import type { Env } from '../index';
import { requireAuth, requireRole } from '../middleware/auth';
import { nextFormattedId } from '../lib/idCounters';

const patients = new Hono<{ Bindings: Env }>();

// Excludes password_hash/token_version — never returned to clients.
const PATIENT_COLUMNS = `id, patient_number, id_number, full_name, date_of_birth, age, gender, phone, address,
  blood_group, emergency_contact, insurance_id, assigned_doctor_id, assigned_nurse_id, portal_enabled,
  registered_at, last_visit_at, created_by_staff_id, created_at, updated_at`;

interface PatientInput {
  fullName: string;
  idNumber?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  phone: string;
  address?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  insuranceId?: string;
  assignedDoctorId?: number;
  assignedNurseId?: number;
}

patients.get('/', requireAuth(), async (c) => {
  const search = c.req.query('search');
  let query = `SELECT ${PATIENT_COLUMNS} FROM patients WHERE 1=1`;
  const binds: unknown[] = [];
  if (search) {
    query += ' AND (full_name LIKE ? OR patient_number LIKE ? OR phone LIKE ? OR id_number LIKE ?)';
    binds.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }
  query += ' ORDER BY created_at DESC';

  const { results } = await c.env.DB.prepare(query).bind(...binds).all();
  return c.json(results);
});

patients.post('/', requireAuth(), requireRole('admin', 'receptionist', 'nurse', 'doctor'), async (c) => {
  const body = await c.req.json<PatientInput>().catch(() => null);
  if (!body?.fullName || !body.phone) return c.json({ error: 'Full name and phone are required' }, 400);

  const auth = c.get('auth');
  const patientNumber = await nextFormattedId(c.env.DB, 'PATIENT');

  const row = await c.env.DB.prepare(
    `INSERT INTO patients (patient_number, id_number, full_name, date_of_birth, age, gender, phone, address, blood_group, emergency_contact, insurance_id, assigned_doctor_id, assigned_nurse_id, created_by_staff_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING ${PATIENT_COLUMNS}`
  )
    .bind(
      patientNumber,
      body.idNumber ?? null,
      body.fullName,
      body.dateOfBirth ?? null,
      body.age ?? null,
      body.gender ?? null,
      body.phone,
      body.address ?? null,
      body.bloodGroup ?? null,
      body.emergencyContact ?? null,
      body.insuranceId ?? null,
      body.assignedDoctorId ?? null,
      body.assignedNurseId ?? null,
      auth.staffId ?? null
    )
    .first();

  return c.json(row, 201);
});

patients.get('/:id', requireAuth(), async (c) => {
  const row = await c.env.DB.prepare(`SELECT ${PATIENT_COLUMNS} FROM patients WHERE id = ?`).bind(c.req.param('id')).first();
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(row);
});

patients.patch('/:id', requireAuth(), requireRole('admin', 'receptionist', 'nurse', 'doctor'), async (c) => {
  const id = c.req.param('id');
  const existing = await c.env.DB.prepare('SELECT * FROM patients WHERE id = ?').bind(id).first<Record<string, unknown>>();
  if (!existing) return c.json({ error: 'Not found' }, 404);

  const body = await c.req.json<Partial<PatientInput>>().catch(() => (({}) as Partial<PatientInput>));

  const result = await c.env.DB.prepare(
    `UPDATE patients SET full_name = ?, id_number = ?, date_of_birth = ?, age = ?, gender = ?, phone = ?, address = ?,
       blood_group = ?, emergency_contact = ?, insurance_id = ?, assigned_doctor_id = ?, assigned_nurse_id = ?,
       updated_at = datetime('now')
     WHERE id = ? RETURNING ${PATIENT_COLUMNS}`
  )
    .bind(
      body.fullName ?? existing.full_name,
      body.idNumber ?? existing.id_number,
      body.dateOfBirth ?? existing.date_of_birth,
      body.age ?? existing.age,
      body.gender ?? existing.gender,
      body.phone ?? existing.phone,
      body.address ?? existing.address,
      body.bloodGroup ?? existing.blood_group,
      body.emergencyContact ?? existing.emergency_contact,
      body.insuranceId ?? existing.insurance_id,
      body.assignedDoctorId ?? existing.assigned_doctor_id,
      body.assignedNurseId ?? existing.assigned_nurse_id,
      id
    )
    .first();

  return c.json(result);
});

patients.delete('/:id', requireAuth(), requireRole('admin'), async (c) => {
  const id = c.req.param('id');
  const deps = await c.env.DB.prepare(
    'SELECT (SELECT COUNT(*) FROM appointments WHERE patient_id = ?) + (SELECT COUNT(*) FROM payments WHERE patient_id = ?) AS count'
  )
    .bind(id, id)
    .first<{ count: number }>();

  if (deps && deps.count > 0) {
    return c.json({ error: 'Cannot delete a patient with existing appointments or payments' }, 409);
  }

  await c.env.DB.prepare('DELETE FROM patients WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

patients.get('/:id/appointments', requireAuth(), async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM appointments WHERE patient_id = ? ORDER BY scheduled_date DESC, scheduled_time DESC'
  )
    .bind(c.req.param('id'))
    .all();
  return c.json(results);
});

patients.get('/:id/consultations', requireAuth(), async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM consultations WHERE patient_id = ? ORDER BY visit_date DESC')
    .bind(c.req.param('id'))
    .all();
  return c.json(results);
});

patients.get('/:id/payments', requireAuth(), async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM payments WHERE patient_id = ? ORDER BY issued_date DESC')
    .bind(c.req.param('id'))
    .all();
  return c.json(results);
});

export default patients;

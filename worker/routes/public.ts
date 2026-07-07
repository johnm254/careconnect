import { Hono } from 'hono';
import type { Env } from '../index';
import { nextFormattedId } from '../lib/idCounters';
import { sendBookingConfirmationEmail } from '../lib/email';

const publicRoutes = new Hono<{ Bindings: Env }>();

interface BookingRequest {
  patientName: string;
  patientEmail?: string;
  patientPhone: string;
  doctorId: number;
  departmentId?: number;
  date: string;
  time: string;
  reason?: string;
}

publicRoutes.get('/departments', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM departments ORDER BY name').all();
  return c.json(results);
});

publicRoutes.get('/doctors', async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, full_name, specialization, department_id FROM staff WHERE role = 'doctor' AND employment_status = 'active' AND is_available = 1 ORDER BY full_name"
  ).all();
  return c.json(results);
});

publicRoutes.post('/book-consultation', async (c) => {
  const body = await c.req.json<BookingRequest>().catch(() => null);
  if (!body?.patientName || !body.patientPhone || !body.doctorId || !body.date || !body.time) {
    return c.json({ error: 'Name, phone, doctor, date, and time are required' }, 400);
  }

  let patient = await c.env.DB.prepare('SELECT * FROM patients WHERE phone = ?')
    .bind(body.patientPhone)
    .first<{ id: number; patient_number: string }>();

  if (!patient) {
    const patientNumber = await nextFormattedId(c.env.DB, 'PATIENT');
    patient = await c.env.DB.prepare(
      'INSERT INTO patients (patient_number, full_name, phone) VALUES (?, ?, ?) RETURNING id, patient_number'
    )
      .bind(patientNumber, body.patientName, body.patientPhone)
      .first<{ id: number; patient_number: string }>();
  }

  const appointment = await c.env.DB.prepare(
    `INSERT INTO appointments (patient_id, doctor_id, department_id, scheduled_date, scheduled_time, reason, status, booked_via)
     VALUES (?, ?, ?, ?, ?, ?, 'pending', 'public') RETURNING *`
  )
    .bind(patient!.id, body.doctorId, body.departmentId ?? null, body.date, body.time, body.reason ?? null)
    .first();

  let emailSent = false;
  if (body.patientEmail && c.env.RESEND_API_KEY) {
    try {
      const doctor = await c.env.DB.prepare('SELECT full_name FROM staff WHERE id = ?').bind(body.doctorId).first<{ full_name: string }>();
      const department = body.departmentId
        ? await c.env.DB.prepare('SELECT name FROM departments WHERE id = ?').bind(body.departmentId).first<{ name: string }>()
        : null;

      await sendBookingConfirmationEmail(c.env.RESEND_API_KEY, {
        patientName: body.patientName,
        patientEmail: body.patientEmail,
        patientPhone: body.patientPhone,
        doctorName: doctor?.full_name ?? '',
        department: department?.name ?? '',
        date: body.date,
        time: body.time,
        bookingRef: patient!.patient_number,
        reason: body.reason,
      });
      emailSent = true;
    } catch (err) {
      console.error('Failed to send booking confirmation email', err);
    }
  }

  return c.json({ patientNumber: patient!.patient_number, appointment, emailSent }, 201);
});

export default publicRoutes;

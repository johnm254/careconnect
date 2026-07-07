import { Hono } from 'hono';
import type { Env } from '../index';
import { requireAuth, requireRole } from '../middleware/auth';

const hr = new Hono<{ Bindings: Env }>();

const adminOnly = requireRole('admin');

// ---- Leave Requests ----

hr.get('/leave-requests', requireAuth(), async (c) => {
  const status = c.req.query('status');
  let query = `SELECT l.*, s.full_name AS staff_name FROM leave_requests l JOIN staff s ON s.id = l.staff_id WHERE 1=1`;
  const binds: unknown[] = [];
  if (status) {
    query += ' AND l.status = ?';
    binds.push(status);
  }
  query += ' ORDER BY l.requested_at DESC';
  const { results } = await c.env.DB.prepare(query).bind(...binds).all();
  return c.json(results);
});

hr.post('/leave-requests', requireAuth(), async (c) => {
  const body = await c.req
    .json<{ staffId?: number; leaveType?: string; startDate?: string; endDate?: string; reason?: string }>()
    .catch(() => null);
  if (!body?.staffId || !body.leaveType || !body.startDate || !body.endDate) {
    return c.json({ error: 'Staff member, leave type, start date, and end date are required' }, 400);
  }
  const row = await c.env.DB.prepare(
    'INSERT INTO leave_requests (staff_id, leave_type, start_date, end_date, reason) VALUES (?, ?, ?, ?, ?) RETURNING *'
  )
    .bind(body.staffId, body.leaveType, body.startDate, body.endDate, body.reason ?? null)
    .first();
  return c.json(row, 201);
});

hr.patch('/leave-requests/:id', requireAuth(), adminOnly, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<{ status?: string }>().catch(() => ({}) as { status?: string });
  if (!body.status || !['pending', 'approved', 'rejected'].includes(body.status)) {
    return c.json({ error: 'A valid status is required' }, 400);
  }
  const auth = c.get('auth');
  const result = await c.env.DB.prepare(
    `UPDATE leave_requests SET status = ?, approved_by_staff_id = ?, approved_at = datetime('now') WHERE id = ? RETURNING *`
  )
    .bind(body.status, auth.staffId ?? null, id)
    .first();
  if (!result) return c.json({ error: 'Not found' }, 404);
  return c.json(result);
});

// ---- Attendance ----

hr.get('/attendance', requireAuth(), async (c) => {
  const date = c.req.query('date');
  let query = `SELECT a.*, s.full_name AS staff_name FROM attendance_records a JOIN staff s ON s.id = a.staff_id WHERE 1=1`;
  const binds: unknown[] = [];
  if (date) {
    query += ' AND a.work_date = ?';
    binds.push(date);
  }
  query += ' ORDER BY a.work_date DESC';
  const { results } = await c.env.DB.prepare(query).bind(...binds).all();
  return c.json(results);
});

hr.post('/attendance', requireAuth(), adminOnly, async (c) => {
  const body = await c.req
    .json<{ staffId?: number; workDate?: string; clockIn?: string; clockOut?: string; status?: string }>()
    .catch(() => null);
  if (!body?.staffId || !body.workDate || !body.status) {
    return c.json({ error: 'Staff member, date, and status are required' }, 400);
  }
  let hoursWorked: number | null = null;
  if (body.clockIn && body.clockOut) {
    const [inH, inM] = body.clockIn.split(':').map(Number);
    const [outH, outM] = body.clockOut.split(':').map(Number);
    hoursWorked = Math.max(0, outH + outM / 60 - (inH + inM / 60));
  }
  const row = await c.env.DB.prepare(
    `INSERT INTO attendance_records (staff_id, work_date, clock_in, clock_out, hours_worked, status)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(staff_id, work_date) DO UPDATE SET clock_in = excluded.clock_in, clock_out = excluded.clock_out, hours_worked = excluded.hours_worked, status = excluded.status
     RETURNING *`
  )
    .bind(body.staffId, body.workDate, body.clockIn ?? null, body.clockOut ?? null, hoursWorked, body.status)
    .first();
  return c.json(row, 201);
});

// ---- Payroll ----

hr.get('/payroll', requireAuth(), adminOnly, async (c) => {
  const month = c.req.query('month');
  let query = `SELECT p.*, s.full_name AS staff_name FROM payroll_records p JOIN staff s ON s.id = p.staff_id WHERE 1=1`;
  const binds: unknown[] = [];
  if (month) {
    query += ' AND p.period_month = ?';
    binds.push(month);
  }
  query += ' ORDER BY p.period_month DESC';
  const { results } = await c.env.DB.prepare(query).bind(...binds).all();
  return c.json(results);
});

hr.post('/payroll', requireAuth(), adminOnly, async (c) => {
  const body = await c.req
    .json<{
      staffId?: number;
      periodMonth?: string;
      baseSalary?: number;
      allowances?: Record<string, number>;
      deductions?: Record<string, number>;
      overtimeHours?: number;
      overtimeRate?: number;
    }>()
    .catch(() => null);
  if (!body?.staffId || !body.periodMonth || body.baseSalary === undefined) {
    return c.json({ error: 'Staff member, period, and base salary are required' }, 400);
  }

  const allowancesTotal = Object.values(body.allowances ?? {}).reduce((s, v) => s + v, 0);
  const deductionsTotal = Object.values(body.deductions ?? {}).reduce((s, v) => s + v, 0);
  const overtimeAmount = (body.overtimeHours ?? 0) * (body.overtimeRate ?? 0);
  const grossSalary = body.baseSalary + allowancesTotal + overtimeAmount;
  const netSalary = grossSalary - deductionsTotal;

  const row = await c.env.DB.prepare(
    `INSERT INTO payroll_records (staff_id, period_month, base_salary, allowances_json, deductions_json, overtime_hours, overtime_rate, gross_salary, net_salary)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
  )
    .bind(
      body.staffId,
      body.periodMonth,
      body.baseSalary,
      JSON.stringify(body.allowances ?? {}),
      JSON.stringify(body.deductions ?? {}),
      body.overtimeHours ?? 0,
      body.overtimeRate ?? 0,
      grossSalary,
      netSalary
    )
    .first();

  return c.json(row, 201);
});

hr.patch('/payroll/:id', requireAuth(), adminOnly, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<{ status?: string }>().catch(() => ({}) as { status?: string });
  if (!body.status || !['pending', 'processed', 'paid'].includes(body.status)) {
    return c.json({ error: 'A valid status is required' }, 400);
  }
  const timestampCol = body.status === 'processed' ? 'processed_at' : body.status === 'paid' ? 'paid_at' : null;
  const result = await c.env.DB.prepare(
    `UPDATE payroll_records SET status = ?${timestampCol ? `, ${timestampCol} = datetime('now')` : ''} WHERE id = ? RETURNING *`
  )
    .bind(body.status, id)
    .first();
  if (!result) return c.json({ error: 'Not found' }, 404);
  return c.json(result);
});

export default hr;

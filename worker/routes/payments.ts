import { Hono } from 'hono';
import type { Env } from '../index';
import { requireAuth, requireRole } from '../middleware/auth';
import { nextFormattedId } from '../lib/idCounters';

const payments = new Hono<{ Bindings: Env }>();

interface PaymentItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface PaymentInput {
  patientId: number;
  dueDate?: string;
  tax?: number;
  paymentMethod?: string;
  items: PaymentItemInput[];
}

const canManage = requireRole('admin', 'receptionist', 'accountant');

payments.get('/', requireAuth(), async (c) => {
  const status = c.req.query('status');
  const patientId = c.req.query('patientId');

  let query = `
    SELECT p.*, pa.full_name AS patient_name, pa.patient_number
    FROM payments p JOIN patients pa ON pa.id = p.patient_id WHERE 1=1`;
  const binds: unknown[] = [];
  if (status) {
    query += ' AND p.status = ?';
    binds.push(status);
  }
  if (patientId) {
    query += ' AND p.patient_id = ?';
    binds.push(patientId);
  }
  query += ' ORDER BY p.created_at DESC';

  const { results } = await c.env.DB.prepare(query).bind(...binds).all();
  return c.json(results);
});

payments.post('/', requireAuth(), canManage, async (c) => {
  const body = await c.req.json<PaymentInput>().catch(() => null);
  if (!body?.patientId || !body.items?.length) {
    return c.json({ error: 'Patient and at least one line item are required' }, 400);
  }

  const auth = c.get('auth');
  const subtotal = body.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const tax = body.tax ?? 0;
  const total = subtotal + tax;
  const invoiceNumber = await nextFormattedId(c.env.DB, 'INVOICE');

  const payment = await c.env.DB.prepare(
    `INSERT INTO payments (invoice_number, patient_id, due_date, subtotal, tax, total, payment_method, created_by_staff_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
  )
    .bind(invoiceNumber, body.patientId, body.dueDate ?? null, subtotal, tax, total, body.paymentMethod ?? null, auth.staffId ?? null)
    .first<{ id: number }>();

  const itemInserts = body.items.map((item) =>
    c.env.DB.prepare('INSERT INTO payment_items (payment_id, description, quantity, unit_price, line_total) VALUES (?, ?, ?, ?, ?)').bind(
      payment!.id,
      item.description,
      item.quantity,
      item.unitPrice,
      item.quantity * item.unitPrice
    )
  );
  await c.env.DB.batch(itemInserts);

  return c.json(payment, 201);
});

payments.get('/:id', requireAuth(), async (c) => {
  const id = c.req.param('id');
  const payment = await c.env.DB.prepare('SELECT * FROM payments WHERE id = ?').bind(id).first();
  if (!payment) return c.json({ error: 'Not found' }, 404);
  const { results: items } = await c.env.DB.prepare('SELECT * FROM payment_items WHERE payment_id = ?').bind(id).all();
  return c.json({ ...payment, items });
});

payments.patch('/:id', requireAuth(), canManage, async (c) => {
  const id = c.req.param('id');
  const existing = await c.env.DB.prepare('SELECT * FROM payments WHERE id = ?').bind(id).first<Record<string, unknown>>();
  if (!existing) return c.json({ error: 'Not found' }, 404);

  const body = await c.req
    .json<{ amountPaid?: number; paymentMethod?: string; status?: string; markPaid?: boolean }>()
    .catch(() => ({}) as { amountPaid?: number; paymentMethod?: string; status?: string; markPaid?: boolean });

  let amountPaid = body.amountPaid ?? (existing.amount_paid as number);
  let status = body.status ?? (existing.status as string);
  let paidAt = existing.paid_at as string | null;

  if (body.markPaid) {
    amountPaid = existing.total as number;
    status = 'paid';
    paidAt = new Date().toISOString();
  } else if (body.amountPaid !== undefined) {
    status = amountPaid >= (existing.total as number) ? 'paid' : amountPaid > 0 ? 'partially_paid' : 'pending';
    if (status === 'paid') paidAt = new Date().toISOString();
  }

  const result = await c.env.DB.prepare(
    `UPDATE payments SET amount_paid = ?, status = ?, payment_method = ?, paid_at = ?, updated_at = datetime('now') WHERE id = ? RETURNING *`
  )
    .bind(amountPaid, status, body.paymentMethod ?? existing.payment_method, paidAt, id)
    .first();

  return c.json(result);
});

payments.delete('/:id', requireAuth(), requireRole('admin'), async (c) => {
  const id = c.req.param('id');
  const existing = await c.env.DB.prepare('SELECT status FROM payments WHERE id = ?').bind(id).first<{ status: string }>();
  if (!existing) return c.json({ error: 'Not found' }, 404);
  if (existing.status === 'paid') {
    return c.json({ error: 'Cannot void an already-paid invoice' }, 409);
  }
  await c.env.DB.prepare("UPDATE payments SET status = 'cancelled', updated_at = datetime('now') WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

export default payments;

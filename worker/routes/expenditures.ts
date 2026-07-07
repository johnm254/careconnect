import { Hono } from 'hono';
import type { Env } from '../index';
import { requireAuth, requireRole } from '../middleware/auth';
import { nextFormattedId } from '../lib/idCounters';

const expenditures = new Hono<{ Bindings: Env }>();

interface ExpenditureInput {
  category: string;
  description: string;
  amount: number;
  expenseDate?: string;
  vendor?: string;
  paymentMethod?: string;
  status?: string;
}

const canManage = requireRole('admin', 'accountant');

expenditures.get('/', requireAuth(), async (c) => {
  const status = c.req.query('status');
  const category = c.req.query('category');

  let query = 'SELECT * FROM expenditures WHERE 1=1';
  const binds: unknown[] = [];
  if (status) {
    query += ' AND status = ?';
    binds.push(status);
  }
  if (category) {
    query += ' AND category = ?';
    binds.push(category);
  }
  query += ' ORDER BY expense_date DESC, created_at DESC';

  const { results } = await c.env.DB.prepare(query).bind(...binds).all();
  return c.json(results);
});

expenditures.post('/', requireAuth(), canManage, async (c) => {
  const body = await c.req.json<ExpenditureInput>().catch(() => null);
  if (!body?.category || !body.description || !body.amount) {
    return c.json({ error: 'Category, description, and amount are required' }, 400);
  }

  const auth = c.get('auth');
  const referenceNumber = await nextFormattedId(c.env.DB, 'EXPENSE');

  const row = await c.env.DB.prepare(
    `INSERT INTO expenditures (reference_number, category, description, amount, expense_date, vendor, payment_method, status, created_by_staff_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
  )
    .bind(
      referenceNumber,
      body.category,
      body.description,
      body.amount,
      body.expenseDate ?? new Date().toISOString().slice(0, 10),
      body.vendor ?? null,
      body.paymentMethod ?? null,
      body.status ?? 'pending',
      auth.staffId ?? null
    )
    .first();

  return c.json(row, 201);
});

expenditures.patch('/:id', requireAuth(), canManage, async (c) => {
  const id = c.req.param('id');
  const existing = await c.env.DB.prepare('SELECT * FROM expenditures WHERE id = ?').bind(id).first<Record<string, unknown>>();
  if (!existing) return c.json({ error: 'Not found' }, 404);

  const body = await c.req.json<Partial<ExpenditureInput> & { approvedByStaffId?: number }>().catch(
    () => ({}) as Partial<ExpenditureInput> & { approvedByStaffId?: number }
  );

  const result = await c.env.DB.prepare(
    `UPDATE expenditures SET category = ?, description = ?, amount = ?, expense_date = ?, vendor = ?, payment_method = ?, status = ?, approved_by_staff_id = ?
     WHERE id = ? RETURNING *`
  )
    .bind(
      body.category ?? existing.category,
      body.description ?? existing.description,
      body.amount ?? existing.amount,
      body.expenseDate ?? existing.expense_date,
      body.vendor ?? existing.vendor,
      body.paymentMethod ?? existing.payment_method,
      body.status ?? existing.status,
      body.approvedByStaffId ?? existing.approved_by_staff_id,
      id
    )
    .first();

  return c.json(result);
});

expenditures.delete('/:id', requireAuth(), requireRole('admin'), async (c) => {
  await c.env.DB.prepare('DELETE FROM expenditures WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

export default expenditures;

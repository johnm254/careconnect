import { Hono } from 'hono';
import type { Env } from '../index';
import { requireAuth, requireRole } from '../middleware/auth';

const inventory = new Hono<{ Bindings: Env }>();

interface InventoryItemInput {
  sku: string;
  name: string;
  category: string;
  unit: string;
  quantityOnHand?: number;
  reorderLevel?: number;
  unitCost?: number;
  supplier?: string;
  batchNumber?: string;
  expiryDate?: string;
  requiresExpiryTracking?: boolean;
}

const canManage = requireRole('admin', 'pharmacist', 'nurse');

inventory.get('/', requireAuth(), async (c) => {
  const category = c.req.query('category');
  const search = c.req.query('search');

  let query = 'SELECT * FROM inventory_items WHERE 1=1';
  const binds: unknown[] = [];
  if (category) {
    query += ' AND category = ?';
    binds.push(category);
  }
  if (search) {
    query += ' AND (name LIKE ? OR sku LIKE ?)';
    binds.push(`%${search}%`, `%${search}%`);
  }
  query += ' ORDER BY name';

  const { results } = await c.env.DB.prepare(query).bind(...binds).all();
  return c.json(results);
});

inventory.get('/alerts', requireAuth(), async (c) => {
  const { results: lowStock } = await c.env.DB.prepare(
    'SELECT * FROM inventory_items WHERE quantity_on_hand <= reorder_level ORDER BY quantity_on_hand ASC'
  ).all();

  const { results: expiring } = await c.env.DB.prepare(
    `SELECT * FROM inventory_items
     WHERE expiry_date IS NOT NULL AND expiry_date <= date('now', '+30 days')
     ORDER BY expiry_date ASC`
  ).all();

  return c.json({ lowStock, expiring });
});

inventory.post('/', requireAuth(), canManage, async (c) => {
  const body = await c.req.json<InventoryItemInput>().catch(() => null);
  if (!body?.sku || !body.name || !body.category || !body.unit) {
    return c.json({ error: 'SKU, name, category, and unit are required' }, 400);
  }

  const row = await c.env.DB.prepare(
    `INSERT INTO inventory_items (sku, name, category, unit, quantity_on_hand, reorder_level, unit_cost, supplier, batch_number, expiry_date, requires_expiry_tracking)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
  )
    .bind(
      body.sku,
      body.name,
      body.category,
      body.unit,
      body.quantityOnHand ?? 0,
      body.reorderLevel ?? 10,
      body.unitCost ?? 0,
      body.supplier ?? null,
      body.batchNumber ?? null,
      body.expiryDate ?? null,
      body.requiresExpiryTracking ? 1 : 0
    )
    .first();

  return c.json(row, 201);
});

inventory.get('/:id', requireAuth(), async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM inventory_items WHERE id = ?').bind(c.req.param('id')).first();
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(row);
});

inventory.patch('/:id', requireAuth(), canManage, async (c) => {
  const id = c.req.param('id');
  const existing = await c.env.DB.prepare('SELECT * FROM inventory_items WHERE id = ?').bind(id).first<Record<string, unknown>>();
  if (!existing) return c.json({ error: 'Not found' }, 404);

  const body = await c.req.json<Partial<InventoryItemInput>>().catch(() => ({}) as Partial<InventoryItemInput>);

  const result = await c.env.DB.prepare(
    `UPDATE inventory_items SET name = ?, category = ?, unit = ?, reorder_level = ?, unit_cost = ?, supplier = ?, batch_number = ?, expiry_date = ?, requires_expiry_tracking = ?, updated_at = datetime('now')
     WHERE id = ? RETURNING *`
  )
    .bind(
      body.name ?? existing.name,
      body.category ?? existing.category,
      body.unit ?? existing.unit,
      body.reorderLevel ?? existing.reorder_level,
      body.unitCost ?? existing.unit_cost,
      body.supplier ?? existing.supplier,
      body.batchNumber ?? existing.batch_number,
      body.expiryDate ?? existing.expiry_date,
      body.requiresExpiryTracking !== undefined ? (body.requiresExpiryTracking ? 1 : 0) : existing.requires_expiry_tracking,
      id
    )
    .first();

  return c.json(result);
});

inventory.delete('/:id', requireAuth(), requireRole('admin'), async (c) => {
  const id = c.req.param('id');
  const existing = await c.env.DB.prepare('SELECT id FROM inventory_items WHERE id = ?').bind(id).first();
  if (!existing) return c.json({ error: 'Not found' }, 404);

  const txCount = await c.env.DB.prepare('SELECT COUNT(*) AS count FROM inventory_transactions WHERE item_id = ?')
    .bind(id)
    .first<{ count: number }>();

  if (txCount && txCount.count > 0) {
    return c.json({ error: 'Cannot delete an item with recorded stock transactions. Set its quantity to 0 instead.' }, 409);
  }

  await c.env.DB.prepare('DELETE FROM inventory_items WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

inventory.post('/:id/transactions', requireAuth(), canManage, async (c) => {
  const id = Number(c.req.param('id'));
  const item = await c.env.DB.prepare('SELECT * FROM inventory_items WHERE id = ?').bind(id).first<{ quantity_on_hand: number }>();
  if (!item) return c.json({ error: 'Not found' }, 404);

  const body = await c.req
    .json<{ type: string; quantity: number; reason?: string; relatedPatientId?: number }>()
    .catch(() => null);
  if (!body?.type || !body.quantity) return c.json({ error: 'Type and quantity are required' }, 400);

  const delta = body.type === 'consumption' || body.type === 'write_off' ? -Math.abs(body.quantity) : Math.abs(body.quantity);
  const newQuantity = item.quantity_on_hand + delta;
  if (newQuantity < 0) return c.json({ error: 'Insufficient stock for this transaction' }, 409);

  const auth = c.get('auth');

  await c.env.DB.batch([
    c.env.DB.prepare(
      'INSERT INTO inventory_transactions (item_id, type, quantity_delta, reason, performed_by_staff_id, related_patient_id) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(id, body.type, delta, body.reason ?? null, auth.staffId ?? null, body.relatedPatientId ?? null),
    c.env.DB.prepare("UPDATE inventory_items SET quantity_on_hand = ?, updated_at = datetime('now') WHERE id = ?").bind(newQuantity, id),
  ]);

  const updated = await c.env.DB.prepare('SELECT * FROM inventory_items WHERE id = ?').bind(id).first();
  return c.json(updated, 201);
});

inventory.get('/:id/transactions', requireAuth(), async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM inventory_transactions WHERE item_id = ? ORDER BY created_at DESC')
    .bind(c.req.param('id'))
    .all();
  return c.json(results);
});

export default inventory;

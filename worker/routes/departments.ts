import { Hono } from 'hono';
import type { Env } from '../index';
import { requireAuth, requireRole } from '../middleware/auth';

const departments = new Hono<{ Bindings: Env }>();

departments.get('/', requireAuth(), async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM departments ORDER BY name').all();
  return c.json(results);
});

departments.post('/', requireAuth(), requireRole('admin'), async (c) => {
  const body = await c.req.json<{ name?: string; description?: string }>().catch(() => (({}) as { name?: string; description?: string }));
  if (!body.name) return c.json({ error: 'Name is required' }, 400);
  const result = await c.env.DB.prepare('INSERT INTO departments (name, description) VALUES (?, ?) RETURNING *')
    .bind(body.name, body.description ?? null)
    .first();
  return c.json(result, 201);
});

departments.patch('/:id', requireAuth(), requireRole('admin'), async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<{ name?: string; description?: string }>().catch(() => (({}) as { name?: string; description?: string }));
  const existing = await c.env.DB.prepare('SELECT * FROM departments WHERE id = ?').bind(id).first();
  if (!existing) return c.json({ error: 'Not found' }, 404);

  const result = await c.env.DB.prepare('UPDATE departments SET name = ?, description = ? WHERE id = ? RETURNING *')
    .bind(body.name ?? existing.name, body.description ?? existing.description, id)
    .first();
  return c.json(result);
});

departments.delete('/:id', requireAuth(), requireRole('admin'), async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM departments WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

export default departments;

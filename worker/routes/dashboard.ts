import { Hono } from 'hono';
import type { Env } from '../index';
import { requireAuth } from '../middleware/auth';

const dashboard = new Hono<{ Bindings: Env }>();

dashboard.get('/stats', requireAuth(), async (c) => {
  const today = new Date().toISOString().slice(0, 10);

  const [totalPatients, todayAppointments, pendingBills] = await Promise.all([
    c.env.DB.prepare('SELECT COUNT(*) AS count FROM patients').first<{ count: number }>(),
    c.env.DB.prepare('SELECT COUNT(*) AS count FROM appointments WHERE scheduled_date = ?')
      .bind(today)
      .first<{ count: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) AS count FROM payments WHERE status IN ('pending','partially_paid','overdue')").first<{
      count: number;
    }>(),
  ]);

  return c.json({
    totalPatients: totalPatients?.count ?? 0,
    todayAppointments: todayAppointments?.count ?? 0,
    pendingBills: pendingBills?.count ?? 0,
    availableBeds: 42,
    today,
  });
});

export default dashboard;

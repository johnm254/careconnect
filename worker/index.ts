import { Hono } from 'hono';
import authRoutes from './routes/auth';
import departmentsRoutes from './routes/departments';
import staffRoutes from './routes/staff';
import patientsRoutes from './routes/patients';
import appointmentsRoutes from './routes/appointments';
import dashboardRoutes from './routes/dashboard';
import paymentsRoutes from './routes/payments';
import expendituresRoutes from './routes/expenditures';
import inventoryRoutes from './routes/inventory';
import publicRoutes from './routes/public';
import hrRoutes from './routes/hr';

export interface Env {
  DB: D1Database;
  APP_ENV: string;
  JWT_SECRET: string;
  RESEND_API_KEY: string;
}

const app = new Hono<{ Bindings: Env }>();

app.get('/api/health', (c) => c.json({ status: 'ok', env: c.env.APP_ENV }));

app.route('/api/auth', authRoutes);
app.route('/api/departments', departmentsRoutes);
app.route('/api/staff', staffRoutes);
app.route('/api/patients', patientsRoutes);
app.route('/api/appointments', appointmentsRoutes);
app.route('/api/dashboard', dashboardRoutes);
app.route('/api/payments', paymentsRoutes);
app.route('/api/expenditures', expendituresRoutes);
app.route('/api/inventory', inventoryRoutes);
app.route('/api/public', publicRoutes);
app.route('/api/hr', hrRoutes);

export default app;

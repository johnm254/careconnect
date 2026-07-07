-- CareConnect HMS — initial schema

CREATE TABLE departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE id_counters (
  entity TEXT NOT NULL,
  year INTEGER NOT NULL,
  last_seq INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (entity, year)
);

CREATE TABLE staff (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  staff_number TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','doctor','nurse','receptionist','pharmacist','accountant','other')),
  specialization TEXT,
  department_id INTEGER REFERENCES departments(id),
  phone TEXT,
  email TEXT UNIQUE,
  hire_date TEXT,
  contract_type TEXT CHECK (contract_type IN ('full-time','part-time','contract')),
  employment_status TEXT NOT NULL DEFAULT 'active' CHECK (employment_status IN ('active','on-leave','terminated')),
  base_salary REAL,
  emergency_contact TEXT,
  address TEXT,
  avatar_url TEXT,
  schedule_note TEXT,
  is_available INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  staff_id INTEGER NOT NULL UNIQUE REFERENCES staff(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','doctor','nurse','receptionist','pharmacist','accountant')),
  token_version INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_number TEXT NOT NULL UNIQUE,
  id_number TEXT,
  full_name TEXT NOT NULL,
  date_of_birth TEXT,
  age INTEGER,
  gender TEXT CHECK (gender IN ('Male','Female','Other')),
  phone TEXT NOT NULL,
  address TEXT,
  blood_group TEXT,
  emergency_contact TEXT,
  insurance_id TEXT,
  assigned_doctor_id INTEGER REFERENCES staff(id),
  assigned_nurse_id INTEGER REFERENCES staff(id),
  password_hash TEXT,
  portal_enabled INTEGER NOT NULL DEFAULT 0,
  token_version INTEGER NOT NULL DEFAULT 0,
  registered_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_visit_at TEXT,
  created_by_staff_id INTEGER REFERENCES staff(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX idx_patients_id_number ON patients(id_number) WHERE id_number IS NOT NULL;

CREATE TABLE appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL REFERENCES patients(id),
  doctor_id INTEGER NOT NULL REFERENCES staff(id),
  department_id INTEGER REFERENCES departments(id),
  scheduled_date TEXT NOT NULL,
  scheduled_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled','no-show')),
  reason TEXT,
  notes TEXT,
  booked_via TEXT NOT NULL DEFAULT 'staff' CHECK (booked_via IN ('staff','public','portal')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_appointments_date ON appointments(scheduled_date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);

CREATE TABLE consultations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  appointment_id INTEGER REFERENCES appointments(id),
  patient_id INTEGER NOT NULL REFERENCES patients(id),
  doctor_id INTEGER NOT NULL REFERENCES staff(id),
  visit_date TEXT NOT NULL DEFAULT (datetime('now')),
  diagnosis TEXT,
  symptoms TEXT,
  treatment_plan TEXT,
  prescription TEXT,
  follow_up_date TEXT,
  vitals_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_consultations_patient ON consultations(patient_id);

CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_number TEXT NOT NULL UNIQUE,
  patient_id INTEGER NOT NULL REFERENCES patients(id),
  issued_date TEXT NOT NULL DEFAULT (date('now')),
  due_date TEXT,
  subtotal REAL NOT NULL DEFAULT 0,
  tax REAL NOT NULL DEFAULT 0,
  total REAL NOT NULL DEFAULT 0,
  amount_paid REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','partially_paid','paid','overdue','cancelled')),
  payment_method TEXT CHECK (payment_method IN ('cash','card','insurance','mobile_money','bank_transfer')),
  paid_at TEXT,
  created_by_staff_id INTEGER REFERENCES staff(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_payments_patient ON payments(patient_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE TABLE payment_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  payment_id INTEGER NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL,
  line_total REAL NOT NULL
);

CREATE TABLE expenditures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference_number TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('supplies','utilities','maintenance','salaries','equipment','pharmacy_restock','other')),
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  expense_date TEXT NOT NULL DEFAULT (date('now')),
  vendor TEXT,
  payment_method TEXT,
  approved_by_staff_id INTEGER REFERENCES staff(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','paid')),
  created_by_staff_id INTEGER REFERENCES staff(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE inventory_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('drug','consumable','equipment','other')),
  unit TEXT NOT NULL,
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 10,
  unit_cost REAL NOT NULL DEFAULT 0,
  supplier TEXT,
  batch_number TEXT,
  expiry_date TEXT,
  requires_expiry_tracking INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_inventory_expiry ON inventory_items(expiry_date);
CREATE INDEX idx_inventory_category ON inventory_items(category);

CREATE TABLE inventory_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL REFERENCES inventory_items(id),
  type TEXT NOT NULL CHECK (type IN ('restock','consumption','adjustment','write_off')),
  quantity_delta INTEGER NOT NULL,
  reason TEXT,
  performed_by_staff_id INTEGER REFERENCES staff(id),
  related_patient_id INTEGER REFERENCES patients(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_inventory_tx_item ON inventory_transactions(item_id);

CREATE TABLE leave_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  staff_id INTEGER NOT NULL REFERENCES staff(id),
  leave_type TEXT NOT NULL CHECK (leave_type IN ('vacation','sick','personal','maternity','other')),
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  requested_at TEXT NOT NULL DEFAULT (datetime('now')),
  approved_by_staff_id INTEGER REFERENCES staff(id),
  approved_at TEXT
);

CREATE TABLE attendance_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  staff_id INTEGER NOT NULL REFERENCES staff(id),
  work_date TEXT NOT NULL,
  clock_in TEXT,
  clock_out TEXT,
  hours_worked REAL,
  status TEXT NOT NULL CHECK (status IN ('present','absent','late','half-day')),
  notes TEXT,
  UNIQUE(staff_id, work_date)
);

CREATE TABLE payroll_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  staff_id INTEGER NOT NULL REFERENCES staff(id),
  period_month TEXT NOT NULL,
  base_salary REAL NOT NULL,
  allowances_json TEXT,
  deductions_json TEXT,
  overtime_hours REAL DEFAULT 0,
  overtime_rate REAL DEFAULT 0,
  gross_salary REAL NOT NULL,
  net_salary REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processed','paid')),
  processed_at TEXT,
  paid_at TEXT,
  UNIQUE(staff_id, period_month)
);

CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('staff','patient')),
  recipient_staff_id INTEGER REFERENCES staff(id),
  recipient_patient_id INTEGER REFERENCES patients(id),
  title TEXT NOT NULL,
  body TEXT,
  category TEXT,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

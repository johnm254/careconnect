-- Seed data: default departments and one admin login so the app is usable
-- out of the box. Admin email is latullahmedcentre@gmail.com; the password
-- is not stored in plaintext anywhere in this repo (only its PBKDF2 hash
-- below) — it is known only to the hospital administrator.

INSERT INTO departments (name, description) VALUES
  ('General Medicine', 'General consultations and primary care'),
  ('Cardiology', 'Heart and cardiovascular care'),
  ('Pediatrics', 'Child healthcare'),
  ('Orthopedics', 'Bone, joint, and muscle care'),
  ('Administration', 'Hospital administration and management');

INSERT INTO staff (staff_number, full_name, role, department_id, phone, email, hire_date, contract_type, employment_status)
VALUES ('CC-STF-2026-00001', 'System Administrator', 'admin',
  (SELECT id FROM departments WHERE name = 'Administration'),
  '+1 (555) 000-0001', 'latullahmedcentre@gmail.com', date('now'), 'full-time', 'active');

INSERT INTO users (staff_id, email, password_hash, role)
VALUES (
  (SELECT id FROM staff WHERE email = 'latullahmedcentre@gmail.com'),
  'latullahmedcentre@gmail.com',
  'pbkdf2$100000$Lw9sJW41mqkWVUaBCkCIBw==$E/s4jHXpgcLCXZdGvSDkS/8fvv61qX3BxyhTbG0co1c=',
  'admin'
);

INSERT INTO id_counters (entity, year, last_seq) VALUES ('STAFF', CAST(strftime('%Y','now') AS INTEGER), 1);

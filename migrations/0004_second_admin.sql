-- Adds a second administrator account. Email is below; the password hash is
-- PBKDF2 only, the plaintext password is not stored anywhere in this repo.
-- Uses an out-of-band staff_number to avoid colliding with normally
-- auto-generated staff numbers in any environment.

INSERT INTO staff (staff_number, full_name, role, department_id, phone, email, hire_date, contract_type, employment_status)
VALUES ('CC-STF-ADMIN-002', 'Deputy Administrator', 'admin',
  (SELECT id FROM departments WHERE name = 'Administration'),
  '+254 700 000002', 'admin2@latullahmedcentre.com', date('now'), 'full-time', 'active');

INSERT INTO users (staff_id, email, password_hash, role)
VALUES (
  (SELECT id FROM staff WHERE email = 'admin2@latullahmedcentre.com'),
  'admin2@latullahmedcentre.com',
  'pbkdf2$100000$gG6bX0FSKpyglt12I22iqw==$/jZaMVOGd4Xx27HzVEf76SxMYovki8DGUhswiaE/ONo=',
  'admin'
);

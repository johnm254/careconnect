-- Update the seeded admin account to the real email and password (hash only;
-- the plaintext password is not stored anywhere in this repo).

UPDATE staff SET email = 'latullahmedcentre@gmail.com' WHERE staff_number = 'CC-STF-2026-00001';

UPDATE users SET
  email = 'latullahmedcentre@gmail.com',
  password_hash = 'pbkdf2$100000$Lw9sJW41mqkWVUaBCkCIBw==$E/s4jHXpgcLCXZdGvSDkS/8fvv61qX3BxyhTbG0co1c=',
  token_version = token_version + 1
WHERE staff_id = (SELECT id FROM staff WHERE staff_number = 'CC-STF-2026-00001');

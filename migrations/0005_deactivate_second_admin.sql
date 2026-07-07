-- Consolidate to a single admin login per user request. Deactivates the
-- secondary admin account's login access; the staff record is retained
-- for history but can no longer sign in. Bumping token_version also
-- invalidates any session already issued to this account.

UPDATE users SET
  is_active = 0,
  token_version = token_version + 1
WHERE email = 'admin2@latullahmedcentre.com';

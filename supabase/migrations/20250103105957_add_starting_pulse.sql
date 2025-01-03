BEGIN;

-- Add starting pulse to all existing users
UPDATE profiles
SET pulse_balance = 1000
WHERE pulse_balance IS NULL OR pulse_balance = 0;

-- Create initial transaction records
INSERT INTO pulse_transactions (user_id, amount, transaction_type, description)
SELECT id, 1000, 'purchase', 'Initial starting pulse'
FROM profiles
WHERE pulse_balance = 1000;

COMMIT;
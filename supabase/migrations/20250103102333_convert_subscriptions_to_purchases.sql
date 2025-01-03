BEGIN;

-- Rename table
ALTER TABLE subscriptions RENAME TO purchases;

-- Add new columns
ALTER TABLE purchases
  ADD COLUMN payment_id TEXT NOT NULL,
  ADD COLUMN amount NUMERIC(10, 2) NOT NULL,
  ADD COLUMN payment_date TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN pulse_amount INTEGER NOT NULL,
  ADD COLUMN benefits JSONB;

-- Update existing rows with default values
UPDATE purchases SET
  payment_id = 'legacy-' || id::text,
  amount = CASE 
    WHEN tier = 'Supporter' THEN 10.00
    WHEN tier = 'Creator' THEN 30.00
    WHEN tier = 'Visionary' THEN 50.00
    ELSE 0.00
  END,
  pulse_amount = CASE
    WHEN tier = 'Supporter' THEN 2000
    WHEN tier = 'Creator' THEN 5000
    WHEN tier = 'Visionary' THEN 10000
    ELSE 0
  END,
  benefits = jsonb_build_array(
    'Early access to new features',
    'Supporter badge on profile',
    'Basic analytics access',
    'Access to community Discord'
  ),
  status = 'completed';

-- Drop unused column
ALTER TABLE purchases DROP COLUMN last_award_date;

COMMIT;
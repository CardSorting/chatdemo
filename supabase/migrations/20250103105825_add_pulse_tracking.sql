BEGIN;

-- Add pulse_balance column to profiles table
ALTER TABLE profiles
  ADD COLUMN pulse_balance INTEGER NOT NULL DEFAULT 0;

-- Create pulse_transactions table
CREATE TABLE pulse_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'usage', 'refund')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_pulse_transactions_user_id ON pulse_transactions(user_id);

COMMIT;
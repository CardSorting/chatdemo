-- Add pulse_balance column to profiles table
alter table profiles add column if not exists pulse_balance integer default 1000;

-- Update existing profiles to have the default balance
update profiles set pulse_balance = 1000 where pulse_balance is null;

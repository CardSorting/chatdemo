-- Update existing profiles to have default pulse balance if not set
update profiles 
set pulse_balance = 1000 
where pulse_balance is null;

-- Create a trigger to set default pulse balance for new profiles
create or replace function set_default_pulse_balance()
returns trigger as $$
begin
  if new.pulse_balance is null then
    new.pulse_balance := 1000;
  end if;
  return new;
end;
$$ language plpgsql;

-- Drop the trigger if it exists
drop trigger if exists set_pulse_balance_trigger on profiles;

-- Create the trigger
create trigger set_pulse_balance_trigger
  before insert on profiles
  for each row
  execute function set_default_pulse_balance();

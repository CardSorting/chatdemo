-- Create profiles table if it doesn't exist
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  username text unique,
  bio text,
  website text,
  avatar_url text,
  email_notifications boolean default true,
  visibility text default 'public' check (visibility in ('public', 'private', 'followers')),
  theme text default 'dark' check (theme in ('dark', 'light', 'system')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS if not already enabled
do $$
begin
  if not exists (
    select 1
    from pg_policy
    join pg_class on pg_class.oid = pg_policy.polrelid
    where pg_class.relname = 'profiles'
      and pg_policy.polname = 'Allow users to update their own profiles'
  ) then
    alter table profiles enable row level security;
    
    create policy "Allow users to update their own profiles"
    on profiles
    for update
    to authenticated
    using (auth.uid() = id);

    create policy "Allow read access for testing"
    on profiles
    for select
    to anon, authenticated
    using (true);
  end if;
end $$;
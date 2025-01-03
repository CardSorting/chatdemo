-- Remove the redundant creator_name column and use profile data instead
alter table companions drop column if exists creator_name;

-- Add RLS policies for companions table
alter table companions enable row level security;

-- Allow users to read all companions
create policy "Allow users to read all companions"
on companions
for select
to authenticated
using (true);

-- Allow users to update their own companions
create policy "Allow users to update their own companions"
on companions
for update
to authenticated
using (auth.uid() = creator_id);

-- Allow users to delete their own companions
create policy "Allow users to delete their own companions"
on companions
for delete
to authenticated
using (auth.uid() = creator_id);

-- Allow users to insert companions with themselves as creator
create policy "Allow users to insert companions"
on companions
for insert
to authenticated
with check (auth.uid() = creator_id);

-- Create a view that joins companions with creator profile info
create or replace view companion_details as
select 
    c.*,
    p.full_name as creator_name,
    p.username as creator_username
from companions c
left join profiles p on c.creator_id = p.id;

-- Grant access to the view
grant select on companion_details to authenticated;

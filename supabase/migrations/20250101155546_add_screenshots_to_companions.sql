-- Create storage bucket for avatars if it doesn't exist
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'avatars') then
    insert into storage.buckets (id, name, public)
    values ('avatars', 'avatars', true);
  end if;
end $$;

-- Update companions table to handle avatar storage
alter table companions
alter column avatar_url type text;

-- Set up storage bucket permissions
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

create policy "Avatar owners can update their avatars"
  on storage.objects for update
  using ( bucket_id = 'avatars' )
  with check ( auth.uid() = owner );

create policy "Avatar owners can delete their avatars"
  on storage.objects for delete
  using ( bucket_id = 'avatars' and auth.uid() = owner );

-- Add screenshots column if it doesn't exist
do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_name = 'companions' and column_name = 'screenshots'
  ) then
    alter table companions
    add column screenshots text[] default '{}';
  end if;
end $$;
-- Add SELECT policy for profiles table
create policy "Allow users to read their own profiles"
on profiles
for select
to authenticated
using (auth.uid() = id);

-- Add SELECT policy for public profile data
create policy "Allow public profile access"
on profiles
for select
to authenticated
using (visibility = 'public' or auth.uid() = id);

-- Enable profile updates for authenticated users
create policy "Allow users to update their own profiles"
on profiles
for update
to authenticated
using (auth.uid() = id);
-- Create achievements table
create table if not exists achievements (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null,
  category text not null check (category in ('creation', 'engagement', 'interaction', 'specialization')),
  required_value integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_achievements table to track progress
create table if not exists user_achievements (
  user_id uuid references profiles(id) on delete cascade not null,
  achievement_id uuid references achievements(id) on delete cascade not null,
  progress integer not null default 0,
  completed boolean not null default false,
  completed_at timestamp with time zone,
  primary key (user_id, achievement_id)
);

-- Enable RLS for achievements table
alter table achievements enable row level security;
create policy "Allow public read access to achievements"
on achievements
for select
to public
using (true);

-- Enable RLS for user_achievements table
alter table user_achievements enable row level security;
create policy "Allow users to view their own achievements"
on user_achievements
for select
to authenticated
using (auth.uid() = user_id);

create policy "Allow users to update their own achievements"
on user_achievements
for update
to authenticated
using (auth.uid() = user_id);

-- Create indexes for faster queries
create index idx_achievements_category on achievements(category);
create index idx_user_achievements_user_id on user_achievements(user_id);
create index idx_user_achievements_achievement_id on user_achievements(achievement_id);
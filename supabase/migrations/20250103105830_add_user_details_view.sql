-- Create a view that joins profiles with their companions and stats
create or replace view user_details as
select 
    p.*,
    count(distinct c.id) as companions_count,
    count(distinct b.id) as bookmarks_received,
    coalesce(sum(c.messages_count), 0) as total_messages,
    array_agg(distinct c.id) filter (where c.id is not null) as companion_ids,
    (
        select json_agg(json_build_object(
            'id', c2.id,
            'name', c2.name,
            'avatar_url', c2.avatar_url,
            'description', c2.description,
            'messages_count', c2.messages_count
        ))
        from companions c2
        where c2.creator_id = p.id
        limit 5
    ) as recent_companions
from profiles p
left join companions c on c.creator_id = p.id
left join bookmarks b on b.companion_id = c.id
group by p.id;

-- Create a security definer function to handle access control
create or replace function get_user_details(user_id uuid)
returns setof user_details
security definer
set search_path = public
language plpgsql
as $$
begin
  return query
  select *
  from user_details
  where id = user_id
    and (
      visibility = 'public'::text
      or id = auth.uid()
      or exists (
        select 1
        from followers f
        where f.followed_id = user_details.id
        and f.follower_id = auth.uid()
      )
    );
end;
$$;

-- Grant access to the function
grant execute on function get_user_details(uuid) to authenticated;

-- Revoke direct access to the view
revoke all on user_details from anon, authenticated;

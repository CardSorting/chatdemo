-- Function to get top tippers for a companion
CREATE OR REPLACE FUNCTION public.get_top_tippers(
    companion_id_param uuid,
    limit_param integer
)
RETURNS TABLE (
    pledger_id uuid,
    username text,
    total_pledged bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.pledger_id,
        profiles.username,
        SUM(p.amount)::bigint as total_pledged
    FROM new_companion_pulse_pledges p
    LEFT JOIN profiles ON profiles.id = p.pledger_id
    WHERE p.companion_id = companion_id_param
    GROUP BY p.pledger_id, profiles.username
    ORDER BY total_pledged DESC
    LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

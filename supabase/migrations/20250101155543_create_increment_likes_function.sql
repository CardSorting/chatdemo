-- Create increment_likes function
CREATE OR REPLACE FUNCTION increment_likes(companion_id uuid)
RETURNS void AS $$
BEGIN
  -- Update likes_count in companions table
  UPDATE companions
  SET likes_count = likes_count + 1
  WHERE id = companion_id;

  -- Insert into likes table
  INSERT INTO likes (companion_id, user_id)
  VALUES (companion_id, auth.uid())
  ON CONFLICT (companion_id, user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;
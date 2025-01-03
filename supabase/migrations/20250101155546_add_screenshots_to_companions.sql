-- Add screenshots column to companions table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'companions' 
    AND column_name = 'screenshots'
  ) THEN
    ALTER TABLE companions
    ADD COLUMN screenshots TEXT[] DEFAULT '{}'::TEXT[];
  END IF;
END $$;

-- Create storage bucket for screenshots if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM storage.buckets 
    WHERE id = 'screenshots'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('screenshots', 'screenshots', true);
  END IF;
END $$;

-- Set bucket policies for screenshots
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'public_read_screenshots'
  ) THEN
    EXECUTE $POLICY$
      CREATE POLICY public_read_screenshots
      ON storage.objects
      FOR SELECT
      USING (bucket_id = 'screenshots');
    $POLICY$;
  END IF;
END $$;
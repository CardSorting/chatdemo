-- Ensure required buckets exist
DO $$
BEGIN
    -- Create avatars bucket if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'avatars'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('avatars', 'avatars', true);
    END IF;

    -- Create screenshots bucket if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'screenshots'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('screenshots', 'screenshots', true);
    END IF;
END $$;

-- Set up avatars bucket permissions
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'avatars' );

DROP POLICY IF EXISTS "Anyone can upload an avatar" ON storage.objects;
CREATE POLICY "Anyone can upload an avatar"
    ON storage.objects FOR INSERT
    WITH CHECK ( bucket_id = 'avatars' );

DROP POLICY IF EXISTS "Avatar owners can update their avatars" ON storage.objects;
CREATE POLICY "Avatar owners can update their avatars"
    ON storage.objects FOR UPDATE
    USING ( bucket_id = 'avatars' )
    WITH CHECK ( auth.uid() = owner );

DROP POLICY IF EXISTS "Avatar owners can delete their avatars" ON storage.objects;
CREATE POLICY "Avatar owners can delete their avatars"
    ON storage.objects FOR DELETE
    USING ( bucket_id = 'avatars' AND auth.uid() = owner );

-- Set up screenshots bucket permissions
DROP POLICY IF EXISTS "Screenshots are publicly accessible" ON storage.objects;
CREATE POLICY "Screenshots are publicly accessible"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'screenshots' );

DROP POLICY IF EXISTS "Anyone can upload a screenshot" ON storage.objects;
CREATE POLICY "Anyone can upload a screenshot"
    ON storage.objects FOR INSERT
    WITH CHECK ( bucket_id = 'screenshots' );

DROP POLICY IF EXISTS "Screenshot owners can update their screenshots" ON storage.objects;
CREATE POLICY "Screenshot owners can update their screenshots"
    ON storage.objects FOR UPDATE
    USING ( bucket_id = 'screenshots' )
    WITH CHECK ( auth.uid() = owner );

DROP POLICY IF EXISTS "Screenshot owners can delete their screenshots" ON storage.objects;
CREATE POLICY "Screenshot owners can delete their screenshots"
    ON storage.objects FOR DELETE
    USING ( bucket_id = 'screenshots' AND auth.uid() = owner );

-- Create new companions table with all required fields
CREATE TABLE IF NOT EXISTS public.new_companions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text NOT NULL,
    avatar_url text NOT NULL CHECK (avatar_url LIKE 'avatars/%'),
    screenshots text[] DEFAULT '{}' CHECK (array_position(screenshots, NULL) IS NULL AND 
        (array_length(screenshots, 1) IS NULL OR 
         array_position(array_remove(array_remove(screenshots, ''), NULL), 
            unnest(array_remove(array_remove(screenshots, ''), NULL))) IS NULL) AND
        (array_length(screenshots, 1) IS NULL OR 
         array_length(array_remove(array_remove(array_filter(screenshots, url -> NOT (url LIKE 'screenshots/%')), ''), NULL), 1) IS NULL)),
    external_url text,
    creator_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    creator_name text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    total_pulse_pledged integer DEFAULT 0 NOT NULL
);

-- Create categories table for the new schema
CREATE TABLE IF NOT EXISTS public.new_categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create join table for companions and categories
CREATE TABLE IF NOT EXISTS public.new_companion_categories (
    companion_id uuid REFERENCES public.new_companions(id) ON DELETE CASCADE,
    category_id uuid REFERENCES public.new_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (companion_id, category_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_new_companions_creator_id ON public.new_companions(creator_id);
CREATE INDEX IF NOT EXISTS idx_new_companions_created_at ON public.new_companions(created_at);
CREATE INDEX IF NOT EXISTS idx_new_companions_external_url ON public.new_companions(external_url);

-- Insert default categories
INSERT INTO public.new_categories (name, description) VALUES
('Technology', 'AI companions focused on technology and programming'),
('Philosophy', 'Companions for philosophical discussions'),
('Art', 'Creative companions for art and design'),
('Science', 'Scientific and research-focused companions'),
('Entertainment', 'Fun and entertaining companions'),
('Education', 'Educational and learning-focused companions'),
('Health', 'Health and wellness companions'),
('Business', 'Business and entrepreneurship companions');

-- Set up RLS policies for companions table
ALTER TABLE public.new_companions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Companions are viewable by everyone" ON public.new_companions;
DROP POLICY IF EXISTS "Authenticated users can create companions" ON public.new_companions;
DROP POLICY IF EXISTS "Users can update their own companions" ON public.new_companions;
DROP POLICY IF EXISTS "Users can delete their own companions" ON public.new_companions;

-- Create new policies
CREATE POLICY "Companions are viewable by everyone" 
    ON public.new_companions FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can create companions" 
    ON public.new_companions FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own companions" 
    ON public.new_companions FOR UPDATE 
    USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own companions" 
    ON public.new_companions FOR DELETE 
    USING (auth.uid() = creator_id);

-- Set up RLS policies for categories join table
ALTER TABLE public.new_companion_categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view companion categories" ON public.new_companion_categories;
DROP POLICY IF EXISTS "Authenticated users can create companion categories" ON public.new_companion_categories;
DROP POLICY IF EXISTS "Users can update their own companion categories" ON public.new_companion_categories;
DROP POLICY IF EXISTS "Users can delete their own companion categories" ON public.new_companion_categories;

-- Create new policies
CREATE POLICY "Anyone can view companion categories" 
    ON public.new_companion_categories FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can create companion categories" 
    ON public.new_companion_categories FOR INSERT 
    WITH CHECK (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.new_companions
            WHERE id = companion_id AND creator_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own companion categories" 
    ON public.new_companion_categories FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.new_companions
            WHERE id = companion_id AND creator_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own companion categories" 
    ON public.new_companion_categories FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.new_companions
            WHERE id = companion_id AND creator_id = auth.uid()
        )
    );

-- Create pulse pledges table
CREATE TABLE IF NOT EXISTS public.new_companion_pulse_pledges (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    companion_id uuid REFERENCES public.new_companions(id) ON DELETE CASCADE,
    pledger_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount integer NOT NULL CHECK (amount > 0),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for pulse pledges
CREATE INDEX IF NOT EXISTS idx_companion_pulse_pledges_companion_id 
    ON public.new_companion_pulse_pledges(companion_id);
CREATE INDEX IF NOT EXISTS idx_companion_pulse_pledges_pledger_id 
    ON public.new_companion_pulse_pledges(pledger_id);
CREATE INDEX IF NOT EXISTS idx_companion_pulse_pledges_created_at 
    ON public.new_companion_pulse_pledges(created_at);

-- Enable RLS on pulse pledges table
ALTER TABLE public.new_companion_pulse_pledges ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view pulse pledges" ON public.new_companion_pulse_pledges;
DROP POLICY IF EXISTS "Authenticated users can create pulse pledges" ON public.new_companion_pulse_pledges;
DROP POLICY IF EXISTS "Users can view their own pulse pledges" ON public.new_companion_pulse_pledges;

-- Create policies for pulse pledges
CREATE POLICY "Anyone can view pulse pledges"
    ON public.new_companion_pulse_pledges FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create pulse pledges"
    ON public.new_companion_pulse_pledges FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' AND
        auth.uid() = pledger_id
    );

-- Create function to update companion total_pulse_pledged
CREATE OR REPLACE FUNCTION public.update_companion_total_pulse_pledged()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.new_companions
        SET total_pulse_pledged = total_pulse_pledged + NEW.amount
        WHERE id = NEW.companion_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.new_companions
        SET total_pulse_pledged = total_pulse_pledged - OLD.amount
        WHERE id = OLD.companion_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating total_pulse_pledged
DROP TRIGGER IF EXISTS update_companion_total_pulse_pledged_trigger 
    ON public.new_companion_pulse_pledges;
    
CREATE TRIGGER update_companion_total_pulse_pledged_trigger
    AFTER INSERT OR DELETE ON public.new_companion_pulse_pledges
    FOR EACH ROW
    EXECUTE FUNCTION public.update_companion_total_pulse_pledged();

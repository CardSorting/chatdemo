-- Create categories table
CREATE TABLE public.categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create companion_categories join table
CREATE TABLE public.companion_categories (
    companion_id uuid REFERENCES public.companions(id) ON DELETE CASCADE,
    category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (companion_id, category_id)
);

-- Insert default categories
INSERT INTO public.categories (name, description) VALUES
('Technology', 'AI companions focused on technology and programming'),
('Philosophy', 'Companions for philosophical discussions'),
('Art', 'Creative companions for art and design'),
('Science', 'Scientific and research-focused companions'),
('Entertainment', 'Fun and entertaining companions'),
('Education', 'Educational and learning-focused companions'),
('Health', 'Health and wellness companions'),
('Business', 'Business and entrepreneurship companions');
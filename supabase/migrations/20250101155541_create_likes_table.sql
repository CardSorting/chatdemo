-- Create likes table
CREATE TABLE public.likes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    companion_id uuid REFERENCES public.companions(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on user_id and companion_id
CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE INDEX idx_likes_companion_id ON public.likes(companion_id);

-- Add unique constraint to prevent duplicate likes
ALTER TABLE public.likes ADD CONSTRAINT unique_like UNIQUE (user_id, companion_id);
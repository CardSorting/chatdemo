-- Create companions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.companions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    avatar_url text,
    creator_name text NOT NULL,
    creator_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    likes_count integer DEFAULT 0,
    messages_count integer DEFAULT 0,
    chat_url text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_featured boolean DEFAULT FALSE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_companions_creator_id ON public.companions(creator_id);
CREATE INDEX IF NOT EXISTS idx_companions_created_at ON public.companions(created_at);
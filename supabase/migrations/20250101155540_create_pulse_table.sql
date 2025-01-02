-- Create Pulse table
CREATE TABLE pulse (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    balance BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on user_id
CREATE INDEX idx_pulse_user_id ON pulse(user_id);

-- Enable RLS
ALTER TABLE pulse ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own pulse" ON pulse
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own pulse" ON pulse
    FOR UPDATE USING (auth.uid() = user_id);
-- Create reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    companion_id UUID NOT NULL REFERENCES companions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    helpful_count INTEGER NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    images TEXT[],
    developer_response TEXT,
    sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    helpful_percentage NUMERIC(5,2),
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    version_history TIMESTAMPTZ[],
    content_warning TEXT,
    reported BOOLEAN NOT NULL DEFAULT FALSE,
    report_reason TEXT
);

-- Create indexes for common queries
CREATE INDEX idx_reviews_companion_id ON reviews(companion_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);
CREATE INDEX idx_reviews_helpful_count ON reviews(helpful_count);

-- Enable row level security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews table
CREATE POLICY "Allow public read access" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert" ON reviews
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow users to update their own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own reviews" ON reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_updated_at_trigger
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_reviews_updated_at();
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  tier TEXT NOT NULL,
  last_award_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
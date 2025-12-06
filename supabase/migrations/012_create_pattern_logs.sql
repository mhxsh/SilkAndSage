-- Migration: 012_create_pattern_logs
-- Description: Create table for storing user pattern and texture harmony logs

CREATE TABLE IF NOT EXISTS user_pattern_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    scenario TEXT NOT NULL, -- e.g., 'outfit', 'interior'
    recommendations JSONB NOT NULL, -- Array of { type, name, description, usage }
    ai_advice TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_pattern_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own pattern logs"
    ON user_pattern_logs
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own pattern logs"
    ON user_pattern_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Index
CREATE INDEX IF NOT EXISTS idx_pattern_logs_user_date 
    ON user_pattern_logs(user_id, created_at DESC);

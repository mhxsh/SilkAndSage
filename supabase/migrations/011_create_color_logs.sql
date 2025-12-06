-- Migration: 011_create_color_logs
-- Description: Create table for storing user color harmony logs

CREATE TABLE IF NOT EXISTS user_color_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    scenario TEXT NOT NULL, -- e.g., 'outfit', 'interior', 'makeup'
    palette JSONB NOT NULL, -- Array of { hex, name, usage }
    ai_advice TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_color_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own color logs"
    ON user_color_logs
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own color logs"
    ON user_color_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Index
CREATE INDEX IF NOT EXISTS idx_color_logs_user_date 
    ON user_color_logs(user_id, created_at DESC);

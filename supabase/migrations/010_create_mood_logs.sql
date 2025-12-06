-- Migration: 010_create_mood_logs
-- Description: Create table for storing user mood test logs

CREATE TABLE IF NOT EXISTS user_mood_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mood_score INT, -- Optional score 1-100
    test_result JSONB, -- Stores the AI analysis result (title, description, advice, color, etc.)
    user_answers JSONB, -- Stores the questions and user's answers
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_mood_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own mood logs"
    ON user_mood_logs
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own mood logs"
    ON user_mood_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_mood_logs_user_date 
    ON user_mood_logs(user_id, created_at DESC);

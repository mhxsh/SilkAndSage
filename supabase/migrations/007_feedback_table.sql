-- Migration: 007_feedback_table
-- Description: Add feedback table for user suggestions and bug reports

CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('bug', 'suggestion', 'content', 'partnership')),
    subject VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    email VARCHAR(255),
    is_anonymous BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    admin_response TEXT,
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);

-- Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feedback
CREATE POLICY "Anyone can submit feedback"
    ON feedback
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

-- Users can view their own feedback
CREATE POLICY "Users can view own feedback"
    ON feedback
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR is_anonymous = false);

-- Only admins can update feedback (you'll need to add admin role logic)
CREATE POLICY "Admins can update feedback"
    ON feedback
    FOR UPDATE
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER feedback_update_timestamp
    BEFORE UPDATE ON feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_feedback_updated_at();

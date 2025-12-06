-- Migration: 008_enhance_tools_interactivity
-- Description: Enhance birthday and fortune tools with save, share, and comment features

-- ============================================
-- 1. Enhance user_fortune_history table
-- ============================================
ALTER TABLE user_fortune_history 
    ADD COLUMN IF NOT EXISTS fortune_data JSONB,
    ADD COLUMN IF NOT EXISTS user_notes TEXT,
    ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS shared_count INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_fortune_history_favorite 
    ON user_fortune_history(user_id, is_favorite) WHERE is_favorite = true;

CREATE INDEX IF NOT EXISTS idx_fortune_history_date 
    ON user_fortune_history(user_id, viewed_at DESC);

-- ============================================
-- 2. Create fortune_comments table
-- ============================================
CREATE TABLE IF NOT EXISTS fortune_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    fortune_history_id UUID REFERENCES user_fortune_history(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) <= 1000),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fortune_comments_history 
    ON fortune_comments(fortune_history_id);

-- ============================================
-- 3. Add metadata to user_birth_profiles
-- ============================================
ALTER TABLE user_birth_profiles
    ADD COLUMN IF NOT EXISTS is_complete BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0;

-- ============================================
-- 4. Row Level Security Policies
-- ============================================

-- Enable RLS on fortune_comments
ALTER TABLE fortune_comments ENABLE ROW LEVEL SECURITY;

-- Users can view their own comments
CREATE POLICY "Users can view own fortune comments"
    ON fortune_comments
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Users can insert their own comments
CREATE POLICY "Users can insert own fortune comments"
    ON fortune_comments
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Users can update their own comments
CREATE POLICY "Users can update own fortune comments"
    ON fortune_comments
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

-- Users can delete their own comments
CREATE POLICY "Users can delete own fortune comments"
    ON fortune_comments
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- ============================================
-- 5. Triggers for updated_at
-- ============================================

-- Update timestamp on fortune history update
CREATE OR REPLACE FUNCTION update_fortune_history_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.viewed_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fortune_history_update_timestamp
    BEFORE UPDATE ON user_fortune_history
    FOR EACH ROW
    EXECUTE FUNCTION update_fortune_history_timestamp();

-- Update timestamp on comment update
CREATE OR REPLACE FUNCTION update_fortune_comment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fortune_comment_update_timestamp
    BEFORE UPDATE ON fortune_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_fortune_comment_timestamp();

-- ============================================
-- 6. Helper functions
-- ============================================

-- Function to get user's fortune history count
CREATE OR REPLACE FUNCTION get_user_fortune_count(user_uuid UUID)
RETURNS INT AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM user_fortune_history
        WHERE user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has fortune for today
CREATE OR REPLACE FUNCTION has_fortune_today(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM user_fortune_history
        WHERE user_id = user_uuid
        AND DATE(viewed_at) = CURRENT_DATE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

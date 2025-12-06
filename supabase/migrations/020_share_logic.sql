-- Migration: 020_share_logic
-- Description: Add tables for share functionality (poster generation, public footprints)

-- ============================================
-- 1. Create shared_content table
-- ============================================
CREATE TABLE IF NOT EXISTS public.shared_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('tool_result', 'footprint', 'post', 'persona')),
    content_id UUID, -- 关联到具体内容ID（可能是footprint_id, post_id等）
    content_data JSONB, -- 存储分享的内容数据
    poster_image_url TEXT, -- 生成的海报图片URL
    share_code TEXT UNIQUE, -- 分享码，用于生成分享链接
    view_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. Create user_footprint_settings table
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_footprint_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    public_username TEXT, -- 公开显示的用户名（可与profile中的username不同）
    public_bio_zh TEXT,
    public_bio_en TEXT,
    public_avatar_url TEXT,
    showcase_tools TEXT[], -- 展示的工具列表，如 ['color_harmony', 'fortune']
    showcase_footprints_count INTEGER DEFAULT 10, -- 展示的足迹数量限制
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. Create indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_shared_content_user ON public.shared_content(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_content_type ON public.shared_content(content_type);
CREATE INDEX IF NOT EXISTS idx_shared_content_code ON public.shared_content(share_code);
CREATE INDEX IF NOT EXISTS idx_shared_content_public ON public.shared_content(is_public) WHERE is_public = true;

-- ============================================
-- 4. RLS Policies
-- ============================================
ALTER TABLE public.shared_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_footprint_settings ENABLE ROW LEVEL SECURITY;

-- Shared content: Public read if is_public, users manage their own
CREATE POLICY "Allow public read access to public shared content"
    ON public.shared_content FOR SELECT
    TO public
    USING (is_public = true);

CREATE POLICY "Allow users to manage their own shared content"
    ON public.shared_content FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- User footprint settings: Users manage their own settings
CREATE POLICY "Allow users to view public footprint settings"
    ON public.user_footprint_settings FOR SELECT
    TO public
    USING (
        is_public = true OR
        user_id = auth.uid()
    );

CREATE POLICY "Allow users to manage their own footprint settings"
    ON public.user_footprint_settings FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- ============================================
-- 5. Function to generate share_code
-- ============================================
CREATE OR REPLACE FUNCTION public.generate_share_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..12 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. Trigger to auto-generate share_code
-- ============================================
CREATE OR REPLACE FUNCTION public.set_share_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.share_code IS NULL THEN
        LOOP
            NEW.share_code := public.generate_share_code();
            EXIT WHEN NOT EXISTS (
                SELECT 1 FROM public.shared_content 
                WHERE share_code = NEW.share_code
            );
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_shared_content_insert
    BEFORE INSERT ON public.shared_content
    FOR EACH ROW
    WHEN (NEW.share_code IS NULL)
    EXECUTE FUNCTION public.set_share_code();


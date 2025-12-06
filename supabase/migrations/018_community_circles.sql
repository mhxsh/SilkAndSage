-- Migration: 018_community_circles
-- Description: Add tables for community circles (五行/MBTI groups)

-- ============================================
-- 1. Create circles table
-- ============================================
CREATE TABLE IF NOT EXISTS public.circles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_zh TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('element', 'mbti', 'custom')),
    type_value TEXT, -- 'wood', 'fire', 'INFJ', etc.
    description_zh TEXT,
    description_en TEXT,
    cover_image_url TEXT,
    member_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. Create circle_members table
-- ============================================
CREATE TABLE IF NOT EXISTS public.circle_members (
    circle_id UUID REFERENCES public.circles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (circle_id, user_id)
);

-- ============================================
-- 3. Create indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_circles_type ON public.circles(type, type_value);
CREATE INDEX IF NOT EXISTS idx_circles_slug ON public.circles(slug);
CREATE INDEX IF NOT EXISTS idx_circle_members_user ON public.circle_members(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_members_circle ON public.circle_members(circle_id);

-- ============================================
-- 4. RLS Policies
-- ============================================
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;

-- Circles: Public read, authenticated write
CREATE POLICY "Allow public read access to circles"
    ON public.circles FOR SELECT
    TO public
    USING (is_public = true);

CREATE POLICY "Allow authenticated users to create circles"
    ON public.circles FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow circle admins to update circles"
    ON public.circles FOR UPDATE
    TO authenticated
    USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.circle_members
            WHERE circle_id = circles.id
            AND user_id = auth.uid()
            AND role IN ('admin', 'moderator')
        )
    );

-- Circle members: Users can view members of public circles, manage their own membership
CREATE POLICY "Allow users to view circle members"
    ON public.circle_members FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.circles
            WHERE circles.id = circle_members.circle_id
            AND circles.is_public = true
        )
    );

CREATE POLICY "Allow users to join circles"
    ON public.circle_members FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow users to leave circles"
    ON public.circle_members FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- ============================================
-- 5. Functions to update member_count
-- ============================================
CREATE OR REPLACE FUNCTION public.update_circle_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.circles
        SET member_count = member_count + 1
        WHERE id = NEW.circle_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.circles
        SET member_count = GREATEST(0, member_count - 1)
        WHERE id = OLD.circle_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_circle_member_changed
    AFTER INSERT OR DELETE ON public.circle_members
    FOR EACH ROW EXECUTE FUNCTION public.update_circle_member_count();

-- ============================================
-- 6. Seed initial circles (五行和MBTI)
-- ============================================
INSERT INTO public.circles (name_zh, name_en, slug, type, type_value, description_zh, description_en, is_public, created_by) VALUES
-- 五行圈子
('木元素圈子', 'Wood Element Circle', 'wood-circle', 'element', 'wood', '木元素代表生长、创造和活力。加入我们，探索如何将木的能量融入日常生活。', 'Wood element represents growth, creativity, and vitality. Join us to explore how to integrate wood energy into daily life.', true, NULL),
('火元素圈子', 'Fire Element Circle', 'fire-circle', 'element', 'fire', '火元素代表热情、行动和转化。在这里，我们分享如何点燃内心的火焰。', 'Fire element represents passion, action, and transformation. Here we share how to ignite the inner flame.', true, NULL),
('土元素圈子', 'Earth Element Circle', 'earth-circle', 'element', 'earth', '土元素代表稳定、滋养和包容。让我们一起建立坚实的基础。', 'Earth element represents stability, nourishment, and inclusiveness. Let''s build a solid foundation together.', true, NULL),
('金元素圈子', 'Metal Element Circle', 'metal-circle', 'element', 'metal', '金元素代表清晰、精确和优雅。在这里，我们追求精致与完美。', 'Metal element represents clarity, precision, and elegance. Here we pursue refinement and perfection.', true, NULL),
('水元素圈子', 'Water Element Circle', 'water-circle', 'element', 'water', '水元素代表流动、智慧和深度。让我们一起探索内在的宁静。', 'Water element represents flow, wisdom, and depth. Let''s explore inner tranquility together.', true, NULL)
ON CONFLICT (slug) DO NOTHING;


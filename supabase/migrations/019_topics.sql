-- Migration: 019_topics
-- Description: Add tables for topic/hashtag functionality

-- ============================================
-- 1. Create topics table
-- ============================================
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, -- 如 "本周穿搭挑战"
    slug TEXT UNIQUE NOT NULL, -- 如 "weekly-outfit-challenge"
    description_zh TEXT,
    description_en TEXT,
    icon TEXT, -- emoji或图标
    type TEXT NOT NULL CHECK (type IN ('challenge', 'wish', 'discussion', 'share')),
    is_featured BOOLEAN DEFAULT false,
    participant_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE, -- 对于限时话题
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. Create topic_posts table (关联UGC posts)
-- ============================================
CREATE TABLE IF NOT EXISTS public.topic_posts (
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    post_id UUID, -- 将关联到ugc_posts表（在022_ugc_upgrade.sql中创建）
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (topic_id, post_id)
);

-- ============================================
-- 3. Create user_topic_follows table
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_topic_follows (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, topic_id)
);

-- ============================================
-- 4. Create indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_topics_slug ON public.topics(slug);
CREATE INDEX IF NOT EXISTS idx_topics_type ON public.topics(type);
CREATE INDEX IF NOT EXISTS idx_topics_featured ON public.topics(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_topic_posts_topic ON public.topic_posts(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_posts_post ON public.topic_posts(post_id);
CREATE INDEX IF NOT EXISTS idx_user_topic_follows_user ON public.user_topic_follows(user_id);

-- ============================================
-- 5. RLS Policies
-- ============================================
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_topic_follows ENABLE ROW LEVEL SECURITY;

-- Topics: Public read, authenticated write
CREATE POLICY "Allow public read access to topics"
    ON public.topics FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to create topics"
    ON public.topics FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Topic posts: Users can view all, authenticated can create
CREATE POLICY "Allow public read access to topic_posts"
    ON public.topic_posts FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to create topic_posts"
    ON public.topic_posts FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- User topic follows: Users manage their own follows
CREATE POLICY "Allow users to view their own topic follows"
    ON public.user_topic_follows FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Allow users to manage their own topic follows"
    ON public.user_topic_follows FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- ============================================
-- 6. Functions to update topic counts
-- ============================================
CREATE OR REPLACE FUNCTION public.update_topic_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.topics
        SET post_count = post_count + 1
        WHERE id = NEW.topic_id;
        
        -- Update participant count (unique users)
        UPDATE public.topics
        SET participant_count = (
            SELECT COUNT(DISTINCT tp2.post_id) 
            FROM public.topic_posts tp2
            WHERE tp2.topic_id = NEW.topic_id
        )
        WHERE id = NEW.topic_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.topics
        SET post_count = GREATEST(0, post_count - 1)
        WHERE id = OLD.topic_id;
        
        -- Update participant count
        UPDATE public.topics
        SET participant_count = (
            SELECT COUNT(DISTINCT tp2.post_id) 
            FROM public.topic_posts tp2
            WHERE tp2.topic_id = OLD.topic_id
        )
        WHERE id = OLD.topic_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_topic_post_changed
    AFTER INSERT OR DELETE ON public.topic_posts
    FOR EACH ROW EXECUTE FUNCTION public.update_topic_post_count();

-- ============================================
-- 7. Seed initial topics
-- ============================================
INSERT INTO public.topics (name, slug, description_zh, description_en, icon, type, is_featured) VALUES
('本周穿搭挑战', 'weekly-outfit-challenge', '每周分享你的穿搭灵感，展示你的风格', 'Share your weekly outfit inspiration and showcase your style', '👗', 'challenge', true),
('满月许愿', 'full-moon-wish', '在满月之夜许下心愿，让宇宙听见你的声音', 'Make wishes on the full moon night, let the universe hear your voice', '🌕', 'wish', true),
('五行生活', 'five-elements-life', '分享你的五行生活智慧', 'Share your five elements life wisdom', '🌿', 'discussion', true),
('今日穿搭', 'today-outfit', '分享你今天的穿搭', 'Share your outfit today', '✨', 'share', false),
('灵性修行', 'spiritual-practice', '分享你的灵性修行心得', 'Share your spiritual practice insights', '🧘', 'discussion', false)
ON CONFLICT (slug) DO NOTHING;


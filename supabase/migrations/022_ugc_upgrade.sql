-- Migration: 022_ugc_upgrade
-- Description: Upgrade UGC system to support images, buyer shows, and product associations

-- ============================================
-- 1. Create ugc_posts table (extends submissions)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ugc_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    post_type TEXT NOT NULL CHECK (post_type IN ('article', 'buyer_show', 'outfit', 'review', 'general')),
    images TEXT[], -- 图片URL数组
    cover_image_url TEXT, -- 封面图
    tags TEXT[], -- 标签数组
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- ============================================
-- 2. Create post_products table (关联商品)
-- ============================================
CREATE TABLE IF NOT EXISTS public.post_products (
    post_id UUID REFERENCES public.ugc_posts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    position INTEGER, -- 在内容中的位置
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (post_id, product_id)
);

-- ============================================
-- 3. Create buyer_shows table (特殊类型的UGC)
-- ============================================
CREATE TABLE IF NOT EXISTS public.buyer_shows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.ugc_posts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 1-5星评分
    review_text TEXT,
    pros TEXT[], -- 优点
    cons TEXT[], -- 缺点
    is_verified BOOLEAN DEFAULT false, -- 是否验证购买
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. Update topic_posts to reference ugc_posts
-- ============================================
-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'topic_posts_post_id_fkey'
    ) THEN
        ALTER TABLE public.topic_posts
        ADD CONSTRAINT topic_posts_post_id_fkey
        FOREIGN KEY (post_id) REFERENCES public.ugc_posts(id) ON DELETE CASCADE;
    END IF;
END $$;

-- ============================================
-- 5. Create circle_posts table (关联圈子动态)
-- ============================================
CREATE TABLE IF NOT EXISTS public.circle_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID REFERENCES public.circles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.ugc_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(circle_id, post_id)
);

-- ============================================
-- 6. Create indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_ugc_posts_user ON public.ugc_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_ugc_posts_type ON public.ugc_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_ugc_posts_status ON public.ugc_posts(status);
CREATE INDEX IF NOT EXISTS idx_ugc_posts_published ON public.ugc_posts(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_ugc_posts_tags ON public.ugc_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_post_products_post ON public.post_products(post_id);
CREATE INDEX IF NOT EXISTS idx_post_products_product ON public.post_products(product_id);
CREATE INDEX IF NOT EXISTS idx_buyer_shows_post ON public.buyer_shows(post_id);
CREATE INDEX IF NOT EXISTS idx_buyer_shows_product ON public.buyer_shows(product_id);
CREATE INDEX IF NOT EXISTS idx_circle_posts_circle ON public.circle_posts(circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_posts_post ON public.circle_posts(post_id);

-- ============================================
-- 7. RLS Policies
-- ============================================
ALTER TABLE public.ugc_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_posts ENABLE ROW LEVEL SECURITY;

-- UGC posts: Public read if published, users manage their own
CREATE POLICY "Allow public read access to published posts"
    ON public.ugc_posts FOR SELECT
    TO public
    USING (status = 'published');

CREATE POLICY "Allow users to manage their own posts"
    ON public.ugc_posts FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow authenticated users to create posts"
    ON public.ugc_posts FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Post products: Public read, authenticated create
CREATE POLICY "Allow public read access to post_products"
    ON public.post_products FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to manage post_products"
    ON public.post_products FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.ugc_posts
            WHERE ugc_posts.id = post_products.post_id
            AND ugc_posts.user_id = auth.uid()
        )
    );

-- Buyer shows: Public read, authenticated create
CREATE POLICY "Allow public read access to buyer_shows"
    ON public.buyer_shows FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to create buyer_shows"
    ON public.buyer_shows FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.ugc_posts
            WHERE ugc_posts.id = buyer_shows.post_id
            AND ugc_posts.user_id = auth.uid()
        )
    );

-- Circle posts: Public read if circle is public
CREATE POLICY "Allow public read access to circle_posts"
    ON public.circle_posts FOR SELECT
    TO public
    USING (
        EXISTS (
            SELECT 1 FROM public.circles
            WHERE circles.id = circle_posts.circle_id
            AND circles.is_public = true
        )
    );

CREATE POLICY "Allow circle members to create circle_posts"
    ON public.circle_posts FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.circle_members
            WHERE circle_members.circle_id = circle_posts.circle_id
            AND circle_members.user_id = auth.uid()
        )
    );

-- ============================================
-- 8. Functions to update counts
-- ============================================
CREATE OR REPLACE FUNCTION public.update_circle_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.circles
        SET post_count = post_count + 1
        WHERE id = NEW.circle_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.circles
        SET post_count = GREATEST(0, post_count - 1)
        WHERE id = OLD.circle_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_circle_post_changed
    AFTER INSERT OR DELETE ON public.circle_posts
    FOR EACH ROW EXECUTE FUNCTION public.update_circle_post_count();

-- Function to update comment_count (similar to existing pattern)
CREATE OR REPLACE FUNCTION public.update_ugc_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Check if comment is for a UGC post
        IF EXISTS (SELECT 1 FROM public.ugc_posts WHERE id = NEW.page_id::uuid) THEN
            UPDATE public.ugc_posts
            SET comment_count = comment_count + 1
            WHERE id = NEW.page_id::uuid;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF EXISTS (SELECT 1 FROM public.ugc_posts WHERE id = OLD.page_id::uuid) THEN
            UPDATE public.ugc_posts
            SET comment_count = GREATEST(0, comment_count - 1)
            WHERE id = OLD.page_id::uuid;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: This trigger assumes comments table has page_id field that can reference ugc_posts
-- You may need to adjust based on your actual comments table structure


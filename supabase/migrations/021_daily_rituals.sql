-- Migration: 021_daily_rituals
-- Description: Add tables for daily rituals (check-ins, mindfulness quotes, morning greetings)

-- ============================================
-- 1. Create mindfulness_quotes table
-- ============================================
CREATE TABLE IF NOT EXISTS public.mindfulness_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_zh TEXT NOT NULL,
    quote_en TEXT NOT NULL,
    author_zh TEXT,
    author_en TEXT,
    element TEXT CHECK (element IN ('wood', 'fire', 'earth', 'metal', 'water', NULL)),
    mbti_type TEXT, -- 16 MBTI types
    zodiac TEXT, -- 12 zodiac signs
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. Create morning_greetings table
-- ============================================
CREATE TABLE IF NOT EXISTS public.morning_greetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    greeting_zh TEXT NOT NULL,
    greeting_en TEXT NOT NULL,
    energy_advice_zh TEXT,
    energy_advice_en TEXT,
    element TEXT CHECK (element IN ('wood', 'fire', 'earth', 'metal', 'water', NULL)),
    mbti_type TEXT,
    zodiac TEXT,
    date DATE, -- 特定日期使用（如节日）
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. Create daily_checkins table
-- ============================================
CREATE TABLE IF NOT EXISTS public.daily_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    mood TEXT CHECK (mood IN ('happy', 'calm', 'anxious', 'energetic', 'tired', 'excited', 'peaceful', 'stressed', NULL)),
    mood_note TEXT, -- 用户的心情记录
    morning_greeting_id UUID REFERENCES public.morning_greetings(id) ON DELETE SET NULL,
    mindfulness_quote_id UUID REFERENCES public.mindfulness_quotes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, checkin_date)
);

-- ============================================
-- 4. Create user_checkin_stats table
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_checkin_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_checkins INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0, -- 当前连续签到天数
    longest_streak INTEGER DEFAULT 0, -- 最长连续签到天数
    last_checkin_date DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. Create indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_date ON public.daily_checkins(user_id, checkin_date DESC);
CREATE INDEX IF NOT EXISTS idx_mindfulness_quotes_element ON public.mindfulness_quotes(element);
CREATE INDEX IF NOT EXISTS idx_mindfulness_quotes_mbti ON public.mindfulness_quotes(mbti_type);
CREATE INDEX IF NOT EXISTS idx_mindfulness_quotes_zodiac ON public.mindfulness_quotes(zodiac);
CREATE INDEX IF NOT EXISTS idx_morning_greetings_date ON public.morning_greetings(date);
CREATE INDEX IF NOT EXISTS idx_morning_greetings_element ON public.morning_greetings(element);

-- ============================================
-- 6. RLS Policies
-- ============================================
ALTER TABLE public.mindfulness_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.morning_greetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_checkin_stats ENABLE ROW LEVEL SECURITY;

-- Mindfulness quotes: Public read
CREATE POLICY "Allow public read access to mindfulness_quotes"
    ON public.mindfulness_quotes FOR SELECT
    TO public
    USING (true);

-- Morning greetings: Public read
CREATE POLICY "Allow public read access to morning_greetings"
    ON public.morning_greetings FOR SELECT
    TO public
    USING (true);

-- Daily checkins: Users manage their own
CREATE POLICY "Allow users to manage their own checkins"
    ON public.daily_checkins FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- User checkin stats: Users view their own
CREATE POLICY "Allow users to view their own checkin stats"
    ON public.user_checkin_stats FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Allow system to update checkin stats"
    ON public.user_checkin_stats FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- ============================================
-- 7. Function to update checkin stats
-- ============================================
CREATE OR REPLACE FUNCTION public.update_checkin_stats()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_checkin_date DATE;
    v_last_date DATE;
    v_current_streak INTEGER;
    v_longest_streak INTEGER;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_user_id := NEW.user_id;
        v_checkin_date := NEW.checkin_date;
    ELSIF TG_OP = 'DELETE' THEN
        v_user_id := OLD.user_id;
        v_checkin_date := OLD.checkin_date;
    END IF;

    -- Get or create stats
    INSERT INTO public.user_checkin_stats (user_id, total_checkins, current_streak, longest_streak, last_checkin_date)
    VALUES (v_user_id, 0, 0, 0, NULL)
    ON CONFLICT (user_id) DO NOTHING;

    -- Calculate stats
    SELECT 
        COUNT(*)::INTEGER,
        MAX(checkin_date)
    INTO v_current_streak, v_last_date
    FROM public.daily_checkins
    WHERE user_id = v_user_id
    ORDER BY checkin_date DESC;

    -- Calculate current streak (consecutive days)
    SELECT COALESCE(MAX(streak), 0)
    INTO v_current_streak
    FROM (
        SELECT 
            checkin_date,
            checkin_date - ROW_NUMBER() OVER (ORDER BY checkin_date)::INTEGER AS grp,
            COUNT(*) OVER (PARTITION BY checkin_date - ROW_NUMBER() OVER (ORDER BY checkin_date)::INTEGER) AS streak
        FROM public.daily_checkins
        WHERE user_id = v_user_id
        ORDER BY checkin_date DESC
        LIMIT 1
    ) sub;

    -- Get longest streak
    WITH streaks AS (
        SELECT 
            checkin_date,
            checkin_date - ROW_NUMBER() OVER (ORDER BY checkin_date)::INTEGER AS grp
        FROM public.daily_checkins
        WHERE user_id = v_user_id
    )
    SELECT COALESCE(MAX(cnt), 0)
    INTO v_longest_streak
    FROM (
        SELECT COUNT(*) AS cnt
        FROM streaks
        GROUP BY grp
    ) sub;

    -- Update stats
    UPDATE public.user_checkin_stats
    SET 
        total_checkins = (SELECT COUNT(*) FROM public.daily_checkins WHERE user_id = v_user_id),
        current_streak = v_current_streak,
        longest_streak = GREATEST(longest_streak, v_current_streak),
        last_checkin_date = v_last_date,
        updated_at = NOW()
    WHERE user_id = v_user_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_checkin_changed
    AFTER INSERT OR DELETE ON public.daily_checkins
    FOR EACH ROW EXECUTE FUNCTION public.update_checkin_stats();

-- ============================================
-- 8. Seed initial mindfulness quotes
-- ============================================
INSERT INTO public.mindfulness_quotes (quote_zh, quote_en, author_zh, author_en, element) VALUES
('静水流深，智者不言。', 'Still water runs deep; the wise speak little.', '古语', 'Ancient Proverb', 'water'),
('木秀于林，风必摧之。', 'A tree that stands out in the forest will be struck by the wind.', '古语', 'Ancient Proverb', 'wood'),
('星星之火，可以燎原。', 'A single spark can start a prairie fire.', '古语', 'Ancient Proverb', 'fire'),
('厚德载物，自强不息。', 'Virtue carries all things; self-improvement never ceases.', '古语', 'Ancient Proverb', 'earth'),
('金玉其外，败絮其中。', 'Gold and jade on the outside, rotten cotton on the inside.', '古语', 'Ancient Proverb', 'metal')
ON CONFLICT DO NOTHING;


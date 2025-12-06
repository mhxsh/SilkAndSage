-- Create tools table
CREATE TABLE IF NOT EXISTS public.tools (
    id text PRIMARY KEY,
    name_zh text NOT NULL,
    name_en text NOT NULL,
    desc_zh text NOT NULL,
    desc_en text NOT NULL,
    url text NOT NULL,
    icon text NOT NULL,
    keywords text[] DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- Enable RLS (Read only for public)
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to tools"
    ON public.tools
    FOR SELECT
    TO public
    USING (true);

-- Seed data
INSERT INTO public.tools (id, name_zh, name_en, desc_zh, desc_en, url, icon, keywords) VALUES
('color_harmony', '色彩搭配', 'Color Harmony', '探索适合您的专属色彩组合', 'Discover your perfect color palette', '/tools/color', '🎨', ARRAY['color', 'style', 'fashion', 'decor', 'art', 'design', '色彩', '穿搭', '时尚', '装饰', '艺术', '幸运色']),
('mood_healing', '情绪疗愈', 'Mood Healing', '获得即时的情绪舒缓建议', 'Get instant emotional relief', '/tools/mood', '💆', ARRAY['anxiety', 'stress', 'mood', 'healing', 'wellness', 'emotion', 'mental health', 'meditation', 'calm', '焦虑', '压力', '情绪', '疗愈', '健康', '冥想', '自我关怀']),
('pattern_harmony', '纹理图案', 'Pattern Harmony', '发现与您共鸣的图案纹理', 'Find patterns that resonate with you', '/tools/pattern', '💠', ARRAY['pattern', 'texture', 'design', 'decor', 'style', 'fashion', 'art', 'motif', '纹理', '图案', '设计', '装饰', '风格', '极简', '侘寂风']),
('fortune', '每日运势', 'Daily Fortune', '查看您的今日星座运程', 'Check your daily zodiac forecast', '/tools/fortune', '🔮', ARRAY['fortune', 'zodiac', 'horoscope', 'luck', 'daily', 'future', 'prediction', 'astrology', 'stars', '运势', '星座', '好运', '预测', '占星', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']),
('birthday', '生日解读', 'Birthday Analysis', '解码您的生辰八字奥秘', 'Decode your birth date mysteries', '/tools/birthday', '🎂', ARRAY['birthday', 'birth date', 'personality', 'character', 'destiny', 'numerology', 'analysis', 'traits', '生日', '八字', '性格', '命运', '解析']),
('quiz', '五行测试', 'Element Quiz', '探索您的内在五行属性', 'Discover your inner element', '/quiz', '🧩', ARRAY['element', 'five elements', 'wood', 'fire', 'earth', 'metal', 'water', 'feng shui', 'balance', 'energy', 'quiz', 'test', 'personality', '五行', '风水', '元素', '木', '火', '土', '金', '水', '能量', '测试', 'ENFP', 'INFJ'])
ON CONFLICT (id) DO UPDATE SET 
    keywords = EXCLUDED.keywords,
    name_zh = EXCLUDED.name_zh,
    name_en = EXCLUDED.name_en,
    desc_zh = EXCLUDED.desc_zh,
    desc_en = EXCLUDED.desc_en;

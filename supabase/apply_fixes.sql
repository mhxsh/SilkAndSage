-- 1. 增加阅读量函数 (如果不存在)
CREATE OR REPLACE FUNCTION increment_views(page_slug text)
RETURNS void AS $$
BEGIN
  UPDATE generated_pages
  SET views_count = views_count + 1
  WHERE slug = page_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 生成英文翻译数据
INSERT INTO public.generated_page_translations (page_id, language_code, title, generated_text)
SELECT 
    page_id, 
    'en', 
    'EN: ' || title, 
    generated_text 
FROM public.generated_page_translations
WHERE language_code = 'zh'
ON CONFLICT (page_id, language_code) DO NOTHING;

-- 3. Quiz 多语言支持与类型修复
ALTER TABLE public.quiz_questions 
ADD COLUMN IF NOT EXISTS language_code text DEFAULT 'zh';

-- 将 answers 列类型从 jsonb[] 修改为 jsonb (如果尚未修改)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'quiz_questions' 
        AND column_name = 'answers' 
        AND data_type = 'ARRAY'
    ) THEN
        ALTER TABLE public.quiz_questions 
        ALTER COLUMN answers TYPE jsonb USING to_jsonb(answers);
    END IF;
END $$;

UPDATE public.quiz_questions SET language_code = 'zh' WHERE language_code IS NULL;

-- 插入英文题目
INSERT INTO public.quiz_questions (question_text, answers, language_code)
VALUES
(
    'Which color palette do you prefer for your living space?',
    '[
        {"text": "Fresh greens and natural wood tones", "element": "wood"},
        {"text": "Warm reds, oranges, and bright light", "element": "fire"},
        {"text": "Earthy browns, beiges, and stability", "element": "earth"},
        {"text": "Clean whites, metallics, and minimalism", "element": "metal"},
        {"text": "Deep blues, blacks, and fluid shapes", "element": "water"}
    ]'::jsonb,
    'en'
),
(
    'How do you usually handle stress?',
    '[
        {"text": "Seek growth and new beginnings", "element": "wood"},
        {"text": "Express emotions and seek excitement", "element": "fire"},
        {"text": "Seek stability and grounding", "element": "earth"},
        {"text": "Analyze logically and organize", "element": "metal"},
        {"text": "Reflect inwardly and adapt", "element": "water"}
    ]'::jsonb,
    'en'
),
(
    'What is your ideal vacation?',
    '[
        {"text": "Hiking in a lush forest", "element": "wood"},
        {"text": "Sunbathing on a tropical beach", "element": "fire"},
        {"text": "Camping in the mountains", "element": "earth"},
        {"text": "Visiting a modern city with architecture", "element": "metal"},
        {"text": "Relaxing by a quiet lake or ocean", "element": "water"}
    ]'::jsonb,
    'en'
),
(
    'Which season do you feel most energetic in?',
    '[
        {"text": "Spring", "element": "wood"},
        {"text": "Summer", "element": "fire"},
        {"text": "Late Summer / Indian Summer", "element": "earth"},
        {"text": "Autumn", "element": "metal"},
        {"text": "Winter", "element": "water"}
    ]'::jsonb,
    'en'
),
(
    'What quality do you value most?',
    '[
        {"text": "Creativity and growth", "element": "wood"},
        {"text": "Passion and charisma", "element": "fire"},
        {"text": "Reliability and nurturing", "element": "earth"},
        {"text": "Precision and justice", "element": "metal"},
        {"text": "Wisdom and adaptability", "element": "water"}
    ]'::jsonb,
    'en'
);

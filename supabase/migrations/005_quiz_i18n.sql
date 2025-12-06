-- 1. 添加 language_code 字段
ALTER TABLE public.quiz_questions 
ADD COLUMN IF NOT EXISTS language_code text DEFAULT 'zh';

-- 2. 将 answers 列类型从 jsonb[] 修改为 jsonb
-- 我们需要先处理现有的数据。
-- 由于 jsonb[] 转 jsonb (array) 需要转换，我们可以使用 to_jsonb() 函数，但它可能将 Postgres 数组转为 JSON 数组。
ALTER TABLE public.quiz_questions 
ALTER COLUMN answers TYPE jsonb USING to_jsonb(answers);

-- 3. 为现有的题目设置 language_code
UPDATE public.quiz_questions SET language_code = 'zh' WHERE language_code IS NULL;

-- 4. 插入英文题目
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

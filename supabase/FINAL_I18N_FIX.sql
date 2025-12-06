-- ========================================
-- Silk & Sage 国际化修复脚本 (完整版)
-- ========================================

-- 1. 阅读量函数 (确保存在)
CREATE OR REPLACE FUNCTION increment_views(page_slug text)
RETURNS void AS $$
BEGIN
  UPDATE generated_pages
  SET views_count = views_count + 1
  WHERE slug = page_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Quiz 多语言支持
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

-- 插入英文测试题目
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
)
ON CONFLICT DO NOTHING;

-- 3. 生成/更新英文翻译数据
-- 如果已经存在英文翻译，先删除它们以便重新生成
DELETE FROM public.generated_page_translations WHERE language_code = 'en';

-- 为每篇中文文章生成对应的英文翻译
INSERT INTO public.generated_page_translations (page_id, language_code, title, generated_text)
SELECT 
    page_id, 
    'en' as language_code,
    -- 生成英文标题
    CASE 
        WHEN title LIKE '%五行%' THEN 'Discover Your Inner Element: A Guide to Five Elements Wisdom'
        WHEN title LIKE '%春%' THEN 'Spring Awakening: Embrace Wood Element Energy'
        WHEN title LIKE '%夏%' THEN 'Summer Passion: Ignite Your Fire Within'
        WHEN title LIKE '%秋%' THEN 'Autumn Balance: Metal Element Harmony'
        WHEN title LIKE '%冬%' THEN 'Winter Wisdom: Water Element Reflection'
        ELSE 'Eastern Wisdom: ' || substring(title from 1 for 30) || '...'
    END as title,
    -- 生成英文内容 (统一的占位内容，符合数据结构)
    jsonb_build_object(
        'hook', 
        E'## Welcome to a Journey of Self-Discovery\n\nIn today''s fast-paced world, finding balance and harmony can feel elusive. The ancient wisdom of the Five Elements offers a timeless framework for understanding ourselves and creating spaces that nurture our well-being.',
        
        'insight',
        E'### The Power of Eastern Philosophy\n\nThe Five Elements—Wood, Fire, Earth, Metal, and Water—form the foundation of traditional Eastern thought. Each element represents different energies, seasons, and qualities that flow through our lives.\n\n- **Wood** embodies growth, creativity, and new beginnings\n- **Fire** represents passion, transformation, and connection\n- **Earth** signifies stability, nurturing, and grounding\n- **Metal** brings clarity, structure, and refinement\n- **Water** flows with wisdom, adaptability, and depth\n\nBy understanding which element resonates most with your inner nature, you can align your lifestyle choices to support your authentic self.',
        
        'solution',
        E'### Creating Your Elemental Sanctuary\n\n**For Wood Types:**\n- Incorporate natural materials and living plants\n- Use green and brown tones in your decor\n- Position your workspace near natural light\n\n**For Fire Types:**\n- Add warm lighting and candles\n- Choose vibrant reds and oranges\n- Create social gathering spaces\n\n**For Earth Types:**\n- Focus on cozy, comfortable furnishings\n- Use earthy beiges and warm yellows\n- Display ceramics and natural textures\n\n**For Metal Types:**\n- Embrace minimalist design\n- Use whites, grays, and metallics\n- Maintain clean, organized spaces\n\n**For Water Types:**\n- Incorporate flowing shapes and curves\n- Choose blues and blacks\n- Add water features or reflective surfaces',
        
        'curation',
        E'### Curated Items for Your Journey\n\nExplore our carefully selected collection of items that harmonize with each element:\n\n- **Meditation cushions** in elemental colors\n- **Essential oil diffusers** with customized blends\n- **Handcrafted ceramics** for tea ceremonies\n- **Natural fiber textiles** for mindful living\n- **Crystals and stones** aligned with your element\n\nEach item is chosen to support your path toward inner balance and authentic expression.'
    ) as generated_text
FROM public.generated_page_translations
WHERE language_code = 'zh'
ON CONFLICT (page_id, language_code) DO UPDATE
SET 
    title = EXCLUDED.title,
    generated_text = EXCLUDED.generated_text;

-- 完成提示
DO $$
BEGIN
    RAISE NOTICE '✅ 国际化数据修复完成！';
    RAISE NOTICE '- 阅读量函数已确保存在';
    RAISE NOTICE '- Quiz 多语言支持已启用';
    RAISE NOTICE '- 英文测试题目已插入';
    RAISE NOTICE '- 英文文章翻译已生成';
END $$;

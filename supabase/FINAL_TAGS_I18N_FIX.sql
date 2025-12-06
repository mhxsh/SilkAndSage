-- ===================================================
-- 标签国际化最终方案：数据库同时存储中英文标签
-- ===================================================

-- 1. 在 generated_page_translations 表中添加 tags 字段
ALTER TABLE public.generated_page_translations
ADD COLUMN IF NOT EXISTS tags text[];

-- 2. 为中文翻译添加中文标签
UPDATE public.generated_page_translations
SET tags = CASE page_id
    WHEN '4b73e411-2fed-4efa-862d-29cef53bb5f5' THEN ARRAY['禅意', '卧室', 'INFJ', '侘寂风', '极简']
    WHEN '2a57b130-c130-4c0b-9643-f03cfae822d9' THEN ARRAY['狮子座', '穿搭', '幸运色', '2025', '时尚']
    WHEN 'f5a2c8f4-bb81-4372-8ac4-af1e1ce15b99' THEN ARRAY['天秤座', '极简', '家居', '平衡', '风水']
    WHEN '38cb4cd0-b2a5-4fd7-95e4-dd7cf8f5cabd' THEN ARRAY['ENFP', '焦虑', '冥想', '风水', '养生']
    WHEN '0a3fa45f-6a6f-4cdc-890d-7544417d2abb' THEN ARRAY['摩羯座', '工作狂', '茶道', '自我关怀', 'wellness']
END
WHERE language_code = 'zh' AND tags IS NULL;

-- 3. 为英文翻译添加英文标签
UPDATE public.generated_page_translations
SET tags = CASE page_id
    WHEN '4b73e411-2fed-4efa-862d-29cef53bb5f5' THEN ARRAY['Zen', 'Bedroom', 'INFJ', 'Wabi-sabi', 'Minimalism']
    WHEN '2a57b130-c130-4c0b-9643-f03cfae822d9' THEN ARRAY['Leo', 'Fashion', 'Lucky Colors', '2025', 'Style']
    WHEN 'f5a2c8f4-bb81-4372-8ac4-af1e1ce15b99' THEN ARRAY['Libra', 'Minimalism', 'Decor', 'Balance', 'Feng Shui']
    WHEN '38cb4cd0-b2a5-4fd7-95e4-dd7cf8f5cabd' THEN ARRAY['ENFP', 'Anxiety', 'Meditation', 'Feng Shui', 'Wellness']
    WHEN '0a3fa45f-6a6f-4cdc-890d-7544417d2abb' THEN ARRAY['Capricorn', 'Workaholic', 'Tea Ceremony', 'Self-care', 'Wellness']
END
WHERE language_code = 'en' AND tags IS NULL;

-- 4. 确保 generated_pages 表的 tags 保留中文版本（用于兼容性）
UPDATE public.generated_pages
SET tags = CASE id
    WHEN '4b73e411-2fed-4efa-862d-29cef53bb5f5' THEN ARRAY['禅意', '卧室', 'INFJ', '侘寂风', '极简']
    WHEN '2a57b130-c130-4c0b-9643-f03cfae822d9' THEN ARRAY['狮子座', '穿搭', '幸运色', '2025', '时尚']
    WHEN 'f5a2c8f4-bb81-4372-8ac4-af1e1ce15b99' THEN ARRAY['天秤座', '极简', '家居', '平衡', '风水']
    WHEN '38cb4cd0-b2a5-4fd7-95e4-dd7cf8f5cabd' THEN ARRAY['ENFP', '焦虑', '冥想', '风水', '养生']
    WHEN '0a3fa45f-6a6f-4cdc-890d-7544417d2abb' THEN ARRAY['摩羯座', '工作狂', '茶道', '自我关怀', 'wellness']
END;

-- 5. 更新英文文章标题（如果还没更新）
UPDATE public.generated_page_translations
SET title = CASE page_id
    WHEN '4b73e411-2fed-4efa-862d-29cef53bb5f5' THEN 'INFJ Bedroom Sanctuary: A Wabi-Sabi Guide'
    WHEN '2a57b130-c130-4c0b-9643-f03cfae822d9' THEN 'Leo 2025 Style Guide: Wear Jade Green for Balance'
    WHEN 'f5a2c8f4-bb81-4372-8ac4-af1e1ce15b99' THEN 'Libra Minimalist Home: Finding Harmony in Balance'
    WHEN '38cb4cd0-b2a5-4fd7-95e4-dd7cf8f5cabd' THEN 'ENFP Anxiety Relief: Find Structure Through Feng Shui'
    WHEN '0a3fa45f-6a6f-4cdc-890d-7544417d2abb' THEN 'Capricorn Tea Ceremony: A Gentle Revolution for Workaholics'
    ELSE title
END
WHERE language_code = 'en' AND title LIKE 'Eastern Wisdom:%';

-- 完成提示
DO $$
BEGIN
    RAISE NOTICE '✅ 标签国际化完成！';
    RAISE NOTICE '========================================';
    RAISE NOTICE '数据库更新完成：';
    RAISE NOTICE '1. generated_page_translations 表已添加 tags 字段';
    RAISE NOTICE '2. 中文翻译已设置中文标签';
    RAISE NOTICE '3. 英文翻译已设置英文标签';
    RAISE NOTICE '4. generated_pages 表保留中文标签（向后兼容）';
    RAISE NOTICE '5. 英文标题已更新';
    RAISE NOTICE '========================================';
    RAISE NOTICE '前端已更新以支持：';
    RAISE NOTICE '- /zh/explore 显示中文标签';
    RAISE NOTICE '- /en/explore 显示英文标签';
    RAISE NOTICE '- /zh/search 热门标签显示中文';
    RAISE NOTICE '- /en/search 热门标签显示英文';
    RAISE NOTICE '- /zh/[slug] 文章标签显示中文';
    RAISE NOTICE '- /en/[slug] 文章标签显示英文';
    RAISE NOTICE '- /en/profile 收藏文章显示英文标题';
END $$;

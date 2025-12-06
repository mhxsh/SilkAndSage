-- 为所有已存在的中文翻译生成英文翻译
INSERT INTO public.generated_page_translations (page_id, language_code, title, generated_text)
SELECT 
    page_id, 
    'en', 
    'EN: ' || title, -- 简单的英文标题前缀
    generated_text -- 暂时复用中文内容，或者替换为简单的英文占位符
FROM public.generated_page_translations
WHERE language_code = 'zh'
ON CONFLICT (page_id, language_code) DO NOTHING;

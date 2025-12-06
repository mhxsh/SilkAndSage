-- 更新英文文章内容，提供真正的英文占位内容
-- 这将替换之前自动生成的"EN: " + 中文标题和中文内容

UPDATE public.generated_page_translations
SET 
    title = CASE
        WHEN page_id IN (
            SELECT id FROM public.generated_pages ORDER BY created_at LIMIT 1
        ) THEN 'Discover Your Inner Element: A Guide to Five Elements Wisdom'
        WHEN page_id IN (
            SELECT id FROM public.generated_pages ORDER BY created_at LIMIT 1 OFFSET 1
        ) THEN 'Spring Awakening: Embrace Wood Element Energy'
        WHEN page_id IN (
            SELECT id FROM public.generated_pages ORDER BY created_at LIMIT 1 OFFSET 2
        ) THEN 'Summer Passion: Ignite Your Fire Within'
        ELSE REPLACE(title, 'EN: ', '') -- 移除 "EN: " 前缀
    END,
    generated_text = jsonb_build_object(
        'hook', 
        E'## Welcome to a Journey of Self-Discovery\n\nIn today''s fast-paced world, finding balance and harmony can feel elusive. The ancient wisdom of the Five Elements offers a timeless framework for understanding ourselves and creating spaces that nurture our well-being.',
        
        'insight',
        E'### The Power of Eastern Philosophy\n\nThe Five Elements—Wood, Fire, Earth, Metal, and Water—form the foundation of traditional Eastern thought. Each element represents different energies, seasons, and qualities that flow through our lives.\n\n- **Wood** embodies growth, creativity, and new beginnings\n- **Fire** represents passion, transformation, and connection\n- **Earth** signifies stability, nurturing, and grounding\n- **Metal** brings clarity, structure, and refinement\n- **Water** flows with wisdom, adaptability, and depth\n\nBy understanding which element resonates most with your inner nature, you can align your lifestyle choices to support your authentic self.',
        
        'solution',
        E'### Creating Your Elemental Sanctuary\n\n**For Wood Types:**\n- Incorporate natural materials and living plants\n- Use green and brown tones in your decor\n- Position your workspace near natural light\n\n**For Fire Types:**\n- Add warm lighting and candles\n- Choose vibrant reds and oranges\n- Create social gathering spaces\n\n**For Earth Types:**\n- Focus on cozy, comfortable furnishings\n- Use earthy beiges and warm yellows\n- Display ceramics and natural textures\n\n**For Metal Types:**\n- Embrace minimalist design\n- Use whites, grays, and metallics\n- Maintain clean, organized spaces\n\n**For Water Types:**\n- Incorporate flowing shapes and curves\n- Choose blues and blacks\n- Add water features or reflective surfaces',
        
        'curation',
        E'### Curated Items for Your Journey\n\nExplore our carefully selected collection of items that harmonize with each element:\n\n- **Meditation cushions** in elemental colors\n- **Essential oil diffusers** with customized blends\n- **Handcrafted ceramics** for tea ceremonies\n- **Natural fiber textiles** for mindful living\n- **Crystals and stones** aligned with your element\n\nEach item is chosen to support your path toward inner balance and authentic expression.'
    )
WHERE language_code = 'en';

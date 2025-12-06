-- ========================================
-- 修复英文翻译内容和标签
-- ========================================

-- 1. 更新英文文章标题为真正的英文标题
UPDATE public.generated_page_translations
SET title = CASE page_id
    WHEN '4b73e411-2fed-4efa-862d-29cef53bb5f5' THEN 'INFJ Bedroom Sanctuary: A Wabi-Sabi Guide'
    WHEN '2a57b130-c130-4c0b-9643-f03cfae822d9' THEN 'Leo 2025 Style Guide: Wear Jade Green for Balance'
    WHEN 'f5a2c8f4-bb81-4372-8ac4-af1e1ce15b99' THEN 'Libra Minimalist Home: Finding Harmony in Balance'
    WHEN '38cb4cd0-b2a5-4fd7-95e4-dd7cf8f5cabd' THEN 'ENFP Anxiety Relief: Find Structure Through Feng Shui'
    WHEN '0a3fa45f-6a6f-4cdc-890d-7544417d2abb' THEN 'Capricorn Tea Ceremony: A Gentle Revolution for Workaholics'
    ELSE title
END
WHERE language_code = 'en';

-- 2. 更新英文文章内容为对应的英文翻译
-- INFJ Bedroom
UPDATE public.generated_page_translations
SET generated_text = '{
    "hook": "## Your Bedroom: More Than Just a Place to Sleep\n\nAs an INFJ, do you find yourself emotionally sensitive and in need of a true sanctuary? Your bedroom isn''t just for sleeping—it''s a refuge for your soul.",
    "insight": "### The INFJ-Wabi-Sabi Connection\n\nIn Eastern philosophy, INFJ''s introverted intuitive nature resonates with the upward growth energy of the **Wood** element. However, modern fast-paced life often creates imbalance. Wabi-sabi aesthetics—embracing imperfection and appreciating simple beauty—is the perfect remedy for the INFJ''s sensitive heart.",
    "solution": "### Creating Your INFJ Wabi-Sabi Bedroom\n\n**1. Color Palette: Deep Greens & Earth Tones**\n- Choose deep green as your primary color\n- Pair with beige, light gray, and earthy tones\n- These colors provide calm and security\n\n**2. Natural Materials First**\n- Linen bedding (breathable and warm)\n- Bamboo woven baskets (storage with texture)\n- Ceramic vases (with dried flowers or zen branches)\n\n**3. The Art of Empty Space**\n- Don''t fill every inch\n- White space gives your thoughts room to breathe",
    "curation": "### Curated Items for INFJ Souls\n\nWe''ve selected these items specifically for INFJ bedrooms:\n\n- **100% Linen Bedding Set**: Soft, improves with each wash\n- **Handmade Ceramic Aromatherapy Burner**: Pair with woody or green tea scents\n- **Bamboo Bedside Lamp**: Warm, gentle light\n- **Wabi-Sabi Art Prints**: Simple lines and negative space"
}'::jsonb
WHERE page_id = '4b73e411-2fed-4efa-862d-29cef53bb5f5' AND language_code = 'en';

-- Leo Style Guide
UPDATE public.generated_page_translations
SET generated_text = '{
    "hook": "## Balance Your Fire with Jade Green\n\nAs a Leo, you naturally radiate confidence and charisma. But do you sometimes feel overheated and in need of calm and balance?",
    "insight": "### The Leo-Fire Connection\n\nIn Five Elements theory, Leo is a **Fire** sign, representing passion, creativity, and leadership. However, excessive fire needs water and earth for balance. For 2025, your lucky color is **Jade Green**—the energy of \"Wood feeding Fire,\" nourishing your flame without burning you out.",
    "solution": "### How to Wear Jade Green\n\n**Daily Wardrobe:**\n- **Core piece**: Jade green silk blouse or knit cardigan\n- **Accessories**: Jade earrings, green silk scarf\n- **Footwear**: Dark green leather loafers\n\n**Occasion Styling:**\n- **Work**: Jade blazer + cream wide-leg pants\n- **Date**: Silk slip dress + gold accessories\n- **Casual**: Green tee + beige trench coat",
    "curation": "### Leo Exclusive Collection\n\n- **Natural Jade Necklace**: Balances fire energy\n- **Silk Scarf (Jade Green)**: Elegant and versatile\n- **Handwoven Straw Bag**: Fresh summer vibes\n- **Green Tea Perfume**: Clean daily scent"
}'::jsonb
WHERE page_id = '2a57b130-c130-4c0b-9643-f03cfae822d9' AND language_code = 'en';

-- Libra Minimalist Home
UPDATE public.generated_page_translations
SET generated_text = '{
    "hook": "## When Beautiful Things Become Overwhelming\n\nAs a Libra, you pursue beauty and harmony. But have you noticed that clutter actually causes you anxiety and makes decisions harder?",
    "insight": "### The Libra Dilemma: Too Many Choices\n\nLibra''s core energy is about **balance** and **choice**. However, too many possessions mean too many choices, which drains your mental energy. Eastern philosophy of \"negative space\" teaches that emptiness itself is beauty—it allows energy to flow and your mind to breathe.",
    "solution": "### The Libra Path to Minimalism\n\n**1. Symmetry & Balance**\nFollow symmetrical principles in furniture placement:\n- Matching nightstands\n- Identical cushions on both sides of the sofa\n- Symmetrically hung artwork\n\n**2. Simplified Color Palette**\nChoose 2-3 main colors:\n- **Primary**: Soft pink (Libra''s guardian color)\n- **Secondary**: Cream white\n- **Accent**: Rose gold\n\n**3. One Purpose Per Item**\nEvery item should have a clear function. Refuse the \"might need it\" hoarding.",
    "curation": "### Curated Selection\n\n- **Scented Candles (Rose/Jasmine)**: Create peaceful atmosphere\n- **Symmetrical Bookshelf**: Functional and beautiful\n- **Silk Cushion Covers (Pink tones)**: Gentle touch\n- **Copper Tray**: Elegant organization"
}'::jsonb
WHERE page_id = 'f5a2c8f4-bb81-4372-8ac4-af1e1ce15b99' AND language_code = 'en';

-- ENFP Anxiety Relief
UPDATE public.generated_page_translations
SET generated_text = '{
    "hook": "## When Your Energy Overwhelms You\n\nAs an ENFP, you''re full of creativity and passion. But do you often feel anxious, mentally scattered, and lacking direction?",
    "insight": "### ENFP Needs Grounding\n\nENFP''s **Fire** energy gives you vitality, but lacking **Earth** foundation leads to floating feelings and anxiety. In Feng Shui, **Earth** represents stability, security, and belonging. By introducing Earth elements into your living space, you create an emotional anchor.",
    "solution": "### Feng Shui Layout for Anxiety Relief\n\n**1. Southwest Corner Power**\nIn your home''s southwest corner (\"Kun position,\" represents stability), place:\n- Ceramic vases\n- Yellow or beige cushions\n- Square decorative items\n\n**2. Create a \"Meditation Corner\"**\nChoose a fixed corner:\n- Lay down a linen floor cushion\n- Light sandalwood incense\n- Place a small succulent plant\n\n**3. Daily Rituals**\n- **Morning**: Sit quietly in meditation corner for 5 minutes\n- **Afternoon**: Brew a cup of tangerine peel tea\n- **Evening**: Soak feet in warm water for 15 minutes",
    "curation": "### ENFP Exclusive Items\n\n- **Handmade Ceramic Tea Set**: Ritual of slowing down\n- **Sandalwood Incense**: Calming for sleep\n- **Linen Yoga Mat**: Establish regular practice\n- **Tangerine Peel + Rose Tea**: Soothe liver qi"
}'::jsonb
WHERE page_id = '38cb4cd0-b2a5-4fd7-95e4-dd7cf8f5cabd' AND language_code = 'en';

-- Capricorn Tea Ceremony
UPDATE public.generated_page_translations
SET generated_text = '{
    "hook": "## Remember How to Be Gentle with Yourself\n\nAs a Capricorn, you''re always climbing, proving, striving. When was the last time you truly relaxed? Have you forgotten how to treat yourself kindly?",
    "insight": "### Tea as Your Gentle Revolution\n\nCapricorn''s **Earth** attribute gives you resilience and responsibility, but excessive earth energy leads to rigidity and suppression. In Eastern wellness wisdom, **tea** is seen as a medium connecting heaven and earth—it lets you slow down without losing elegance; it lets you rest without losing control.",
    "solution": "### Build Your Tea Ceremony Ritual\n\n**Choose Your Tea:**\n- **Weekday Afternoon**: Pu-erh (awakening without anxiety)\n- **Weekend Morning**: White tea (light and heart-nourishing)\n- **High Stress**: Rose tea (soothe liver and relieve depression)\n\n**15-Minute Tea Ceremony:**\n1. **Preparation (3 min)**: Heat water, warm cups\n2. **Brewing (2 min)**: Focus on water flow and tea leaves unfurling\n3. **Savoring (10 min)**: Put down phone, focus only on tea''s aroma and warmth\n\n**Advanced: Weekend Tea Gatherings**\nOnce a month, invite 2-3 friends to share a good pot of tea.",
    "curation": "### Capricorn Tea Set\n\n- **Ru Kiln Tea Set**: Simple yet premium\n- **Aged Pu-erh Tea Cake**: Investment is also enjoyment\n- **Bamboo Tea Tray**: Durable and zen\n- **Electric Clay Stove (Japanese)**: Precise temperature control"
}'::jsonb
WHERE page_id = '0a3fa45f-6a6f-4cdc-890d-7544417d2abb' AND language_code = 'en';

-- 3. 更新 generated_pages 表中的 tags，添加英文标签或混合标签
UPDATE public.generated_pages
SET tags = CASE id
    WHEN '4b73e411-2fed-4efa-862d-29cef53bb5f5' THEN ARRAY['Zen', 'Bedroom', 'INFJ', 'Wabi-sabi', 'Minimalism']
    WHEN '2a57b130-c130-4c0b-9643-f03cfae822d9' THEN ARRAY['Leo', 'Fashion', 'Lucky Colors', '2025', 'Style']
    WHEN 'f5a2c8f4-bb81-4372-8ac4-af1e1ce15b99' THEN ARRAY['Libra', 'Minimalism', 'Decor', 'Balance', 'Feng Shui']
    WHEN '38cb4cd0-b2a5-4fd7-95e4-dd7cf8f5cabd' THEN ARRAY['ENFP', 'Anxiety', 'Meditation', 'Feng Shui', 'Wellness']
    WHEN '0a3fa45f-6a6f-4cdc-890d-7544417d2abb' THEN ARRAY['Capricorn', 'Workaholic', 'Tea Ceremony', 'Self-care', 'Wellness']
END;

-- 完成提示
DO $$
BEGIN
    RAISE NOTICE '✅ 英文翻译和标签修复完成！';
    RAISE NOTICE '- 英文文章标题已更新为真正的英文';
    RAISE NOTICE '- 英文文章内容已更新为对应的翻译';
    RAISE NOTICE '- 标签已更新为英文版本';
    RAISE NOTICE '现在 en/search 页面的标签应该全部显示英文！';
END $$;

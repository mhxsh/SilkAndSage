-- 基础数据填充 (Seed Data)

-- 1. 插入 16 个 MBTI 类型
INSERT INTO public.identities (name, slug, type, pain_points, power_color) VALUES
('INTJ', 'intj', 'mbti', ARRAY['思虑过度', '完美主义'], 'Deep Purple'),
('INTP', 'intp', 'mbti', ARRAY['拖延', '社交疲劳'], 'Cool Gray'),
('ENTJ', 'entj', 'mbti', ARRAY['职业倦怠', '控制欲'], 'Bold Red'),
('ENTP', 'entp', 'mbti', ARRAY['注意力分散', '缺乏深度'], 'Electric Blue'),
('INFJ', 'infj', 'mbti', ARRAY['情绪敏感', '边界模糊'], 'Deep Green'),
('INFP', 'infp', 'mbti', ARRAY['自我怀疑', '理想幻灭'], 'Soft Lavender'),
('ENFJ', 'enfj', 'mbti', ARRAY['取悦他人', '忽视自我'], 'Warm Coral'),
('ENFP', 'enfp', 'mbti', ARRAY['焦虑', '缺乏结构'], 'Vibrant Yellow'),
('ISTJ', 'istj', 'mbti', ARRAY['僵化思维', '压力'], 'Navy Blue'),
('ISFJ', 'isfj', 'mbti', ARRAY['过度奉献', '忽视需求'], 'Gentle Beige'),
('ESTJ', 'estj', 'mbti', ARRAY['工作狂', '关系疏离'], 'Military Green'),
('ESFJ', 'esfj', 'mbti', ARRAY['缺乏认可', '焦虑'], 'Peach Pink'),
('ISTP', 'istp', 'mbti', ARRAY['情感压抑', '孤立'], 'Steel Gray'),
('ISFP', 'isfp', 'mbti', ARRAY['迷失方向', '自信不足'], 'Soft Moss'),
('ESTP', 'estp', 'mbti', ARRAY['冲动', '缺乏耐心'], 'Bright Orange'),
('ESFP', 'esfp', 'mbti', ARRAY['寻求认可', '逃避现实'], 'Sunny Gold');

-- 2. 插入 12 星座
INSERT INTO public.identities (name, slug, type, pain_points, power_color) VALUES
('Aries', 'aries', 'zodiac', ARRAY['急躁', '冲动'], 'Fiery Red'),
('Taurus', 'taurus', 'zodiac', ARRAY['固执', '物质执着'], 'Earthy Green'),
('Gemini', 'gemini', 'zodiac', ARRAY['注意力分散', '肤浅'], 'Airy Yellow'),
('Cancer', 'cancer', 'zodiac', ARRAY['情绪化', '过度敏感'], 'Moonlight Silver'),
('Leo', 'leo', 'zodiac', ARRAY['自负', '需要关注'], 'Royal Gold'),
('Virgo', 'virgo', 'zodiac', ARRAY['完美主义', '焦虑'], 'Muted Beige'),
('Libra', 'libra', 'zodiac', ARRAY['优柔寡断', '取悦他人'], 'Soft Pink'),
('Scorpio', 'scorpio', 'zodiac', ARRAY['控制欲', '嫉妒'], 'Deep Crimson'),
('Sagittarius', 'sagittarius', 'zodiac', ARRAY['缺乏承诺', '不切实际'], 'Royal Purple'),
('Capricorn', 'capricorn', 'zodiac', ARRAY['工作狂', '悲观'], 'Charcoal Gray'),
('Aquarius', 'aquarius', 'zodiac', ARRAY['情感疏离', '叛逆'], 'Electric Teal'),
('Pisces', 'pisces', 'zodiac', ARRAY['逃避现实', '边界模糊'], 'Mystic Lavender');

-- 3. 插入五行元素解决方案
INSERT INTO public.solutions (element_type, aesthetic_style, material, wellness_habit) VALUES
('wood', 'Zen', 'Bamboo', 'Meditation'),
('fire', 'Opulent', 'Silk', 'Tea Ceremony'),
('earth', 'Wabi-sabi', 'Ceramic', 'Grounding'),
('metal', 'Minimalist', 'Jade', 'Gua Sha'),
('water', 'Flow', 'Linen', 'Incense');

-- 4. 插入内在元素测试问题
INSERT INTO public.quiz_questions (question_text, answers) VALUES
(
  '你周末最想去哪里？',
  ARRAY[
    '{"text": "森林或山林", "element": "wood"}'::jsonb,
    '{"text": "艺术展或音乐会", "element": "fire"}'::jsonb,
    '{"text": "农场或田野", "element": "earth"}'::jsonb,
    '{"text": "博物馆或建筑", "element": "metal"}'::jsonb,
    '{"text": "海边或湖泊", "element": "water"}'::jsonb
  ]
),
(
  '你如何应对压力？',
  ARRAY[
    '{"text": "通过户外活动释放", "element": "wood"}'::jsonb,
    '{"text": "倾诉或创作表达", "element": "fire"}'::jsonb,
    '{"text": "独处并整理思绪", "element": "earth"}'::jsonb,
    '{"text": "制定计划并执行", "element": "metal"}'::jsonb,
    '{"text": "冥想或静心", "element": "water"}'::jsonb
  ]
),
(
  '你最看重什么？',
  ARRAY[
    '{"text": "成长与自由", "element": "wood"}'::jsonb,
    '{"text": "激情与创造力", "element": "fire"}'::jsonb,
    '{"text": "稳定与踏实", "element": "earth"}'::jsonb,
    '{"text": "结构与精准", "element": "metal"}'::jsonb,
    '{"text": "和谐与灵性", "element": "water"}'::jsonb
  ]
),
(
  '你的理想家居风格是？',
  ARRAY[
    '{"text": "自然、充满绿植", "element": "wood"}'::jsonb,
    '{"text": "温暖、色彩丰富", "element": "fire"}'::jsonb,
    '{"text": "朴素、手工质感", "element": "earth"}'::jsonb,
    '{"text": "极简、线条清晰", "element": "metal"}'::jsonb,
    '{"text": "流动、宁静禅意", "element": "water"}'::jsonb
  ]
),
(
  '你如何描述自己？',
  ARRAY[
    '{"text": "充满活力、向上生长", "element": "wood"}'::jsonb,
    '{"text": "热情、富有表现力", "element": "fire"}'::jsonb,
    '{"text": "可靠、脚踏实地", "element": "earth"}'::jsonb,
    '{"text": "理性、追求卓越", "element": "metal"}'::jsonb,
    '{"text": "深邃、适应力强", "element": "water"}'::jsonb
  ]
);

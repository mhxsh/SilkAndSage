-- 测试文章数据
-- 注意：请先确保已经执行了 001_initial_schema.sql 和 seed.sql

-- 文章 1: INFJ 卧室 - 侘寂风格的庇护所
INSERT INTO generated_pages (slug, identity_id, generated_image_url, tags, status, published_at)
SELECT 
  'infj-bedroom-wabi-sabi-sanctuary',
  id,
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200',
  ARRAY['禅意', '卧室', 'infj', '侘寂风', '极简'],
  'published',
  now() - interval '5 days'
FROM identities WHERE slug = 'infj';

-- 文章 1 中文翻译
INSERT INTO generated_page_translations (page_id, language_code, title, generated_text)
SELECT 
  id,
  'zh',
  'INFJ 卧室：侘寂风格的庇护所指南',
  jsonb_build_object(
    'hook', E'作为一名 INFJ，你最近是否感到情绪敏感、需要一个真正属于自己的避风港？你的卧室不仅仅是睡觉的地方，更是你灵魂的庇护所。',
    'insight', E'在东方哲学中，INFJ 的内向直觉特质与"木"元素的向上生长能量相呼应。然而，现代快节奏的生活往往让这种能量失衡。侘寂（Wabi-sabi）美学——接纳不完美、欣赏朴素之美——正是疗愈 INFJ 敏感心灵的良方。',
    'solution', E'## 打造 INFJ 专属的侘寂卧室\n\n### 1. 色彩选择：深绿与大地色\n选择深绿色作为主色调，搭配米色、浅灰等大地色系。这些颜色能让你感到安心与平静。\n\n### 2. 材质优先：天然与手工\n- 亚麻床品（透气且触感温润）\n- 竹编篮筐（收纳同时增添质感）\n- 陶器花瓶（盛放干花或一枝禅意枯枝）\n\n### 3. 留白的艺术\n不要填满每一寸空间。留白能让你的思绪有呼吸的余地。',
    'curation', E'## 为你精选的灵性单品\n\n以下是我们为 INFJ 挑选的卧室好物：\n\n- **100% 亚麻床品套装**：柔软亲肤，越洗越舒适\n- **手工陶瓷香薰炉**：搭配木质调或绿茶香氛\n- **竹制床头灯**：温暖柔和的光线，不刺眼\n- **侘寂风格装饰画**：简约的线条与留白'
  )
FROM generated_pages WHERE slug = 'infj-bedroom-wabi-sabi-sanctuary';

-- 文章 2: 狮子座 2025 幸运色穿搭
INSERT INTO generated_pages (slug, identity_id, generated_image_url, tags, status, published_at)
SELECT 
  'leo-2025-lucky-colors-style-guide',
  id,
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',
  ARRAY['狮子座', '穿搭', '幸运色', '2025', '时尚'],
  'published',
  now() - interval '3 days'
FROM identities WHERE slug = 'leo';

-- 文章 2 中文翻译
INSERT INTO generated_page_translations (page_id, language_code, title, generated_text)
SELECT 
  id,
  'zh',
  '狮子座 2025 风格指南：穿戴玉绿色以获得平衡',
  jsonb_build_object(
    'hook', E'作为一名狮子座，你天生散发着自信与魅力。但你是否有时感到过度燃烧、需要冷静与平衡？',
    'insight', E'在东方五行学说中，狮子座属于"火象"星座，代表热情、创造力和领导力。然而，火过旺则需水土来调和。2025 年，你的幸运色是**玉绿色（Jade Green）**——这是"木生火"的能量，既能滋养你的火焰，又不会让你燃尽。',
    'solution', E'## 如何运用玉绿色\n\n### 日常穿搭\n- **核心单品**：玉绿色丝质衬衫或针织开衫\n- **配饰点缀**：玉石耳环、绿色丝巾\n- **鞋履选择**：墨绿色皮革乐福鞋\n\n### 场合搭配\n- **职场**：玉绿色西装外套 + 奶油色阔腿裤\n- **约会**：丝绸吊带裙 + 金色配饰（火金相生）\n- **日常**：绿色 T 恤 + 米色风衣',
    'curation', E'## 狮子座专属选品\n\n- **天然玉石项链**：平衡火能量\n- **丝绸围巾（玉绿色）**：优雅与实用兼备\n- **手工编织草编包**：夏日清新感\n- **绿茶香水**：清新不厌腻的日常香'
  )
FROM generated_pages WHERE slug = 'leo-2025-lucky-colors-style-guide';

-- 文章 3: 天秤座的极简家居指南
INSERT INTO generated_pages (slug, identity_id, generated_image_url, tags, status, published_at)
SELECT 
  'libra-minimalist-home-harmony',
  id,
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200',
  ARRAY['天秤座', '极简', '家居', '平衡', '风水'],
  'published',
  now() - interval '1 day'
FROM identities WHERE slug = 'libra';

-- 文章 3 中文翻译
INSERT INTO generated_page_translations (page_id, language_code, title, generated_text)
SELECT 
  id,
  'zh',
  '天秤座极简家居：在平衡中寻找和谐',
  jsonb_build_object(
    'hook', E'作为天秤座，你追求美感与和谐，但你是否发现家中的杂物反而让你焦虑、难以决断？',
    'insight', E'天秤座的核心能量是"平衡"与"选择"。然而，过多的物品意味着过多的选择，这会消耗你的心力。东方"留白"哲学认为，空间本身就是一种美——它让能量流动，也让心灵呼吸。',
    'solution', E'## 天秤座的极简之道\n\n### 1. 对称与平衡\n在家具摆放时，遵循对称原则：\n- 床头柜成对\n- 沙发两侧放置同款抱枕\n- 装饰画左右对称挂放\n\n### 2. 精简色板\n选择 2-3 种主色调：\n- **主色**：柔和粉色（天秤座守护色）\n- **辅色**：奶白色\n- **点缀**：玫瑰金\n\n### 3. 一物一用\n每件物品都应有明确功能，拒绝"可能会用到"的囤积。',
    'curation', E'## 精选单品\n\n- **香薰蜡烛（玫瑰/茉莉香）**：营造平和氛围\n- **对称装饰书架**：实用与美观兼具\n- **丝绸抱枕套（粉色系）**：温柔触感\n- **铜制托盘**：整理小物的优雅方案'
  )
FROM generated_pages WHERE slug = 'libra-minimalist-home-harmony';

-- 文章 4: ENFP 的焦虑缓解指南
INSERT INTO generated_pages (slug, identity_id, generated_image_url, tags, status, published_at)
SELECT 
  'enfp-anxiety-relief-feng-shui',
  id,
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200',
  ARRAY['enfp', '焦虑', '冥想', '风水', '养生'],
  'published',
  now() - interval '7 days'
FROM identities WHERE slug = 'enfp';

-- 文章 4 中文翻译
INSERT INTO generated_page_translations (page_id, language_code, title, generated_text)
SELECT 
  id,
  'zh',
  'ENFP 焦虑缓解：用风水找回内心的结构',
  jsonb_build_object(
    'hook', E'作为 ENFP，你充满创意和热情，但你是否经常感到焦虑、思绪混乱、缺乏方向感？',
    'insight', E'ENFP 的"火"能量让你充满活力，但缺乏"土"的根基会导致漂浮感与焦虑。在风水学中，"土"代表稳定、安全和归属感。通过在生活空间中引入"土"元素，你可以为自己建立一个情绪的锚点。',
    'solution', E'## 风水布局缓解焦虑\n\n### 1. 西南角的力量\n在家中西南角（代表"坤位"，主稳定）放置：\n- 陶瓷花瓶\n- 黄色或米色抱枕\n- 方形装饰物\n\n### 2. 建立"冥想角"\n选择一个固定的角落：\n- 铺设亚麻蒲团\n- 点燃檀香\n- 放置一小盆绿植（如多肉）\n\n### 3. 每日仪式感\n- **晨间**：在冥想角静坐 5 分钟\n- **午间**：泡一杯陈皮茶（健脾养土）\n- **晚间**：用温水泡脚 15 分钟',
    'curation', E'## ENFP 专属好物\n\n- **手工陶瓷茶具套装**：慢下来的仪式感\n- **檀香线香**：安神助眠\n- **亚麻瑜伽垫**：建立固定练习\n- **陈皮 + 玫瑰花茶**：疏肝理气'
  )
FROM generated_pages WHERE slug = 'enfp-anxiety-relief-feng-shui';

-- 文章 5: 摩羯座的自我关怀
INSERT INTO generated_pages (slug, identity_id, generated_image_url, tags, status, published_at)
SELECT 
  'capricorn-self-care-tea-ceremony',
  id,
  'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=1200',
  ARRAY['摩羯座', '工作狂', '茶道', '自我关怀', 'wellness'],
  'published',
  now()
FROM identities WHERE slug = 'capricorn';

-- 文章 5 中文翻译
INSERT INTO generated_page_translations (page_id, language_code, title, generated_text)
SELECT 
  id,
  'zh',
  '摩羯座的茶道时光：工作狂的温柔革命',
  jsonb_build_object(
    'hook', E'作为摩羯座，你总是在攀登、在证明、在奋斗。但你上次真正放松是什么时候？你是否忘记了如何善待自己？',
    'insight', E'摩羯座的"土"属性赋予你坚韧与责任感，但过度的土能量会导致僵化与压抑。在东方养生智慧中，"茶"被视为连接天地的媒介——它让你慢下来，却不失优雅；它让你休息，却不失掌控。',
    'solution', E'## 为自己建立茶道仪式\n\n### 选择你的茶\n- **工作日午后**：普洱（醒脑不焦虑）\n- **周末早晨**：白茶（清淡养心）\n- **压力大时**：玫瑰花茶（疏肝解郁）\n\n### 15 分钟茶道流程\n1. **准备（3分钟）**：烧水、温杯\n2. **冲泡（2分钟）**：专注于水流与茶叶的舒展\n3. **品饮（10分钟）**：放下手机，只专注于茶的香气与温度\n\n### 进阶：周末茶会\n每月一次，邀请 2-3 位朋友，分享一壶好茶。',
    'curation', E'## 摩羯座茶道套装\n\n- **汝窑茶具套装**：简约而高级\n- **普洱茶饼（陈年）**：投资也是一种享受\n- **竹制茶盘**：耐用且禅意\n- **电陶炉（日式）**：精准控温'
  )
FROM generated_pages WHERE slug = 'capricorn-self-care-tea-ceremony';

-- 更新统计数据（模拟一些浏览和评分）
UPDATE generated_pages 
SET views_count = 234, ratings_count = 12, average_score = 4.7
WHERE slug = 'infj-bedroom-wabi-sabi-sanctuary';

UPDATE generated_pages 
SET views_count = 189, ratings_count = 8, average_score = 4.5
WHERE slug = 'leo-2025-lucky-colors-style-guide';

UPDATE generated_pages 
SET views_count = 156, ratings_count = 10, average_score = 4.8
WHERE slug = 'libra-minimalist-home-harmony';

UPDATE generated_pages 
SET views_count = 298, ratings_count = 15, average_score = 4.6
WHERE slug = 'enfp-anxiety-relief-feng-shui';

UPDATE generated_pages 
SET views_count = 123, ratings_count = 7, average_score = 4.9
WHERE slug = 'capricorn-self-care-tea-ceremony';

-- 完成提示
SELECT 
  '✅ 成功创建 5 篇测试文章！' as status,
  COUNT(*) as article_count,
  COUNT(DISTINCT identity_id) as covered_identities
FROM generated_pages 
WHERE status = 'published';

-- Migration: 006_community_tools
-- Description: Add tables for Chinese calendar, birthday profiles, and fortune tools

-- ============================================
-- Chinese Calendar Data
-- ============================================
CREATE TABLE IF NOT EXISTS chinese_calendar_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gregorian_date DATE UNIQUE NOT NULL,
    lunar_year VARCHAR(10), -- '甲辰年'
    lunar_month VARCHAR(10), -- '正月'
    lunar_day VARCHAR(10), -- '初一'
    zodiac VARCHAR(10), -- '龙'
    solar_term VARCHAR(20), -- '立春'
    is_solar_term_day BOOLEAN DEFAULT false,
    traditional_festivals TEXT[], -- Array of festival names
    element VARCHAR(10), -- '木', '火', '土', '金', '水'
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calendar_date ON chinese_calendar_data(gregorian_date);
CREATE INDEX IF NOT EXISTS idx_calendar_solar_term ON chinese_calendar_data(solar_term) WHERE is_solar_term_day = true;

-- ============================================
-- Traditional Festivals
-- ============================================
CREATE TABLE IF NOT EXISTS traditional_festivals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_zh VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL,
    lunar_month INT,
    lunar_day INT,
    description_zh TEXT,
    description_en TEXT,
    customs_zh TEXT,
    customs_en TEXT,
    wellness_tips_zh TEXT,
    wellness_tips_en TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert major Chinese festivals
INSERT INTO traditional_festivals (name_zh, name_en, lunar_month, lunar_day, description_zh, description_en, customs_zh, customs_en, wellness_tips_zh, wellness_tips_en)
VALUES 
('春节', 'Spring Festival', 1, 1, '农历新年，中国最重要的传统节日。', 'Chinese New Year, the most important traditional festival.', '贴春联、放鞭炮、吃年夜饭、拜年', 'Put up couplets, set off fireworks, have reunion dinner, pay new year calls', '保持心情愉悦，适量饮食，避免过度疲劳。', 'Stay joyful, eat moderately, avoid overexertion.'),
('元宵节', 'Lantern Festival', 1, 15, '春节的最后一天，赏灯猜谜吃元宵。', 'The last day of Spring Festival celebrations.', '赏花灯、猜灯谜、吃汤圆', 'Watch lanterns, solve riddles, eat tangyuan', '注意保暖，元宵不宜多食。', 'Keep warm, eat tangyuan in moderation.'),
('清明节', 'Qingming Festival', 3, 5, '扫墓祭祖，踏青游春。', 'Tomb-sweeping day and spring outing.', '扫墓、踏青、插柳', 'Sweep tombs, spring outing, plant willows', '顺应春季养肝，多食绿色蔬菜。', 'Nourish liver in spring, eat more green vegetables.'),
('端午节', 'Dragon Boat Festival', 5, 5, '纪念屈原，赛龙舟吃粽子。', 'Commemorate Qu Yuan with dragon boat races.', '赛龙舟、吃粽子、挂艾草', 'Dragon boat racing, eat zongzi, hang mugwort', '炎热季节注意防暑，粽子适量。', 'Prevent heatstroke, eat zongzi in moderation.'),
('七夕节', 'Qixi Festival', 7, 7, '中国的情人节，牛郎织女相会。', 'Chinese Valentine''s Day, Cowherd and Weaver Girl reunion.', '穿针乞巧、赏星', 'Thread needles for skills, watch stars', '保持心情愉悦，适合约会。', 'Stay joyful, good day for dating.'),
('中秋节', 'Mid-Autumn Festival', 8, 15, '团圆赏月，吃月饼。', 'Family reunion and moon watching.', '赏月、吃月饼、团圆', 'Watch the moon, eat mooncakes, family reunion', '秋季养肺，月饼不宜多食。', 'Nourish lungs in autumn, eat mooncakes in moderation.'),
('重阳节', 'Double Ninth Festival', 9, 9, '登高赏菊，敬老孝亲。', 'Climb mountains, appreciate chrysanthemums, respect elders.', '登高、赏菊、饮菊花酒', 'Climb mountains, view chrysanthemums, drink chrysanthemum wine', '秋高气爽，登高锻炼身体。', 'Clear autumn weather, exercise by climbing.')
ON CONFLICT DO NOTHING;

-- ============================================
-- User Birth Profiles
-- ============================================
CREATE TABLE IF NOT EXISTS user_birth_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    birth_date DATE NOT NULL,
    birth_time TIME, -- Optional
    zodiac_sign VARCHAR(20), -- Western zodiac
    chinese_zodiac VARCHAR(10), -- 生肖
    lunar_birth_date VARCHAR(50),
    birth_hour VARCHAR(10), -- 时辰
    element VARCHAR(10), -- 主导五行
    element_balance JSONB, -- {wood: 2, fire: 1, earth: 2, metal: 1, water: 0}
    personality_traits TEXT,
    lucky_colors TEXT[],
    lucky_numbers INT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_birth_profiles_user ON user_birth_profiles(user_id);

-- ============================================
-- Zodiac Interpretations
-- ============================================
CREATE TABLE IF NOT EXISTS zodiac_interpretations (
    zodiac VARCHAR(20) PRIMARY KEY,
    name_zh VARCHAR(10),
    name_en VARCHAR(20),
    personality_zh TEXT,
    personality_en TEXT,
    strengths_zh TEXT[],
    strengths_en TEXT[],
    compatible_zodiacs TEXT[],
    element VARCHAR(10)
);

-- Insert Chinese Zodiac data
INSERT INTO zodiac_interpretations (zodiac, name_zh, name_en, personality_zh, personality_en, strengths_zh, strengths_en, compatible_zodiacs, element)
VALUES 
('rat', '鼠', 'Rat', '机智灵活，适应力强，善于社交。', 'Witty, adaptable, good at socializing.', ARRAY['聪明', '灵活', '勤奋'], ARRAY['Smart', 'Flexible', 'Diligent'], ARRAY['dragon', 'monkey'], 'water'),
('ox', '牛', 'Ox', '稳重踏实，勤劳务实，有责任心。', 'Steady, diligent, responsible.', ARRAY['可靠', '耐心', '诚实'], ARRAY['Reliable', 'Patient', 'Honest'], ARRAY['snake', 'rooster'], 'earth'),
('tiger', '虎', 'Tiger', '勇敢自信，具有领导力，热情洋溢。', 'Brave, confident, enthusiastic leader.', ARRAY['勇敢', '自信', '有魅力'], ARRAY['Brave', 'Confident', 'Charismatic'], ARRAY['horse', 'dog'], 'wood'),
('rabbit', '兔', 'Rabbit', '温柔善良，细腻敏感，追求和平。', 'Gentle, sensitive, peace-loving.', ARRAY['温柔', '善良', '优雅'], ARRAY['Gentle', 'Kind', 'Elegant'], ARRAY['sheep', 'pig'], 'wood'),
('dragon', '龙', 'Dragon', '充满活力，雄心勃勃，具有创造力。', 'Energetic, ambitious, creative.', ARRAY['自信', '热情', '有魅力'], ARRAY['Confident', 'Passionate', 'Charismatic'], ARRAY['rat', 'monkey'], 'earth'),
('snake', '蛇', 'Snake', '智慧深邃，神秘优雅，直觉敏锐。', 'Wise, mysterious, intuitive.', ARRAY['智慧', '优雅', '直觉'], ARRAY['Wise', 'Elegant', 'Intuitive'], ARRAY['ox', 'rooster'], 'fire'),
('horse', '马', 'Horse', '热情奔放，自由独立，精力充沛。', 'Passionate, independent, energetic.', ARRAY['热情', '独立', '开朗'], ARRAY['Passionate', 'Independent', 'Cheerful'], ARRAY['tiger', 'dog'], 'fire'),
('sheep', '羊', 'Sheep', '温和friendly，富有同情心，艺术气质。', 'Gentle, compassionate, artistic.', ARRAY['温柔', '善良', '有艺术感'], ARRAY['Gentle', 'Kind', 'Artistic'], ARRAY['rabbit', 'pig'], 'earth'),
('monkey', '猴', 'Monkey', '聪明机智，活泼好动，善于解决问题。', 'Clever, lively, good problem solver.', ARRAY['聪明', '机智', '灵活'], ARRAY['Smart', 'Witty', 'Flexible'], ARRAY['rat', 'dragon'], 'metal'),
('rooster', '鸡', 'Rooster', '勤奋认真，追求完美，诚实坦率。', 'Diligent, perfectionist, honest.', ARRAY['勤奋', '诚实', '自信'], ARRAY['Hardworking', 'Honest', 'Confident'], ARRAY['ox', 'snake'], 'metal'),
('dog', '狗', 'Dog', '忠诚可靠，正直善良，具有正义感。', 'Loyal, honest, just.', ARRAY['忠诚', '可靠', '正直'], ARRAY['Loyal', 'Reliable', 'Honest'], ARRAY['tiger', 'horse'], 'earth'),
('pig', '猪', 'Pig', '善良真诚，乐观开朗，享受生活。', 'Kind, optimistic, enjoys life.', ARRAY['善良', '真诚', '慷慨'], ARRAY['Kind', 'Sincere', 'Generous'], ARRAY['rabbit', 'sheep'], 'water')
ON CONFLICT DO NOTHING;

-- ============================================
-- Daily Fortunes
-- ============================================
CREATE TABLE IF NOT EXISTS daily_fortunes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    zodiac VARCHAR(20),
    overall_score INT CHECK (overall_score BETWEEN 1 AND 5),
    love_score INT CHECK (love_score BETWEEN 1 AND 5),
    career_score INT CHECK (career_score BETWEEN 1 AND 5),
    health_score INT CHECK (health_score BETWEEN 1 AND 5),
    wealth_score INT CHECK (wealth_score BETWEEN 1 AND 5),
    lucky_color VARCHAR(50),
    lucky_direction VARCHAR(50),
    lucky_food VARCHAR(100),
    auspicious_activities TEXT[],
    inauspicious_activities TEXT[],
    advice_zh TEXT,
    advice_en TEXT,
    element_energy JSONB, -- {wood: 3, fire: 4, earth: 2, metal: 1, water: 5}
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(date, zodiac)
);

CREATE INDEX IF NOT EXISTS idx_fortunes_date ON daily_fortunes(date);
CREATE INDEX IF NOT EXISTS idx_fortunes_zodiac ON daily_fortunes(zodiac);

-- ============================================
-- User Fortune History
-- ============================================
CREATE TABLE IF NOT EXISTS user_fortune_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    fortune_id UUID REFERENCES daily_fortunes(id),
    viewed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fortune_history_user ON user_fortune_history(user_id);
CREATE INDEX IF NOT EXISTS idx_fortune_history_date ON user_fortune_history(viewed_at);

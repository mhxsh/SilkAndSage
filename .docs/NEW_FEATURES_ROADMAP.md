# Silk & Sage 新功能路线图：社区互动 + 东方智慧工具

## 目标
将 Silk & Sage 从内容消费平台升级为**互动式生活方式社区**，增加用户粘性，丰富内容来源，提供独特的东方智慧工具。

---

## 📋 功能清单

### Phase 1: 社区互动功能 (优先级：高)
1. **问题与意见反馈页面** (`/feedback`)
2. **用户投稿系统** (`/contribute`)

### Phase 2: 东方智慧工具集 (优先级：高)
3. **日历查询工具** (`/tools/calendar`)
4. **生日解读工具** (`/tools/birthday`)
5. **今日运势工具** (`/tools/fortune`)

---

## 详细设计

### 1️⃣ 问题与意见反馈页面

#### 功能描述
为用户提供一个优雅的反馈渠道，用于提交问题、建议、合作意向等。

#### 核心功能
- **多类型反馈**：问题报告、功能建议、内容建议、合作洽谈
- **附件上传**：支持上传截图（问题报告）
- **匿名选项**：用户可选择匿名或具名反馈
- **状态追踪**：已登录用户可查看反馈处理状态

#### 数据库设计
```sql
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL, -- 'bug', 'suggestion', 'content_idea', 'partnership'
    subject VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    email VARCHAR(255), -- For anonymous users
    is_anonymous BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved', 'closed'
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_user ON feedback(user_id);
```

#### UI/UX 设计要点
- **女性化配色**：柔和的 Sage 绿 + 温暖的米色背景
- **表单设计**：清晰的步骤指引，减少用户焦虑
- **感谢页面**：提交后显示温馨的感谢信息 + 预计回复时间
- **微交互**：表单验证动画、提交成功的花瓣飘落效果

#### 技术实现
- **前端**：`app/[lang]/feedback/page.tsx`
- **API**：`app/api/feedback/route.ts`
- **组件**：`components/FeedbackForm.tsx`
- **邮件通知**：使用 Resend 或 Nodemailer 发送通知给管理员

---

### 2️⃣ 用户投稿系统

#### 功能描述
允许用户提交自己的故事、经验、推荐，经审核后发布为社区内容。

#### 核心功能
- **投稿编辑器**：Markdown 或富文本编辑器
- **分类选择**：五行、情绪管理、家居美学、个人成长等
- **图片上传**：封面图 + 内容图片（Supabase Storage）
- **草稿保存**：支持保存草稿，分多次完成
- **审核流程**：提交 → 待审核 → 已发布/已拒绝
- **作者署名**：发布后显示作者信息 + 个人主页链接

#### 数据库设计
```sql
CREATE TABLE user_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50), -- 'wood', 'fire', 'earth', 'metal', 'water', 'emotion', 'home', 'growth'
    tags TEXT[], -- Array of tags
    cover_image_url TEXT,
    images TEXT[], -- Array of image URLs
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'submitted', 'under_review', 'published', 'rejected'
    published_at TIMESTAMP,
    rejection_reason TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contributions_user ON user_contributions(user_id);
CREATE INDEX idx_contributions_status ON user_contributions(status);
CREATE INDEX idx_contributions_published ON user_contributions(published_at) WHERE status = 'published';
```

#### UI/UX 设计要点
- **鼓励性引导**："分享您的五行生活智慧"
- **示例展示**：提供优秀投稿案例作为参考
- **进度保存**：自动保存草稿，减少用户焦虑
- **审核透明**：清晰告知审核时间和标准

#### 技术实现
- **前端**：`app/[lang]/contribute/page.tsx`
- **编辑器**：使用 `@uiw/react-md-editor` 或 `react-quill`
- **图片上传**：Supabase Storage + 图片压缩
- **API**：`app/api/contributions/route.ts`

---

### 3️⃣ 日历查询工具

#### 功能描述
提供阳历转农历、二十四节气、传统节日查询，融入东方文化解读。

#### 核心功能
- **日期选择器**：选择公历日期
- **农历显示**：
  - 农历年月日（如：甲辰年 乙亥月 丙寅日）
  - 生肖年（如：龙年）
  - 节气信息（如：立春后第 3 天）
- **传统节日**：
  - 显示当月所有传统节日
  - 节日介绍 + 习俗 + 养生建议
- **月历视图**：
  - 展示整月的农历日期
  - 高亮节气和节日
- **文化解读**：
  - 当日五行属性
  - 宜忌事项（现代化解读，避免迷信）
  - 养生建议

#### 数据库设计
```sql
CREATE TABLE chinese_calendar_data (
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
    auspicious_activities TEXT[], -- 宜做的事
    inauspicious_activities TEXT[], -- 忌做的事
    wellness_advice TEXT, -- 养生建议
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE traditional_festivals (
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
    wellness_tips_en TEXT
);
```

#### UI/UX 设计要点
- **视觉风格**：中式水墨风格 + 现代扁平设计
- **颜色映射**：五行配色（木绿、火红、土黄、金白、水蓝）
- **动画效果**：日期切换时的淡入淡出
- **节日氛围**：临近节日时增加装饰元素（如春节的梅花）

#### 技术实现
- **前端**：`app/[lang]/tools/calendar/page.tsx`
- **日历库**：使用 `lunar-javascript` 或 `@uiw/react-lunar-calendar`
- **组件**：
  - `components/ChineseCalendar.tsx`
  - `components/FestivalCard.tsx`
  - `components/ElementBadge.tsx`

---

### 4️⃣ 生日解读工具

#### 功能描述
输入生日，获取生肖、时辰、五行属性、性格特质、幸运元素等解读。

#### 核心功能
- **输入信息**：
  - 出生日期（年月日）
  - 出生时间（时辰，可选）
- **自动计算**：
  - 生肖
  - 农历生日
  - 时辰（如果提供出生时间）
  - 五行属性（基于出生年份和时辰）
  - 星座
- **个性化解读**：
  - 生肖性格特质
  - 五行平衡分析
  - 适合的颜色、方位、职业
  - 幸运数字和幸运石
  - 养生建议
- **保存到个人档案**：已登录用户可将结果保存

#### 数据库设计
```sql
CREATE TABLE user_birth_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    birth_date DATE NOT NULL,
    birth_time TIME, -- Optional
    zodiac_sign VARCHAR(20), -- 生肖
    chinese_zodiac VARCHAR(10),
    lunar_birth_date VARCHAR(50),
    birth_hour VARCHAR(10), -- 时辰
    element VARCHAR(10), -- 主导五行
    element_balance JSONB, -- {wood: 2, fire: 1, earth: 2, metal: 1, water: 0}
    personality_traits TEXT,
    lucky_colors TEXT[],
    lucky_numbers INT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE zodiac_interpretations (
    zodiac VARCHAR(20) PRIMARY KEY,
    name_zh VARCHAR(10),
    name_en VARCHAR(20),
    personality_zh TEXT,
    personality_en TEXT,
    strengths_zh TEXT[],
    strengths_en TEXT[],
    weaknesses_zh TEXT[],
    weaknesses_en TEXT[],
    lucky_colors TEXT[],
    lucky_numbers INT[],
    compatible_zodiacs TEXT[],
    element VARCHAR(10)
);
```

#### UI/UX 设计要点
- **步骤化表单**：分步骤收集信息，减少认知负担
- **动画展示**：结果以卡片翻转或淡入的方式呈现
- **视觉化数据**：五行平衡用雷达图展示
- **分享功能**：支持生成美图分享到社交媒体

#### 技术实现
- **前端**：`app/[lang]/tools/birthday/page.tsx`
- **图表库**：使用 `recharts` 或 `chart.js`
- **API**：`app/api/tools/birthday/route.ts`
- **组件**：
  - `components/BirthdayForm.tsx`
  - `components/ZodiacCard.tsx`
  - `components/ElementRadarChart.tsx`

---

### 5️⃣ 今日运势工具

#### 功能描述
结合用户生日、生肖、星座等信息，提供每日运势解读和建议。

#### 核心功能
- **登录用户**：从个人档案自动加载信息
- **访客用户**：需输入生日
- **运势维度**：
  - 整体运势（1-5 星）
  - 爱情运势
  - 事业运势
  - 健康运势
  - 财富运势
- **每日建议**：
  - 宜做的事
  - 忌做的事
  - 幸运颜色
  - 幸运方位
  - 开运食物
- **五行能量**：当日五行能量分布图
- **历史记录**：已登录用户可查看过往运势

#### 数据库设计
```sql
CREATE TABLE daily_fortunes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    zodiac VARCHAR(20),
    overall_score INT, -- 1-5
    love_score INT,
    career_score INT,
    health_score INT,
    wealth_score INT,
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

CREATE TABLE user_fortune_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    fortune_id UUID REFERENCES daily_fortunes(id),
    viewed_at TIMESTAMP DEFAULT NOW()
);
```

#### UI/UX 设计要点
- **仪式感设计**：点击"查看今日运势"有抽卡动画
- **渐进式呈现**：信息逐步展开，保持神秘感
- **每日更新提醒**：0点后提醒用户查看新运势
- **分享美图**：自动生成精美的运势卡片图

#### 技术实现
- **前端**：`app/[lang]/tools/fortune/page.tsx`
- **运势生成**：
  - 方案 1：预生成（每日凌晨为所有生肖生成运势）
  - 方案 2：AI 生成（使用 OpenAI API 根据日期+生肖+五行实时生成）
- **动画库**：使用 `framer-motion`
- **组件**：
  - `components/FortuneCard.tsx`
  - `components/FortuneAnimation.tsx`

---

## 🚀 实施计划

### MVP (Minimum Viable Product) - 2 周
**目标**：快速验证核心功能

- [ ] 功能 1：反馈页面（简化版，仅表单提交）
- [ ] 功能 2：投稿页面（仅 Markdown 编辑器，无图片）
- [ ] 功能 3：日历查询（基础农历转换，无文化解读）

### Phase 2 - 4 周
**目标**：完善工具功能

- [ ] 功能 4：生日解读（完整版，含五行分析）
- [ ] 功能 5：今日运势（预生成版本）
- [ ] 日历查询：增加二十四节气和节日解读
- [ ] 投稿系统：增加图片上传和草稿功能

### Phase 3 - 8 周
**目标**：数据整合和个性化

- [ ] 用户个人档案：整合生日、运势、收藏等
- [ ] 运势 AI 生成：接入 OpenAI 实现个性化运势
- [ ] 内容关联：根据用户五行属性推荐文章
- [ ] 社区功能：投稿内容评论和点赞

---

## 📊 数据价值与内容生成

### 数据收集
通过这些工具，我们可以收集：
- 用户生日分布（生肖、星座）
- 用户关注的节气和节日
- 用户查询运势的频率
- 用户的五行属性分布

### 内容生成思路
1. **节气专题**：每个节气前推送相关养生、生活建议
2. **生肖系列**：为每个生肖创建专属内容系列
3. **五行平衡**：根据五行缺失推荐调整方案
4. **用户故事**：将优质投稿整理为"社区故事"栏目

---

## 🎨 统一视觉风格

### 工具页面设计规范
- **导航栏**：增加"工具"下拉菜单（日历、生日、运势）
- **配色**：
  - 木：#6B8E23（橄榄绿）
  - 火：#DC143C（深红）
  - 土：#D2B48C（谭黄）
  - 金：#C0C0C0（银白）
  - 水：#4682B4（钢蓝）
- **插画风格**：水墨风 + 扁平化
- **字体**：标题用宋体/衬线，正文用无衬线

---

## 💡 技术栈推荐

### 新增依赖
```json
{
  "lunar-javascript": "^1.6.12", // 农历计算
  "@uiw/react-md-editor": "^4.0.0", // Markdown 编辑器
  "recharts": "^2.10.0", // 图表
  "framer-motion": "^10.16.0", // 动画
  "html2canvas": "^1.4.1" // 生成分享图
}
```

### API 集成
- **OpenAI API**：运势 AI 生成
- **Resend/Nodemailer**：反馈邮件通知
- **Supabase Storage**：图片存储

---

## ✅ 下一步行动

1. **创建数据库迁移文件**（`supabase/migrations/006_community_tools.sql`）
2. **设计工具导航菜单**（在 Header 中增加"工具"入口）
3. **实现反馈页面**（最简单，优先验证）
4. **搭建日历查询 MVP**（使用现成库快速迭代）

是否需要我立即开始实现某个具体功能？

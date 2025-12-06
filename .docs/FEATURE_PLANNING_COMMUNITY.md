# 社区功能扩展需求规划文档 v1.0

## 📋 概述

本文档详细规划了 Silk & Sage 社区功能的扩展需求，包括圈子模块、话题功能、分享逻辑增强、每日仪式和UGC升级。

**创建日期**: 2024-12-19  
**状态**: 规划中  
**优先级**: 高

---

## 🎯 功能模块清单

### 1. Community / Circles (圈子模块)

#### 1.1 功能描述
允许用户加入基于"五行"或"MBTI"的专属小组，形成垂直社区。

#### 1.2 核心功能
- **圈子类型**：
  - 五行圈子（木、火、土、金、水）
  - MBTI圈子（16种人格类型）
  - 自定义圈子（由管理员创建）
- **圈子功能**：
  - 创建圈子（管理员）
  - 加入/退出圈子
  - 圈子动态流（成员发布的内容）
  - 圈子成员列表
  - 圈子话题讨论
  - 圈子专属活动

#### 1.3 用户故事
- 作为用户，我希望能够根据我的五行属性（如"木"）加入对应的圈子
- 作为用户，我希望在圈子中看到其他成员分享的内容和讨论
- 作为用户，我希望能够在我的个人资料中展示我加入的圈子

#### 1.4 数据库设计
```sql
-- 圈子表
CREATE TABLE circles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_zh TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- 'element', 'mbti', 'custom'
    type_value TEXT, -- 'wood', 'fire', 'INFJ', etc.
    description_zh TEXT,
    description_en TEXT,
    cover_image_url TEXT,
    member_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 圈子成员表
CREATE TABLE circle_members (
    circle_id UUID REFERENCES circles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- 'member', 'moderator', 'admin'
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (circle_id, user_id)
);

-- 圈子动态表（关联到posts表）
CREATE TABLE circle_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID REFERENCES circles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES ugc_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 2. Topic (话题) 功能

#### 2.1 功能描述
增加"话题"功能，如 #本周穿搭挑战、#满月许愿，允许用户参与话题讨论。

#### 2.2 核心功能
- **话题创建**：
  - 管理员创建官方话题
  - 用户可建议话题（需审核）
- **话题参与**：
  - 在发布内容时添加话题标签
  - 浏览话题下的所有内容
  - 话题热度排序
- **话题类型**：
  - 挑战类（#本周穿搭挑战）
  - 许愿类（#满月许愿）
  - 讨论类（#五行生活）
  - 分享类（#今日穿搭）

#### 2.3 用户故事
- 作为用户，我希望能够参与"本周穿搭挑战"话题，分享我的穿搭
- 作为用户，我希望能够浏览某个话题下的所有相关内容
- 作为用户，我希望能够关注感兴趣的话题

#### 2.4 数据库设计
```sql
-- 话题表
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, -- 如 "本周穿搭挑战"
    slug TEXT UNIQUE NOT NULL, -- 如 "weekly-outfit-challenge"
    description_zh TEXT,
    description_en TEXT,
    icon TEXT, -- emoji或图标
    type TEXT NOT NULL, -- 'challenge', 'wish', 'discussion', 'share'
    is_featured BOOLEAN DEFAULT false,
    participant_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE, -- 对于限时话题
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 话题-内容关联表
CREATE TABLE topic_posts (
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    post_id UUID REFERENCES ugc_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (topic_id, post_id)
);

-- 用户关注话题表
CREATE TABLE user_topic_follows (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, topic_id)
);
```

---

### 3. Share Logic (分享逻辑增强)

#### 3.1 功能描述
强化分享功能，包括工具结果海报化和足迹公开化。

#### 3.2 核心功能

**3.2.1 工具结果海报化**
- 所有工具（Color Harmony, Fortune, Profile）的产出物，必须能一键生成一张高分辨率、带有二维码和品牌 Logo 的美图
- 支持自定义海报样式
- 支持分享到社交媒体（微信、微博、Instagram、Pinterest等）

**3.2.2 足迹公开化**
- 允许用户选择性公开自己的"灵性足迹"
- 打造各种人设（如"灵性修行者"、"五行生活家"等）
- 足迹展示页面（类似Instagram的个人主页）
- 足迹统计（使用工具次数、最常用工具等）

#### 3.3 用户故事
- 作为用户，我希望能够将我的颜色搭配结果生成一张精美的海报分享到朋友圈
- 作为用户，我希望能够公开我的足迹，展示我的灵性修行历程
- 作为用户，我希望能够查看其他用户的公开足迹，获得灵感

#### 3.4 数据库设计
```sql
-- 分享内容表
CREATE TABLE shared_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL, -- 'tool_result', 'footprint', 'post'
    content_id UUID, -- 关联到具体内容ID
    poster_image_url TEXT, -- 生成的海报图片URL
    share_code TEXT UNIQUE, -- 分享码，用于生成分享链接
    view_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户足迹公开设置表
CREATE TABLE user_footprint_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    public_username TEXT, -- 公开显示的用户名
    public_bio_zh TEXT,
    public_bio_en TEXT,
    public_avatar_url TEXT,
    showcase_tools TEXT[], -- 展示的工具列表
    showcase_footprints INTEGER, -- 展示的足迹数量限制
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 4. Daily Rituals (每日仪式)

#### 4.1 功能描述
除了每日运势，增加"每日签到"但包装成"每日正念"或"早安寄语"，增加用户每天打开 App 的理由。

#### 4.2 核心功能
- **每日正念**：
  - 每日一句正念语录（基于五行、星座等个性化）
  - 用户可以选择记录今日心情
  - 连续签到奖励
- **早安寄语**：
  - 每日个性化早安问候
  - 结合用户画像（五行、MBTI、星座）
  - 今日能量建议
- **签到系统**：
  - 连续签到天数统计
  - 签到奖励（徽章、称号等）
  - 签到日历视图

#### 4.3 用户故事
- 作为用户，我希望每天打开App时能看到一句符合我个性的正念语录
- 作为用户，我希望能够记录每日心情，形成我的情绪日记
- 作为用户，我希望能够通过连续签到获得奖励

#### 4.4 数据库设计
```sql
-- 每日签到记录表
CREATE TABLE daily_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    mood TEXT, -- 'happy', 'calm', 'anxious', 'energetic', etc.
    mood_note TEXT, -- 用户的心情记录
    morning_greeting_id UUID, -- 关联到早安寄语
    mindfulness_quote_id UUID, -- 关联到正念语录
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, checkin_date)
);

-- 正念语录表
CREATE TABLE mindfulness_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_zh TEXT NOT NULL,
    quote_en TEXT NOT NULL,
    author_zh TEXT,
    author_en TEXT,
    element TEXT, -- 关联五行
    mbti_type TEXT, -- 关联MBTI
    zodiac TEXT, -- 关联星座
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 早安寄语表
CREATE TABLE morning_greetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    greeting_zh TEXT NOT NULL,
    greeting_en TEXT NOT NULL,
    energy_advice_zh TEXT,
    energy_advice_en TEXT,
    element TEXT,
    mbti_type TEXT,
    zodiac TEXT,
    date DATE, -- 特定日期使用
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户签到统计表
CREATE TABLE user_checkin_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_checkins INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0, -- 当前连续签到天数
    longest_streak INTEGER DEFAULT 0, -- 最长连续签到天数
    last_checkin_date DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 5. UGC (用户生成内容) 升级

#### 5.1 功能描述
不仅是文字投稿，允许用户上传"买家秀"或"穿搭图"，并关联到你的Affiliate商品，形成"买家社区"。

#### 5.2 核心功能
- **图片上传**：
  - 支持多图上传（最多9张）
  - 图片压缩和优化
  - 图片标签和描述
- **商品关联**：
  - 在发布内容时关联Affiliate商品
  - 商品卡片展示
  - 点击跳转到商品链接
- **买家秀功能**：
  - 专门的买家秀发布入口
  - 买家秀展示页面
  - 买家秀点赞和评论
- **穿搭分享**：
  - 穿搭图片上传
  - 穿搭标签（风格、场合等）
  - 穿搭灵感推荐

#### 5.3 用户故事
- 作为用户，我希望能够上传我购买的商品的买家秀，分享使用心得
- 作为用户，我希望能够看到其他用户的穿搭分享，获得搭配灵感
- 作为用户，我希望能够通过点击商品卡片直接跳转到购买页面

#### 5.4 数据库设计
```sql
-- UGC内容表（扩展原有submissions表）
CREATE TABLE ugc_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    post_type TEXT NOT NULL, -- 'article', 'buyer_show', 'outfit', 'review'
    images TEXT[], -- 图片URL数组
    cover_image_url TEXT, -- 封面图
    tags TEXT[], -- 标签数组
    status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- 内容-商品关联表
CREATE TABLE post_products (
    post_id UUID REFERENCES ugc_posts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    position INTEGER, -- 在内容中的位置
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (post_id, product_id)
);

-- 买家秀表（特殊类型的UGC）
CREATE TABLE buyer_shows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES ugc_posts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    rating INTEGER, -- 1-5星评分
    review_text TEXT,
    pros TEXT[], -- 优点
    cons TEXT[], -- 缺点
    is_verified BOOLEAN DEFAULT false, -- 是否验证购买
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🗄️ 数据库迁移计划

### 迁移文件结构
```
supabase/migrations/
  018_community_circles.sql
  019_topics.sql
  020_share_logic.sql
  021_daily_rituals.sql
  022_ugc_upgrade.sql
```

### 索引策略
- 所有外键字段建立索引
- 时间字段建立索引（用于排序）
- 状态字段建立索引（用于筛选）
- 文本搜索字段建立GIN索引（如tags数组）

---

## 🎨 UI/UX 设计要点

### 1. 圈子模块
- **视觉风格**：卡片式设计，每个圈子有独特的配色（基于五行）
- **交互**：点击进入圈子详情页，展示成员和动态
- **导航**：在主导航栏增加"圈子"入口

### 2. 话题功能
- **视觉风格**：话题标签采用圆角矩形，带emoji图标
- **交互**：点击话题标签进入话题详情页
- **展示**：在内容发布页面支持话题选择

### 3. 分享功能
- **海报生成**：使用Canvas API生成海报，支持自定义样式
- **分享按钮**：在所有工具结果页面增加"生成海报"按钮
- **足迹展示**：类似Instagram的个人主页布局

### 4. 每日仪式
- **首页入口**：在首页顶部增加"今日正念"卡片
- **签到动画**：签到成功有动画反馈
- **日历视图**：展示连续签到日历

### 5. UGC升级
- **图片上传**：支持拖拽上传，预览功能
- **商品卡片**：在内容中嵌入商品卡片，支持点击跳转
- **买家秀专区**：专门的买家秀展示页面

---

## 🚀 实施计划

### Phase 1: 数据库与基础架构 (Week 1)
- [ ] 创建数据库迁移文件
- [ ] 实现基础数据模型
- [ ] 设置RLS策略

### Phase 2: 核心功能开发 (Week 2-3)
- [ ] 实现圈子模块（创建、加入、展示）
- [ ] 实现话题功能（创建、参与、展示）
- [ ] 实现每日仪式（签到、正念、早安寄语）

### Phase 3: 分享与UGC (Week 4-5)
- [ ] 实现工具结果海报生成
- [ ] 实现足迹公开化
- [ ] 实现UGC图片上传
- [ ] 实现商品关联功能

### Phase 4: 优化与测试 (Week 6)
- [ ] UI/UX优化
- [ ] 性能优化
- [ ] 功能测试
- [ ] 用户反馈收集

---

## 📊 成功指标 (KPI)

| 功能模块 | 核心指标 | 目标值 |
|---------|---------|--------|
| 圈子模块 | 圈子创建数、成员加入率 | 10个圈子，50%用户加入至少1个圈子 |
| 话题功能 | 话题参与度、内容发布数 | 每个话题平均50条内容 |
| 分享功能 | 海报生成数、分享次数 | 每日100次分享 |
| 每日仪式 | 日活跃用户、连续签到率 | 30%用户连续签到7天 |
| UGC升级 | 图片上传数、买家秀数量 | 每周50条买家秀 |

---

## 🔗 相关文档

- [PRD.md](./PRD.md) - 产品需求文档
- [DATA_MODEL.md](./DATA_MODEL.md) - 数据模型规范
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 系统架构文档

---

## 📝 更新日志

- **2024-12-19**: 创建初始版本，规划所有功能模块


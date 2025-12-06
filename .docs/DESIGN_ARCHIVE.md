# Merged Documentation: DESIGN_ARCHIVE.md


---

# Source: HOMEPAGE_REDESIGN.md


# 主页视觉升级：杂志风格重构

## 目标
解决主页"热门精选"板块视觉单调、缺乏灵动感的问题，摆脱"简单博客"的刻板印象，打造具有东方美学质感的"生活美学杂志"体验。

## 核心变更：PopularArticles 组件重构

### 1. 布局革新：非对称杂志排版 (Asymmetrical Editorial Layout)
- **旧版**：3列均匀网格，视觉平淡，缺乏重点。
- **新版**：**"1+3" 结构**。
  - **左侧 (Hero)**：占据 60% 宽度。展示最热门的一篇文章，使用沉浸式大图卡片。
  - **右侧 (List)**：占据 40% 宽度。垂直排列 3 篇次要热门文章，形成清晰的视觉层级。

### 2. 视觉增强
- **沉浸式 Hero 卡片**：
  - 图片全填充 (`object-cover`)。
  - 底部渐变遮罩，保证文字可读性。
  - 标签使用磨砂玻璃效果 (`backdrop-blur-md`)，增加通透感。
- **精致列表项**：
  - 增加序号 (02, 03, 04) 和装饰线条，强化序列感。
  - 悬停时背景变白并浮起 (`hover:shadow-md`)，提供明确的交互反馈。
- **氛围背景**：
  - 引入了两个巨大的模糊光晕 (`blur-3xl`) 作为背景装饰：
    - 右上角：淡绿色 (Sage)
    - 左下角：淡橙色 (Orange)
  - 这些光晕打破了纯色背景的沉闷，增加了空间的流动感。

### 3. 交互细节
- **图片微动效**：悬停时图片缓慢放大 (`scale-105`)，时长 1秒，营造优雅、不急促的感觉。
- **文字交互**：标题悬停变色，"View All Stories" 箭头移动效果。

## 技术实现
- 使用 Tailwind CSS 的 Grid 系统 (`grid-cols-12`) 实现复杂布局。
- 使用 `backdrop-filter` 实现磨砂效果。
- 使用 `group-hover` 控制父子元素的联动交互。

## 后续建议
- 考虑在 Hero Section 引入视频背景。
- 引入 `framer-motion` 实现滚动入场动画。


---

# Source: NEW_TOOLS_DESIGN.md


# AI 增强型美学与心理工具扩展设计方案

## 1. 🎨 色彩搭配大师 (Color Harmony AI)

### 核心理念
不仅仅是色轮工具，而是基于"意境"和"五行能量"的 AI 色彩生成器。

### 功能特性
1.  **意境配色生成**: 用户输入关键词（如"雨后清晨"、"复古爵士"），AI 生成 5 色调色板。
2.  **五行能量补给**: 根据用户当天的运势或缺失元素（例如缺"火"），推荐穿搭或环境配色。
3.  **图片取色与分析**: 上传一张图片，AI 提取主色调并分析其情感倾向。

### AI 交互逻辑
*   **Input**: 关键词 / 用户五行属性 / 图片
*   **Prompt 示例**: "为一名五行属'木'的用户生成一组'职场自信'主题的配色方案，要求包含一种主色、一种辅助色和一种点缀色，并解释色彩心理学含义。"
*   **Output (JSON)**:
    ```json
    {
      "palette_name": "森林晨曦",
      "colors": ["#2D5A27", "#8FBC8F", "#F0E68C", ...],
      "description": "深绿色增强稳重感，浅绿带来生机，点缀鹅黄色增加亲和力...",
      "usage_advice": "适合周一会议穿着，建议深绿色为西装外套..."
    }
    ```

---

## 2. 👔 图形纹理协调师 (Pattern & Texture Harmony)

### 核心理念
解决"这件衣服配什么裤子"的终极难题。用专业的设计语言（如"视觉重量"、"纹理对比"）来指导搭配。

### 功能特性
1.  **纹理百科**: 介绍丝绸、亚麻、羊毛等材质的特性及五行属性（如丝绸属金/水）。
2.  **AI 搭配助手**:
    *   用户选择/上传一种纹理（如"粗花呢"）。
    *   AI 推荐 3 种协调的搭配方案（如"搭配丝绸产生软硬对比"）。
3.  **图案冲突美学**: 教用户如何混搭条纹、波点、印花而不显凌乱。

### AI 交互逻辑
*   **Input**: 基础纹理/图案（例如：苏格兰格纹）
*   **Prompt 示例**: "用户想穿一件'苏格兰格纹(Tartan)'的羊毛外套，请推荐三种不同风格的下装纹理搭配方案（保守、时尚、前卫），并解释视觉原理。"
*   **Output**:
    *   **方案A (经典)**: 搭配纯色灯芯绒 (Corduroy) - 增加温暖感，纹理和谐。
    *   **方案B (现代)**: 搭配光面皮革 (Leather) - 材质软硬对比，酷感十足。

---

## 3. 🧠 AI 每日心情疗愈 (Personalized Mood Test)

### 核心理念
抛弃死板的固定题库。根据用户的**性格画像（星座/MBTI/五行）**，动态生成最能击中用户当下状态的测试题。

### 流程设计
1.  **读取画像**: 系统读取用户档案（例如：天蝎座，水象，最近运势低迷）。
2.  **动态出题 (AI)**:
    *   AI 生成 3-5 个针对性问题。
    *   *针对天蝎座*: "今天是否感觉周围的人不够真诚？"
    *   *针对火象星座*: "是否感觉今天的行动力受阻，有一股无名火？"
3.  **用户回答**: 简单的滑动条或选项。
4.  **生成处方 (AI)**:
    *   **情绪分析**: "你今天感到受挫是因为..."
    *   **行动建议**: "去喝一杯冰美式，或者听这首白噪音..."
    *   **能量色彩**: 推荐今日疗愈色。

### AI 交互逻辑
*   **Input**: 用户档案 + 当前时间
*   **Output**: 动态题目列表 -> 用户回答 -> 最终建议卡片。

---

## 🛠️ 技术架构与实现路径

### 1. AI 服务层 (`/app/api/ai/*`)
我们需要接入大模型 API (如 OpenAI, Gemini, 或国内的 DeepSeek/Moonshot)。
*   `POST /api/ai/generate-palette`: 生成配色
*   `POST /api/ai/consult-texture`: 纹理咨询
*   `POST /api/ai/mood-test/generate`: 生成题目
*   `POST /api/ai/mood-test/analyze`: 分析结果

### 2. 数据库扩展 (`supabase`)
*   `user_mood_logs`: 记录每日心情、测试结果和 AI 建议。
*   `saved_palettes`: 保存用户喜欢的配色方案。

### 3. 前端组件
*   **ColorPicker**: 交互式色盘。
*   **ChatInterface**: 类似对话框的测试界面，提供沉浸式体验。
*   **TextureCard**: 展示不同材质的高清纹理图。

---

## 📅 实施路线图 (Roadmap)

### Phase 1: 基础框架搭建
*   配置 AI SDK (Vercel AI SDK)。
*   设置 API Key 环境变量。
*   创建新的数据库表。

### Phase 2: 色彩搭配学开发
*   实现 AI 配色 API。
*   前端展示色卡和 Hex 码复制功能。

### Phase 3: 心情测试开发
*   实现基于 User Profile 的 Prompt 工程。
*   开发动态问卷 UI。

### Phase 4: 纹理搭配开发
*   整理基础纹理知识库。
*   实现搭配推荐逻辑。



---

# Source: TOOLS_INTERACTIVITY_DESIGN.md


# 工具互动性增强设计方案

## 📌 需求概述

### 1. 今日运势增强
- 登录用户自动读取生日信息
- 支持保存运势结果到历史记录
- 支持为运势添加个人笔记/评论
- 支持分享到主流社交平台

### 2. 生日解读增强
- 支持保存到用户个人资料
- 在个人中心展示生日解读
- 一键更新生日信息

---

## 🗄️ 数据库设计

### 现有表（已存在）
```sql
-- user_birth_profiles: 用户生日档案
-- user_fortune_history: 运势查看历史
```

### 新增/修改表

#### 1. 增强 user_fortune_history 表
```sql
ALTER TABLE user_fortune_history ADD COLUMN IF NOT EXISTS 
    fortune_data JSONB,           -- 保存完整运势数据
    user_notes TEXT,               -- 用户笔记
    is_favorite BOOLEAN DEFAULT false,  -- 是否收藏
    shared_count INT DEFAULT 0;    -- 分享次数
```

#### 2. 新增 fortune_comments 表
```sql
CREATE TABLE fortune_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    fortune_history_id UUID REFERENCES user_fortune_history(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎨 UI/UX 流程设计

### 今日运势流程

#### 未登录用户
```
1. 输入生日 → 2. 查看运势 → 3. 提示登录以保存
```

#### 登录用户
```
1. 自动读取生日（首次需输入）
   ↓
2. 显示今日运势
   ↓
3. [保存] [添加笔记] [分享] [收藏]
   ↓
4. 查看历史运势（在个人中心）
```

### 生日解读流程

#### 未登录用户
```
1. 输入生日 → 2. 查看解读
```

#### 登录用户
```
1. 自动读取生日（首次需输入）
   ↓
2. 显示解读结果
   ↓
3. [保存到个人资料] 按钮
   ↓
4. 在个人中心查看完整解读
```

---

## 🔧 技术实现方案

### Phase 1: 数据层（优先）
- ✅ 数据库迁移文件
- API 路由创建
- 数据验证和 RLS 策略

### Phase 2: 生日解读保存功能
- 更新 BirthdayTool 组件
- 添加保存按钮
- API 集成
- 个人中心展示

### Phase 3: 今日运势增强
- 更新 FortuneTool 组件
- 自动读取用户生日
- 添加保存/笔记/收藏功能
- 运势历史记录页面

### Phase 4: 分享功能
- 分享按钮组件
- 支持平台：
  - Facebook
  - Twitter (X)
  - LinkedIn
  - WhatsApp
  - 复制链接
  - 生成分享图片

### Phase 5: 个人中心整合
- 我的生日解读卡片
- 运势历史列表
- 收藏的运势
- 统计数据

---

## 📊 数据流设计

### 保存生日解读
```
User → BirthdayTool → API (/api/profile/birth-info) → Supabase
                                                          ↓
                                            user_birth_profiles 表
```

### 保存运势记录
```
User → FortuneTool → API (/api/fortune/save) → Supabase
                                                   ↓
                                   user_fortune_history 表
```

### 分享运势
```
User → Share Button → Generate Share Data → Social Platform API
                           ↓
                    Update share_count
```

---

## 🎯 功能优先级

### P0 - 立即实现
1. ✅ 数据库表结构更新
2. ⬜ 生日信息保存 API
3. ⬜ 个人中心显示生日解读

### P1 - 本周完成
4. ⬜ 运势历史保存功能
5. ⬜ 用户笔记功能
6. ⬜ 运势历史查看页面

### P2 - 下周完成
7. ⬜ 分享功能
8. ⬜ 收藏功能
9. ⬜ 统计和数据可视化

---

## 🔐 安全考虑

### Row Level Security (RLS)
```sql
-- 用户只能查看/修改自己的记录
CREATE POLICY "Users can manage own birth profile"
    ON user_birth_profiles
    USING (user_id = auth.uid());

CREATE POLICY "Users can manage own fortune history"
    ON user_fortune_history
    USING (user_id = auth.uid());
```

### 数据验证
- 生日日期验证（合理范围）
- 笔记长度限制
- 防止重复保存（同一天）

---

## 📱 响应式设计

### 移动端优化
- 生日选择器：原生日期选择器
- 运势卡片：滑动查看
- 分享：原生分享 API（支持的平台）

### 桌面端
- 更丰富的视觉效果
- 侧边栏历史记录
- 快捷键支持

---

## 🌐 国际化

### 新增翻译键
```json
{
  "tools": {
    "birthday": {
      "save_to_profile": "保存到个人资料",
      "saved": "已保存",
      "update_profile": "更新资料"
    },
    "fortune": {
      "save_fortune": "保存运势",
      "add_note": "添加笔记",
      "favorite": "收藏",
      "share": "分享",
      "my_history": "历史运势",
      "notes_placeholder": "记录今天的感受..."
    }
  },
  "profile": {
    "my_birth_info": "我的生日解读",
    "fortune_history": "运势历史"
  }
}
```

---

## 📈 成功指标

### 用户参与度
- 保存生日信息的用户比例
- 每日运势查看频率
- 运势历史查看次数
- 分享次数

### 留存率
- 生日解读保存后的回访率
- 运势笔记功能使用率

---

## 🚀 实施计划

### Week 1 (当前)
- Day 1: 数据库迁移 ✅
- Day 2: 生日保存 API + UI
- Day 3: 个人中心集成

### Week 2
- Day 1-2: 运势保存功能
- Day 3-4: 运势历史页面
- Day 5: 笔记功能

### Week 3
- Day 1-3: 分享功能
- Day 4-5: 优化和测试

---

## 🔄 未来扩展

### 高级功能（可选）
- AI 生成个性化建议
- 运势提醒推送
- 运势趋势分析图表
- 好友运势对比
- 导出运势日记为 PDF

---

**文档版本**: v1.0  
**创建日期**: 2025-12-05  
**状态**: 设计中 → 开发中


---

# Source: FEEDBACK_FEATURE.md


# 反馈功能实现总结

## ✅ 完成内容

### 1. 数据库设计
**文件**：`supabase/migrations/007_feedback_table.sql`

**表结构**：`feedback`
- `id`: UUID 主键
- `user_id`: 用户ID（可为空，支持匿名）
- `type`: 反馈类型（bug/suggestion/content/partnership）
- `subject`: 主题（最多200字符）
- `content`: 详细内容
- `email`: 联系邮箱
- `is_anonymous`: 是否匿名
- `status`: 状态（pending/in_progress/resolved/closed）
- `admin_response`: 管理员回复
- `responded_at`: 回复时间
- `created_at`, `updated_at`: 时间戳

**安全策略（RLS）**：
- ✅ 任何人都可以提交反馈
- ✅ 用户可以查看自己的反馈
- ✅ 管理员可以更新反馈

### 2. 前端组件
**文件**：`components/FeedbackForm.tsx`

**功能**：
- ✅ 反馈类型选择（4种类型）
- ✅ 主题输入
- ✅ 详细内容输入（多行文本框）
- ✅ 邮箱输入（已登录用户自动填充）
- ✅ 匿名选项（仅登录用户可见）
- ✅ 表单验证
- ✅ 提交状态管理
- ✅ 成功页面显示
- ✅ 错误处理

### 3. 页面路由
**文件**：`app/[lang]/feedback/page.tsx`

**功能**：
- ✅ 服务端获取用户信息
- ✅ 传递字典和语言参数
- ✅ 渲染反馈表单组件

### 4. 国际化
**字典文件**：
- `dictionaries/zh.json` ✅
- `dictionaries/en.json` ✅

**翻译内容**：
- 所有UI标签
- 反馈类型选项
- 占位符文本
- 提示消息
- 按钮文字

---

## 📱 访问路径

- **中文版**：`/zh/feedback`
- **英文版**：`/en/feedback`

---

## 🎨 设计特点

### 表单设计
- 简洁清晰的布局
- 必填字段标记（*）
- 友好的占位符提示
- 响应式设计

### 用户体验
- **未登录用户**：可以匿名提交，需填写邮箱
- **已登录用户**：
  - 自动填充邮箱
  - 可选择是否匿名
  - 匿名时邮箱字段可编辑

### 成功页面
- ✓ 绿色成功图标
- 感谢信息
- 两个操作按钮：
  - "返回首页"
  - "提交其他反馈"

### 错误处理
- 表单验证提示
- Supabase 错误提示
- 友好的错误消息

---

## 🔐 安全考虑

1. **Row Level Security (RLS)**
   - 任何人可以插入（包括匿名用户）
   - 只能查看自己的反馈
   - 管理员权限控制

2. **数据验证**
   - 类型枚举限制
   - 状态枚举限制
   - 必填字段检查

3. **隐私保护**
   - 支持匿名反馈
   - 邮箱可选
   - 用户ID可为空

---

## 📊 反馈类型说明

| 类型 | 中文 | 英文 | 用途 |
|------|------|------|------|
| bug | 问题报告 | Bug Report | 报告网站问题或错误 |
| suggestion | 功能建议 | Feature Suggestion | 提出新功能建议 |
| content | 内容建议 | Content Suggestion | 建议文章主题或改进 |
| partnership | 合作洽谈 | Partnership | 商务合作咨询 |

---

## 🚀 后续优化建议

### 短期
- [ ] 添加附件上传功能
- [ ] 邮件通知管理员
- [ ] 用户反馈历史查看页面

### 中期
- [ ] 管理后台（Admin Panel）
  - 查看所有反馈
  - 状态更新
  - 回复反馈
- [ ] 反馈分类筛选
- [ ] 搜索功能

### 长期
- [ ] AI自动分类
- [ ] 优先级评分
- [ ] 反馈投票系统
- [ ] 公开反馈看板

---

## 📝 使用说明

### 用户端
1. 访问 `/feedback` 页面
2. 选择反馈类型
3. 填写主题和详细内容
4. （可选）留下联系邮箱
5. 提交反馈
6. 查看成功提示

### 管理员端
需要在 Supabase 中：
1. 执行迁移文件 `007_feedback_table.sql`
2. 查看 `feedback` 表中的数据
3. 更新 `status` 和 `admin_response` 字段
4. （未来）开发管理后台界面

---

## 🔧 技术栈

- **框架**：Next.js 14 (App Router)
- **数据库**：Supabase (PostgreSQL)
- **样式**：Tailwind CSS
- **组件类型**：Client Component ('use client')
- **数据获取**：Supabase Client
- **国际化**：自定义字典系统

---

**实现日期**：2025-12-05  
**状态**：✅ 完成并可用  
**需要执行**：运行数据库迁移文件

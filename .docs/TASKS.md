# 开发任务清单 (Development Tasks)

本文档基于 `PRD.md` (v3.0) 和 `ARCHITECTURE.md` (v3.0) 制定，用于追踪 Silk & Sage 项目的开发进度。

## 阶段一：基础建设 (Week 1 - Foundation)

### 1.1. 项目初始化
# 开发任务清单 (Development Tasks)

本文档基于 `PRD.md` (v3.0) 和 `ARCHITECTURE.md` (v3.0) 制定，用于追踪 Silk & Sage 项目的开发进度。

## 阶段一：基础建设 (Week 1 - Foundation)

### 1.1. 项目初始化
- [x] **初始化 Next.js 项目**
    - 使用 `create-next-app` 初始化。
    - 配置 TypeScript, Tailwind CSS, ESLint。
    - 清理默认样板代码。
- [x] **配置项目结构**
    - 建立 `components`, `lib`, `app`, `types` 等标准目录。
    - 配置路径别名 (`@/*`)。
- [x] **配置 UI 基础**
    - 定义品牌色 (Sage Green, Cream, Silk Gold)。
    - 配置字体 (Playfair Display, Lato)。

### 1.2. 数据库与后端 (Supabase)
- [x] **Supabase 项目设置**
    - (用户操作) 在 Supabase 创建项目。
    - 获取 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY`。
    - 配置本地 `.env.local`。
- [x] **数据库 Schema 迁移**
    - 根据 `DATA_MODEL.md` 创建 SQL 迁移文件。
    - 执行迁移建立核心表。
- [x] **数据填充 (Seeding)**
    - 编写 `seed.sql`。
    - 录入基础数据 (16 MBTI, 12 星座, 5 元素)。

---

## 阶段二：核心功能开发 (MVP - v2.0)

### 2.1. 认证模块
- [x] 实现 Supabase Auth (注册/登录/登出)。
- [x] 创建受保护的路由 (Middleware)。
- [x] 实现"个人资料"页面基础版。

### 2.2. pSEO 页面引擎
- [x] **数据层开发**
    - 实现获取文章详情的 Server Action。
- [x] **动态路由实现**
    - 创建 `app/[slug]/page.tsx`。
    - 实现 `generateStaticParams` (SSG)。
- [x] **页面渲染**
    - 开发文章详情页 UI 组件。
    - 集成 Markdown 渲染器。

### 2.3. 首页与导航
- [x] 开发全局导航栏 (Navbar) 和页脚 (Footer)。
- [x] 开发着陆页 (Landing Page)。

---

## 阶段三：内容与互动 (v2.1 - Future)
- [ ] 开发"点赞"功能。
- [ ] 开发"评论"区组件。
- [ ] 开发"收藏"功能。
- [ ] 配置国际化 (i18n)。

---

## 阶段四：智能层集成 (v3.0 - Future)
- [ ] (暂缓) 推荐算法 API。
- [ ] (暂缓) 用户画像后台任务。

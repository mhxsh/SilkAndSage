# Silk & Sage 文档中心

欢迎来到 **Silk & Sage** 的技术文档中心。这是一个基于东方哲学的数据驱动型 AI 现代生活美学社区。

## 📚 文档索引

### 1. Product & Strategy
*   **[PRD.md](./PRD.md) (v3.0):** Core product requirements.
*   **[STRATEGY.md](./STRATEGY.md):** (Formerly req.md) Brand strategy, pSEO architecture, and "Identity-to-Solution" mapping.
*   **[ROADMAP.md](./ROADMAP.md):** Consolidated project roadmap, task lists, and user checklists.
*   **[RESOURCES.md](./RESOURCES.md):** (Formerly source.md) Eastern aesthetic knowledge graph and resource collection.

### 2. Technical Architecture
*   **[ARCHITECTURE.md](./ARCHITECTURE.md) (v3.0):** System design and AI layer.
*   **[DATA_MODEL.md](./DATA_MODEL.md):** Database Schema source of truth.
*   **[API.md](./API.md):** REST API specifications.
*   **[DESIGN_ARCHIVE.md](./DESIGN_ARCHIVE.md):** Archive of specific feature design documents (Homepage, Tools, Feedback).

### 3. Development & Operations
*   **[DEV_OPS.md](./DEV_OPS.md):** Deployment, CI/CD, and infrastructure.
*   **[TESTING.md](./TESTING.md):** Testing strategies.
*   **[PROMPTS.md](./PROMPTS.md):** AI System Prompts.
*   **[GUIDES.md](./GUIDES.md):** Implementation guides, manual patches, and i18n instructions.
*   **[DEVELOPMENT_HISTORY.md](./DEVELOPMENT_HISTORY.md):** Historical logs of implementation reports and progress summaries.

---

## 🚀 快速开始 (Getting Started)

### 前置要求
*   Node.js 18+
*   Supabase CLI
*   Docker (用于本地 Supabase)

### 本地开发流程

1.  **克隆与安装:**
    ```bash
    git clone <repo_url>
    cd silk-and-sage
    npm install
    ```

2.  **环境设置:**
    *   复制 `.env.example` 到 `.env.local`。
    *   填入所需的 API 密钥 (详见 `DEV_OPS.md`)。

3.  **数据库设置:**
    *   启动本地 Supabase: `npx supabase start`
    *   这将自动应用迁移并运行 `seed.sql` 以填充初始数据 (MBTI 类型, 五行元素等)。

4.  **运行应用:**
    ```bash
    npm run dev
    ```
    访问 `http://localhost:3000`。

### 本地运行 AI 引擎
要在本地测试 `ContentEngine` 或 `ProfilingEngine` 脚本:
```bash
# 确保你的 .env.local 中包含 SUPABASE_SERVICE_ROLE_KEY
npm run script:content-engine
npm run script:profiling-engine
```

---

## 🤝 贡献指南
*   **数据库变更:** 严禁手动修改 Schema。必须使用 `supabase db diff` 生成迁移文件。
*   **文档:** 如果更改了功能逻辑或 API 契约，请务必更新 `.docs/` 下相应的 `.md` 文件。

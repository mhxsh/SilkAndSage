# Silk & Sage 文档中心

欢迎来到 **Silk & Sage** 的技术文档中心。这是一个基于东方哲学的数据驱动型 AI 现代生活美学社区。

## 📚 文档索引

### 1. 产品与策略
*   **[PRD.md](./PRD.md) (v3.0):** 核心产品需求文档。定义了功能、用户故事和成功指标。
*   **[req.md](./req.md):** **运营策略与品牌手册。** 详述了 "身份-解决方案" (Identity-to-Solution) 架构、pSEO 策略和品牌基调。(可视作项目的“灵魂”)。

### 2. 技术架构
*   **[ARCHITECTURE.md](./ARCHITECTURE.md) (v3.0):** 系统设计，包含智能层、AI 抽象层和后台管理方案。
*   **[DATA_MODEL.md](./DATA_MODEL.md) (v4.1):** **数据库 Schema 的唯一事实来源。** 包含所有表、枚举和触发器的完整 SQL 定义。*注：v4.1 是支持 v3.0 需求的具体实现版本。*
*   **[API.md](./API.md) (v3.0):** REST API 规范，包括新的个性化推荐端点。

### 3. 开发与运维
*   **[DEV_OPS.md](./DEV_OPS.md) (v3.0):** 部署指南、CI/CD 流程、密钥管理和基础设施设置。
*   **[TESTING.md](./TESTING.md) (v1.0):** 测试策略，涵盖单元测试、集成测试和端到端测试。
*   **[PROMPTS.md](./PROMPTS.md) (v1.0):** 集中管理内容引擎和用户画像引擎使用的系统提示词 (System Prompts) 和 AI 配置。

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

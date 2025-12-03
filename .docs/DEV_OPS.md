# DevOps 和部署计划 v3.0 (最终版)

## 1. 概述

本文档在 v2.1 的基础上，更新了**密钥管理**部分以支持新增的**分析服务**和**多 AI 模型**架构，构成了与 v3.0 智能系统完全匹配的最终运维方案。

---

## 2. 数据库迁移 (同 v2.1)

-   **工具:** **Supabase CLI**。
-   **工作流:** 遵循“本地优先”的原则，通过 `supabase db diff` 生成迁移文件，并通过 `supabase db push` 在 CI/CD 流程中应用到线上。

---

## 2.1. 数据库初始数据填充 (Seeding) (新增)

为了确保所有环境（本地开发、Staging、生产）都有一致的基础核心数据（例如16种MBTI类型），我们需要一个标准化的数据填充流程。

-   **方案:** **Supabase Seeding**。
-   **实现:**
    1.  在 Supabase 项目的 `supabase` 目录下，创建一个 `seed.sql` 文件。
    2.  在此文件中，编写标准的 `INSERT` 语句，将所有核心的、非用户生成的基础数据录入。这包括：
        -   `identities` 表: 16 个 MBTI 类型、12 个星座等。
        -   `solutions` 表: 五行元素、核心的美学风格和材料等。
        -   `quiz_questions` 表: “内在元素测试”的所有问题和答案选项。
-   **工作流:**
    -   **本地开发:** 当开发者执行 `supabase start` 或 `supabase db reset` 时，`seed.sql` 文件会被自动执行，填充本地数据库。
    -   **线上部署:** 对于 Staging 和 Production 环境，可以在 Supabase 的仪表盘中的 “Database” -> “Seed Script” 部分粘贴并运行 `seed.sql` 内容，以安全地初始化线上数据库。

---

## 3. 监控与日志 (同 v2.1)

-   **应用日志:** Vercel Log Drains -> Logtail / Datadog。
-   **可用性监控:** UptimeRobot / Checkly。
-   **前端错误追踪:** Sentry / LogRocket。
38: 
39: ---
40: 
41: ## 3.1. 灾难恢复 (Disaster Recovery) (新增)
42: 
43: -   **数据库备份:** 启用 Supabase 的 Point-in-Time Recovery (PITR) 功能（需付费计划）或配置每日定时逻辑备份。
44: -   **代码回滚:** Vercel 提供一键回滚到上一个部署版本的功能，用于快速修复因代码部署导致的生产事故。

---

## 4. 持续集成与部署 (CI/CD) (v3.0 精修)

CI/CD 流程继续由 Vercel 和 GitHub Actions 管理。

-   **Vercel 管道:** (同 v2.1) 负责前端应用的构建、预览和部署。
-   **GitHub Actions:** (同 v2.1) 负责代码检查、测试和后台自动化任务。
-   **环境变量与功能开关 (新增策略):**
    -   我们将利用 Vercel 的环境变量系统来实现功能开关。例如，可以创建一个 `ENABLED_AI_MODELS` 变量，在 `production` 环境中其值为 `openai,claude,gemini`，但在 `staging` 或 `preview` 环境中，其值可以仅为 `openai`，以节约测试成本。AI 抽象层将读取此变量来决定加载哪些模型提供者。

---

## 5. 邮件服务集成 (同 v2.1)

-   **选定服务:** **Resend**，用于处理用户注册验证、密码重置等事务性邮件。

---

## 6. 自动化脚本 (同 v2.1)

-   `ContentEngine` 和新增的 `ProfilingEngine` 都将作为后台脚本，由 GitHub Actions 的 `schedule` 任务触发。

---

## 7. 测试策略 (同 v2.1)

-   测试策略涵盖单元测试、集成测试和 E2E 端到端测试，包含了对新功能（如个性化推荐、多语言切换）的验证。

---

## 8. 密钥管理 (v3.0 最终版)

所有密钥和敏感变量必须根据环境进行隔离。`.env.example` 文件需要被更新以反映所有必需的变量。

-   **Vercel / GitHub Actions Secrets:**
    -   **Supabase:**
        -   `SUPABASE_URL`, `SUPABASE_ANON_KEY` (公共)
        -   `SUPABASE_SERVICE_ROLE_KEY` (私有, 用于后台脚本)
    -   **AI 模型抽象层 (新增):**
        -   `OPENAI_API_KEY` (私有)
        -   `ANTHROPIC_API_KEY` (私有, 可选)
        -   `GOOGLE_API_KEY` (私有, 可选)
    -   **邮件服务:**
        -   `RESEND_API_KEY` (私有)
    -   **社媒与自动化:**
        -   `PINTEREST_API_KEY` (私有)
    -   **分析服务 (新增):**
        -   `POSTHOG_API_KEY` (公共, 如果使用 PostHog Cloud)
        -   `POSTHOG_HOST` (公共, PostHog 实例地址)

-   **本地开发:**
    -   通过 `.env.local` 文件管理，该文件已被加入 `.gitignore`。

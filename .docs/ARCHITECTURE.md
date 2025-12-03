# 系统架构 v3.0 (最终版)

## 1. 指导原则 (v3.0)

在 v2.1 的基础上，新增以下最终指导原则，定义了项目的技术远景：

-   **数据驱动 (Data-Driven):** 所有的产品决策和内容推荐，都应基于真实的用户行为数据。
-   **智能进化 (Intelligent Evolution):** 系统应具备自我学习和进化的能力，通过 AI 不断加深对用户的理解，实现“千人千面”的个性化体验。
-   **模型不可知 (Model-Agnostic):** 核心业务逻辑不与任何单一的 AI 大模型绑定，以保持长期的技术灵活性和成本控制能力。

---

## 2. 核心架构图 (v3.0)

此图展示了 Silk & Sage v3.0 的完整数据与智能闭环。

```mermaid
graph TD
    subgraph "用户交互层"
        User[👩‍💻 用户] --> Browser[🌐 Next.js 前端]
        Browser -->|读写数据/获取推荐| AppLayer[应用层]
        Browser -->|发送行为事件| Analytics[📊 分析服务 (PostHog)]
    end

    subgraph "应用层 (Vercel)"
        AppLayer -- "认证" --> Auth[🔒 Supabase Auth]
        AppLayer -- "CRUD" --> DB[🐘 Supabase DB]
        AppLayer -- "推荐" --> RecoEngine[🧠 推荐引擎 (Edge Fn)]
    end

    subgraph "数据与智能后台"
        subgraph "数据核心 (Supabase)"
            Auth -->|管理用户| DB
            DB -- "存储" --> Storage[📦 Supabase Storage]
        end
        
        subgraph "智能引擎 (后台任务)"
            Scheduler[⏰ 调度器] --> ContentEngine[📝 内容生成引擎]
            Scheduler --> ProfilingEngine[👤 AI 用户画像引擎]
            
            ProfilingEngine -->|读取行为数据| Analytics
            ProfilingEngine -->|调用AI分析| AI_Abstract[🤖 AI 抽象层]
            ProfilingEngine -->|更新用户画像| DB

            ContentEngine -->|调用AI写作| AI_Abstract
            ContentEngine -->|写入内容| DB
            ContentEngine -->|写入图片| Storage
        end

        subgraph "外部服务"
            AI_Abstract --> GPT4[OpenAI GPT-4o]
            AI_Abstract --> Claude[Anthropic Claude 3]
            AI_Abstract --> Gemini[Google Gemini]
        end
    end
```

---

## 3. 组件分解 (v3.0)

### 3.1. 智能层 (Intelligence Layer) (新增)

这是 v3.0 架构的核心，由三个新组件构成一个数据驱动的智能闭环。

1.  **分析服务 (Analytics Service):**
    *   **工具:** **PostHog** (开源) 或 Mixpanel。
    *   **角色:** 数据采集的基石。Next.js 前端将集成其 SDK，捕获所有关键用户行为事件（如 `page_view`, `comment`, `like`, `quiz_complete`），并将这些事件与用户 ID 关联后发送到分析服务。
2.  **AI 用户画像引擎 (AI Profiling Engine):**
    *   **角色:** 项目的“大脑”。这是一个由调度器（如 GitHub Actions Scheduled Workflow）定期触发的后台批处理任务。
    *   **容错机制:** 建议将耗时的 AI 分析任务放入消息队列 (如 Upstash QStash 或 Supabase Edge Functions 的异步调用)，以避免超时并支持自动重试。
    *   **工作流:**
        1.  从分析服务 API 拉取近期的活跃用户行为数据。
        2.  为每位用户，将行为数据（例如：过去7天浏览了10篇文章，其中7篇含'冥想'标签）综合成一个摘要。
        3.  通过 **AI 抽象层**调用一个合适的 AI 模型（不一定是能力最强但性价比高的模型），将摘要作为 Prompt，要求 AI 输出结构化的用户画像，如兴趣标签 `{"tags": ["冥想", "侘寂风"]}`。
        4.  将生成的画像 JSON 更新到 Supabase `profiles` 表的 `ai_profile` 字段中。
3.  **推荐引擎 (Recommendation Engine):**
    *   **角色:** 个性化体验的交付者。它是一个部署在 Vercel Edge 上的轻量级函数，以实现最低延迟。
    *   **工作流:**
        1.  接收到前端为已登录用户发起的推荐请求。
        2.  从 `profiles` 表中读取该用户的 `ai_profile`（主要是兴趣标签）。
        3.  基于这些标签，在 `generated_pages` 表中进行高效查询（利用标签索引），找回最相关的文章列表。
        4.  返回推荐的文章列表给前端进行展示。

### 3.2. AI 模型抽象层 (AI Abstraction Layer) (新增)

-   **角色:** 解耦业务逻辑与具体 AI 模型，是系统保持长期技术灵活性的关键。
-   **设计模式:** 采用“提供者模式”(Provider Pattern)。
    -   定义一个统一的接口，例如 `interface AIProvider { generate(prompt): Promise<string> }`。
    -   为每个需要支持的 AI 模型创建一个实现该接口的类，例如 `class OpenAIProvider`, `class ClaudeProvider`。
    -   业务逻辑代码（内容引擎、画像引擎）不再直接调用某个具体 API，而是调用 `AI_Abstract.generate(prompt, model_name)`。
    -   `model_name` 参数允许我们根据任务需求（质量、成本、速度）灵活选择使用 GPT-4o, Claude 3 Sonnet, 或 Gemini Pro。

### 3.3. 后台管理方案 (Admin Backend Solution) (新增)

为了支持策展人 (Curator) 对用户投稿 (UGC) 的审核和对社区评论的管理，我们规划了分阶段的后台实现路径，以平衡开发成本和运营效率。

-   **阶段一 (MVP 启动期):**
    -   **方案:** 直接使用 **Supabase Studio** 作为管理后台。
    -   **实现:** Supabase 提供了功能强大的图形化界面，运营人员可以直接在 `submissions` 表中将稿件的 `status` 从 `pending_review` 修改为 `approved`，或在 `comments` 表中删除不当言论。
    -   **优势:** **零开发成本**，可随项目立即上线，满足最基本的管理需求。

-   **阶段二 (社区成熟期):**
    -   **方案:** 在 Next.js 应用中，于 `/admin` 路径下开发一个受保护的、定制化的**前端管理面板**。
    -   **实现:**
        1.  创建一个新的用户角色 `admin`。
        2.  通过 Next.js 的中间件或页面级逻辑，校验访问 `/admin` 路径的用户是否具有 `admin` 角色。
        3.  该面板将提供一个专门的 UI，用于展示待审核列表、一键批准/驳回、批量管理评论等，提供比直接操作数据库更友好、更安全的用户体验。

---

## 4. 技术栈与选择理由 (v3.0 最终版)

| 组件               | 技术                           | 选择理由                                                                       |
| :----------------- | :----------------------------- | :----------------------------------------------------------------------------- |
| **前端**           | Next.js 14 / React             | (同 v2.1)                                                                      |
| **国际化**         | `next-intl`                    | (同 v2.1)                                                                      |
| **图片优化**       | Vercel Image Optimization      | (同 v2.1)                                                                      |
| **后端一体化**     | Supabase                       | (同 v2.1)                                                                      |
| **分析服务 (新增)**| **PostHog**                      | **开源可私有部署，功能强大，避免将用户数据锁定在第三方商业平台。**                 |
| **AI 文本生成**    | **AI 抽象层**                    | **(新增)** 统一管理对 OpenAI, Anthropic, Google 等多模型的调用，灵活、可扩展。 |
| **自动化**         | GitHub Actions                 | (同 v2.1)                                                                      |
| **邮件发送**       | Resend                         | (同 v2.1)                                                                      |
| **速率限制**       | Upstash Rate Limit             | (同 v2.1)                                                                      |

---
*(其他章节如组件分解、数据流示例等在 v2.1 基础上保持一致，但其内部实现需遵循 v3.0 的新架构)*

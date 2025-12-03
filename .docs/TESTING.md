# 测试策略 (Testing Strategy) v1.0

## 1. 概述
本文档概述了 Silk & Sage v3.0 的测试策略，旨在确保“智能层”的可靠性、数据完整性以及卓越的用户体验。

---

## 2. 测试层级 (Testing Levels)

### 2.1. 单元测试 (Unit Testing)
*   **范围:** 独立的工具函数、UI 组件和 API 路由逻辑。
*   **工具:** Jest, React Testing Library。
*   **核心目标:**
    *   **算法逻辑:** 验证 "身份-解决方案" (Identity-to-Solution) 的映射脚本逻辑是否正确。
    *   **组件:** 确保 UI 组件 (如 `Button`, `Card`) 在不同 Props 下能正确渲染。
    *   **工具函数:** 测试日期格式化、字符串处理等辅助函数。

### 2.2. 集成测试 (Integration Testing)
*   **范围:** 模块之间的交互，特别是 API 端点与数据库的交互。
*   **工具:** Jest, Supertest (用于 API), Supabase Local。
*   **核心目标:**
    *   **API 路由:** 使用模拟 (Mock) 的数据库响应测试 `GET /api/recommendations`。
    *   **数据库触发器:** 验证当添加评论时，`comments_count` 字段是否正确更新 (使用本地 Supabase 实例)。
    *   **AI 抽象层:** 模拟 AI 提供商的响应，以测试 `ContentEngine` 的流程，避免调用真实的外部 API。

### 2.3. 端到端测试 (E2E Testing)
*   **范围:** 从浏览器视角出发的关键用户流程。
*   **工具:** Playwright 或 Cypress。
*   **核心流程:**
    *   **用户注册:** 注册 -> 邮件验证 (模拟) -> 登录。
    *   **测试流程:** 完成 "内在元素测试" (Element Quiz) -> 查看结果页。
    *   **个性化:** 登录 -> 访问主页 -> 验证 "为您推荐" (Recommended for You) 模块是否成功加载。

---

## 3. 测试数据管理
*   **数据填充 (Seeding):** 使用 `supabase/seed.sql` 填充一致的基准测试数据 (MBTI 类型, 五行元素)。
*   **模拟 (Mocking):**
    *   **AI API:** 在测试中**必须**模拟 OpenAI/Claude API，以避免成本和不稳定性。
    *   **认证:** 使用 Supabase 测试助手 (Test Helpers) 模拟已认证的会话。

## 4. CI/CD 集成
*   **触发器:** 每次 GitHub Pull Request 都会自动运行测试。
*   **把关:** 如果任何测试失败，将禁止合并到 `main` 分支。

## 5. 本地运行测试
*   **单元/集成测试:** `npm run test`
*   **E2E 测试:** `npm run test:e2e`

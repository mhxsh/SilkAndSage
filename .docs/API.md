# API 和服务接口规范 v3.0 (最终版)

## 1. 概述

本文档定义了 Silk & Sage v3.0 的最终核心接口规范。在 v2.1 的基础上，新增了**个性化推荐 API**，并更新了内部服务流程，以完全支持数据驱动的智能推荐架构。

---

## 2. 通用 API 策略 (同 v2.1)

### 2.1. 速率限制 (Rate Limiting)
所有需要用户认证的**写入操作** API 都将受到速率限制（例如，每分钟 10 次），超出限制将返回 `429 Too Many Requests`。

---

## 3. 个性化 API (新增)

### 3.1. 获取个性化推荐内容

这是 v3.0 智能推荐引擎的核心交付接口。(其后端实现详见 ARCHITECTURE.md 中的“推荐引擎”章节)

-   **端点:** `GET /api/recommendations`
-   **实现:** Next.js API Route (Serverless Function)。
-   **认证:** **必需**。请求头中必须包含有效的 Supabase 用户认证 JWT。服务器端会从中解析用户 ID。
-   **核心逻辑:**
    1.  从认证信息中获取 `user_id`。
    2.  查询 `profiles` 表，获取该用户的 `ai_profile` 字段（其中包含 `tags` 数组）。
    3.  **冷启动策略:** 如果用户画像或标签不存在（新用户或数据不足），**必须**返回一个基于 `views_count` 排序的“热门文章”列表，确保前端始终有内容展示。
    4.  如果存在标签，则使用这些标签查询 `generated_pages` 表。查询将使用 GIN 索引在 `tags` 数组字段中高效地查找包含一个或多个匹配标签的文章 (例如 `tags && ARRAY['冥想', '侘寂风']`)。
    5.  排除用户已经收藏或长时间浏览过的文章。
    6.  将结果按相关性排序后返回。
-   **响应载荷 (成功):**
    ```json
    {
      "data": [
        {
          "slug": "zen-living-room-ideas",
          "locale": "zh",
          "title": "打造禅意客厅的五个技巧",
          "imageUrl": "..."
        },
        // ... 其他推荐文章
      ]
    }
    ```
-   **错误处理:**
    -   `401 Unauthorized`: 未提供有效 JWT。
    -   `500 Internal Server Error`: 数据库连接失败或查询错误。


---

## 4. 用户认证 API (同 v2.0)
*(包含 `signUp`, `signInWithPassword`, `signOut` 等)*

---

## 5. 内容获取 API (v4.0 最终版)

### 5.1. 获取单篇本地化文章 (已优化)
-   **场景:** 加载文章详情页。
-   **逻辑:** 根据 slug 查询主表 `generated_pages`，并内连接（inner join）`generated_page_translations` 表，同时筛选出当前语言 (`zh` 或 `en`) 的内容。
-   **示例方法:**
    ```javascript
    // (服务器端数据获取)
    async function getPage(slug, locale) {
      const { data, error } = await supabase
        .from('generated_pages')
        .select(`
          slug,
          generated_image_url,
          views_count,
          comments_count,
          average_score,
          translations:generated_page_translations!inner (
            title,
            generated_text
          )
        `)
        .eq('slug', slug)
        .eq('translations.language_code', locale)
        .single();
      
      // 为保证数据准确性，阅读数的增加建议通过专门的 rpc 函数或队列处理
      // 此处仅为示意
      
      return data;
    }
    ```
-   **响应载荷 (`data`):**
    ```json
    {
      "slug": "infj-bedroom-aesthetic",
      "generated_image_url": "...",
      "views_count": 1024,
      "comments_count": 15,
      "average_score": "4.7",
      "translations": {
        "title": "INFJ 卧室：侘寂风格的庇护所指南",
        "generated_text": { "hook": "...", "insight": "..." }
      }
    }
    ```

### 5.2. 获取评论列表
*(同 v2.1, 支持分页和排序)*

---

## 6. 社区互动 API (同 v2.1)
*(包含发表评论、点赞、收藏、评分等)*

---

## 7. 内部服务与外部 API (v3.0)

### 7.1. 内容生成流程 (更新)

-   **核心变更:** 内容生成任务现在包含一个额外的步骤。
-   **流程:**
    1.  通过 **AI 抽象层**调用模型生成文章的多语言版本。
    2.  **(新增)** 再次调用 AI 模型（可选用更轻量级的模型），传入生成的文章内容，要求其提取 5-7 个最相关的关键词作为 `tags`。
    3.  将生成的文章、翻译和 `tags` 一并存入数据库。

### 7.2. OpenAI 等外部 API (同 v2.1)
- 调用方式遵循 **AI 抽象层**的设计，业务代码不直接与任何具体厂商的 API 耦合。
- 调用时需明确传递语言要求，例如 `"请用中文生成..."`。

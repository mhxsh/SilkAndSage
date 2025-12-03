# 数据模型规范 v4.1 (最终完整版)

## 1. 概述

本文档定义了 Silk & Sage v4.1 的最终数据库 schema。本版本旨在提供**所有表的完整、明确字段定义**，消除所有省略号和模糊之处，达到可直接用于数据库创建和后端开发的“零疑问”标准。

---

## 2. 用户与权限表

### 2.1. `profiles` (用户资料)

**说明:** `email` 作为核心身份标识，安全地存储于 Supabase 的私有表 `auth.users` 中，并通过 API 访问，不在此表冗余。

| 列名          | 数据类型        | 约束和描述                                      | 示例                                |
| :------------ | :-------------- | :---------------------------------------------- | :---------------------------------- |
| `id`          | `uuid`          | 主键, **外键 -> `auth.users.id`**, 级联删除     | `8f...`                             |
| `username`    | `text`          | 唯一, 非空。公开显示的昵称。                    | `Anna`, `muse_88`                   |
| `full_name`   | `text`          | 可空。真实姓名。                                | `Anna Lee`                          |
| `gender`      | `gender_enum`   | 可空。(`male`, `female`, `non_binary`, `prefer_not_to_say`) | `female`                            |
| `birth_date`  | `date`          | 可空。出生日期，用于计算年龄和星座。            | `1995-05-20`                        |
| `occupation`  | `text`          | 可空。职业。                                    | `平面设计师`                        |
| `inner_element` | `element`     | 可空。内在元素测试结果。                        | `wood`                              |
| `ai_profile`  | `jsonb`         | 可空。存储 AI 生成的动态用户画像。**Schema:** `{"tags": ["string"], "last_updated": "ISO8601"}`。 | `{"tags": ["zen", "wellness"], "last_updated": "2023-11-01"}`     |
| `updated_at`  | `timestamptz`   | 默认值：`now()`                                 | `2023-10-26T10:00:00Z`              |

---

## 3. 核心内容表

### 3.1. `identities` (身份)

存储作为 pSEO 入口点的不同用户原型。

| 列名          | 数据类型       | 约束和描述                                                  | 示例                           |
| :------------ | :------------- | :---------------------------------------------------------- | :----------------------------- |
| `id`          | `uuid`         | 主键, 默认值：`gen_random_uuid()`                           | `8f...`                        |
| `name`        | `text`         | 非空。人类可读的名称。                                      | `INFJ`, `Leo`, `Career Woman`  |
| `slug`        | `text`         | 非空, 唯一。URL 友好的标识符。                              | `infj`, `leo`, `career-woman`  |
| `type`        | `identity_type`| 非空。身份类别。(`mbti`, `zodiac`, `life_stage`)            | `mbti`                         |
| `pain_points` | `text[]`       | 常见痛点数组。                                              | `{"思虑过度", "倦怠"}`            |
| `power_color` | `text`         | 可空。AI 生成或手动分配的能量颜色。                         | `Deep Green`                   |
| `created_at`  | `timestamptz`  | 默认值：`now()`                                             | `2023-10-26T10:00:00Z`         |

### 3.2. `solutions` (解决方案)

存储构成我们内容核心的东方哲学概念、美学和材料。

| 列名            | 数据类型      | 约束和描述                                                  | 示例                                     |
| :-------------- | :------------ | :---------------------------------------------------------- | :--------------------------------------- |
| `id`            | `uuid`        | 主键, 默认值：`gen_random_uuid()`                           | `5a...`                                  |
| `element_type`  | `element`     | 非空。五行类型。(`wood`, `fire`, `earth`, `metal`, `water`) | `wood`                                   |
| `aesthetic_style` | `text`      | 可空。相关联的美学风格。                                    | `Zen`, `Wabi-sabi`, `Opulent`            |
| `material`      | `text`        | 可空。相关联的物理材料。                                    | `Silk`, `Jade`, `Bamboo`, `Ceramic`      |
| `wellness_habit`| `text`        | 可空。相关联的健康习惯。                                    | `Tea Ceremony`, `Gua Sha`, `Meditation`  |
| `created_at`    | `timestamptz` | 默认值：`now()`                                             | `2023-10-26T10:00:00Z`                   |

### 3.3. `products` (产品)

存储用于商业化的精选商品。

| 列名            | 数据类型       | 约束和描述                                                  | 示例                           |
| :-------------- | :------------- | :---------------------------------------------------------- | :----------------------------- |
| `id`            | `uuid`         | 主键, 默认值：`gen_random_uuid()`                           | `1b...`                        |
| `name`          | `text`         | 非空。产品的显示名称。                                      | `手工玉石滚轮`                 |
| `category`      | `product_category`| 非空。产品类别。(`decor`, `fashion`, `wellness`, `jewelry`) | `wellness`                     |
| `affiliate_link`| `text`         | 非空。追踪的联盟营销 URL。                                  | `https://etsy.me/xxxx`         |
| `image_url`     | `text`         | 可空。产品图片的 URL。                                      | `https://i.etsystatic.com/....jpg` |
| `source`        | `text`         | 可空。联盟营销来源（例如，“Etsy”，“Amazon”）。               | `Etsy`                         |
| `created_at`    | `timestamptz`  | 默认值：`now()`                                             | `2023-10-26T10:00:00Z`         |

### 3.4. `product_solution_map` (产品-解决方案映射)

一个多对多关系表，将产品与其所体现的解决方案/元素连接起来。

| 列名          | 数据类型 | 约束和描述                                  |
| :------------ | :------- | :------------------------------------------ |
| `product_id`  | `uuid`   | **外键 -> `products.id`**, 级联删除         |
| `solution_id` | `uuid`   | **外键 -> `solutions.id`**, 级联删除        |
| **复合主键** on (`product_id`, `solution_id`) |

### 3.5. `generated_pages` (页面主表)

存储与语言无关的页面核心信息和互动统计。

| 列名             | 数据类型        | 约束和描述                                    | 示例                                         |
| :--------------- | :-------------- | :-------------------------------------------- | :------------------------------------------- |
| `id`             | `uuid`          | 主键, 默认值：`gen_random_uuid()`             | `9c...`                                      |
| `slug`           | `text`          | 非空, 唯一。页面的 URL slug (不含语言前缀)。 | `infj-bedroom-aesthetic`                     |
| `identity_id`    | `uuid`          | **外键 -> `identities.id`**                   | `8f...` (Points to INFJ)                     |
| `generated_image_url` | `text`      | 可空。AI 生成的图片 URL。                   | `https://<ref>.supabase.co/storage/v1/.../infj-bedroom.jpg` |
| `tags`           | `text[]`        | 可空。AI 提取的内容标签，用于推荐算法。       | `{"zen", "bedroom", "infj"}`                 |
| `views_count`    | `bigint`        | 默认 0。阅读数。                             | `1024`                                       |
| `comments_count` | `integer`       | 默认 0。评论数。                             | `15`                                         |
| `ratings_count`  | `integer`       | 默认 0。评分总人数。                         | `10`                                         |
| `average_score`  | `numeric(2, 1)` | 默认 0.0。平均分 (例如 4.5)。                 | `4.7`                                        |
| `status`         | `page_status`   | (`draft`, `published`, `archived`)          | `published`                                  |
| `published_at`   | `timestamptz`   | 可空。发布时间。                              | `2023-10-26T10:00:00Z`                       |
| `created_at`     | `timestamptz`   | 默认值：`now()`                               | `2023-10-26T10:00:00Z`                       |

### 3.6. `generated_page_translations` (页面翻译表)

存储页面的多语言内容。

| 列名             | 数据类型    | 约束和描述                                  | 示例                               |
| :--------------- | :---------- | :------------------------------------------ | :--------------------------------- |
| `id`             | `bigserial` | 主键                                        | `123`                              |
| `page_id`        | `uuid`      | **外键 -> `generated_pages.id`**, 级联删除  | `9c...`                            |
| `language_code`  | `text`      | 非空。例如 `en` 或 `zh`。                   | `zh`                               |
| `title`          | `text`      | 非空。该语言版本的标题。                    | `INFJ 卧室：侘寂风格的庇护所指南` |
| `generated_text` | `jsonb`     | 非空。该语言版本的结构化文本（JSON）。      | `{"hook": "...", "insight": "..."}` |
| **复合唯一约束** on (`page_id`, `language_code`) |

---

## 4. 社区与工具互动表

### 4.1. `comments` (评论)

| 列名         | 数据类型      | 约束和描述                                  | 示例                               |
| :----------- | :------------ | :------------------------------------------ | :--------------------------------- |
| `id`         | `uuid`        | 主键, 默认值：`gen_random_uuid()`             | `c1...`                            |
| `page_id`    | `uuid`        | **外键 -> `generated_pages.id`**, 级联删除  | `9c...`                            |
| `user_id`    | `uuid`        | **外键 -> `profiles.id`**, 级联删除         | `u1...`                            |
| `parent_id`  | `uuid`        | 可空, 外键 -> `comments.id` (用于回复)。    | `c2...`                            |
| `content`    | `text`        | 非空。评论内容。                            | `写得真好！`                       |
| `created_at` | `timestamptz` | 默认值：`now()`                             | `2023-10-26T10:05:00Z`             |

### 4.2. `likes` (点赞)

通用点赞表，可扩展支持对不同类型内容（评论、文章等）的点赞。

| 列名          | 数据类型      | 约束和描述                                  | 示例                               |
| :------------ | :------------ | :------------------------------------------ | :--------------------------------- |
| `user_id`     | `uuid`        | **外键 -> `profiles.id`**, 级联删除         | `u1...`                            |
| `target_id`   | `uuid`        | 非空。被点赞对象的 ID (例如一个 `comments.id` 或 `generated_pages.id`) | `c1...`                            |
| `target_type` | `text`        | 非空。被点赞对象的类型 (例如 `'comment'`, `'page'`) | `comment`                          |
| `created_at`  | `timestamptz` | 默认值：`now()`                             | `2023-10-26T10:06:00Z`             |
| **复合主键** on (`user_id`, `target_id`) |

### 4.3. `ratings` (评分)

| 列名         | 数据类型      | 约束和描述                                  | 示例                               |
| :----------- | :------------ | :------------------------------------------ | :--------------------------------- |
| `page_id`    | `uuid`        | **外键 -> `generated_pages.id`**, 级联删除  | `9c...`                            |
| `user_id`    | `uuid`        | **外键 -> `profiles.id`**, 级联删除         | `u1...`                            |
| `score`      | `smallint`    | 非空。评分 (1 到 5)。                       | `5`                                |
| `created_at` | `timestamptz` | 默认值：`now()`                             | `2023-10-26T10:07:00Z`             |
| **复合主键** on (`page_id`, `user_id`) |

### 4.4. `submissions` (用户投稿)

| 列名         | 数据类型          | 约束和描述                                                  | 示例                           |
| :----------- | :---------------- | :---------------------------------------------------------- | :----------------------------- |
| `id`         | `uuid`            | 主键, 默认值：`gen_random_uuid()`                           | `s1...`                        |
| `user_id`    | `uuid`            | **外键 -> `profiles.id`**, 级联删除                         | `u1...`                        |
| `title`      | `text`            | 非空。投稿标题。                                            | `我的 Zen 风格卧室心得`        |
| `content`    | `text`            | 非空。投稿内容 (Markdown 格式)。                            | `## 灵感来源...`               |
| `status`     | `submission_status` | 非空。(`draft`, `pending_review`, `approved`, `rejected`) | `pending_review`               |
| `notes`      | `text`            | 可空。审核意见。                                            | `内容很好，但需要优化图片`     |
| `created_at` | `timestamptz`     | 默认值：`now()`                                             | `2023-10-26T10:08:00Z`         |
| `updated_at` | `timestamptz`     | 默认值：`now()`                                             | `2023-10-26T10:09:00Z`         |

### 4.5. `user_favorites` (用户收藏文章)

连接用户和他们收藏页面的多对多关系表。

| 列名         | 数据类型      | 约束和描述                          | 示例                               |
| :----------- | :------------ | :---------------------------------- | :--------------------------------- |
| `user_id`    | `uuid`        | **外键 -> `profiles.id`**, 级联删除 | `u1...`                            |
| `page_id`    | `uuid`        | **外键 -> `generated_pages.id`**, 级联删除 | `9c...`                            |
| `created_at` | `timestamptz` | 默认值：`now()`                     | `2023-10-26T10:10:00Z`             |
| **复合主键** on (`user_id`, `page_id`) |

### 4.6. `quiz_questions` (测试问题)

支持“元素测试”的问题定义。

| 列名          | 数据类型  | 约束和描述           | 示例                           |
| :------------ | :-------- | :------------------- | :----------------------------- |
| `id`          | `serial`  | 主键                 | `1`                            |
| `question_text` | `text`    | 非空。问题内容。     | `你周末更喜欢去哪里？`         |
| `answers`     | `jsonb[]` | 非空。答案选项数组。 | `[{"text": "森林", "element": "wood"}]` |

### 4.7. `quiz_submissions` (测试提交)

记录用户每次“元素测试”的提交结果。

| 列名          | 数据类型      | 约束和描述                                  | 示例                           |
| :------------ | :------------ | :------------------------------------------ | :----------------------------- |
| `id`          | `uuid`        | 主键, 默认值：`gen_random_uuid()`             | `qs1...`                       |
| `user_id`     | `uuid`        | 可空, 外键 -> `profiles.id`。匿名用户可为空。 | `u1...`                        |
| `result_element` | `element`   | 非空。为用户计算出的元素。                  | `water`                        |
| `choices`     | `jsonb`       | 非空。存储的选择，用于分析。                | `[{"question_id":1, "choice_idx":0}]` |
| `created_at`  | `timestamptz` | 默认值：`now()`                             | `2023-10-26T10:15:00Z`         |

### 4.8. `tool_usage_history` (工具使用历史)

记录用户每一次使用小工具的历史。

| 列名          | 数据类型      | 约束和描述                                | 示例                                  |
| :------------ | :------------ | :---------------------------------------- | :------------------------------------ |
| `id`          | `bigserial`   | 主键                                      | `1`                                   |
| `user_id`     | `uuid`        | 可空, **外键 -> `profiles.id`**。匿名用户可为空。 | `u1...`                               |
| `tool_name`   | `text`        | 非空。工具的唯一标识符，如 `daily_luck`。 | `daily_luck`                          |
| `input_data`  | `jsonb`       | 可空。用户输入的参数，如生日。            | `{"birth_date": "1990-01-01"}`        |
| `output_data` | `jsonb`       | 可空。工具返回的结果。                    | `{"luck_score": 85, "color": "green"}` |
| `created_at`  | `timestamptz` | 默认值：`now()`                           | `2023-10-26T10:20:00Z`                |

### 4.9. `user_tool_favorites` (用户工具收藏)

允许用户收藏他们喜欢的小工具，方便快速访问。

| 列名          | 数据类型      | 约束和描述                          | 示例                               |
| :---------- | :------------ | :---------------------------------- | :--------------------------------- |
| `user_id`     | `uuid`        | **外键 -> `profiles.id`**。         | `u1...`                            |
| `tool_name`   | `text`        | 非空。工具的唯一标识符。            | `iching_oracle`                    |
| `created_at`  | `timestamptz` | 默认值：`now()`                     | `2023-10-26T10:25:00Z`             |
| **复合主键** on (`user_id`, `tool_name`) |

---

## 5. 后台与系统表

### 5.1. `failed_jobs` (失败任务记录表)

用于记录所有自动化后台任务（如内容生成、用户画像分析）的失败信息，以便追踪和手动恢复。(其具体实现详见 ARCHITECTURE.md 中的“容错与弹性设计”章节)

| 列名         | 数据类型      | 约束和描述                            | 示例                                  |
| :----------- | :------------ | :------------------------------------ | :------------------------------------ |
| `id`         | `bigserial`   | 主键                                  | `1`                                   |
| `job_type`   | `text`        | 非空。任务类型。                      | `generate_text`, `profile_analysis`   |
| `payload`    | `jsonb`       | 可空。执行任务所需的上下文数据。      | `{"page_id": "...", "locale": "zh"}`  |
| `last_error` | `text`        | 可空。记录最后一次失败的错误信息。    | `OpenAI API returned 503`             |
| `retries`    | `smallint`    | 尝试次数，默认 0。                    | `3`                                   |
| `status`     | `text`        | 任务状态，默认 `failed`。             | `failed`, `resolved`                  |
| `created_at` | `timestamptz` | 默认值：`now()`                       | `2023-10-26T10:30:00Z`                |

---

## 6. 性能优化：索引策略

---

## 7. 数据库函数与触发器

---

## 8. SQL 参考 (v4.1 最终完整版)

```sql
-- A. 枚举类型 (Enum Types)
CREATE TYPE identity_type AS ENUM ('mbti', 'zodiac', 'life_stage');
CREATE TYPE element AS ENUM ('wood', 'fire', 'earth', 'metal', 'water');
CREATE TYPE product_category AS ENUM ('decor', 'fashion', 'wellness', 'jewelry');
CREATE TYPE page_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE submission_status AS ENUM ('draft', 'pending_review', 'approved', 'rejected');
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'non_binary', 'prefer_not_to_say');

-- B. 创建表 (CREATE TABLE)

-- B.1. profiles (用户资料)
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username text UNIQUE NOT NULL,
    full_name text,
    gender gender_enum,
    birth_date date,
    occupation text,
    inner_element element,
    ai_profile jsonb,
    updated_at timestamptz DEFAULT now()
);

-- B.2. identities (身份)
CREATE TABLE public.identities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    type identity_type NOT NULL,
    pain_points text[],
    power_color text,
    created_at timestamptz DEFAULT now()
);

-- B.3. solutions (解决方案)
CREATE TABLE public.solutions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    element_type element NOT NULL,
    aesthetic_style text,
    material text,
    wellness_habit text,
    created_at timestamptz DEFAULT now()
);

-- B.4. products (产品)
CREATE TABLE public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    category product_category NOT NULL,
    affiliate_link text NOT NULL,
    image_url text,
    source text,
    created_at timestamptz DEFAULT now()
);

-- B.5. product_solution_map (产品-解决方案映射)
CREATE TABLE public.product_solution_map (
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    solution_id uuid REFERENCES public.solutions(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, solution_id)
);

-- B.6. generated_pages (页面主表)
CREATE TABLE public.generated_pages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    identity_id uuid REFERENCES public.identities(id),
    generated_image_url text,
    tags text[],
    views_count bigint DEFAULT 0,
    comments_count integer DEFAULT 0,
    ratings_count integer DEFAULT 0,
    average_score numeric(2, 1) DEFAULT 0.0,
    status page_status NOT NULL,
    published_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- B.7. generated_page_translations (页面翻译表)
CREATE TABLE public.generated_page_translations (
    id bigserial PRIMARY KEY,
    page_id uuid REFERENCES public.generated_pages(id) ON DELETE CASCADE,
    language_code text NOT NULL,
    title text NOT NULL,
    generated_text jsonb NOT NULL,
    UNIQUE (page_id, language_code)
);

-- B.8. comments (评论)
CREATE TABLE public.comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id uuid REFERENCES public.generated_pages(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- B.9. likes (点赞)
CREATE TABLE public.likes (
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_id uuid NOT NULL,
    target_type text NOT NULL,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, target_id)
);

-- B.10. ratings (评分)
CREATE TABLE public.ratings (
    page_id uuid REFERENCES public.generated_pages(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    score smallint NOT NULL CHECK (score >= 1 AND score <= 5),
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (page_id, user_id)
);

-- B.11. submissions (用户投稿)
CREATE TABLE public.submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    content text NOT NULL,
    status submission_status NOT NULL,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- B.12. user_favorites (用户收藏文章)
CREATE TABLE public.user_favorites (
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    page_id uuid REFERENCES public.generated_pages(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, page_id)
);

-- B.13. quiz_questions (测试问题)
CREATE TABLE public.quiz_questions (
    id serial PRIMARY KEY,
    question_text text NOT NULL,
    answers jsonb[] NOT NULL
);

-- B.14. quiz_submissions (测试提交)
CREATE TABLE public.quiz_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    result_element element NOT NULL,
    choices jsonb NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- B.15. tool_usage_history (工具使用历史)
CREATE TABLE public.tool_usage_history (
    id bigserial PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    tool_name text NOT NULL,
    input_data jsonb,
    output_data jsonb,
    created_at timestamptz DEFAULT now()
);

-- B.16. user_tool_favorites (用户工具收藏)
CREATE TABLE public.user_tool_favorites (
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    tool_name text NOT NULL,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, tool_name)
);

-- B.17. failed_jobs (失败任务记录表)
CREATE TABLE public.failed_jobs (
    id bigserial PRIMARY KEY,
    job_type text NOT NULL,
    payload jsonb,
    last_error text,
    retries smallint DEFAULT 0,
    status text DEFAULT 'failed',
    created_at timestamptz DEFAULT now()
);

-- C. 索引创建 (CREATE INDEX)
-- C.1. 常规 B-Tree 索引
CREATE INDEX ON public.profiles (username);
CREATE INDEX ON public.identities (slug);
CREATE INDEX ON public.generated_pages (slug);
CREATE INDEX ON public.generated_page_translations (page_id);
CREATE INDEX ON public.generated_page_translations (language_code);
CREATE INDEX ON public.comments (page_id);
CREATE INDEX ON public.comments (user_id);
CREATE INDEX ON public.comments (parent_id);
CREATE INDEX ON public.likes (target_id);
CREATE INDEX ON public.submissions (user_id);
CREATE INDEX ON public.submissions (status);
CREATE INDEX ON public.user_favorites (user_id);
CREATE INDEX ON public.user_favorites (page_id);
CREATE INDEX ON public.tool_usage_history (user_id);
CREATE INDEX ON public.tool_usage_history (tool_name);
CREATE INDEX ON public.user_tool_favorites (user_id);
CREATE INDEX ON public.user_tool_favorites (tool_name);
CREATE INDEX ON public.failed_jobs (job_type);
CREATE INDEX ON public.failed_jobs (status);

-- C.2. GIN 索引 (针对数组和JSONB字段)
CREATE INDEX ON public.generated_pages USING GIN (tags);
CREATE INDEX ON public.profiles USING GIN (ai_profile);
CREATE INDEX ON public.quiz_questions USING GIN (answers);
CREATE INDEX ON public.quiz_submissions USING GIN (choices);

-- D. 数据库函数与触发器 (CREATE FUNCTION & CREATE TRIGGER)

-- D.1. 用于自动创建 Profile 的函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- D.2. 用户注册后自动创建 Profile 的触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- D.3. 用于更新 comments_count 的函数
CREATE OR REPLACE FUNCTION public.update_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.generated_pages
    SET comments_count = comments_count + 1
    WHERE id = NEW.page_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.generated_pages
    SET comments_count = comments_count - 1
    WHERE id = OLD.page_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- D.4. 评论操作后更新 comments_count 的触发器
CREATE TRIGGER on_comment_created_or_deleted
AFTER INSERT OR DELETE ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.update_comments_count();

-- D.5. 用于更新 ratings_count 和 average_score 的函数
CREATE OR REPLACE FUNCTION public.update_ratings_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Recompute for the affected page
  UPDATE public.generated_pages
  SET
    ratings_count = (SELECT COUNT(score) FROM public.ratings WHERE page_id = NEW.page_id),
    average_score = (SELECT AVG(score) FROM public.ratings WHERE page_id = NEW.page_id)
  WHERE id = NEW.page_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- D.6. 评分操作后更新 ratings_count 和 average_score 的触发器
CREATE TRIGGER on_rating_changed
AFTER INSERT OR UPDATE OR DELETE ON public.ratings
FOR EACH ROW EXECUTE FUNCTION public.update_ratings_stats();

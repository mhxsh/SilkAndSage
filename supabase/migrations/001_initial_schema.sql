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
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'full_name');
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

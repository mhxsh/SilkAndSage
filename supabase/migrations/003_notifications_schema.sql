-- 创建通知类型枚举
CREATE TYPE notification_type AS ENUM ('like_page', 'like_comment', 'comment_page', 'reply_comment', 'system_message');

-- 创建通知表
CREATE TABLE public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE, -- 接收通知的用户
    actor_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE, -- 触发通知的用户
    type notification_type NOT NULL,
    title text NOT NULL,
    content text,
    link text, -- 跳转链接
    is_read boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- 创建索引
CREATE INDEX ON public.notifications (user_id);
CREATE INDEX ON public.notifications (is_read);
CREATE INDEX ON public.notifications (created_at);

-- 创建触发器函数：当有人评论文章时通知作者（如果文章有作者字段，目前generated_pages没有作者，所以暂时跳过文章作者通知，只做回复通知）

-- 创建触发器函数：当有人回复评论时通知原评论作者
CREATE OR REPLACE FUNCTION public.notify_on_comment_reply()
RETURNS TRIGGER AS $$
DECLARE
    parent_comment_author_id uuid;
    commenter_username text;
    page_slug text;
BEGIN
    -- 只有当是回复（parent_id 不为空）时才触发
    IF NEW.parent_id IS NOT NULL THEN
        -- 获取父评论的作者ID
        SELECT user_id INTO parent_comment_author_id FROM public.comments WHERE id = NEW.parent_id;
        
        -- 如果父评论作者存在，且不是自己回复自己
        IF parent_comment_author_id IS NOT NULL AND parent_comment_author_id != NEW.user_id THEN
            -- 获取评论者用户名
            SELECT username INTO commenter_username FROM public.profiles WHERE id = NEW.user_id;
            
            -- 获取文章 slug 用于链接
            SELECT slug INTO page_slug FROM public.generated_pages WHERE id = NEW.page_id;

            -- 插入通知
            INSERT INTO public.notifications (user_id, actor_id, type, title, content, link)
            VALUES (
                parent_comment_author_id,
                NEW.user_id,
                'reply_comment',
                commenter_username || ' 回复了你的评论',
                left(NEW.content, 50), -- 截取前50个字符
                '/' || page_slug || '#comment-' || NEW.id
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
CREATE TRIGGER on_comment_reply
    AFTER INSERT ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.notify_on_comment_reply();

-- 启用 RLS (Row Level Security)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能查看自己的通知
CREATE POLICY "Users can view their own notifications" 
    ON public.notifications FOR SELECT 
    USING (auth.uid() = user_id);

-- 创建策略：系统可以插入通知（或者通过触发器），这里允许 authenticated 用户插入（为了测试方便，实际生产可能更严格）
CREATE POLICY "Users can insert notifications" 
    ON public.notifications FOR INSERT 
    WITH CHECK (auth.uid() = actor_id);

-- 创建策略：用户可以更新自己的通知（标记为已读）
CREATE POLICY "Users can update their own notifications" 
    ON public.notifications FOR UPDATE 
    USING (auth.uid() = user_id);

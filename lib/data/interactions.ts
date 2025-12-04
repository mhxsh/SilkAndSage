import { createClient } from '@/lib/supabase/server'

/**
 * 获取文章评论列表（带嵌套回复）
 */
export async function getComments(pageId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('comments')
        .select(`
      id,
      content,
      created_at,
      parent_id,
      user_id,
      user:profiles(
        id,
        username
      )
    `)
        .eq('page_id', pageId)
        .is('parent_id', null)
        .order('created_at', { ascending: false })

    if (error || !data) {
        return []
    }

    // 获取每个评论的回复并转换用户数据
    const commentsWithReplies = await Promise.all(
        data.map(async (comment: any) => {
            const { data: replies } = await supabase
                .from('comments')
                .select(`
          id,
          content,
          created_at,
          parent_id,
          user_id,
          user:profiles(
            id,
            username
          )
        `)
                .eq('parent_id', comment.id)
                .order('created_at', { ascending: true })

            // Transform replies array - handle null user
            const transformedReplies = (replies || []).map((reply: any) => ({
                ...reply,
                user: reply.user && Array.isArray(reply.user) ? reply.user[0] : reply.user,
            }))

            return {
                ...comment,
                user: comment.user && Array.isArray(comment.user) ? comment.user[0] : comment.user,
                replies: transformedReplies,
            }
        })
    )

    return commentsWithReplies
}

/**
 * 添加评论
 */
export async function addComment(
    pageId: string,
    userId: string,
    content: string,
    parentId?: string
) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('comments')
        .insert({
            page_id: pageId,
            user_id: userId,
            content,
            parent_id: parentId || null,
        })
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    return data
}

/**
 * 删除评论（仅限作者或管理员）
 */
export async function deleteComment(commentId: string, userId: string) {
    const supabase = await createClient()

    // 验证是否是作者
    const { data: comment } = await supabase
        .from('comments')
        .select('user_id')
        .eq('id', commentId)
        .single()

    if (!comment || comment.user_id !== userId) {
        throw new Error('Unauthorized')
    }

    const { error } = await supabase.from('comments').delete().eq('id', commentId)

    if (error) {
        throw new Error(error.message)
    }

    return true
}

/**
 * 检查用户是否点赞了某个对象
 */
export async function checkUserLike(userId: string, targetId: string) {
    const supabase = await createClient()

    const { data } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', userId)
        .eq('target_id', targetId)
        .single()

    return !!data
}

/**
 * 切换点赞状态
 */
export async function toggleLike(
    userId: string,
    targetId: string,
    targetType: 'comment' | 'page'
) {
    const supabase = await createClient()

    // 检查是否已点赞
    const { data: existing } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', userId)
        .eq('target_id', targetId)
        .single()

    if (existing) {
        // 取消点赞
        await supabase
            .from('likes')
            .delete()
            .eq('user_id', userId)
            .eq('target_id', targetId)
        return { liked: false }
    } else {
        // 添加点赞
        await supabase.from('likes').insert({
            user_id: userId,
            target_id: targetId,
            target_type: targetType,
        })
        return { liked: true }
    }
}

/**
 * 获取点赞数
 */
export async function getLikesCount(targetId: string) {
    const supabase = await createClient()

    const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('target_id', targetId)

    return count || 0
}

/**
 * 检查用户是否收藏了文章
 */
export async function checkUserFavorite(userId: string, pageId: string) {
    const supabase = await createClient()

    const { data } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', userId)
        .eq('page_id', pageId)
        .single()

    return !!data
}

/**
 * 切换收藏状态
 */
export async function toggleFavorite(userId: string, pageId: string) {
    const supabase = await createClient()

    const { data: existing } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', userId)
        .eq('page_id', pageId)
        .single()

    if (existing) {
        // 取消收藏
        await supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', userId)
            .eq('page_id', pageId)
        return { favorited: false }
    } else {
        // 添加收藏
        await supabase.from('user_favorites').insert({
            user_id: userId,
            page_id: pageId,
        })
        return { favorited: true }
    }
}

/**
 * 获取用户收藏的文章列表
 */
export async function getUserFavorites(userId: string, locale: string = 'zh') {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('user_favorites')
        .select(`
      created_at,
      page:generated_pages(
        slug,
        generated_image_url,
        tags,
        translations:generated_page_translations!inner(
          title
        )
      )
    `)
        .eq('user_id', userId)
        .eq('page.translations.language_code', locale)
        .order('created_at', { ascending: false })

    if (error || !data) {
        return []
    }

    return data
}

/**
 * 获取用户对文章的评分
 */
export async function getUserRating(userId: string, pageId: string) {
    const supabase = await createClient()

    const { data } = await supabase
        .from('ratings')
        .select('score')
        .eq('user_id', userId)
        .eq('page_id', pageId)
        .single()

    return data?.score || null
}

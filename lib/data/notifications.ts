import { createClient } from '@/lib/supabase/server'

export type Notification = {
    id: string
    user_id: string
    actor_id: string
    type: 'like_page' | 'like_comment' | 'comment_page' | 'reply_comment' | 'system_message'
    title: string
    content: string | null
    link: string | null
    is_read: boolean
    created_at: string
    actor?: {
        username: string
    }
}

/**
 * 获取用户的通知列表
 */
export async function getNotifications(userId: string, limit: number = 20) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('notifications')
        .select(`
      *,
      actor:profiles!actor_id(username)
    `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error || !data) {
        return []
    }

    // Transform actor array to single object if needed (Supabase usually returns object for single relation if configured right, but let's be safe)
    return data.map((item: any) => ({
        ...item,
        actor: item.actor, // Assuming profiles returns single object or we handle it
    })) as Notification[]
}

/**
 * 获取未读通知数量
 */
export async function getUnreadNotificationCount(userId: string) {
    const supabase = await createClient()

    const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false)

    if (error) {
        return 0
    }

    return count || 0
}

/**
 * 标记通知为已读
 */
export async function markNotificationAsRead(notificationId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

    if (error) {
        throw new Error(error.message)
    }
}

/**
 * 标记所有通知为已读
 */
export async function markAllNotificationsAsRead(userId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)

    if (error) {
        throw new Error(error.message)
    }
}

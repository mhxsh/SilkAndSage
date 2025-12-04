'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
    addComment,
    deleteComment,
    toggleLike,
    toggleFavorite,
} from '@/lib/data/interactions'

/**
 * 发表评论
 */
export async function postComment(
    pageId: string,
    pageSlug: string,
    content: string,
    parentId?: string
) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: '请先登录' }
    }

    try {
        await addComment(pageId, user.id, content, parentId)
        revalidatePath(`/${pageSlug}`)
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

/**
 * 删除评论
 */
export async function removeComment(commentId: string, pageSlug: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: '请先登录' }
    }

    try {
        await deleteComment(commentId, user.id)
        revalidatePath(`/${pageSlug}`)
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

/**
 * 切换点赞
 */
export async function toggleLikeAction(
    targetId: string,
    targetType: 'comment' | 'page',
    pageSlug?: string
) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: '请先登录' }
    }

    try {
        const result = await toggleLike(user.id, targetId, targetType)
        if (pageSlug) {
            revalidatePath(`/${pageSlug}`)
        }
        return { success: true, ...result }
    } catch (error: any) {
        return { error: error.message }
    }
}

/**
 * 切换收藏
 */
export async function toggleFavoriteAction(pageId: string, pageSlug: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: '请先登录' }
    }

    try {
        const result = await toggleFavorite(user.id, pageId)
        revalidatePath(`/${pageSlug}`)
        revalidatePath('/profile')
        return { success: true, ...result }
    } catch (error: any) {
        return { error: error.message }
    }
}

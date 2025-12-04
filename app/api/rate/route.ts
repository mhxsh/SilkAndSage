import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    try {
        const { pageId, rating, pageSlug } = await request.json()

        if (!pageId || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: '无效的参数' }, { status: 400 })
        }

        // 使用 upsert 插入或更新评分
        const { error } = await supabase.from('ratings').upsert(
            {
                page_id: pageId,
                user_id: user.id,
                score: rating,
            },
            {
                onConflict: 'page_id,user_id',
            }
        )

        if (error) {
            throw error
        }

        // 重新验证页面
        if (pageSlug) {
            revalidatePath(`/${pageSlug}`)
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Rating error:', error)
        return NextResponse.json({ error: error.message || '评分失败' }, { status: 500 })
    }
}

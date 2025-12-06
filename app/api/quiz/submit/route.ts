import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateQuizResult, saveQuizResult } from '@/lib/data/quiz'
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
        const { answers } = await request.json()

        if (!answers || Object.keys(answers).length === 0) {
            return NextResponse.json({ error: '请完成所有问题' }, { status: 400 })
        }

        // 计算结果
        const result = calculateQuizResult(answers)

        // 保存结果
        await saveQuizResult(user.id, result, answers)

        // 重新验证个人资料页
        revalidatePath('/profile')

        // Save to Footprints
        await supabase.from('user_footprints').insert({
            user_id: user.id,
            tool_name: 'Element Quiz',
            input_context: { answers_count: Object.keys(answers).length },
            output_result: result
        })

        return NextResponse.json({ success: true, result })
    } catch (error: any) {
        console.error('Quiz submission error:', error)
        return NextResponse.json({ error: error.message || '提交失败' }, { status: 500 })
    }
}

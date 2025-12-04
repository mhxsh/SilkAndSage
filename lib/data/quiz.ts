import { createClient } from '@/lib/supabase/server'

type QuizQuestion = {
    id: number
    question_text: string
    answers: Array<{
        text: string
        element: 'wood' | 'fire' | 'earth' | 'metal' | 'water'
    }>
}

/**
 * 获取所有测试问题
 */
export async function getQuizQuestions(): Promise<QuizQuestion[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('id', { ascending: true })

    if (error || !data) {
        return []
    }

    return data as QuizQuestion[]
}

/**
 * 保存测试结果
 */
export async function saveQuizResult(
    userId: string,
    resultElement: 'wood' | 'fire' | 'earth' | 'metal' | 'water',
    choices: Record<number, number>
) {
    const supabase = await createClient()

    // 保存测试提交
    const { error: submitError } = await supabase.from('quiz_submissions').insert({
        user_id: userId,
        result_element: resultElement,
        choices,
    })

    if (submitError) {
        throw new Error(submitError.message)
    }

    // 更新用户 profile 的 inner_element
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ inner_element: resultElement })
        .eq('id', userId)

    if (profileError) {
        throw new Error(profileError.message)
    }

    return true
}

/**
 * 计算测试结果（统计最多的元素）
 */
export function calculateQuizResult(
    answers: Record<number, string>
): 'wood' | 'fire' | 'earth' | 'metal' | 'water' {
    const elementCounts: Record<string, number> = {
        wood: 0,
        fire: 0,
        earth: 0,
        metal: 0,
        water: 0,
    }

    Object.values(answers).forEach((element) => {
        if (element in elementCounts) {
            elementCounts[element]++
        }
    })

    // 找到计数最多的元素
    const maxElement = Object.entries(elementCounts).reduce((max, [element, count]) =>
        count > max[1] ? [element, count] : max
    )[0] as 'wood' | 'fire' | 'earth' | 'metal' | 'water'

    return maxElement
}

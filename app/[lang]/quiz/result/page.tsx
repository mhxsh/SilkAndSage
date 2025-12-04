import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

type Element = {
    name: string
    description: string
    characteristics: string[]
    recommendations: string[]
    color: string
}

const elements: Record<string, Element> = {
    wood: {
        name: '木',
        description: '你的内在元素是木，象征着生长、创造与自由。你充满活力，渴望向上发展。',
        characteristics: ['富有创造力', '追求自由', '适应力强', '充满活力'],
        recommendations: ['多接触大自然', '使用绿色系装饰', '练习瑜伽或太极', '培养植物'],
        color: '#8A9A5B',
    },
    fire: {
        name: '火',
        description: '你的内在元素是火，象征着热情、表达与温暖。你光芒四射，感染力强。',
        characteristics: ['热情洋溢', '表现力强', '富有领导力', '善于社交'],
        recommendations: ['多晒太阳', '使用暖色调', '参与社交活动', '尝试创作艺术'],
        color: '#D4524F',
    },
    earth: {
        name: '土',
        description: '你的内在元素是土，象征着稳定、可靠与滋养。你脚踏实地，值得信赖。',
        characteristics: ['稳重可靠', '善解人意', '细心体贴', '脚踏实地'],
        recommendations: ['穿大地色系', '练习冥想', '做陶艺手工', '规律作息'],
        color: '#8B7355',
    },
    metal: {
        name: '金',
        description: '你的内在元素是金，象征着精准、结构与品质。你追求卓越，注重细节。',
        characteristics: ['追求完美', '有条理', '理性思考', '注重品质'],
        recommendations: ['保持整洁空间', '使用金属或白色', '深呼吸练习', '精简物品'],
        color: '#C0C0C0',
    },
    water: {
        name: '水',
        description: '你的内在元素是水，象征着深度、适应与流动。你富有智慧，情感丰富。',
        characteristics: ['深思熟虑', '适应力强', '情感丰富', '富有智慧'],
        recommendations: ['常喝水', '使用蓝黑色系', '听流水声', '泡澡放松'],
        color: '#4A5F7F',
    },
}

export default async function QuizResultPage({
    searchParams,
}: {
    searchParams: Promise<{ element?: string }>
}) {
    const { element } = await searchParams
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user || !element || !(element in elements)) {
        redirect('/quiz')
    }

    const result = elements[element]

    return (
        <div className="min-h-screen bg-cream py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Result Header */}
                <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center mb-8">
                    <div className="mb-6">
                        <div
                            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
                            style={{ backgroundColor: `${result.color}20`, border: `3px solid ${result.color}` }}
                        >
                            <span className="text-4xl font-serif font-bold" style={{ color: result.color }}>
                                {result.name}
                            </span>
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">
                        你的内在元素：{result.name}
                    </h1>
                    <p className="text-lg text-gray-700 leading-relaxed">{result.description}</p>
                </div>

                {/* Characteristics */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h2 className="text-2xl font-serif font-semibold mb-6">你的特质</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {result.characteristics.map((char, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 p-3 rounded-lg"
                                style={{ backgroundColor: `${result.color}10` }}
                            >
                                <svg className="w-5 h-5 flex-shrink-0" fill={result.color} viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{char}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h2 className="text-2xl font-serif font-semibold mb-6">生活建议</h2>
                    <ul className="space-y-3">
                        {result.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <span
                                    className="mt-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0"
                                    style={{ backgroundColor: result.color }}
                                >
                                    {index + 1}
                                </span>
                                <span className="text-gray-700">{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/profile"
                        className="px-8 py-3 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors text-center"
                    >
                        查看个人资料
                    </Link>
                    <Link
                        href={`/explore?tag=${element}`}
                        className="px-8 py-3 border border-sage text-sage rounded-lg hover:bg-sage/10 transition-colors text-center"
                    >
                        探索相关文章
                    </Link>
                </div>
            </div>
        </div>
    )
}

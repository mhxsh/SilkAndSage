import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 1. Fetch user profile for personalization
        const { data: profile } = await supabase
            .from('user_birth_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

        // 2. Construct the prompt based on profile
        const { lang = 'zh' } = await request.json()

        let userContext = ''
        if (profile) {
            userContext = lang === 'zh'
                ? `用户画像: 生肖-${profile.chinese_zodiac}, 星座-${profile.zodiac_sign}, 五行元素-${profile.element}。`
                : `User Profile: Chinese Zodiac-${profile.chinese_zodiac}, Zodiac Sign-${profile.zodiac_sign}, Element-${profile.element}.`
        } else {
            userContext = lang === 'zh' ? '用户暂无详细档案。' : 'User has no detailed profile.'
        }

        const systemPrompt = lang === 'zh'
            ? `你是一位心理疗愈师。请根据用户画像，生成 3 个针对性的心情测试问题。
               问题应该温和、具有洞察力，能反映用户当下的能量状态。
               
               IMPORTANT: 只返回纯 JSON 字符串，不要包含 Markdown 代码块。
               格式如下:
               {
                 "questions": [
                   { "id": 1, "text": "问题内容", "options": ["选项A", "选项B", "选项C"] },
                   ...
                 ]
               }`
            : `You are a mental healer. Generate 3 personalized mood test questions based on the user profile.
               The questions should be gentle, insightful, and reflect the user's current energy state.
               
               IMPORTANT: Return ONLY raw JSON string, NO Markdown code blocks.
               Format:
               {
                 "questions": [
                   { "id": 1, "text": "Question text", "options": ["Option A", "Option B", "Option C"] },
                   ...
                 ]
               }`

        // 3. Call AI API with native fetch
        try {
            // Priority: MOOD_AI_API_KEY > OPENAI_API_KEY
            const rawApiKey = process.env.MOOD_AI_API_KEY || process.env.OPENAI_API_KEY

            // Check for valid API key
            if (!rawApiKey || rawApiKey === 'dummy-key') {
                throw new Error('No valid API key')
            }

            // Aggressive Key Sanitization: remove whitespace, quotes
            const apiKey = rawApiKey.trim().replace(/^['"]|['"]$/g, '')
            const modelToUse = process.env.OPENAI_MODEL || "gpt-3.5-turbo"

            // Ensure Base URL is correct and doesn't end with slash
            let baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
            if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, -1)
            }

            const apiUrl = `${baseUrl}/chat/completions`

            // Construct request payload
            const requestBody = {
                model: modelToUse,
                messages: [
                    { role: "user", content: `${systemPrompt}\n\n${userContext} 请生成今日测试题。` }
                ],
                temperature: 0.7
            }

            const requestHeaders = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: requestHeaders,
                body: JSON.stringify(requestBody)
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('AI API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                })
                throw new Error(`API Error: ${response.status} ${errorText}`)
            }

            const data = await response.json()

            let content = data.choices?.[0]?.message?.content
            if (!content) throw new Error('No content generated in response')

            // Clean up markdown code blocks if present
            content = content.replace(/```json\n?|\n?```/g, '').trim()

            const result = JSON.parse(content)
            return NextResponse.json(result)

        } catch (aiError) {
            console.warn('AI Generation failed, falling back to mock data:', aiError)

            // Fallback Mock Data
            return NextResponse.json({
                questions: [
                    {
                        id: 1,
                        text: lang === 'zh' ? "今天你感觉自己的能量水平如何？" : "How is your energy level today?",
                        options: lang === 'zh'
                            ? ["充满活力", "平平淡淡", "有些疲惫"]
                            : ["Full of energy", "Average", "A bit tired"]
                    },
                    {
                        id: 2,
                        text: lang === 'zh' ? "最近是否有什么事情让你感到焦虑？" : "Is there anything making you anxious recently?",
                        options: lang === 'zh'
                            ? ["完全没有", "有一点点", "非常焦虑"]
                            : ["Not at all", "A little bit", "Very anxious"]
                    },
                    {
                        id: 3,
                        text: lang === 'zh' ? "你现在最想做的一件事是什么？" : "What is the one thing you want to do most right now?",
                        options: lang === 'zh'
                            ? ["出去走走", "大睡一觉", "找人倾诉"]
                            : ["Go for a walk", "Sleep", "Talk to someone"]
                    }
                ]
            })
        }

    } catch (error: any) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}

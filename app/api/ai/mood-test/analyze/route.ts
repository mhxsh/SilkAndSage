import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { answers, questions, lang = 'zh' } = await request.json()

        // 1. Fetch user profile
        const { data: profile } = await supabase
            .from('user_birth_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

        let userContext = ''
        if (profile) {
            userContext = lang === 'zh'
                ? `用户画像: 生肖-${profile.chinese_zodiac}, 星座-${profile.zodiac_sign}, 五行元素-${profile.element}。`
                : `User Profile: Chinese Zodiac-${profile.chinese_zodiac}, Zodiac Sign-${profile.zodiac_sign}, Element-${profile.element}.`
        }

        // 2. Construct Prompt
        const systemPrompt = lang === 'zh'
            ? `你是一位温暖的心理疗愈师。请根据用户的测试回答和个人画像，生成一份今日心情疗愈报告。
               报告应包含：
               1. 情绪状态分析（简短精准）
               2. 疗愈建议（具体可行的行动，如听什么类型的音乐、吃什么食物）
               3. 今日能量色彩（Hex色值和颜色名称）
               4. 一句鼓励的话
               
               IMPORTANT: 只返回纯 JSON 字符串，不要包含 Markdown 代码块。
               格式如下:
               {
                 "analysis": "...",
                 "suggestion": "...",
                 "lucky_color": { "name": "...", "hex": "..." },
                 "quote": "..."
               }`
            : `You are a warm mental healer. Generate a mood healing report based on user answers and profile.
               Include:
               1. Mood analysis (concise)
               2. Healing suggestion (actionable)
               3. Energy color (Hex and name)
               4. A quote
               
               IMPORTANT: Return ONLY raw JSON string, NO Markdown code blocks.
               Format:
               {
                 "analysis": "...",
                 "suggestion": "...",
                 "lucky_color": { "name": "...", "hex": "..." },
                 "quote": "..."
               }`

        const userMessage = `
            ${userContext}
            问题与回答:
            ${questions.map((q: any, i: number) => `Q: ${q.text}\nA: ${answers[q.id]}`).join('\n')}
        `

        let analysisResult;

        // 3. Call AI API with native fetch
        try {
            // Priority: MOOD_AI_API_KEY > OPENAI_API_KEY
            const rawApiKey = process.env.MOOD_AI_API_KEY || process.env.OPENAI_API_KEY

            if (!rawApiKey || rawApiKey === 'dummy-key') {
                throw new Error('No valid API key')
            }

            // Aggressive Key Sanitization
            const apiKey = rawApiKey.trim().replace(/^['"]|['"]$/g, '')
            const modelToUse = process.env.OPENAI_MODEL || "gpt-3.5-turbo"

            let baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
            if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, -1)
            }
            const apiUrl = `${baseUrl}/chat/completions`

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: modelToUse,
                    messages: [
                        { role: "user", content: `${systemPrompt}\n\n${userMessage}` }
                    ],
                    temperature: 0.7
                })
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('AI Analyze API Error:', errorText)
                throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()
            let content = data.choices?.[0]?.message?.content
            if (!content) throw new Error('No content generated')

            // Clean up markdown
            content = content.replace(/```json\n?|\n?```/g, '').trim()
            analysisResult = JSON.parse(content)

        } catch (aiError) {
            console.warn('AI Analysis failed, falling back to mock data:', aiError)
            // Fallback Mock Data
            analysisResult = {
                analysis: lang === 'zh' ? "你今天似乎有些疲惫，需要休息。" : "You seem a bit tired today.",
                suggestion: lang === 'zh' ? "建议喝一杯热茶，听听轻音乐。" : "Suggest drinking hot tea and listening to light music.",
                lucky_color: { name: lang === 'zh' ? "宁静蓝" : "Serenity Blue", hex: "#91A8D0" },
                quote: lang === 'zh' ? "休息是为了走更长远的路。" : "Rest is for a longer journey."
            }
        }

        // 4. Save to Database
        const { error: dbError } = await supabase
            .from('user_mood_logs')
            .insert({
                user_id: user.id,
                test_result: analysisResult,
                user_answers: { questions, answers },
                mood_score: 0
            })

        if (dbError) {
            console.error('DB Save Error:', dbError)
        }

        // 5. Save to Footprints
        await supabase.from('user_footprints').insert({
            user_id: user.id,
            tool_name: 'Mood Healing',
            input_context: { questions_count: questions.length, answers_sample: Object.keys(answers).length },
            output_result: analysisResult
        })

        return NextResponse.json(analysisResult)

    } catch (error: any) {
        console.error('AI Analyze Error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to analyze results' },
            { status: 500 }
        )
    }
}

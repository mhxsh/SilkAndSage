import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { scenario, lang = 'zh' } = await request.json()

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
        } else {
            userContext = lang === 'zh' ? '用户暂无详细档案。' : 'User has no detailed profile.'
        }

        // 2. Construct Prompt
        const systemPrompt = lang === 'zh'
            ? `你是一位顶尖的色彩搭配师和能量疗愈师。请根据用户的五行/星座画像，以及用户选择的场景（${scenario}），生成一组专属的色彩搭配方案。
               
               目标：通过色彩平衡用户的能量，同时符合场景的美学要求。
               
               请返回纯 JSON 格式：
               {
                 "palette": [
                   { "hex": "#RRGGBB", "name": "颜色名称", "usage": "该颜色在场景中的具体用法（如：作为外套主色、作为抱枕点缀）" },
                   ... (共4-5个颜色)
                 ],
                 "advice": "一段简短的搭配建议，解释为什么这组颜色适合该用户的当下能量和该场景。"
               }
               
               IMPORTANT: 只返回纯 JSON 字符串，无 Markdown。`
            : `You are a top colorist and energy healer. Generate a personalized color palette based on the user's profile and the selected scenario (${scenario}).
               
               Goal: Balance user energy while meeting aesthetic standards for the scenario.
               
               Return raw JSON only:
               {
                 "palette": [
                   { "hex": "#RRGGBB", "name": "Color Name", "usage": "Specific usage in scenario (e.g., Main coat color, Accent pillow)" },
                   ... (4-5 colors)
                 ],
                 "advice": "Brief advice explaining why this palette fits the user's energy and scenario."
               }`

        let result;

        // 3. Call AI API
        try {
            const rawApiKey = process.env.MOOD_AI_API_KEY || process.env.OPENAI_API_KEY
            if (!rawApiKey || rawApiKey === 'dummy-key') throw new Error('No valid API key')

            const apiKey = rawApiKey.trim().replace(/^['"]|['"]$/g, '')
            const modelToUse = process.env.OPENAI_MODEL || "gpt-3.5-turbo"
            let baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
            if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1)

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
                        { role: "user", content: `${systemPrompt}\n\n${userContext}` }
                    ],
                    temperature: 0.7
                })
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('AI Color API Error:', errorText)
                throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()
            let content = data.choices?.[0]?.message?.content
            if (!content) throw new Error('No content generated')

            content = content.replace(/```json\n?|\n?```/g, '').trim()
            result = JSON.parse(content)

        } catch (aiError) {
            console.warn('AI Color Generation failed, falling back to mock data:', aiError)
            // Fallback Mock Data
            result = {
                palette: [
                    { hex: "#E6E6FA", name: lang === 'zh' ? "薰衣草紫" : "Lavender", usage: lang === 'zh' ? "大面积背景色" : "Background" },
                    { hex: "#98FF98", name: lang === 'zh' ? "薄荷绿" : "Mint Green", usage: lang === 'zh' ? "点缀色" : "Accent" },
                    { hex: "#FFFFFF", name: lang === 'zh' ? "纯白" : "White", usage: lang === 'zh' ? "调和色" : "Neutral" }
                ],
                advice: lang === 'zh' ? "AI 服务暂时繁忙，为您推荐这组通用的清新配色。" : "AI service busy, recommending this fresh palette."
            }
        }

        // 4. Save to Database
        const { error: dbError } = await supabase
            .from('user_color_logs')
            .insert({
                user_id: user.id,
                scenario: scenario,
                palette: result.palette,
                ai_advice: result.advice
            })

        if (dbError) console.error('DB Save Error:', dbError)

        // 5. Save to Footprints
        await supabase.from('user_footprints').insert({
            user_id: user.id,
            tool_name: 'Color Harmony',
            input_context: { scenario, lang },
            output_result: { palette: result.palette, advice: result.advice }
        })

        return NextResponse.json(result)

    } catch (error: any) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}

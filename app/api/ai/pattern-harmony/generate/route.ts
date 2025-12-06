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
            ? `你是一位顶尖的时尚与空间设计师，精通纹理、图案与五行能量的搭配。请根据用户的五行/星座画像，以及用户选择的场景（${scenario}），推荐一组最适合的图案和材质。
               
               目标：通过触觉和视觉纹理平衡用户的能量，提升场景质感。
               
               请返回纯 JSON 格式：
               {
                 "recommendations": [
                   { 
                     "type": "图案" 或 "材质", 
                     "name": "名称 (如: 波点, 丝绸)", 
                     "description": "简短描述其视觉或触觉特征",
                     "usage": "在场景中的具体应用建议"
                   },
                   ... (共3-4个推荐)
                 ],
                 "advice": "一段简短的整体搭配建议，解释为什么这些纹理适合该用户的当下能量。"
               }
               
               IMPORTANT: 只返回纯 JSON 字符串，无 Markdown。`
            : `You are a top designer expert in textures, patterns, and energy balance. Generate personalized pattern/texture recommendations based on the user's profile and scenario (${scenario}).
               
               Goal: Balance user energy through tactile and visual textures.
               
               Return raw JSON only:
               {
                 "recommendations": [
                   { 
                     "type": "Pattern" or "Texture", 
                     "name": "Name (e.g., Polka Dot, Silk)", 
                     "description": "Brief visual/tactile description",
                     "usage": "Specific application in the scenario"
                   },
                   ... (3-4 items)
                 ],
                 "advice": "Brief advice explaining why these textures fit the user's energy."
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
                console.error('AI Pattern API Error:', errorText)
                throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()
            let content = data.choices?.[0]?.message?.content
            if (!content) throw new Error('No content generated')

            content = content.replace(/```json\n?|\n?```/g, '').trim()
            result = JSON.parse(content)

        } catch (aiError) {
            console.warn('AI Pattern Generation failed, falling back to mock data:', aiError)
            // Fallback Mock Data
            result = {
                recommendations: [
                    {
                        type: lang === 'zh' ? "材质" : "Texture",
                        name: lang === 'zh' ? "天然亚麻" : "Natural Linen",
                        description: lang === 'zh' ? "透气、质朴、亲肤" : "Breathable, rustic, skin-friendly",
                        usage: lang === 'zh' ? "适合作为窗帘或床品" : "Good for curtains or bedding"
                    },
                    {
                        type: lang === 'zh' ? "图案" : "Pattern",
                        name: lang === 'zh' ? "几何线条" : "Geometric Lines",
                        description: lang === 'zh' ? "简约、现代、有序" : "Minimalist, modern, ordered",
                        usage: lang === 'zh' ? "适合地毯或装饰画" : "Good for rugs or wall art"
                    }
                ],
                advice: lang === 'zh' ? "AI 服务暂时繁忙，为您推荐这组通用的自然风格搭配。" : "AI service busy, recommending this natural style."
            }
        }

        // 4. Save to Database
        const { error: dbError } = await supabase
            .from('user_pattern_logs')
            .insert({
                user_id: user.id,
                scenario: scenario,
                recommendations: result.recommendations,
                ai_advice: result.advice
            })

        if (dbError) console.error('DB Save Error:', dbError)

        // 5. Save to Footprints
        await supabase.from('user_footprints').insert({
            user_id: user.id,
            tool_name: 'Pattern Harmony',
            input_context: { scenario, lang },
            output_result: { recommendations: result.recommendations, advice: result.advice }
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

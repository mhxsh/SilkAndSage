import { OpenAI } from 'openai';
import { FootprintLog, UserPersona } from '@/types/footprint';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePersonaFromHistory(
    history: FootprintLog[],
    currentPersona?: UserPersona | null,
    userPrompt?: string,
    lang: string = 'en'
) {
    // Format history for the prompt
    const historySummary = history.map(h => {
        return `Tool: ${h.tool_name}, Date: ${h.created_at}, Input: ${JSON.stringify(h.input_context)}, Result: ${JSON.stringify(h.output_result)}`;
    }).join('\n---\n');

    const isChinese = lang === 'zh';

    const systemPromptZh = `
    你是一位专业的性格分析师。请根据用户使用各种占卜和身心灵工具的历史记录，创建一个详细的"用户画像"。
    
    画像应包含：
    1. 人格类型（如具体的原型或MBTI类型，如果适用）
    2. 关键性格特征（3-5个关键词）
    3. 优势与劣势
    4. 个人成长的可执行建议
    
    请严格按照以下 JSON 结构输出（所有文本内容必须使用中文）：
    {
        "persona_traits": {
            "personality_type": "string",
            "keywords": ["string", "string"],
            "strengths": ["string"],
            "weaknesses": ["string"]
        },
        "analysis_text": "string (一段描述用户的文字)",
        "suggestions": "string (一段建议文字)"
    }
    
    如果历史记录较少，请进行合理的推断，但请确保内容正面且有帮助。
    `;

    const systemPromptEn = `
    You are an expert personality analyst. Based on the user's interaction history with various divination and self-help tools, create a detailed "User Persona".
    
    The Persona should include:
    1. A Personality Type (e.g. detailed archetype or MBTI-like if applicable)
    2. Key Character Traits (List of 3-5 keywords)
    3. Strengths and Weaknesses
    4. Actionable Suggestions for personal growth
    
    Output strictly in JSON format with the following structure (All text content MUST be in English):
    {
        "persona_traits": {
            "personality_type": "string",
            "keywords": ["string", "string"],
            "strengths": ["string"],
            "weaknesses": ["string"]
        },
        "analysis_text": "string (A paragraph describing the user)",
        "suggestions": "string (A paragraph of advice)"
    }
    
    If the history is sparse, make reasonable inferences but mention confidence is low.
    `;

    const systemPrompt = isChinese ? systemPromptZh : systemPromptEn;

    const userMessage = `
    User History Logs:
    ${historySummary}
    
    ${userPrompt ? `User's additional context/prompt: ${userPrompt}` : ''}
    
    ${currentPersona ? `Previous Persona Notes: ${currentPersona.user_notes}` : ''}
    
    Generate the persona JSON.
    `;

    // 3. Configure Client with Base URL support
    const apiKey = process.env.MOOD_AI_API_KEY || process.env.OPENAI_API_KEY;
    let baseURL = process.env.OPENAI_BASE_URL;
    if (baseURL && baseURL.endsWith('/')) {
        baseURL = baseURL.slice(0, -1);
    }
    // OpenAI client automatically appends /chat/completions if using standard client, 
    // but the library expects base URL to be the root or v1. 
    // Usually 'https://api.openai.com/v1'.

    // However, to match the manual fetch implementation completely and avoid library quirks with custom proxies:
    // Let's use the same manual fetch approach or ensure the library is init correctly.
    // The previous error `400` strongly suggests invalid parameters for the specific model/proxy.
    // Let's switch to the robust manual fetch pattern used in mood-test.

    const modelToUse = process.env.OPENAI_MODEL || "gpt-3.5-turbo"
    const apiUrl = `${baseURL || 'https://api.openai.com/v1'}/chat/completions`

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: modelToUse,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage }
                ],
                temperature: 0.7
                // Removed strict response_format to avoid 400 on incompatible models
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`AI API Error ${response.status}: ${errorText}`)
        }

        const data = await response.json()
        let content = data.choices?.[0]?.message?.content
        if (!content) throw new Error("No content generated");

        // robust cleanup
        content = content.replace(/```json\n?|\n?```/g, '').trim()

        return JSON.parse(content);

    } catch (error) {
        console.error("Error generating persona:", error);
        throw error;
    }
}

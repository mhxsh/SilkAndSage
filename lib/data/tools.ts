import { createClient } from '@/lib/supabase/server'

export type Tool = {
    id: string
    name_zh: string
    name_en: string
    desc_zh: string
    desc_en: string
    url: string
    icon: string
    keywords: string[]
}

/**
 * Get all available tools
 */
export async function getAllTools(): Promise<Tool[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('tools')
        .select('*')

    if (error || !data) return []
    return data as Tool[]
}

/**
 * Get tools matching specific tags
 * This performs an in-memory matching since tool count is low.
 * Matching logic: Tool is relevant if any of its keywords partially match any of the page tags.
 */
export async function getMatchingTools(tags: string[] | null): Promise<Tool[]> {
    if (!tags || tags.length === 0) return []

    const allTools = await getAllTools()

    // Normalize tags for comparison
    const normalizedTags = tags.map(t => t.toLowerCase().trim())

    return allTools.filter(tool => {
        // Check intersection of tool.keywords and page tags
        return tool.keywords.some(keyword => {
            const k = keyword.toLowerCase()
            return normalizedTags.some(t => t.includes(k) || k.includes(t))
        })
    })
}

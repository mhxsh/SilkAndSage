import { createClient } from '@/lib/supabase/server'

type SearchResult = {
    slug: string
    generated_image_url: string | null
    tags: string[] | null
    views_count: number
    translations: {
        title: string
    }
}

/**
 * 搜索文章
 */
export async function searchPages(
    query: string,
    locale: string = 'zh',
    limit: number = 20
): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) {
        return []
    }

    const supabase = await createClient()

    // 先获取所有已发布的文章
    const { data: allData, error: allError } = await supabase
        .from('generated_pages')
        .select(`
      slug,
      generated_image_url,
      tags,
      views_count,
      translations:generated_page_translations!inner(
        title
      )
    `)
        .eq('status', 'published')
        .eq('translations.language_code', locale)

    if (allError || !allData) {
        return []
    }

    // 在客户端过滤数据（支持标签和标题搜索）
    const results = allData
        .filter((item: any) => {
            const titleMatch = item.translations[0]?.title?.toLowerCase().includes(query.toLowerCase())
            const tagMatch = item.tags?.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
            return titleMatch || tagMatch
        })
        .slice(0, limit)

    // Transform translations array to single object
    return results.map((item: any) => ({
        ...item,
        translations: item.translations[0],
    })) as SearchResult[]
}

/**
 * 按标签筛选文章
 */
export async function filterPagesByTag(
    tag: string,
    locale: string = 'zh',
    limit: number = 12
): Promise<SearchResult[]> {
    const supabase = await createClient()

    // 先获取所有已发布的文章
    const { data: allData, error } = await supabase
        .from('generated_pages')
        .select(`
      slug,
      generated_image_url,
      tags,
      views_count,
      translations:generated_page_translations!inner(
        title
      )
    `)
        .eq('status', 'published')
        .eq('translations.language_code', locale)

    if (error || !allData) {
        return []
    }

    // 在客户端过滤包含该标签的文章
    const results = allData
        .filter((item: any) => {
            return item.tags?.includes(tag)
        })
        .slice(0, limit)

    return results.map((item: any) => ({
        ...item,
        translations: item.translations[0],
    })) as SearchResult[]
}

/**
 * 获取所有标签（用于标签云）
 */
export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('generated_pages')
        .select('tags')
        .eq('status', 'published')

    if (error || !data) {
        return []
    }

    // 统计所有标签出现的次数
    const tagCounts: Record<string, number> = {}

    data.forEach((page: any) => {
        if (page.tags && Array.isArray(page.tags)) {
            page.tags.forEach((tag: string) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1
            })
        }
    })

    // 转换为数组并排序
    return Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
}

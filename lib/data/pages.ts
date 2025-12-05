import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'

type PageWithTranslation = {
    id: string
    slug: string
    identity_id: string | null
    generated_image_url: string | null
    tags: string[] | null
    views_count: number
    comments_count: number
    average_score: number
    status: 'draft' | 'published' | 'archived'
    published_at: string | null
    translations: {
        title: string
        generated_text: any
        tags: string[] | null
    }
}

export type PageListItem = {
    slug: string
    generated_image_url: string | null
    tags: string[] | null
    views_count: number
    average_score: number
    translations: {
        title: string
        tags: string[] | null
    }
}

/**
 * 获取单篇文章详情（带翻译）
 */
export async function getPageBySlug(
    slug: string,
    locale: string = 'zh'
): Promise<PageWithTranslation | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('generated_pages')
        .select(`
      id,
      slug,
      identity_id,
      generated_image_url,
      tags,
      views_count,
      comments_count,
      average_score,
      status,
      published_at,
      translations:generated_page_translations!inner(
        title,
        generated_text,
        tags
      )
    `)
        .eq('slug', slug)
        .eq('translations.language_code', locale)
        .eq('status', 'published')
        .single()

    if (error || !data) {
        return null
    }

    // 增加浏览计数已移至客户端组件 ViewCounter

    // Supabase returns translations as array, get first item
    const result = data as any
    return {
        ...result,
        translations: result.translations[0],
    } as PageWithTranslation
}

/**
 * 获取所有已发布文章的 slugs（用于 generateStaticParams）
 */
export async function getAllPublishedSlugs(): Promise<string[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('generated_pages')
        .select('slug')
        .eq('status', 'published')

    if (error || !data) {
        return []
    }

    return data.map((page) => page.slug)
}

/**
 * 增加文章浏览计数
 */
async function incrementViewCount(slug: string): Promise<void> {
    const supabase = await createClient()

    await supabase.rpc('increment_views', { page_slug: slug })
}

/**
 * 获取相关文章推荐（基于标签）
 */
export async function getRelatedPages(
    currentSlug: string,
    tags: string[] | null,
    locale: string = 'zh',
    limit: number = 3
): Promise<PageWithTranslation[]> {
    if (!tags || tags.length === 0) {
        return []
    }

    const supabase = await createClient()

    const { data, error } = await supabase
        .from('generated_pages')
        .select(`
      id,
      slug,
      identity_id,
      generated_image_url,
      tags,
      views_count,
      comments_count,
      average_score,
      status,
      published_at,
      translations:generated_page_translations!inner(
        title,
        generated_text,
        tags
      )
    `)
        .neq('slug', currentSlug)
        .eq('status', 'published')
        .eq('translations.language_code', locale)

    if (error || !data) {
        return []
    }

    // 在客户端过滤具有相同标签的文章
    const relatedPages = data
        .filter((page: any) => {
            const pageTags = page.translations[0]?.tags || []
            // 检查是否有共同标签
            return pageTags.some((tag: string) => tags.includes(tag))
        })
        .slice(0, limit)

    // Transform array translations to first item
    return relatedPages.map((item: any) => ({
        ...item,
        translations: item.translations[0],
    })) as PageWithTranslation[]
}

/**
 * 获取所有已发布文章列表（分页）
 */
export async function getPublishedPages(
    locale: string = 'zh',
    page: number = 1,
    limit: number = 12
): Promise<{ pages: PageListItem[]; total: number }> {
    const supabase = await createClient()

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
        .from('generated_pages')
        .select(
            `
      slug,
      generated_image_url,
      tags,
      views_count,
      average_score,
      translations:generated_page_translations!inner(
        title,
        tags
      )
    `,
            { count: 'exact' }
        )
        .eq('status', 'published')
        .eq('translations.language_code', locale)
        .order('published_at', { ascending: false })
        .range(from, to)

    if (error || !data) {
        return { pages: [], total: 0 }
    }

    // Transform array translations to first item
    const pages = data.map((item: any) => ({
        ...item,
        translations: item.translations[0],
    })) as PageListItem[]

    return {
        pages,
        total: count || 0,
    }
}

/**
 * 获取热门文章列表（按浏览量排序）
 */
export async function getPopularPages(
    locale: string = 'zh',
    limit: number = 6
): Promise<PageListItem[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('generated_pages')
        .select(
            `
      slug,
      generated_image_url,
      tags,
      views_count,
      average_score,
      translations:generated_page_translations!inner(
        title,
        tags
      )
    `
        )
        .eq('status', 'published')
        .eq('translations.language_code', locale)
        .order('views_count', { ascending: false })
        .limit(limit)

    if (error || !data) {
        return []
    }

    // Transform array translations to first item
    return data.map((item: any) => ({
        ...item,
        translations: item.translations[0],
    })) as PageListItem[]
}

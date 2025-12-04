# 英文文章详情页修复完成

## 问题
英文版本的文章详情页面读取的不是英文版本，显示的是中文标题、标签和内容。

## 根本原因
`app/[lang]/[slug]/page.tsx` 中的数据获取函数**没有传递 `lang` 参数**：
- `getPageBySlug(slug)` ❌
- `getRelatedPages(slug, page.tags)` ❌

## 修复内容

### 1. `app/[lang]/[slug]/page.tsx`
```typescript
// 修复前
export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const page = await getPageBySlug(slug)  // ❌ 没有传递 lang
    // ...
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug, lang } = await params
    const page = await getPageBySlug(slug)  // ❌ 没有传递 lang
    // ...
    const relatedPages = await getRelatedPages(slug, page.tags)  // ❌ 没有传递 lang
}

// 修复后
export async function generateMetadata({ params }: PageProps) {
    const { slug, lang } = await params
    const page = await getPageBySlug(slug, lang)  // ✅ 传递 lang
    // ...
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug, lang } = await params
    const page = await getPageBySlug(slug, lang)  // ✅ 传递 lang
    // ...
    const relatedPages = await getRelatedPages(slug, page.translations.tags, lang)  // ✅ 传递 lang 和 translations.tags
}
```

### 2. `lib/data/pages.ts` - `getRelatedPages()`
```typescript
// 修复前
.overlaps('tags', tags)  // ❌ 在 generated_pages.tags 中搜索

// 修复后
// ✅ 在客户端过滤 translations.tags
const relatedPages = data
    .filter((page: any) => {
        const pageTags = page.translations[0]?.tags || []
        return pageTags.some((tag: string) => tags.includes(tag))
    })
    .slice(0, limit)
```

## 验证清单

### ✅ 英文文章详情页 (`/en/capricorn-self-care-tea-ceremony`)
- [ ] **标题**显示英文：`Capricorn Tea Ceremony: A Gentle Revolution for Workaholics`
- [ ] **标签**显示英文：`Capricorn`, `Workaholic`, `Tea Ceremony`, `Self-care`, `Wellness`
- [ ] **文章内容**显示英文（hook, insight, solution, curation 部分）
- [ ] **相关文章**显示英文标题

### ✅ 中文文章详情页 (`/zh/capricorn-self-care-tea-ceremony`)  
- [ ] **标题**显示中文：`摩羯座的茶道时光：工作狂的温柔革命`
- [ ] **标签**显示中文：`摩羯座`, `工作狂`, `茶道`, `自我关怀`, `wellness`
- [ ] **文章内容**显示中文
- [ ] **相关文章**显示中文标题

## 其他修复页面
以下页面也已修复，应该正常显示：
- ✅ `/en/infj-bedroom-wabi-sabi-sanctuary`
- ✅ `/en/leo-2025-lucky-colors-style-guide`
- ✅ `/en/libra-minimalist-home-harmony`
- ✅ `/en/enfp-anxiety-relief-feng-shui`

## 数据库要求
确保已运行：
```bash
d:/dev/AI/SilkAndSage/supabase/FINAL_TAGS_I18N_FIX.sql
```

这将添加翻译表的 tags 字段并填充中英文标签。

## 刷新浏览器
修复后，请**刷新浏览器**（Ctrl+Shift+R 或 Cmd+Shift+R）以清除缓存并查看更新后的内容。

完成！🎉

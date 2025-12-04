# 标签国际化修复总结

## 问题描述
用户希望数据库直接存储中英文两个版本的标签，而不是通过前端翻译函数。

## 解决方案
在 `generated_page_translations` 表中添加 `tags` 字段，每个语言版本存储各自的标签。

## 数据库变更

### 1. 表结构修改
```sql
ALTER TABLE public.generated_page_translations
ADD COLUMN IF NOT EXISTS tags text[];
```

### 2. 数据填充
- **中文翻译**：存储中文标签（如 `['禅意', '卧室', 'INFJ']`）
- **英文翻译**：存储英文标签（如 `['Zen', 'Bedroom', 'INFJ']`）
- **主表**：`generated_pages.tags` 保留中文标签（向后兼容）

## 代码变更

### 1. 类型定义更新 (`lib/data/pages.ts`)
```typescript
type PageWithTranslation = {
    // ...
    translations: {
        title: string
        generated_text: any
        tags: string[] | null  // 新增
    }
}
```

### 2. 数据查询更新
所有查询翻译的地方都包含 `tags` 字段：
- `getPageBySlug()`
- `getPublishedPages()`
- `getRelatedPages()`
- `getUserFavorites()`

### 3. 搜索功能更新 (`lib/data/search.ts`)
```typescript
export async function getAllTags(locale: string = 'zh')
```
现在从 `generated_page_translations` 获取当前语言的标签。

### 4. 页面组件更新
所有页面都使用 `page.translations.tags` 而不是 `page.tags`：
- ✅ `app/[lang]/explore/page.tsx`
- ✅ `app/[lang]/[slug]/page.tsx`
- ✅ `app/[lang]/search/page.tsx`
- ✅ `app/[lang]/profile/page.tsx`

### 5. 字典更新
添加了 `common.view_details` 用于 Profile 页面。

## 执行步骤

**在 Supabase SQL Editor 中运行：**
```bash
d:/dev/AI/SilkAndSage/supabase/FINAL_TAGS_I18N_FIX.sql
```

## 验证清单

### ✅ 中文版
- [ ] `/zh/explore` - 文章标签显示中文
- [ ] `/zh/search` - 热门标签显示中文
- [ ] `/zh/[slug]` - 文章头部标签显示中文
- [ ] `/zh/profile` - 收藏文章标签显示中文

### ✅ 英文版
- [ ] `/en/explore` - 文章标签显示英文
- [ ] `/en/search` - 热门标签显示英文
- [ ] `/en/[slug]` - 文章头部标签显示英文
- [ ] `/en/[slug]` - 文章标题和内容显示英文
- [ ] `/en/profile` - "View Details" 显示英文
- [ ] `/en/profile` - 收藏文章标题显示英文
- [ ] `/en/profile` - 收藏文章标签显示英文

## 数据示例

### 中文版 (language_code='zh')
```sql
{
  "page_id": "xxx",
  "language_code": "zh",
  "title": "INFJ 卧室：侘寂风格的庇护所指南",
  "tags": ["禅意", "卧室", "INFJ", "侘寂风", "极简"]
}
```

### 英文版 (language_code='en')
```sql
{
  "page_id": "xxx",
  "language_code": "en",
  "title": "INFJ Bedroom Sanctuary: A Wabi-Sabi Guide",
  "tags": ["Zen", "Bedroom", "INFJ", "Wabi-sabi", "Minimalism"]
}
```

## 优势
1. **准确性**：避免翻译错误，每个标签都是人工审核的
2. **灵活性**：中英文标签可以完全不同，不受翻译函数限制
3. **性能**：无需前端翻译，直接从数据库获取正确语言的标签
4. **可扩展**：未来添加其他语言只需插入新的翻译记录

## 移除的功能
- ❌ `lib/data/tags.ts` 中的 `translateTag()` 函数不再需要（但保留以防万一）
- ❌ 前端不再需要手动翻译标签

完成！🎉

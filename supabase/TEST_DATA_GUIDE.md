# 测试数据执行指南

## 准备工作

在执行测试文章数据之前，请确保已完成以下步骤：

1. ✅ 执行了 `001_initial_schema.sql`（创建所有表）
2. ✅ 执行了 `seed.sql`（填充 MBTI、星座、元素等基础数据）
3. ✅ 执行了 `002_increment_views_function.sql`（创建浏览计数函数）

## 执行步骤

### 方法一：通过 Supabase SQL Editor（推荐）

1. 访问您的 Supabase 项目：https://app.supabase.com/project/dwusxpyirwejwtbfbzxm
2. 导航至 **SQL Editor**
3. 点击 **New Query**
4. 复制 `test_articles.sql` 的全部内容并粘贴
5. 点击 **Run**
6. 等待执行完成，应该看到成功提示

### 方法二：使用 Supabase CLI（本地）

```bash
# 如果您安装了 Supabase CLI
npx supabase db reset  # 重置数据库（可选，会清空所有数据）
npx supabase db push   # 应用所有迁移
psql <your-connection-string> < supabase/test_articles.sql
```

## 验证数据

执行以下 SQL 查询验证数据是否正确插入：

```sql
-- 查看所有已发布文章
SELECT 
  gp.slug,
  gpt.title,
  gp.views_count,
  gp.average_score,
  array_length(gp.tags, 1) as tag_count
FROM generated_pages gp
JOIN generated_page_translations gpt ON gp.id = gpt.page_id
WHERE gp.status = 'published'
ORDER BY gp.published_at DESC;

-- 应返回 5 篇文章
```

## 测试文章列表

执行成功后，您将拥有以下 5 篇测试文章：

1. **INFJ 卧室：侘寂风格的庇护所指南**
   - Slug: `infj-bedroom-wabi-sabi-sanctuary`
   - 标签: 禅意, 卧室, infj, 侘寂风, 极简
   - 浏览: 234 | 评分: 4.7

2. **狮子座 2025 风格指南：穿戴玉绿色以获得平衡**
   - Slug: `leo-2025-lucky-colors-style-guide`
   - 标签: 狮子座, 穿搭, 幸运色, 2025, 时尚
   - 浏览: 189 | 评分: 4.5

3. **天秤座极简家居：在平衡中寻找和谐**
   - Slug: `libra-minimalist-home-harmony`
   - 标签: 天秤座, 极简, 家居, 平衡, 风水
   - 浏览: 156 | 评分: 4.8

4. **ENFP 焦虑缓解：用风水找回内心的结构**
   - Slug: `enfp-anxiety-relief-feng-shui`
   - 标签: enfp, 焦虑, 冥想, 风水, 养生
   - 浏览: 298 | 评分: 4.6

5. **摩羯座的茶道时光：工作狂的温柔革命**
   - Slug: `capricorn-self-care-tea-ceremony`
   - 标签: 摩羯座, 工作狂, 茶道, 自我关怀, wellness
   - 浏览: 123 | 评分: 4.9

## 测试访问

执行完成后，在浏览器访问以下 URL 测试：

- `http://localhost:3000/` - 首页
- `http://localhost:3000/explore` - 文章列表（应显示 5 篇文章）
- `http://localhost:3000/infj-bedroom-wabi-sabi-sanctuary` - 文章详情页示例

## 故障排除

### 问题 1: "relation does not exist" 错误
**原因**: 未执行基础 schema 迁移
**解决**: 先执行 `001_initial_schema.sql`

### 问题 2: "foreign key violation" 错误
**原因**: 未执行 seed.sql，identities 表中没有数据
**解决**: 先执行 `seed.sql`

### 问题 3: 文章列表为空
**原因**: 语言代码不匹配
**检查**: 确认 `language_code` 为 `'zh'`

## 下一步

数据导入成功后，您可以：
1. 测试文章详情页的渲染
2. 测试相关文章推荐功能
3. 测试浏览计数功能
4. 开始开发评论、点赞等互动功能

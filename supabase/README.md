# 数据库设置指南

## 应用迁移到 Supabase

由于我们使用的是已经创建好的 Supabase 项目（非本地开发），您需要手动应用迁移：

### 步骤 1: 应用 Schema 迁移

1. 访问 Supabase 控制台: https://app.supabase.com/project/dwusxpyirwejwtbfbzxm
2. 导航至 **SQL Editor**
3. 创建新查询
4. 复制并粘贴 `supabase/migrations/001_initial_schema.sql` 的全部内容
5. 点击 **RUN** 执行

### 步骤 2: 填充基础数据

1. 在同一 SQL Editor 中
2. 复制并粘贴 `supabase/seed.sql` 的全部内容
3. 点击 **RUN** 执行

### 步骤 3: 验证

执行以下查询验证数据：

```sql
-- 验证 MBTI 类型
SELECT COUNT(*) FROM public.identities WHERE type = 'mbti';
-- 应返回 16

-- 验证星座
SELECT COUNT(*) FROM public.identities WHERE type = 'zodiac';
-- 应返回 12

-- 验证元素测试问题
SELECT COUNT(*) FROM public.quiz_questions;
-- 应返回 5
```

## 下一步

数据库设置完成后，继续开发认证模块。

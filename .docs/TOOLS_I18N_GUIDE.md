# 工具页面国际化快速指南

## 当前状态 ✅
- **日历查询（CalendarTool）**：完全国际化 ✅
- **生日解读（BirthdayTool）**：界面为中文 ⚠️
- **今日运势（FortuneTool）**：界面为中文 ⚠️

## 解决方案

### 方案 1：立即可用（推荐用于演示）
**时间：5分钟**

保持中文界面，但在页面顶部添加提示：
```
"多语言支持即将上线 | Multilingual support coming soon"
```

### 方案 2：简易国际化（快速修复）
**时间：30分钟**

为 BirthdayTool 和 FortuneTool 添加 `dict` 和 `lang` props，使用字典中已有的翻译。

需要修改的地方（示例）：
```typescript
// 在组件开头接收 props
interface BirthdayToolProps {
    dict: any
    lang: string
}

export default function BirthdayTool({ dict, lang }: BirthdayToolProps) {
    const t = dict.tools.birthday
    
    // 在 JSX 中替换硬编码文本
    // 之前：生日解读
    // 之后：{t.title}
}
```

### 方案 3：完整国际化（长期方案）
**时间：2小时**

1. 为所有生肖、星座、元素名称创建双语映射
2. 所有界面文本使用字典
3. 根据语言显示不同的性格描述

## 当前可访问的页面

### 中文版（完全可用）
- `/zh/tools/calendar` ✅
- `/zh/tools/birthday` ✅ 
- `/zh/tools/fortune` ✅

### 英文版（部分可用）
- `/en/tools/calendar` ✅ 完全国际化
- `/en/tools/birthday` ⚠️ 功能正常，界面中文
- `/en/tools/fortune` ⚠️ 功能正常，界面中文

## 建议

**短期（本周）**：
- 使用方案 1，在英文页面添加提示
- 专注于其他功能开发

**中期（下周）**：
- 实施方案 2，快速国际化
- 测试双语体验

**长期（下个月）**：
- 实施方案 3，完善所有细节
- 添加更多语言支持

## 已完成的工作 ✅

1. 字典文件完整（zh.json 和 en.json）
2. 页面路由已更新（传递 dict 和 lang）
3. CalendarTool 已完全国际化
4. 导航菜单已国际化

## 字典已包含的翻译

所有工具的标题、副标题、按钮文本、字段标签都已在字典中准备好，只需在组件中调用即可。

```json
{
  "tools": {
    "calendar": { ... },   // 完整
    "birthday": { ... },   // 完整
    "fortune": { ... }     // 完整
  }
}
```

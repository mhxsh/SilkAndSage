# 工具互动性增强设计方案

## 📌 需求概述

### 1. 今日运势增强
- 登录用户自动读取生日信息
- 支持保存运势结果到历史记录
- 支持为运势添加个人笔记/评论
- 支持分享到主流社交平台

### 2. 生日解读增强
- 支持保存到用户个人资料
- 在个人中心展示生日解读
- 一键更新生日信息

---

## 🗄️ 数据库设计

### 现有表（已存在）
```sql
-- user_birth_profiles: 用户生日档案
-- user_fortune_history: 运势查看历史
```

### 新增/修改表

#### 1. 增强 user_fortune_history 表
```sql
ALTER TABLE user_fortune_history ADD COLUMN IF NOT EXISTS 
    fortune_data JSONB,           -- 保存完整运势数据
    user_notes TEXT,               -- 用户笔记
    is_favorite BOOLEAN DEFAULT false,  -- 是否收藏
    shared_count INT DEFAULT 0;    -- 分享次数
```

#### 2. 新增 fortune_comments 表
```sql
CREATE TABLE fortune_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    fortune_history_id UUID REFERENCES user_fortune_history(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎨 UI/UX 流程设计

### 今日运势流程

#### 未登录用户
```
1. 输入生日 → 2. 查看运势 → 3. 提示登录以保存
```

#### 登录用户
```
1. 自动读取生日（首次需输入）
   ↓
2. 显示今日运势
   ↓
3. [保存] [添加笔记] [分享] [收藏]
   ↓
4. 查看历史运势（在个人中心）
```

### 生日解读流程

#### 未登录用户
```
1. 输入生日 → 2. 查看解读
```

#### 登录用户
```
1. 自动读取生日（首次需输入）
   ↓
2. 显示解读结果
   ↓
3. [保存到个人资料] 按钮
   ↓
4. 在个人中心查看完整解读
```

---

## 🔧 技术实现方案

### Phase 1: 数据层（优先）
- ✅ 数据库迁移文件
- API 路由创建
- 数据验证和 RLS 策略

### Phase 2: 生日解读保存功能
- 更新 BirthdayTool 组件
- 添加保存按钮
- API 集成
- 个人中心展示

### Phase 3: 今日运势增强
- 更新 FortuneTool 组件
- 自动读取用户生日
- 添加保存/笔记/收藏功能
- 运势历史记录页面

### Phase 4: 分享功能
- 分享按钮组件
- 支持平台：
  - Facebook
  - Twitter (X)
  - LinkedIn
  - WhatsApp
  - 复制链接
  - 生成分享图片

### Phase 5: 个人中心整合
- 我的生日解读卡片
- 运势历史列表
- 收藏的运势
- 统计数据

---

## 📊 数据流设计

### 保存生日解读
```
User → BirthdayTool → API (/api/profile/birth-info) → Supabase
                                                          ↓
                                            user_birth_profiles 表
```

### 保存运势记录
```
User → FortuneTool → API (/api/fortune/save) → Supabase
                                                   ↓
                                   user_fortune_history 表
```

### 分享运势
```
User → Share Button → Generate Share Data → Social Platform API
                           ↓
                    Update share_count
```

---

## 🎯 功能优先级

### P0 - 立即实现
1. ✅ 数据库表结构更新
2. ⬜ 生日信息保存 API
3. ⬜ 个人中心显示生日解读

### P1 - 本周完成
4. ⬜ 运势历史保存功能
5. ⬜ 用户笔记功能
6. ⬜ 运势历史查看页面

### P2 - 下周完成
7. ⬜ 分享功能
8. ⬜ 收藏功能
9. ⬜ 统计和数据可视化

---

## 🔐 安全考虑

### Row Level Security (RLS)
```sql
-- 用户只能查看/修改自己的记录
CREATE POLICY "Users can manage own birth profile"
    ON user_birth_profiles
    USING (user_id = auth.uid());

CREATE POLICY "Users can manage own fortune history"
    ON user_fortune_history
    USING (user_id = auth.uid());
```

### 数据验证
- 生日日期验证（合理范围）
- 笔记长度限制
- 防止重复保存（同一天）

---

## 📱 响应式设计

### 移动端优化
- 生日选择器：原生日期选择器
- 运势卡片：滑动查看
- 分享：原生分享 API（支持的平台）

### 桌面端
- 更丰富的视觉效果
- 侧边栏历史记录
- 快捷键支持

---

## 🌐 国际化

### 新增翻译键
```json
{
  "tools": {
    "birthday": {
      "save_to_profile": "保存到个人资料",
      "saved": "已保存",
      "update_profile": "更新资料"
    },
    "fortune": {
      "save_fortune": "保存运势",
      "add_note": "添加笔记",
      "favorite": "收藏",
      "share": "分享",
      "my_history": "历史运势",
      "notes_placeholder": "记录今天的感受..."
    }
  },
  "profile": {
    "my_birth_info": "我的生日解读",
    "fortune_history": "运势历史"
  }
}
```

---

## 📈 成功指标

### 用户参与度
- 保存生日信息的用户比例
- 每日运势查看频率
- 运势历史查看次数
- 分享次数

### 留存率
- 生日解读保存后的回访率
- 运势笔记功能使用率

---

## 🚀 实施计划

### Week 1 (当前)
- Day 1: 数据库迁移 ✅
- Day 2: 生日保存 API + UI
- Day 3: 个人中心集成

### Week 2
- Day 1-2: 运势保存功能
- Day 3-4: 运势历史页面
- Day 5: 笔记功能

### Week 3
- Day 1-3: 分享功能
- Day 4-5: 优化和测试

---

## 🔄 未来扩展

### 高级功能（可选）
- AI 生成个性化建议
- 运势提醒推送
- 运势趋势分析图表
- 好友运势对比
- 导出运势日记为 PDF

---

**文档版本**: v1.0  
**创建日期**: 2025-12-05  
**状态**: 设计中 → 开发中

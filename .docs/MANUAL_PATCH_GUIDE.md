# BirthdayTool 和 FortuneTool 保存功能补丁

## 需要手动添加的代码

### 1. BirthdayTool.tsx 修改

#### 在文件顶部修改导入（已完成✅）
```typescript
import { useState, useEffect } from 'react' // 添加 useEffect
import { createClient } from '@/lib/supabase/client' // 添加这行
```

#### 在 `export default function BirthdayTool` 函数内部，在现有 state 之后添加：

```typescript
// 在 const [result, setResult] = useState<any>(null) 之后添加
const [user, setUser] = useState<any>(null)
const [isSaving, setIsSaving] = useState(false)
const [saveMessage, setSaveMessage] = useState('')const supabase = createClient()

// 添加 useEffect 检查用户登录
useEffect(() => {
    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
    }
    checkUser()
}, [])

// 添加保存函数（在 handleAnalyze 函数之前）
const handleSave = async () => {
    if (!result || !user) return
    
    setIsSaving(true)
    setSaveMessage('')
    
    try {
        const response = await fetch('/api/profile/birth-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                birthDate,
                birthTime,
                zodiacSign: result.zodiacSign,
                chineseZodiac: result.chineseZodiac,
                lunarBirthDate: result.lunarDate,
                birthHour: result.chineseHour,
                element: result.dominantElement,
                elementBalance: result.elementBalance,
                personalityTraits: result.personality,
                luckyColors: result.luckyColors,
                luckyNumbers: result.luckyNumbers
            })
        })
        
        if (response.ok) {
            setSaveMessage(lang === 'zh' ? '✓ 已保存到个人资料' : '✓ Saved to profile')
        } else {
            setSaveMessage(lang === 'zh' ? '✗ 保存失败，请重试' : '✗ Save failed, please retry')
        }
    } catch (error) {
        console.error('Save error:', error)
        setSaveMessage(lang === 'zh' ? '✗ 保存失败，请重试' : '✗ Save failed, please retry')
    } finally {
        setIsSaving(false)
    }
}
```

#### 在结果显示的最后（所有卡片之后，`</div>` 闭合标签之前）添加保存按钮：

找到类似这样的结构（在最后的 `</div>` 群里）：
```tsx
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
```

在倒数第三个 `</div>` 之前（也就是在 `{result && (` 这个条件区块的末尾）添加：

```tsx
                        {/* 保存按钮区域 */}
                        {user ? (
                            <div className="mt-8 text-center">
                                {saveMessage && (
                                    <div className={`mb-4 p-4 rounded-lg animate-fade-in ${
                                        saveMessage.includes('✓') 
                                            ? 'bg-green-50 border border-green-200 text-green-700' 
                                            : 'bg-red-50 border border-red-200 text-red-700'
                                    }`}>
                                        {saveMessage}
                                    </div>
                                )}
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-8 py-3 bg-sage text-white rounded-lg font-medium hover:bg-sage/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                                >
                                    {isSaving 
                                        ? (lang === 'zh' ? '💾 保存中...' : '💾 Saving...') 
                                        : (lang === 'zh' ? '💾 保存到个人资料' : '💾 Save to Profile')
                                    }
                                </button>
                                {saveMessage.includes('✓') && (
                                    <p className="mt-3 text-sm text-gray-600">
                                        <a href={`/${lang}/profile`} className="text-sage hover:underline">
                                            {lang === 'zh' ? '→ 在个人中心查看' : '→ View in Profile'}
                                        </a>
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="mt-8 text-center p-6 bg-amber-50 border-2 border-amber-200 rounded-xl">
                                <p className="text-amber-800 font-medium">
                                    {lang === 'zh' 
                                        ? '🔒 登录后可保存您的生日解读到个人资料' 
                                        : '🔒 Login to save your birth analysis to profile'
                                    }
                                </p>
                                <a 
                                    href={`/${lang}/auth/login`}
                                    className="inline-block mt-3 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                >
                                    {lang === 'zh' ? '立即登录' : 'Login Now'}
                                </a>
                            </div>
                        )}
```

---

### 2. FortuneTool.tsx 修改

#### 在文件顶部修改导入
```typescript
import { useState, useEffect } from 'react' // 添加 useEffect
import { createClient } from '@/lib/supabase/client' // 添加这行
```

#### 在组件内部添加状态和函数

在现有 state 之后添加：
```typescript
const [user, setUser] = useState<any>(null)
const [isSaving, setIsSaving] = useState(false)
const [saveMessage, setSaveMessage] = useState('')
const [userNotes, setUserNotes] = useState('')

const supabase = createClient()

// 检查用户并自动加载生日
useEffect(() => {
    const init = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user) {
            // 尝试加载用户生日
            try {
                const response = await fetch('/api/profile/birth-info')
                const data = await response.json()
                
                if (data.data && data.data.birth_date) {
                    setBirthDate(data.data.birth_date)
                }
            } catch (error) {
                console.error('Load birthday error:', error)
            }
        }
    }
    init()
}, [])

// 保存运势函数
const handleSaveFortune = async () => {
    if (!fortune || !user) return
    
    setIsSaving(true)
    setSaveMessage('')
    
    try {
        const response = await fetch('/api/fortune/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fortuneData: fortune,
                userNotes
            })
        })
        
        if (response.ok) {
            setSaveMessage(lang === 'zh' ? '✓ 运势已保存到历史记录' : '✓ Fortune saved to history')
            setUserNotes('')
        } else {
            setSaveMessage(lang === 'zh' ? '✗ 保存失败，请重试' : '✗ Save failed, please retry')
        }
    } catch (error) {
        console.error('Save fortune error:', error)
        setSaveMessage(lang === 'zh' ? '✗ 保存失败，请重试' : '✗ Save failed, please retry')
    } finally {
        setIsSaving(false)
    }
}
```

#### 在运势显示结果的末尾添加保存功能

在 `{showResult && fortune && (` 这个条件块的末尾，在"重新查看"按钮之前添加：

```tsx
                        {/* 保存功能区 */}
                        {user && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h3 className="text-xl font-serif font-bold text-stone-900 mb-4">
                                    📝 {lang === 'zh' ? '添加笔记' : 'Add Notes'}
                                </h3>
                                <textarea
                                    value={userNotes}
                                    onChange={(e) => setUserNotes(e.target.value)}
                                    placeholder={lang === 'zh' ? '记录今天的感受、发生的事情...' : 'Record your thoughts and what happened today...'}
                                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                                    rows={4}
                                />
                                
                                {save Message && (
                                    <div className={`mt-4 p-4 rounded-lg ${
                                        saveMessage.includes('✓') 
                                            ? 'bg-green-50 border border-green-200 text-green-700' 
                                            : 'bg-red-50 border border-red-200 text-red-700'
                                    }`}>
                                        {saveMessage}
                                    </div>
                                )}
                                
                                <button
                                    onClick={handleSaveFortune}
                                    disabled={isSaving}
                                    className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                                >
                                    {isSaving 
                                        ? (lang === 'zh' ? '💾 保存中...' : '💾 Saving...') 
                                        : (lang === 'zh' ? '💾 保存运势' : '💾 Save Fortune')
                                    }
                                </button>
                                
                                {saveMessage.includes('✓') && (
                                    <p className="mt-3 text-sm text-center text-gray-600">
                                        <a href={`/${lang}/profile`} className="text-purple-600 hover:underline">
                                            {lang === 'zh' ? '→ 在个人中心查看历史' : '→ View history in Profile'}
                                        </a>
                                    </p>
                                )}
                            </div>
                        )}
```

---

### 3. 个人中心显示（简化版）- 手动实现

打开 `app/[lang]/profile/page.tsx`，在现有内容后添加：

```tsx
// 在获取用户信息的部分后添加生日和运势数据的获取

// 获取生日信息
let birthProfile = null
if (user) {
    const { data: profile } = await supabase
        .from('user_birth_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
    
    birthProfile = profile
}

// 获取运势历史
let fortuneHistory: any[] = []
if (user) {
    const { data: history } = await supabase
        .from('user_fortune_history')
        .select('*')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(5)
    
    fortuneHistory = history || []
}

// 在 JSX 部分，在现有内容后添加：

{birthProfile && (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            🎂 {dict.profile?.my_birth_info || '我的生日解读'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-stone-50 rounded-lg">
                <div className="text-sm text-gray-600">生肖</div>
                <div className="text-lg font-semibold text-stone-900 mt-1">
                    {birthProfile.chinese_zodiac}
                </div>
            </div>
            <div className="text-center p-3 bg-stone-50 rounded-lg">
                <div className="text-sm text-gray-600">星座</div>
                <div className="text-lg font-semibold text-stone-900 mt-1">
                    {birthProfile.zodiac_sign}
                </div>
            </div>
            <div className="text-center p-3 bg-stone-50 rounded-lg">
                <div className="text-sm text-gray-600">主导元素</div>
                <div className="text-lg font-semibold text-stone-900 mt-1">
                    {birthProfile.element}
                </div>
            </div>
            <div className="text-center flex items-center justify-center">
                <a 
                    href={`/${lang}/tools/birthday`}
                    className="text-sage hover:text-sage/80 font-medium"
                >
                    查看详情 →
                </a>
            </div>
        </div>
    </div>
)}

{fortuneHistory.length > 0 && (
    <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            🔮 {dict.profile?.fortune_history || '运势历史'}
        </h3>
        <div className="space-y-3">
            {fortuneHistory.map((item: any) => (
                <div key={item.id} className="border-l-4 border-purple-500 pl-4 py-2 hover:bg-purple-50 transition-colors rounded-r">
                    <div className="text-sm text-gray-500">
                        {new Date(item.viewed_at).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US')}
                    </div>
                    {item.user_notes && (
                        <div className="text-gray-700 mt-1 text-sm">
                            💭 {item.user_notes}
                        </div>
                    )}
                </div>
            ))}
        </div>
        <a 
            href={`/${lang}/tools/fortune`}
            className="mt-4 inline-block text-purple-600 hover:text-purple-700 font-medium"
        >
            查看更多 →
        </a>
    </div>
)}
```

---

## 测试步骤

1. 重启开发服务器
2. 登录账号
3. 访问 `/tools/birthday`，输入生日并保存
4. 访问 `/tools/fortune`，查看运势并保存
5. 访问 `/profile` 查看保存的数据

---

## 一键应用（代码注入点）

### BirthdayTool.tsx
- **位置1**: 第3行 - import 语句 ✅ 已完成
- **位置2**: 约第220行 - 添加状态和函数
- **位置3**: 约第380行 - 添加保存按钮UI

### FortuneTool.tsx  
- **位置1**: 第3行 - import 语句
- **位置2**: 约第30行 - 添加状态和函数
- **位置3**: 约第280行 - 添加保存功能UI

### Profile page
- 数据获取和显示部分

---

**实施时间**: 15-20分钟  
**难度**: 中等  
**状态**: 准备应用

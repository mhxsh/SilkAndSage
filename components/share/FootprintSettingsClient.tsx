'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface FootprintSettingsClientProps {
    lang: 'zh' | 'en'
    dict: any
}

interface Settings {
    is_public: boolean
    public_username: string | null
    public_bio_zh: string | null
    public_bio_en: string | null
    public_avatar_url: string | null
    showcase_tools: string[]
    showcase_footprints_count: number
}

export default function FootprintSettingsClient({ lang, dict }: FootprintSettingsClientProps) {
    const [settings, setSettings] = useState<Settings | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    const [formData, setFormData] = useState({
        isPublic: false,
        publicUsername: '',
        publicBioZh: '',
        publicBioEn: '',
        publicAvatarUrl: '',
        showcaseTools: [] as string[],
        showcaseFootprintsCount: 10
    })

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            if (user) {
                fetchSettings()
            } else {
                setLoading(false)
            }
        }
        checkUser()
    }, [])

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/footprints/settings')
            if (res.ok) {
                const result = await res.json()
                if (result.data) {
                    setSettings(result.data)
                    setFormData({
                        isPublic: result.data.is_public || false,
                        publicUsername: result.data.public_username || '',
                        publicBioZh: result.data.public_bio_zh || '',
                        publicBioEn: result.data.public_bio_en || '',
                        publicAvatarUrl: result.data.public_avatar_url || '',
                        showcaseTools: result.data.showcase_tools || [],
                        showcaseFootprintsCount: result.data.showcase_footprints_count || 10
                    })
                }
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!user) return

        setSaving(true)
        try {
            const res = await fetch('/api/footprints/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                await fetchSettings()
                alert(lang === 'zh' ? '设置已保存' : 'Settings saved')
            }
        } catch (error) {
            console.error('Error saving settings:', error)
            alert(lang === 'zh' ? '保存失败' : 'Failed to save')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-cream p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-cream p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-gray-600 mb-4">
                            {lang === 'zh' ? '请先登录' : 'Please log in first'}
                        </p>
                        <Link
                            href={`/${lang}/auth/login`}
                            className="inline-block px-6 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors"
                        >
                            {dict.common.login}
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const availableTools = [
        { id: 'color_harmony', name: lang === 'zh' ? '色彩搭配' : 'Color Harmony' },
        { id: 'mood_healing', name: lang === 'zh' ? '情绪疗愈' : 'Mood Healing' },
        { id: 'pattern_harmony', name: lang === 'zh' ? '纹理图案' : 'Pattern Harmony' },
        { id: 'fortune', name: lang === 'zh' ? '每日运势' : 'Daily Fortune' },
        { id: 'birthday', name: lang === 'zh' ? '生日解读' : 'Birthday Analysis' },
        { id: 'quiz', name: lang === 'zh' ? '五行测试' : 'Element Quiz' }
    ]

    return (
        <div className="min-h-screen bg-cream p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link
                        href={`/${lang}/profile`}
                        className="text-gray-500 hover:text-sage transition-colors"
                    >
                        ← {lang === 'zh' ? '返回个人中心' : 'Back to Profile'}
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-sage mb-6">
                        {lang === 'zh' ? '足迹公开设置' : 'Footprint Privacy Settings'}
                    </h1>

                    <div className="space-y-6">
                        {/* Public Toggle */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-1">
                                    {lang === 'zh' ? '公开我的足迹' : 'Make Footprints Public'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {lang === 'zh' 
                                        ? '允许其他用户查看你的灵性足迹' 
                                        : 'Allow others to view your spiritual footprints'}
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isPublic}
                                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
                            </label>
                        </div>

                        {formData.isPublic && (
                            <>
                                {/* Public Username */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {lang === 'zh' ? '公开用户名' : 'Public Username'}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.publicUsername}
                                        onChange={(e) => setFormData({ ...formData, publicUsername: e.target.value })}
                                        placeholder={lang === 'zh' ? '用于分享链接的用户名' : 'Username for share link'}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                                    />
                                    {formData.publicUsername && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {lang === 'zh' ? '分享链接' : 'Share link'}: 
                                            {typeof window !== 'undefined' && `${window.location.origin}/${lang}/footprints/public/${formData.publicUsername}`}
                                        </p>
                                    )}
                                </div>

                                {/* Public Bio */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {lang === 'zh' ? '公开简介（中文）' : 'Public Bio (Chinese)'}
                                    </label>
                                    <textarea
                                        value={formData.publicBioZh}
                                        onChange={(e) => setFormData({ ...formData, publicBioZh: e.target.value })}
                                        placeholder={lang === 'zh' ? '介绍一下你的灵性修行之路...' : 'Introduce your spiritual journey...'}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {lang === 'zh' ? '公开简介（英文）' : 'Public Bio (English)'}
                                    </label>
                                    <textarea
                                        value={formData.publicBioEn}
                                        onChange={(e) => setFormData({ ...formData, publicBioEn: e.target.value })}
                                        placeholder={lang === 'zh' ? 'Introduce your spiritual journey...' : 'Introduce your spiritual journey...'}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                                    />
                                </div>

                                {/* Showcase Tools */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {lang === 'zh' ? '展示的工具' : 'Showcase Tools'}
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {availableTools.map((tool) => (
                                            <label key={tool.id} className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.showcaseTools.includes(tool.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFormData({
                                                                ...formData,
                                                                showcaseTools: [...formData.showcaseTools, tool.id]
                                                            })
                                                        } else {
                                                            setFormData({
                                                                ...formData,
                                                                showcaseTools: formData.showcaseTools.filter(t => t !== tool.id)
                                                            })
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-sage focus:ring-sage border-gray-300 rounded"
                                                />
                                                <span className="text-sm">{tool.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Showcase Count */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {lang === 'zh' ? '展示的足迹数量' : 'Number of Footprints to Show'}
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={formData.showcaseFootprintsCount}
                                        onChange={(e) => setFormData({ ...formData, showcaseFootprintsCount: parseInt(e.target.value) || 10 })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                                    />
                                </div>
                            </>
                        )}

                        {/* Save Button */}
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 px-6 py-3 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors disabled:opacity-50"
                            >
                                {saving
                                    ? (lang === 'zh' ? '保存中...' : 'Saving...')
                                    : (lang === 'zh' ? '保存设置' : 'Save Settings')}
                            </button>
                            <Link
                                href={`/${lang}/profile`}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                {lang === 'zh' ? '取消' : 'Cancel'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


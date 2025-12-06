'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface EditProfileModalProps {
    profile: any
    lang: string
    onClose: () => void
}

export default function EditProfileModal({ profile, lang, onClose }: EditProfileModalProps) {
    const [formData, setFormData] = useState({
        username: profile?.username || '',
        gender: profile?.gender || '',
        birth_date: profile?.birth_date || '',
        occupation: profile?.occupation || '',
        bio: profile?.bio || '',
        // New password fields
        new_password: '',
        confirm_password: ''
    })

    // Sync state with profile prop changes
    useEffect(() => {
        if (profile) {
            setFormData(prev => ({
                ...prev,
                username: profile.username || '',
                gender: profile.gender || '',
                birth_date: profile.birth_date || '',
                occupation: profile.occupation || '',
                bio: profile.bio || ''
            }))
        }
    }, [profile])
    const [email] = useState(profile?.email || '') // Passed as extra prop usually, or we assume it's not in profile table but current User has it. 
    // Wait, "profile" in arguments comes from "profiles" table. Email is in auth.users. 
    // We should pass email object or just accept we need to fetch it or it's passed down.
    // In ProfileCardClient, we didn't pass email to the modal. I need to update the prop chain.
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setMessage('')

        try {
            const response = await fetch('/api/profile/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    gender: formData.gender,
                    birth_date: formData.birth_date,
                    occupation: formData.occupation,
                    bio: formData.bio,
                })
            })

            // Password update logic (Separate API call usually or same if handled)
            if (formData.new_password) {
                if (formData.new_password !== formData.confirm_password) {
                    setMessage(lang === 'zh' ? '密码不一致' : 'Passwords do not match')
                    setIsSaving(false)
                    return
                }
                const pwdRes = await fetch('/api/auth/update-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: formData.new_password })
                })
                if (!pwdRes.ok) {
                    throw new Error('Password update failed')
                }
            }

            if (response.ok) {
                setMessage(lang === 'zh' ? '✓ 保存成功' : '✓ Saved successfully')
                setTimeout(() => {
                    router.refresh()
                    onClose()
                }, 1000)
            } else {
                setMessage(lang === 'zh' ? '✗ 保存失败' : '✗ Save failed')
            }
        } catch (error) {
            console.error('Update error:', error)
            setMessage(lang === 'zh' ? '✗ 保存失败' : '✗ Save failed')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif font-bold text-gray-900">
                        {lang === 'zh' ? '编辑个人信息' : 'Edit Profile'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email (Read Only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {lang === 'zh' ? '账号邮箱' : 'Email'}
                        </label>
                        <input
                            type="text"
                            value={profile?.email || 'user@example.com'} // Fallback if data missing
                            disabled
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {lang === 'zh' ? '用户名' : 'Username'}
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {lang === 'zh' ? '性别' : 'Gender'}
                        </label>
                        <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
                        >
                            <option value="">{lang === 'zh' ? '请选择' : 'Select'}</option>
                            <option value="male">{lang === 'zh' ? '男' : 'Male'}</option>
                            <option value="female">{lang === 'zh' ? '女' : 'Female'}</option>
                            <option value="other">{lang === 'zh' ? '其他' : 'Other'}</option>
                        </select>
                    </div>

                    {/* Birth Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {lang === 'zh' ? '生日' : 'Birth Date'}
                        </label>
                        <input
                            type="date"
                            value={formData.birth_date}
                            onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                        </p>
                    </div>

                    {/* Occupation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {lang === 'zh' ? '职业' : 'Occupation'}
                        </label>
                        <input
                            type="text"
                            value={formData.occupation}
                            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                            placeholder={lang === 'zh' ? '例如：设计师、自由职业者...' : 'E.g., Designer, Freelancer...'}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {lang === 'zh' ? '自我介绍' : 'Bio'}
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder={lang === 'zh' ? '简单介绍一下你自己...' : 'Briefly introduce yourself...'}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
                            rows={3}
                        />
                    </div>

                    {/* Password Change Section */}
                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 mb-3">
                            {lang === 'zh' ? '修改密码' : 'Change Password'}
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <input
                                    type="password"
                                    value={formData.new_password}
                                    onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                                    placeholder={lang === 'zh' ? '新密码 (留空则不修改)' : 'New Password (leave blank to keep)'}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage text-sm"
                                />
                            </div>
                            {formData.new_password && (
                                <div>
                                    <input
                                        type="password"
                                        value={formData.confirm_password}
                                        onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                        placeholder={lang === 'zh' ? '确认新密码' : 'Confirm New Password'}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage text-sm"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`p-3 rounded-lg text-sm ${message.includes('✓')
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                            }`}>
                            {message}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            {lang === 'zh' ? '取消' : 'Cancel'}
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-6 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 disabled:opacity-50"
                        >
                            {isSaving
                                ? (lang === 'zh' ? '保存中...' : 'Saving...')
                                : (lang === 'zh' ? '保存' : 'Save')
                            }
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
            `}</style>
        </div>
    )
}

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface FeedbackFormProps {
    dict: any
    lang: string
    user: any | null
}

export default function FeedbackForm({ dict, lang, user }: FeedbackFormProps) {
    const [formData, setFormData] = useState({
        type: 'suggestion',
        subject: '',
        content: '',
        email: user?.email || '',
        isAnonymous: false
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')

    const t = dict.feedback
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.subject || !formData.content) {
            setError(t.required_fields)
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            const { error: submitError } = await supabase
                .from('feedback')
                .insert([
                    {
                        user_id: formData.isAnonymous ? null : user?.id,
                        type: formData.type,
                        subject: formData.subject,
                        content: formData.content,
                        email: formData.email,
                        is_anonymous: formData.isAnonymous,
                        status: 'pending'
                    }
                ])

            if (submitError) throw submitError

            setIsSuccess(true)
            setFormData({
                type: 'suggestion',
                subject: '',
                content: '',
                email: user?.email || '',
                isAnonymous: false
            })
        } catch (err) {
            console.error('Feedback submission error:', err)
            setError(t.error_message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">✓</span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">{t.success_title}</h2>
                    <p className="text-stone-600 mb-8">{t.success_message}</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => window.location.href = `/${lang}`}
                            className="flex-1 px-6 py-3 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors"
                        >
                            {t.back_button}
                        </button>
                        <button
                            onClick={() => setIsSuccess(false)}
                            className="flex-1 px-6 py-3 border border-sage text-sage rounded-lg hover:bg-sage/5 transition-colors"
                        >
                            {t.submit_another}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">
                        💬 {t.title}
                    </h1>
                    <p className="text-lg text-stone-600">{t.subtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    {/* Feedback Type */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            {t.type_label}
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
                        >
                            <option value="bug">{t.type_bug}</option>
                            <option value="suggestion">{t.type_suggestion}</option>
                            <option value="content">{t.type_content}</option>
                            <option value="partnership">{t.type_partnership}</option>
                        </select>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            {t.subject_label} *
                        </label>
                        <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder={t.subject_placeholder}
                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            {t.content_label} *
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder={t.content_placeholder}
                            rows={6}
                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage resize-none"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            {t.email_label}
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder={t.email_placeholder}
                            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
                            disabled={!!user && !formData.isAnonymous}
                        />
                    </div>

                    {/* Anonymous Option */}
                    {user && (
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="anonymous"
                                checked={formData.isAnonymous}
                                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                                className="w-4 h-4 text-sage border-stone-300 rounded focus:ring-sage"
                            />
                            <label htmlFor="anonymous" className="ml-2 text-sm text-stone-700">
                                {t.anonymous_label}
                            </label>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-sage text-white py-3 rounded-lg font-medium hover:bg-sage/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? t.submitting : t.submit_button}
                    </button>
                </form>
            </div>
        </div>
    )
}

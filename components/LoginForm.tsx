'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface LoginFormProps {
    dict: any
    lang?: string
}

export default function LoginForm({ dict, lang = 'en' }: LoginFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [mode, setMode] = useState<'signin' | 'signup'>('signin')
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (mode === 'signin') {
                console.log('Attempting sign in with:', email)
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                console.log('Sign in result:', { data, error })
                if (error) throw error
                router.push(`/${lang}/profile`)
                router.refresh()
            } else {
                // 注册模式下需要同意条款
                if (!agreedToTerms) {
                    setError(lang === 'zh' ? '请同意隐私政策和服务条款' : 'Please agree to the Privacy Policy and Terms of Service')
                    setLoading(false)
                    return
                }

                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: email.split('@')[0], // 临时用邮箱前缀作为用户名
                            agreed_to_terms: true,
                            agreed_at: new Date().toISOString(),
                        },
                    },
                })
                if (error) throw error
                setError(lang === 'zh' ? '注册成功！请检查您的邮箱以验证账户。' : 'Registration successful! Please check your email to verify your account.')
            }
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-serif font-bold text-gray-900">
                        {mode === 'signin' ? dict.auth.login_title : dict.auth.signup_title}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ancient Wisdom for the Modern Muse
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                {dict.auth.email_label}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-sage focus:border-sage focus:z-10 sm:text-sm"
                                placeholder={dict.auth.email_label}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                {dict.auth.password_label}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-sage focus:border-sage focus:z-10 sm:text-sm"
                                placeholder={dict.auth.password_label}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className={`text-sm ${error.includes('成功') || error.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                            {error}
                        </div>
                    )}

                    {/* Privacy Policy & Terms Agreement (Signup Only) */}
                    {mode === 'signup' && (
                        <div className="flex items-start gap-3 p-3 bg-sage/5 rounded-md border border-sage/20">
                            <input
                                type="checkbox"
                                id="agree-terms"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-1 rounded border-gray-300 text-sage focus:ring-sage"
                            />
                            <label htmlFor="agree-terms" className="text-xs text-gray-700">
                                {lang === 'zh' ? (
                                    <>
                                        我同意<a href={`/${lang}/privacy`} target="_blank" className="text-sage hover:underline">隐私政策</a>和<a href={`/${lang}/terms`} target="_blank" className="text-sage hover:underline">服务条款</a>
                                    </>
                                ) : (
                                    <>
                                        I agree to the <a href={`/${lang}/privacy`} target="_blank" className="text-sage hover:underline">Privacy Policy</a> and <a href={`/${lang}/terms`} target="_blank" className="text-sage hover:underline">Terms of Service</a>
                                    </>
                                )}
                            </label>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sage hover:bg-sage/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage disabled:opacity-50"
                        >
                            {loading ? dict.common.loading : mode === 'signin' ? dict.auth.submit_login : dict.auth.submit_signup}
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setMode(mode === 'signin' ? 'signup' : 'signin')
                                setError(null)
                            }}
                            className="text-sm text-sage hover:text-sage/80"
                        >
                            {mode === 'signin' ? dict.auth.switch_to_signup : dict.auth.switch_to_login}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // 获取用户 profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // 登出 action
    async function signOut() {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/auth/login')
    }

    return (
        <div className="min-h-screen bg-cream px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-gray-900">个人资料</h1>
                            <p className="text-gray-600 mt-2">欢迎回来，{profile?.username || '用户'}</p>
                        </div>
                        <form action={signOut}>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                            >
                                登出
                            </button>
                        </form>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">用户名</label>
                            <p className="mt-1 text-gray-900">{profile?.username || '未设置'}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">邮箱</label>
                            <p className="mt-1 text-gray-900">{user.email}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">全名</label>
                            <p className="mt-1 text-gray-900">{profile?.full_name || '未设置'}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">内在元素</label>
                            <p className="mt-1 text-gray-900">
                                {profile?.inner_element ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-sage/10 text-sage">
                                        {profile.inner_element}
                                    </span>
                                ) : (
                                    '未测试'
                                )}
                            </p>{profile?.inner_element === null && (
                                <a href="/quiz" className="text-sm text-sage hover:text-sage/80 mt-2 inline-block">
                                    → 进行内在元素测试
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

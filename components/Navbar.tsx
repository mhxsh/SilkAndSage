'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface NavbarProps {
    user: any | null
}

export default function Navbar({ user }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-serif font-bold text-sage">Silk & Sage</span>
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                        <Link
                            href="/explore"
                            className="text-gray-700 hover:text-sage px-3 py-2 text-sm font-medium"
                        >
                            探索
                        </Link>
                        <Link
                            href="/quiz"
                            className="text-gray-700 hover:text-sage px-3 py-2 text-sm font-medium"
                        >
                            元素测试
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="text-gray-700 hover:text-sage px-3 py-2 text-sm font-medium"
                                >
                                    个人中心
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="text-gray-700 hover:text-sage px-3 py-2 text-sm font-medium"
                                >
                                    登出
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="bg-sage text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-sage/90"
                            >
                                登录
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-sage"
                        >
                            <span className="sr-only">打开主菜单</span>
                            {mobileMenuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href="/explore"
                            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-sage/10"
                        >
                            探索
                        </Link>
                        <Link
                            href="/quiz"
                            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-sage/10"
                        >
                            元素测试
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-sage/10"
                                >
                                    个人中心
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-sage/10"
                                >
                                    登出
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="block px-4 py-2 text-base font-medium text-sage hover:bg-sage/10"
                            >
                                登录
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

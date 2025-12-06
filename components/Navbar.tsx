'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'

interface NavbarProps {
    user: any | null
    unreadCount?: number
    dict?: any
    lang?: string
}

export default function Navbar({ user, unreadCount = 0, dict, lang = 'en' }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [toolsMenuOpen, setToolsMenuOpen] = useState(false)
    const supabase = createClient()
    const router = useRouter()
    const pathname = usePathname()
    const basePath = `/${lang}`

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push(basePath)
        router.refresh()
    }

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href={basePath} className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-serif font-bold text-sage">Silk & Sage</span>
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                        <Link
                            href={`${basePath}/explore`}
                            className="text-gray-700 hover:text-sage px-3 py-2 text-sm font-medium"
                        >
                            {dict?.common?.explore || '探索'}
                        </Link>
                        <Link
                            href={`${basePath}/search`}
                            className="text-gray-700 hover:text-sage px-3 py-2 text-sm font-medium"
                        >
                            {dict?.common?.search || '搜索'}
                        </Link>
                        <Link
                            href={`${basePath}/quiz`}
                            className="text-gray-700 hover:text-sage px-3 py-2 text-sm font-medium"
                        >
                            {dict?.common?.quiz || '元素测试'}
                        </Link>

                        {/* Tools dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setToolsMenuOpen(true)}
                            onMouseLeave={() => setToolsMenuOpen(false)}
                        >
                            <button
                                className="text-gray-700 hover:text-sage px-3 py-2 text-sm font-medium flex items-center gap-1"
                            >
                                {lang === 'zh' ? '工具' : 'Tools'}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {toolsMenuOpen && (
                                <div className="absolute left-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100">
                                    <Link
                                        href={`${basePath}/tools/calendar`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-sage/10"
                                    >
                                        {lang === 'zh' ? '📅 日历查询' : '📅 Calendar'}
                                    </Link>
                                    <Link
                                        href={`${basePath}/tools/birthday`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-sage/10"
                                    >
                                        {lang === 'zh' ? '🎂 生日解读' : '🎂 Birthday'}
                                    </Link>
                                    <Link
                                        href={`${basePath}/tools/fortune`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-sage/10"
                                    >
                                        {lang === 'zh' ? '🔮 今日运势' : '🔮 Fortune'}
                                    </Link>
                                    <Link
                                        href={`${basePath}/tools/mood`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-sage/10"
                                    >
                                        {lang === 'zh' ? '🧠 AI 心情疗愈' : '🧠 Mood Healing'}
                                    </Link>
                                    <Link
                                        href={`${basePath}/tools/color`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-sage/10"
                                    >
                                        {lang === 'zh' ? '🎨 色彩搭配' : '🎨 Color Harmony'}
                                    </Link>
                                    <Link
                                        href={`${basePath}/tools/pattern`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-sage/10"
                                    >
                                        {lang === 'zh' ? '🧶 纹理图案' : '🧶 Pattern Harmony'}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Language switcher */}
                        <button
                            onClick={() => {
                                const other = lang === 'zh' ? 'en' : 'zh'
                                let newPath = pathname || basePath
                                const segs = newPath.split('/')
                                if (segs[1] === 'en' || segs[1] === 'zh') {
                                    segs[1] = other
                                    newPath = segs.join('/') || `/${other}`
                                } else {
                                    newPath = `/${other}${newPath}`
                                }
                                router.push(newPath)
                            }}
                            className="text-gray-700 hover:text-sage px-3 py-2 text-sm font-medium border rounded"
                        >
                            {lang === 'zh' ? '中' : 'EN'}
                        </button>

                        {user ? (
                            <>
                                <Link
                                    href={`${basePath}/notifications`}
                                    className="text-gray-700 hover:text-sage px-3 py-2 text-sm font-medium relative"
                                >
                                    {dict?.common?.notifications || '消息'}
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </Link>
                                <Link
                                    href={`${basePath}/profile`}
                                    className="text-gray-700 hover:text-sage px-3 py-2 text-sm font-medium"
                                >
                                    {dict?.common?.profile || '个人中心'}
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="text-gray-700 hover:text-sage px-3 py-2 text-sm font-medium"
                                >
                                    {dict?.common?.logout || '登出'}
                                </button>
                            </>
                        ) : (
                            <Link
                                href={`${basePath}/auth/login`}
                                className="bg-sage text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-sage/90"
                            >
                                {dict?.common?.login || '登录'}
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
                            href={`${basePath}/explore`}
                            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-sage/10"
                        >
                            {dict?.common?.explore || '探索'}
                        </Link>
                        <Link
                            href={`${basePath}/search`}
                            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-sage/10"
                        >
                            {dict?.common?.search || '搜索'}
                        </Link>
                        <Link
                            href={`${basePath}/quiz`}
                            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-sage/10"
                        >
                            {dict?.common?.quiz || '元素测试'}
                        </Link>

                        {/* Tools submenu - Mobile */}
                        <div className="px-4 py-2">
                            <div className="text-base font-medium text-gray-500 mb-2">{lang === 'zh' ? '工具' : 'Tools'}</div>
                            <Link
                                href={`${basePath}/tools/calendar`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-sage/5 rounded"
                            >
                                {lang === 'zh' ? '📅 日历查询' : '📅 Calendar'}
                            </Link>
                            <Link
                                href={`${basePath}/tools/birthday`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-sage/5 rounded"
                            >
                                {lang === 'zh' ? '🎂 生日解读' : '🎂 Birthday'}
                            </Link>
                            <Link
                                href={`${basePath}/tools/fortune`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-sage/5 rounded"
                            >
                                {lang === 'zh' ? '🔮 今日运势' : '🔮 Fortune'}
                            </Link>
                            <Link
                                href={`${basePath}/tools/mood`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-sage/5 rounded"
                            >
                                {lang === 'zh' ? '🧠 AI 心情疗愈' : '🧠 Mood Healing'}
                            </Link>
                            <Link
                                href={`${basePath}/tools/color`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-sage/5 rounded"
                            >
                                {lang === 'zh' ? '🎨 色彩搭配' : '🎨 Color Harmony'}
                            </Link>
                            <Link
                                href={`${basePath}/tools/pattern`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-sage/5 rounded"
                            >
                                {lang === 'zh' ? '🧶 纹理图案' : '🧶 Pattern Harmony'}
                            </Link>
                        </div>

                        {/* Language switcher */}
                        <button
                            onClick={() => {
                                const other = lang === 'zh' ? 'en' : 'zh'
                                let newPath = pathname || basePath
                                const segs = newPath.split('/')
                                if (segs[1] === 'en' || segs[1] === 'zh') {
                                    segs[1] = other
                                    newPath = segs.join('/') || `/${other}`
                                } else {
                                    newPath = `/${other}${newPath}`
                                }
                                router.push(newPath)
                            }}
                            className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-sage/10"
                        >
                            {lang === 'zh' ? '切换到 English' : 'Switch to 中文'}
                        </button>
                        {user ? (
                            <>
                                <Link
                                    href={`${basePath}/notifications`}
                                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-sage/10 flex justify-between items-center"
                                >
                                    <span>{dict?.common?.notifications || '消息'}</span>
                                    {unreadCount > 0 && (
                                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
                                <Link
                                    href={`${basePath}/profile`}
                                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-sage/10"
                                >
                                    {dict?.common?.profile || '个人中心'}
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-sage/10"
                                >
                                    {dict?.common?.logout || '登出'}
                                </button>
                            </>
                        ) : (
                            <Link
                                href={`${basePath}/auth/login`}
                                className="block px-4 py-2 text-base font-medium text-sage hover:bg-sage/10"
                            >
                                {dict?.common?.login || '登录'}
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

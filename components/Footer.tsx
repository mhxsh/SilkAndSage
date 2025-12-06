'use client'

import { useParams } from 'next/navigation'

export default function Footer() {
    const params = useParams()
    const lang = (params?.lang as string) || 'en'

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">Silk & Sage</h3>
                        <p className="text-sm text-gray-600">
                            Ancient Wisdom for the Modern Muse.
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            献给现代缪斯的东方智慧。
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">{lang === 'zh' ? '探索' : 'Explore'}</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href={`/${lang}/explore`} className="text-sm text-gray-600 hover:text-sage">
                                    {lang === 'zh' ? '文章' : 'Articles'}
                                </a>
                            </li>
                            <li>
                                <a href={`/${lang}/quiz`} className="text-sm text-gray-600 hover:text-sage">
                                    {lang === 'zh' ? '元素测试' : 'Element Quiz'}
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">{lang === 'zh' ? '关于' : 'About'}</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href={`/${lang}/about`} className="text-sm text-gray-600 hover:text-sage">
                                    {lang === 'zh' ? '关于我们' : 'About Us'}
                                </a>
                            </li>
                            <li>
                                <a href={`/${lang}/feedback`} className="text-sm text-gray-600 hover:text-sage">
                                    {lang === 'zh' ? '反馈建议' : 'Feedback'}
                                </a>
                            </li>
                            <li>
                                <a href={`/${lang}/privacy`} className="text-sm text-gray-600 hover:text-sage">
                                    {lang === 'zh' ? '隐私政策' : 'Privacy Policy'}
                                </a>
                            </li>
                            <li>
                                <a href={`/${lang}/terms`} className="text-sm text-gray-600 hover:text-sage">
                                    {lang === 'zh' ? '服务条款' : 'Terms of Service'}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 text-center">
                        © {new Date().getFullYear()} Silk & Sage. {lang === 'zh' ? '版权所有。保留所有权利。' : 'All rights reserved.'}
                    </p>
                </div>
            </div>
        </footer>
    )
}

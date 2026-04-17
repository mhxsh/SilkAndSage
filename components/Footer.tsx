'use client'

import { useParams } from 'next/navigation'

export default function Footer() {
    const params = useParams()
    const lang = (params?.lang as string) || 'en'

    return (
        <footer className="bg-white border-t border-gray-100 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Column 1: Branding */}
                    <div>
                        <h3 className="font-serif text-xl font-bold text-sage mb-4">Silk & Sage</h3>
                        <p className="text-sm text-gray-500">
                            {lang === 'zh' ? '东方智慧与现代美学的交汇。' : 'Where Eastern wisdom meets modern aesthetics.'}
                        </p>
                    </div>

                    {/* Column 2: Navigation */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">{lang === 'zh' ? '导航' : 'Explore'}</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href={`/${lang}/explore`} className="hover:text-sage">{lang === 'zh' ? '探索' : 'Explore'}</a></li>
                            <li><a href={`/${lang}/quiz`} className="hover:text-sage">{lang === 'zh' ? '测试' : 'Quiz'}</a></li>
                            <li><a href={`/${lang}/about`} className="hover:text-sage">{lang === 'zh' ? '关于我们' : 'About'}</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Legal */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">{lang === 'zh' ? '法律' : 'Legal'}</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href={`/${lang}/privacy`} className="hover:text-sage">{lang === 'zh' ? '隐私政策' : 'Privacy'}</a></li>
                            <li><a href={`/${lang}/terms`} className="hover:text-sage">{lang === 'zh' ? '使用条款' : 'Terms'}</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                        © {new Date().getFullYear()} Silk & Sage. {lang === 'zh' ? '版权所有。保留所有权利。' : 'All rights reserved.'}
                    </p>
                </div>
            </div>
        </footer>
    )
}

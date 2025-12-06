import Link from 'next/link'
import { Tool } from '@/lib/data/tools'

interface RelatedToolsProps {
    tools: Tool[]
    lang: string
}

export default function RelatedTools({ tools, lang }: RelatedToolsProps) {
    if (!tools || tools.length === 0) return null

    const isZh = lang === 'zh'

    return (
        <div className="bg-gradient-to-br from-sage/5 to-white rounded-xl p-6 border border-sage/10 mb-8 mx-auto max-w-4xl shadow-sm">
            <h3 className="text-xl font-serif font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🛠️</span>
                {isZh ? '推荐工具' : 'Recommended Tools'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {tools.map(tool => {
                    const href = `/${lang}${tool.url}`

                    return (
                        <Link
                            key={tool.id}
                            href={href}
                            className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:border-sage/50 hover:shadow-md transition-all group"
                        >
                            <div className="text-2xl bg-gray-50 rounded-lg w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                {tool.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 group-hover:text-sage transition-colors">
                                    {isZh ? tool.name_zh : tool.name_en}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {isZh ? tool.desc_zh : tool.desc_en}
                                </p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

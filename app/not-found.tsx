import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <h1 className="text-9xl font-serif font-bold text-sage mb-4">404</h1>
                <h2 className="text-3xl font-serif font-semibold text-gray-900 mb-4">
                    页面未找到
                </h2>
                <p className="text-gray-600 mb-8">
                    抱歉，您访问的页面不存在。或许它已经被移动，或者从未存在过。
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors"
                    >
                        返回首页
                    </Link>
                    <Link
                        href="/explore"
                        className="inline-flex items-center justify-center px-6 py-3 border border-sage text-sage rounded-lg hover:bg-sage/10 transition-colors"
                    >
                        探索文章
                    </Link>
                </div>
            </div>
        </div>
    )
}

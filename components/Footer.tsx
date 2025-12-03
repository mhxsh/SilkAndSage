export default function Footer() {
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
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">探索</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/explore" className="text-sm text-gray-600 hover:text-sage">
                                    文章
                                </a>
                            </li>
                            <li>
                                <a href="/quiz" className="text-sm text-gray-600 hover:text-sage">
                                    元素测试
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">关于</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/about" className="text-sm text-gray-600 hover:text-sage">
                                    关于我们
                                </a>
                            </li>
                            <li>
                                <a href="/privacy" className="text-sm text-gray-600 hover:text-sage">
                                    隐私政策
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 text-center">
                        © {new Date().getFullYear()} Silk & Sage. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

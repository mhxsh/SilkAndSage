import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-gray-900 mb-6">
              Ancient Wisdom for the{" "}
              <span className="text-sage">Modern Muse</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              献给现代缪斯的东方智慧
            </p>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              通过东方哲学、五行智慧与现代生活美学的结合，发现属于你的内在平衡与和谐。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sage hover:bg-sage/90 transition-colors"
              >
                发现你的内在元素
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center px-8 py-3 border border-sage text-base font-medium rounded-md text-sage bg-transparent hover:bg-sage/10 transition-colors"
              >
                探索文章
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center text-gray-900 mb-12">
            探索你的生活美学
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2">五行智慧</h3>
              <p className="text-gray-600">
                基于古老的五行理论，为你的生活空间和日常习惯提供个性化建议。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2">内在元素测试</h3>
              <p className="text-gray-600">
                通过简单的测试，发现你的内在元素属性，获得专属的生活美学指南。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎋</span>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2">东方美学</h3>
              <p className="text-gray-600">
                从禅意到侘寂，探索适合你的东方美学风格，打造独特的生活空间。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-sage/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">
            开始你的内在探索之旅
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            加入 Silk & Sage 社区，与志同道合的现代女性一起，探索东方智慧与现代生活的完美融合。
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sage hover:bg-sage/90 transition-colors"
          >
            立即加入
          </Link>
        </div>
      </section>
    </div>
  );
}

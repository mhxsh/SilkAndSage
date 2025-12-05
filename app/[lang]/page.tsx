import Link from "next/link";
import { getAtmosphere } from "@/lib/theme/atmosphere";
import AtmosphericHero from "@/components/AtmosphericHero";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

import { getPopularPages } from "@/lib/data/pages";
import PopularArticles from "@/components/PopularArticles";

export default async function Home({
    params,
}: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const atmosphere = getAtmosphere();
    const popularArticles = await getPopularPages(lang);

    return (
        <div className="bg-cream">
            {/* Hero Section */}
            <AtmosphericHero atmosphere={atmosphere} dict={dict} />

            {/* Features Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center text-gray-900 mb-12">
                        {dict.home.features_title}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🌿</span>
                            </div>
                            <h3 className="text-xl font-serif font-semibold mb-2">{dict.home.feature_1_title}</h3>
                            <p className="text-gray-600">
                                {dict.home.feature_1_desc}
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">✨</span>
                            </div>
                            <h3 className="text-xl font-serif font-semibold mb-2">{dict.home.feature_2_title}</h3>
                            <p className="text-gray-600">
                                {dict.home.feature_2_desc}
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🎋</span>
                            </div>
                            <h3 className="text-xl font-serif font-semibold mb-2">{dict.home.feature_3_title}</h3>
                            <p className="text-gray-600">
                                {dict.home.feature_3_desc}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Articles Section */}
            <PopularArticles articles={popularArticles} lang={lang} dict={dict} />

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-sage/5">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">
                        {dict.home.join_title}
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        {dict.home.join_desc}
                    </p>
                    <Link
                        href={`/${lang}/auth/login`}
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sage hover:bg-sage/90 transition-colors"
                    >
                        {dict.home.join_btn}
                    </Link>
                </div>
            </section>
        </div>
    );
}

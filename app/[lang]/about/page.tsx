import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'
import { Metadata } from 'next'

export async function generateMetadata({
    params
}: {
    params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
    const { lang } = await params
    const dict = await getDictionary(lang)

    return {
        title: `${dict.about.title} | Silk & Sage`,
        description: dict.about.subtitle
    }
}

export default async function AboutPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)
    const about = dict?.about || {}

    return (
        <div className="min-h-screen bg-cream">
            {/* Hero Section */}
            <section className="bg-white border-b border-gray-200 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
                        {about.title}
                    </h1>
                    <p className="text-2xl text-sage">{about.subtitle}</p>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Mission */}
                <section className="mb-16">
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
                        {about.mission?.heading}
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        {about.mission?.text}
                    </p>
                </section>

                {/* Vision */}
                <section className="mb-16">
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
                        {about.vision?.heading}
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        {about.vision?.text}
                    </p>
                </section>

                {/* Values */}
                <section className="mb-16">
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">
                        {about.values?.heading}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {(about.values?.items || []).map((value: any, index: number) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-sage transition-colors"
                            >
                                <h3 className="text-xl font-serif font-bold text-sage mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-gray-700">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* What We Do */}
                <section className="mb-16">
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                        {about.whatWeDo?.heading}
                    </h2>
                    <p className="text-lg text-gray-700 mb-8">{about.whatWeDo?.intro}</p>
                    <div className="space-y-8">
                        {(about.whatWeDo?.services || []).map((service: any, index: number) => (
                            <div key={index} className="border-l-4 border-sage pl-6">
                                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">
                                    {service.title}
                                </h3>
                                <p className="text-gray-700 leading-relaxed">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Philosophy */}
                <section className="mb-16 bg-sage/5 p-8 rounded-lg">
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">
                        {about.philosophy?.heading}
                    </h2>
                    <div className="space-y-6">
                        {(about.philosophy?.paragraphs || []).map((paragraph: string, index: number) => (
                            <p key={index} className="text-gray-700 leading-relaxed text-lg">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </section>

                {/* Team */}
                <section className="mb-16">
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
                        {about.team?.heading}
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        {about.team?.description}
                    </p>
                </section>

                {/* Contact */}
                <section className="bg-white border border-gray-200 p-8 rounded-lg">
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                        {about.contact?.heading}
                    </h2>
                    <p className="text-lg text-gray-700 mb-4">{about.contact?.text}</p>
                    <p className="text-lg text-sage font-semibold">{about.contact?.email}</p>
                </section>
            </div>
        </div>
    )
}

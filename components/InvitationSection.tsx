import Link from 'next/link'
import Image from 'next/image'

interface InvitationSectionProps {
    lang: string
    dict: any
}

export default function InvitationSection({ lang, dict }: InvitationSectionProps) {
    return (
        <section className="relative py-32 md:py-48 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=2000" // 舒适的沙发/阅读角落
                    alt="Cozy reading corner"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                <span className="block text-sage-200 font-medium tracking-[0.2em] text-sm uppercase mb-6">
                    Join the Community
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-8 leading-tight">
                    {dict.home.join_title}
                </h2>
                <p className="text-lg md:text-xl text-stone-100 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                    {dict.home.join_desc}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href={`/${lang}/auth/signup`}
                        className="w-full sm:w-auto px-8 py-4 bg-white text-stone-900 font-medium rounded-full hover:bg-sage hover:text-white transition-all duration-300 min-w-[200px]"
                    >
                        {dict.home.join_btn}
                    </Link>
                    <Link
                        href={`/${lang}/about`}
                        className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 min-w-[200px]"
                    >
                        Learn More
                    </Link>
                </div>
            </div>
        </section>
    )
}

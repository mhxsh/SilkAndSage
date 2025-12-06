import Image from 'next/image'

interface PhilosophySectionProps {
    dict: any
}

export default function PhilosophySection({ dict }: PhilosophySectionProps) {
    const philosophies = [
        {
            id: 'wisdom',
            title: dict.home.philosophy_1_title,
            desc: dict.home.philosophy_1_desc,
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800', // 海边平衡石
            imageAlt: 'Balanced stones representing Five Elements wisdom',
            reverse: false
        },
        {
            id: 'inner',
            title: dict.home.philosophy_2_title,
            desc: dict.home.philosophy_2_desc,
            image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800', // 女性冥想/自然光
            imageAlt: 'Woman in meditation representing inner journey',
            reverse: true
        },
        {
            id: 'aesthetics',
            title: dict.home.philosophy_3_title,
            desc: dict.home.philosophy_3_desc,
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800', // 日式茶道场景
            imageAlt: 'Japanese tea ceremony representing Eastern aesthetics and slow living',
            reverse: false
        }
    ]

    return (
        <section className="py-24 bg-stone-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <span className="text-sage font-medium tracking-[0.2em] text-sm uppercase mb-4 block">
                        Our Philosophy
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900">
                        {dict.home.philosophy_title}
                    </h2>
                </div>

                <div className="space-y-24 md:space-y-32">
                    {philosophies.map((item) => (
                        <div
                            key={item.id}
                            className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 ${item.reverse ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Image Side */}
                            <div className="w-full md:w-1/2 relative group">
                                <div className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-2xl shadow-xl">
                                    <Image
                                        src={item.image}
                                        alt={item.imageAlt}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Overlay for texture/mood */}
                                    <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors duration-500" />
                                </div>
                                {/* Decorative elements */}
                                <div className={`absolute -z-10 w-full h-full border border-sage/30 rounded-2xl top-4 ${item.reverse ? 'left-4' : '-left-4'}`} />
                            </div>

                            {/* Text Side */}
                            <div className="w-full md:w-1/2 text-center md:text-left">
                                <div className="max-w-md mx-auto md:mx-0">
                                    <div className="w-12 h-1 bg-sage mb-8 mx-auto md:mx-0" />
                                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-6">
                                        {item.title}
                                    </h3>
                                    <p className="text-lg text-stone-600 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

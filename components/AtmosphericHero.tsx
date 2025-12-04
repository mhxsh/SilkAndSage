'use client'

import { Atmosphere } from '@/lib/theme/atmosphere'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface AtmosphericHeroProps {
    atmosphere: Atmosphere
    dict?: any
}

export default function AtmosphericHero({ atmosphere, dict }: AtmosphericHeroProps) {
    const { colors, id, element } = atmosphere
    const atmosphereDict = dict?.atmosphere?.[id] || {}
    const elementsDict = dict?.elements || {}
    const homeDict = dict?.home || {}

    return (
        <section
            className="relative overflow-hidden transition-colors duration-1000 ease-in-out"
            style={{ backgroundColor: colors.background }}
        >
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl transition-colors duration-1000"
                    style={{ backgroundColor: colors.primary }}
                />
                <div
                    className="absolute top-1/2 -left-24 w-72 h-72 rounded-full opacity-20 blur-3xl transition-colors duration-1000"
                    style={{ backgroundColor: colors.accent }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    {/* Season/Element Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-6 border transition-colors duration-1000"
                        style={{
                            borderColor: colors.primary,
                            color: colors.text,
                            backgroundColor: `${colors.primary}10`,
                        }}
                    >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }} />
                        {atmosphereDict.name} · {elementsDict[element]}
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6 transition-colors duration-1000"
                        style={{ color: colors.text }}
                    >
                        {atmosphereDict.greeting}
                    </motion.h1>

                    {/* Psychology Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg sm:text-xl mb-10 leading-relaxed transition-colors duration-1000"
                        style={{ color: `${colors.text}CC` }} // 80% opacity
                    >
                        {atmosphereDict.psychology}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link
                            href="/explore"
                            className="px-8 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                            style={{ backgroundColor: colors.primary }}
                        >
                            {homeDict.cta_explore}
                        </Link>
                        <Link
                            href="/quiz"
                            className="px-8 py-3 rounded-lg border-2 font-medium transition-all duration-300 hover:bg-white/50"
                            style={{
                                borderColor: colors.primary,
                                color: colors.primary,
                            }}
                        >
                            {homeDict.cta_quiz}
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

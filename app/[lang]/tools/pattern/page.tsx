import PatternHarmony from '@/components/tools/PatternHarmony'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Pattern & Texture Harmony | Silk & Sage',
    description: 'Personalized pattern and texture recommendations based on your energy profile.',
}

export default async function PatternPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params
    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 py-12">
            <PatternHarmony lang={lang} />
        </div>
    )
}

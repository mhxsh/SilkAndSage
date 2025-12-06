import ColorHarmony from '@/components/tools/ColorHarmony'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Color Harmony AI | Silk & Sage',
    description: 'Personalized color palette generator based on your energy profile.',
}

export default async function ColorPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params
    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-sage/5 to-stone-100 py-12">
            <ColorHarmony lang={lang} />
        </div>
    )
}

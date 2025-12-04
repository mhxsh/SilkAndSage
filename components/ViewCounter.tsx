'use client'

import { useEffect } from 'react'
import { incrementPageView } from '@/app/actions/view-counter'

export default function ViewCounter({ slug }: { slug: string }) {
    useEffect(() => {
        incrementPageView(slug)
    }, [slug])

    return null
}

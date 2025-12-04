'use server'

import { createClient } from '@/lib/supabase/server'

export async function incrementPageView(slug: string) {
    const supabase = await createClient()

    const { error } = await supabase.rpc('increment_views', { page_slug: slug })

    if (error) {
        console.error('Error incrementing views:', error)
    }
}

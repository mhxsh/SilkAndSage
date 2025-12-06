import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data, error } = await supabase
            .from('user_footprint_settings')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                // Create default settings
                const { data: newSettings } = await supabase
                    .from('user_footprint_settings')
                    .insert({
                        user_id: user.id,
                        is_public: false
                    })
                    .select()
                    .single()

                return NextResponse.json({ data: newSettings })
            }
            console.error('Error fetching footprint settings:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ data })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { isPublic, publicUsername, publicBioZh, publicBioEn, publicAvatarUrl, showcaseTools, showcaseFootprintsCount } = body

        const { data, error } = await supabase
            .from('user_footprint_settings')
            .upsert({
                user_id: user.id,
                is_public: isPublic !== undefined ? isPublic : false,
                public_username: publicUsername || null,
                public_bio_zh: publicBioZh || null,
                public_bio_en: publicBioEn || null,
                public_avatar_url: publicAvatarUrl || null,
                showcase_tools: showcaseTools || [],
                showcase_footprints_count: showcaseFootprintsCount || 10,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id'
            })
            .select()
            .single()

        if (error) {
            console.error('Error updating footprint settings:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}


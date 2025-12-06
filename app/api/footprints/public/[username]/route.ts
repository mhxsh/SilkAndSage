import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const supabase = await createClient()
        const { username } = await params
        const { searchParams } = new URL(request.url)
        const lang = searchParams.get('lang') || 'zh'

        // Find user by public username
        const { data: settings, error: settingsError } = await supabase
            .from('user_footprint_settings')
            .select(`
                *,
                profiles:user_id (
                    id,
                    username,
                    full_name,
                    inner_element
                )
            `)
            .eq('public_username', username)
            .eq('is_public', true)
            .single()

        if (settingsError || !settings) {
            return NextResponse.json({ error: 'User not found or profile not public' }, { status: 404 })
        }

        // Get footprints based on settings
        let footprintsQuery = supabase
            .from('user_footprints')
            .select('*')
            .eq('user_id', settings.user_id)
            .eq('is_deleted', false)
            .order('created_at', { ascending: false })

        // Filter by showcase tools if specified
        if (settings.showcase_tools && settings.showcase_tools.length > 0) {
            footprintsQuery = footprintsQuery.in('tool_name', settings.showcase_tools)
        }

        // Limit by showcase count
        const limit = settings.showcase_footprints_count || 10
        const { data: footprints, error: footprintsError } = await footprintsQuery.limit(limit)

        if (footprintsError) {
            console.error('Error fetching footprints:', footprintsError)
            return NextResponse.json({ error: footprintsError.message }, { status: 500 })
        }

        return NextResponse.json({
            profile: {
                username: settings.public_username,
                bio: lang === 'zh' ? settings.public_bio_zh : settings.public_bio_en,
                avatar: settings.public_avatar_url,
                element: settings.profiles?.inner_element
            },
            footprints: footprints || []
        })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}


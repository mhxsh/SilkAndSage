'use server'

import { createClient } from '@/lib/supabase/server'
import { FootprintLog, UserPersona } from '@/types/footprint'
import { generatePersonaFromHistory } from '@/lib/ai/persona'

// --- Footprint Logs ---

export async function recordToolUsage(
    toolName: string,
    input: any,
    output: any
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase.from('user_footprints').insert({
        user_id: user.id,
        tool_name: toolName,
        input_context: input,
        output_result: output
    })

    if (error) {
        console.error('Error recording footprint:', error)
        return { error: error.message }
    }

    return { success: true }
}

export async function getFootprints(limit = 50) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { data: [], error: 'Unauthorized' }

    const { data, error } = await supabase
        .from('user_footprints')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(limit)

    return { data: data as FootprintLog[], error }
}

export async function deleteFootprint(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Soft delete
    const { error } = await supabase
        .from('user_footprints')
        .update({ is_deleted: true })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) return { error: error.message }
    return { success: true }
}

// --- Personas ---

export async function getLatestPersona() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { data: null, error: 'Unauthorized' }

    const { data, error } = await supabase
        .from('user_personas')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_latest', true)
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is 'not found'
        console.error('Error fetching persona:', error)
    }

    return { data: data as UserPersona | null }
}

export async function generateAndSavePersona(userPrompt?: string, lang: string = 'en') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // 1. Get history
    // We get both generic footprints AND existing fortune history if needed
    // For now, let's just use the footprints table + maybe fetch fortune history separately if unified isn't ready
    // To be comprehensive, I will fetch fortune history and map it to FootprintLog format

    const { data: footprints } = await supabase
        .from('user_footprints')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(20)

    const { data: fortunes } = await supabase
        .from('user_fortune_history')
        .select('*')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(10)

    // Combine logs
    const history: FootprintLog[] = [
        ...(footprints || []),
        ...(fortunes || []).map(f => ({
            id: f.id,
            user_id: f.user_id,
            tool_name: 'fortune_history',
            input_context: null,
            output_result: f.fortune_data,
            created_at: f.viewed_at,
            is_deleted: false
        }))
    ]

    // 2. Get current persona for context
    const { data: currentPersona } = await supabase
        .from('user_personas')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_latest', true)
        .single()

    // 2.5 Get user core profile for extra context
    const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Construct rich prompt
    const richPrompt = `
    User Basic Info: 
    - Gender: ${userProfile?.gender || 'Unknown'}
    - Zodiac: ${userProfile?.zodiac_sign || 'Unknown'} / ${userProfile?.chinese_zodiac || 'Unknown'}
    - Occupation: ${userProfile?.occupation || 'Unknown'}
    - Bio: ${userProfile?.bio || 'Unknown'}
    
    User Context: ${userPrompt || ''}
    `

    // 3. Generate
    try {
        const generated = await generatePersonaFromHistory(history, currentPersona, richPrompt, lang)

        // 4. Save
        const { error: saveError } = await supabase.from('user_personas').insert({
            user_id: user.id,
            persona_traits: generated.persona_traits,
            analysis_text: generated.analysis_text,
            suggestions: generated.suggestions,
            is_latest: true
        })

        if (saveError) throw saveError

        return { success: true }

    } catch (e: any) {
        console.error("Gen persona failed", e)
        return { error: e.message }
    }
}

export async function updatePersonaNotes(id: string, notes: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('user_personas')
        .update({ user_notes: notes })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) return { error: error.message }
    return { success: true }
}

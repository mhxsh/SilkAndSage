import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const {
            birthDate,
            birthTime,
            zodiacSign,
            chineseZodiac,
            lunarBirthDate,
            birthHour,
            element,
            elementBalance,
            personalityTraits,
            luckyColors,
            luckyNumbers
        } = body

        // Upsert birth profile
        const { data, error } = await supabase
            .from('user_birth_profiles')
            .upsert({
                user_id: user.id,
                birth_date: birthDate,
                birth_time: birthTime || null,
                zodiac_sign: zodiacSign,
                chinese_zodiac: chineseZodiac,
                lunar_birth_date: lunarBirthDate,
                birth_hour: birthHour || null,
                element,
                element_balance: elementBalance,
                personality_traits: personalityTraits,
                lucky_colors: luckyColors,
                lucky_numbers: luckyNumbers,
                is_complete: true,
                last_viewed_at: new Date().toISOString(),
                view_count: 1,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id'
            })
            .select()
            .single()

        if (error) {
            console.error('Error saving birth profile:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Save to Footprints
        await supabase.from('user_footprints').insert({
            user_id: user.id,
            tool_name: 'Birthday Analysis',
            input_context: {
                birthDate,
                zodiacSign,
                chineseZodiac
            },
            output_result: {
                element,
                elementBalance,
                personalityTraits,
                luckyColors
            }
        })

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data, error } = await supabase
            .from('user_birth_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error fetching birth profile:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ data: data || null })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

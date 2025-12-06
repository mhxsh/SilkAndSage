import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        const { searchParams } = new URL(request.url)
        const lang = searchParams.get('lang') || 'zh'

        // Get user profile for personalization
        let userProfile = null
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('inner_element, birth_date')
                .eq('id', user.id)
                .single()
            userProfile = profile
        }

        const today = new Date().toISOString().split('T')[0]

        // Get mindfulness quote (personalized if user has element)
        let quoteQuery = supabase
            .from('mindfulness_quotes')
            .select('*')
            .limit(1)

        if (userProfile?.inner_element) {
            // Try to get quote matching user's element
            quoteQuery = quoteQuery.eq('element', userProfile.inner_element)
        }

        // If no element-specific quote, get random
        const { data: quotes } = await quoteQuery
        let quote = quotes?.[0]

        // If still no quote, get any random quote
        if (!quote) {
            const { data: allQuotes } = await supabase
                .from('mindfulness_quotes')
                .select('*')
            if (allQuotes && allQuotes.length > 0) {
                quote = allQuotes[Math.floor(Math.random() * allQuotes.length)]
            }
        }

        // Get morning greeting (personalized)
        let greetingQuery = supabase
            .from('morning_greetings')
            .select('*')
            .limit(1)

        // Check for date-specific greeting first
        const { data: dateGreeting } = await supabase
            .from('morning_greetings')
            .select('*')
            .eq('date', today)
            .limit(1)
            .single()

        let greeting = dateGreeting

        if (!greeting) {
            if (userProfile?.inner_element) {
                greetingQuery = greetingQuery.eq('element', userProfile.inner_element)
            }
            const { data: greetings } = await greetingQuery
            greeting = greetings?.[0]

            // If still no greeting, get any random
            if (!greeting) {
                const { data: allGreetings } = await supabase
                    .from('morning_greetings')
                    .select('*')
                if (allGreetings && allGreetings.length > 0) {
                    greeting = allGreetings[Math.floor(Math.random() * allGreetings.length)]
                }
            }
        }

        // Check if user has checked in today
        let todayCheckin = null
        if (user) {
            const { data: checkin } = await supabase
                .from('daily_checkins')
                .select('*')
                .eq('user_id', user.id)
                .eq('checkin_date', today)
                .single()
            todayCheckin = checkin
        }

        return NextResponse.json({
            quote: quote ? {
                id: quote.id,
                text: lang === 'zh' ? quote.quote_zh : quote.quote_en,
                author: lang === 'zh' ? quote.author_zh : quote.author_en,
                element: quote.element
            } : null,
            greeting: greeting ? {
                id: greeting.id,
                text: lang === 'zh' ? greeting.greeting_zh : greeting.greeting_en,
                advice: lang === 'zh' ? greeting.energy_advice_zh : greeting.energy_advice_en,
                element: greeting.element
            } : null,
            checkin: todayCheckin,
            hasCheckedIn: !!todayCheckin
        })
    } catch (error) {
        console.error('Error fetching today rituals:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}


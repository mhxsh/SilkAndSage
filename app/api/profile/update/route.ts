import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// 计算星座
function getZodiacSign(month: number, day: number): string {
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius'
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces'
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries'
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus'
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini'
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer'
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo'
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo'
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra'
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio'
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius'
    return 'Capricorn'
}

export async function PATCH(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { username, gender, birth_date, occupation, bio } = body

        let zodiac_sign = null
        let chinese_zodiac = null

        // 如果有生日，计算星座和生肖
        if (birth_date) {
            const date = new Date(birth_date)
            const month = date.getMonth() + 1
            const day = date.getDate()
            const year = date.getFullYear()

            zodiac_sign = getZodiacSign(month, day)

            // 简单的生肖计算（基于年份）
            const zodiacAnimals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
                'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig']
            chinese_zodiac = zodiacAnimals[(year - 1900) % 12]
        }

        const updateData: any = {}
        if (username !== undefined) updateData.username = username
        if (gender !== undefined) {
            // Handle empty string for enum compatibility (convert to null)
            updateData.gender = gender === '' ? null : gender
        }
        if (birth_date !== undefined) {
            updateData.birth_date = birth_date
            updateData.zodiac_sign = zodiac_sign
            updateData.chinese_zodiac = chinese_zodiac
        }
        if (occupation !== undefined) updateData.occupation = occupation
        if (bio !== undefined) updateData.bio = bio

        const { data, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', user.id)
            .select()
            .single()

        if (error) {
            console.error('Error updating profile:', error)
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

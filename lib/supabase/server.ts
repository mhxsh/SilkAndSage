import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    let cookieStore: ReturnType<typeof cookies> | undefined

    try {
        // cookies() throws when used outside of a request scope (eg. during
        // static generation). Wrap in try/catch and fall back to not
        // providing the cookies option so the client can still be used for
        // public, read-only requests.
        cookieStore = await cookies()
    } catch {
        cookieStore = undefined
    }


    const supabaseOptions: { cookies: CookieOptions } = {
        cookies: {
            getAll() {
                if (cookieStore) return cookieStore.getAll()
                return []
            },
            setAll(cookiesToSet) {
                if (!cookieStore) return
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore!.set(name, value, options)
                    )
                } catch {
                    // The `setAll` method was called from a Server Component.
                    // This can be ignored if you have middleware refreshing
                    // user sessions.
                }
            },
        },
    }

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        supabaseOptions
    )
}

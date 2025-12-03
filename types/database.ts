export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    username: string
                    full_name: string | null
                    gender: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say' | null
                    birth_date: string | null
                    occupation: string | null
                    inner_element: 'wood' | 'fire' | 'earth' | 'metal' | 'water' | null
                    ai_profile: Json | null
                    updated_at: string
                }
                Insert: {
                    id: string
                    username: string
                    full_name?: string | null
                    gender?: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say' | null
                    birth_date?: string | null
                    occupation?: string | null
                    inner_element?: 'wood' | 'fire' | 'earth' | 'metal' | 'water' | null
                    ai_profile?: Json | null
                    updated_at?: string
                }
                Update: {
                    id?: string
                    username?: string
                    full_name?: string | null
                    gender?: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say' | null
                    birth_date?: string | null
                    occupation?: string | null
                    inner_element?: 'wood' | 'fire' | 'earth' | 'metal' | 'water' | null
                    ai_profile?: Json | null
                    updated_at?: string
                }
            }
            identities: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    type: 'mbti' | 'zodiac' | 'life_stage'
                    pain_points: string[] | null
                    power_color: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    type: 'mbti' | 'zodiac' | 'life_stage'
                    pain_points?: string[] | null
                    power_color?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    type?: 'mbti' | 'zodiac' | 'life_stage'
                    pain_points?: string[] | null
                    power_color?: string | null
                    created_at?: string
                }
            }
            generated_pages: {
                Row: {
                    id: string
                    slug: string
                    identity_id: string | null
                    generated_image_url: string | null
                    tags: string[] | null
                    views_count: number
                    comments_count: number
                    ratings_count: number
                    average_score: number
                    status: 'draft' | 'published' | 'archived'
                    published_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    identity_id?: string | null
                    generated_image_url?: string | null
                    tags?: string[] | null
                    views_count?: number
                    comments_count?: number
                    ratings_count?: number
                    average_score?: number
                    status: 'draft' | 'published' | 'archived'
                    published_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    identity_id?: string | null
                    generated_image_url?: string | null
                    tags?: string[] | null
                    views_count?: number
                    comments_count?: number
                    ratings_count?: number
                    average_score?: number
                    status?: 'draft' | 'published' | 'archived'
                    published_at?: string | null
                    created_at?: string
                }
            }
            generated_page_translations: {
                Row: {
                    id: number
                    page_id: string
                    language_code: string
                    title: string
                    generated_text: Json
                }
                Insert: {
                    id?: number
                    page_id: string
                    language_code: string
                    title: string
                    generated_text: Json
                }
                Update: {
                    id?: number
                    page_id?: string
                    language_code?: string
                    title?: string
                    generated_text?: Json
                }
            }
        }
    }
}

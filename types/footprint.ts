export interface FootprintLog {
    id: string;
    user_id: string;
    tool_name: string;
    input_context: any;
    output_result: any;
    created_at: string;
    is_deleted?: boolean;
}

export interface UserPersona {
    id: string;
    user_id: string;
    persona_traits: {
        mbti?: string;
        keywords?: string[];
        personality_type?: string;
        strengths?: string[];
        weaknesses?: string[];
        [key: string]: any;
    };
    analysis_text: string;
    suggestions: string;
    user_notes?: string;
    is_latest: boolean;
    created_at: string;
    updated_at: string;
}

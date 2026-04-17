import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { OpenAI } from 'openai';

// Define expected structure for database rows
interface ScheduledMessage {
    id: string;
    user_id: string;
    intent_prompt: string;
    scheduled_at: string;
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const dynamic = 'force-dynamic'; // Ensure this route is not cached

export async function GET(request: NextRequest) {
    // Security Check: Verify Cron Secret (if configured)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    try {
        // 1. Fetch pending messages that are due
        const now = new Date().toISOString();
        const { data: messages, error } = await supabase
            .from('ai_scheduled_messages')
            .select('*')
            .eq('status', 'pending')
            .lte('scheduled_at', now)
            .limit(10); // Batch size limit

        if (error) {
            console.error('Error fetching scheduled messages:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        if (!messages || messages.length === 0) {
            return NextResponse.json({ success: true, processed: 0, message: 'No messages due' });
        }

        // 2. Process each message
        const results = await Promise.all(messages.map(async (msg: ScheduledMessage) => {
            try {
                // A. Generate the actual message content using AI
                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "You are Sage, a supportive and spiritual companion. Write a short, warm notification message (< 30 words) based on the intent." },
                        { role: "user", content: `Intent: ${msg.intent_prompt}` }
                    ],
                    max_tokens: 50,
                });

                const content = completion.choices[0].message.content || "Thinking of you.";

                // B. "Send" the message (For MVP: Insert into 'notification' table)
                // Ensure you have a notifications table. If not, this step might fail or need adjustment.
                // Assuming a standard 'notifications' table exists or we log it.
                // Let's check schema: notifications usually have user_id, title, content, type.

                const { error: notifError } = await supabase.from('notifications').insert({
                    user_id: msg.user_id,
                    title: "Sage",
                    content: content,
                    type: 'ai_care',
                    is_read: false
                });

                if (notifError) throw notifError;

                // C. Mark as sent
                await supabase
                    .from('ai_scheduled_messages')
                    .update({ status: 'sent' })
                    .eq('id', msg.id);

                return { id: msg.id, status: 'success' };

            } catch (err: any) {
                console.error(`Failed to process message ${msg.id}:`, err);

                // Mark as failed to avoid infinite loop retry immediately (or implement retry count)
                await supabase
                    .from('ai_scheduled_messages')
                    .update({ status: 'failed' }) // Simple failure state
                    .eq('id', msg.id);

                return { id: msg.id, status: 'failed', error: err.message };
            }
        }));

        return NextResponse.json({ success: true, processed: results.length, details: results });

    } catch (e: any) {
        console.error('Cron job error:', e);
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

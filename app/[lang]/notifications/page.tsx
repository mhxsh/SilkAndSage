import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getNotifications, markAllNotificationsAsRead } from '@/lib/data/notifications'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { getDictionary } from '@/get-dictionary'
import { Locale } from '@/i18n-config'

export default async function NotificationsPage({
    params,
}: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await params
    const dict = await getDictionary(lang)
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/${lang}/auth/login`)
    }

    const notifications = await getNotifications(user.id)

    // Server Action to mark all as read
    async function markAllRead() {
        'use server'
        if (user) {
            await markAllNotificationsAsRead(user.id)
            revalidatePath(`/${lang}/notifications`)
        }
    }

    return (
        <div className="min-h-screen bg-cream py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-gray-900">{dict.notifications_page.title}</h1>
                    {notifications.some((n) => !n.is_read) && (
                        <form action={markAllRead}>
                            <button
                                type="submit"
                                className="text-sm text-sage hover:text-sage/80 font-medium"
                            >
                                {dict.notifications_page.mark_all_as_read}
                            </button>
                        </form>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-6 transition-colors ${!notification.is_read ? 'bg-sage/5' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            {notification.type === 'reply_comment' && (
                                                <span className="text-2xl">💬</span>
                                            )}
                                            {notification.type === 'like_comment' && (
                                                <span className="text-2xl">❤️</span>
                                            )}
                                            {notification.type === 'system_message' && (
                                                <span className="text-2xl">📢</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-medium text-gray-900">
                                                    {notification.title}
                                                </h3>
                                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                                    {new Date(notification.created_at).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US')}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                                                {notification.content}
                                            </p>
                                            {notification.link && (
                                                <Link
                                                    href={notification.link}
                                                    className="inline-block mt-3 text-sm text-sage hover:underline"
                                                >
                                                    {dict.notifications_page.view_details}
                                                </Link>
                                            )}
                                        </div>
                                        {!notification.is_read && (
                                            <div className="flex-shrink-0 self-center">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            <p>{dict.notifications_page.no_notifications}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

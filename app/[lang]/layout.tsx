import { Playfair_Display, Lato } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { getUnreadNotificationCount } from "@/lib/data/notifications";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
});

const lato = Lato({
    variable: "--font-lato",
    weight: ["100", "300", "400", "700", "900"],
    subsets: ["latin"],
});

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const unreadCount = user ? await getUnreadNotificationCount(user.id) : 0;

    return (
        <div className={`${playfair.variable} ${lato.variable} antialiased flex flex-col min-h-screen`}>
            <Navbar user={user} unreadCount={unreadCount} dict={dict} lang={lang} />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}

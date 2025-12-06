import { getAtmosphere } from "@/lib/theme/atmosphere";
import AtmosphericHero from "@/components/AtmosphericHero";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { getPopularPages } from "@/lib/data/pages";
import PopularArticles from "@/components/PopularArticles";
import PhilosophySection from "@/components/PhilosophySection";
import InvitationSection from "@/components/InvitationSection";
import MindfulnessCard from "@/components/rituals/MindfulnessCard";

export default async function Home({
    params,
}: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const atmosphere = getAtmosphere();
    const popularArticles = await getPopularPages(lang);

    return (
        <div className="bg-cream">
            {/* Hero Section */}
            <AtmosphericHero atmosphere={atmosphere} dict={dict} />

            {/* Daily Mindfulness Card */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <MindfulnessCard lang={lang} dict={dict} />
            </div>

            {/* Philosophy Section - Replaces Features */}
            <PhilosophySection dict={dict} />

            {/* Popular Articles Section */}
            <PopularArticles articles={popularArticles} lang={lang} dict={dict} />

            {/* Invitation Section - Replaces CTA */}
            <InvitationSection lang={lang} dict={dict} />
        </div>
    );
}

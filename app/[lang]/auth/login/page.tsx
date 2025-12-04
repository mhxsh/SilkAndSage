import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage({
    params,
}: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return <LoginForm dict={dict} lang={lang} />;
}

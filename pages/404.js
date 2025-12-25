import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Static Translations for the creative copy
const TRANSLATIONS = {
    en: {
        title: "404 – Page Not Found",
        heading: "Looks like this page drifted out of orbit",
        subtext: "The page you're trying to reach doesn't exist or may have moved.",
        reassurance: "Your work is safe — let's get you back on track.",
        dashboard: "Go to Home",
        documentation: "Study Guide",
        features: "Subject Areas",
        contact: "Contact Support"
    },
    ar: {
        title: "404 – الصفحة غير موجودة",
        heading: "يبدو أن هذه الصفحة خرجت عن المسار",
        subtext: "الصفحة التي تحاول الوصول إليها غير موجودة أو ربما تم نقلها.",
        reassurance: "لا تقلق، كل شيء بخير — دعنا نعيدك إلى المسار الصحيح.",
        dashboard: "الرئيسية",
        documentation: "دليل الدراسة",
        features: "التخصصات الدراسية",
        contact: "تواصل مع الدعم"
    }
};

export default function Custom404() {
    const router = useRouter();
    const { locale } = router;
    const t = TRANSLATIONS[locale] || TRANSLATIONS.en;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <NextSeo
                title={t.title}
                description={t.subtext}
                noindex={true}
            />

            <div className="max-w-2xl w-full text-center" dir={locale === 'ar' ? 'rtl' : 'ltr'}>

                {/* Logo Area */}
                <div className="mb-8 flex justify-center">
                    <div className="w-16 h-16 bg-blue-100/50 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-pulse-slow">
                        <span className="text-2xl">🪐</span>
                    </div>
                </div>

                {/* 404 Code */}
                <h1 className="text-8xl font-black text-blue-100/80 mb-4 select-none">
                    404
                </h1>

                {/* Main Content */}
                <div className="space-y-4 mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                        {t.heading}
                    </h2>
                    <div className="text-slate-500 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
                        <p>{t.subtext}</p>
                        <p className="font-medium text-slate-700 mt-2">{t.reassurance}</p>
                    </div>
                </div>

                {/* Action Links */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <Link href="/" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200/50">
                        {t.dashboard}
                    </Link>
                    <Link href="/study-abroad-guide" className="px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-300 transition">
                        {t.documentation}
                    </Link>
                    <Link href="/subjectareas" className="px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-300 transition">
                        {t.features}
                    </Link>
                    <Link href="/contact-us" className="px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-300 transition">
                        {t.contact}
                    </Link>
                </div>

            </div>
        </div>
    );
}

// Ensure i18n works
export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}

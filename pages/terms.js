import SEO from '../components/SEO';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import legalData from '../data/legal.json';

export default function TermsAndPrivacy() {
    const router = useRouter();
    const { locale } = router;
    const { t } = useTranslation('common');
    const content = legalData[locale] || legalData['en'];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <SEO
                title={content.title}
                description={t('terms.description')}
            />

            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
                        {content.title}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {content.lastUpdated}
                    </p>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-12">
                    <div className="prose prose-slate max-w-none 
                        prose-headings:font-bold prose-headings:text-slate-900 
                        prose-p:text-slate-600 prose-li:text-slate-600
                        prose-a:text-blue-600 hover:prose-a:text-blue-700
                        marker:prose-li:text-slate-400">

                        {content.sections.map((section, index) => (
                            <section key={index} className="mb-12 last:mb-0">
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-slate-100">
                                    {section.heading}
                                </h2>
                                <div
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                    className="space-y-4"
                                />
                            </section>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}

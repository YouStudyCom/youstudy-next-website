import SEO from '../components/SEO';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import InquiryForm from '../components/InquiryForm';
import contactData from '../data/contact.json';

export default function ContactUs() {
    const router = useRouter();
    const { locale } = router;
    const t = contactData[locale] || contactData['en'];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <SEO
                title={t.title}
                description={t.metaDescription}
            />

            {/* Hero Section */}
            <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_25%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_25%)]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        {t.heroTitle}
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                        {t.heroDescription}
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                    {/* Left Column: Inquiry Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-slate-100">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.formTitle}</h2>
                            <p className="text-slate-500">{t.formSubtitle}</p>
                        </div>
                        <InquiryForm />
                    </div>

                    {/* Right Column: Contact Details */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.officesTitle}</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {t.offices.map((office, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-blue-50 p-3 rounded-lg text-2xl">
                                                {office.flag}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-900 mb-2">{office.country}</h3>
                                                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                                                    {office.address}
                                                </p>

                                                <div className="space-y-2">
                                                    {office.phones.map((phone, i) => (
                                                        <a key={i} href={`tel:${phone.replace(/\s+/g, '').replace(/[()]/g, '')}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm group" dir="ltr">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                            <span className="group-hover:underline">{phone}</span>
                                                        </a>
                                                    ))}

                                                    {office.website && (
                                                        <a href="https://youstudy.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm group">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                            </svg>
                                                            <span className="group-hover:underline">{locale === 'ar' ? 'زيارة الموقع' : 'Visit Website'}</span>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Trust Section / Info */}
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                            <h3 className="font-bold text-blue-900 mb-2">{t.whyUsTitle}</h3>
                            <ul className="space-y-3">
                                {t.whyUsPoints.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-blue-800">
                                        <svg className="h-5 w-5 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
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

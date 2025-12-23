import SEO from '../components/SEO';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import aboutData from '../data/about.json';

export default function AboutUs() {
    const router = useRouter();
    const { locale } = router;
    const t = aboutData[locale] || aboutData['en'];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <SEO
                title={t.title}
                description={t.description}
            />

            {/* Magic Hero Section  test*/}
            <section className="relative bg-slate-900 text-white overflow-hidden py-24 md:py-32">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-300 text-sm font-semibold tracking-wide mb-6 uppercase">
                        {t.stats[0].label} {t.stats[0].value}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        {t.hero.title}
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                        {t.hero.content}
                    </p>
                </div>
            </section>

            {/* Stats Bar */}
            <div className="bg-white border-b border-slate-200 relative z-20 -mt-8 mx-4 md:mx-auto max-w-5xl rounded-2xl shadow-xl p-8 flex flex-col md:flex-row justify-around items-center gap-8 md:gap-4">
                {t.stats.map((stat, i) => (
                    <div key={i} className="text-center group">
                        <div className="text-4xl font-black text-blue-600 mb-1 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                        <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* What We Do */}
            <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{t.whatWeDo.title}</h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">{t.whatWeDo.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {t.whatWeDo.items.map((item, index) => (
                        <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                                <svg className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {item.content}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-slate-100 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-1/3 h-full bg-slate-200 skew-x-12 opacity-50 hidden lg:block"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8">{t.whyChooseUs.title}</h2>
                            <div className="space-y-8">
                                {t.whyChooseUs.items.map((item, index) => (
                                    <div key={index} className="flex gap-6">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                                            {item.id}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                            <p className="text-slate-600 text-lg">{item.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10">
                                <Link
                                    href="/contact-us"
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-full hover:bg-blue-700 hover:shadow-lg hover:scale-105"
                                >
                                    {locale === 'ar' ? 'تحدث معنا اليوم' : 'Talk with us today'}
                                </Link>
                            </div>
                        </div>
                        <div className="relative h-[500px] w-full hidden lg:block rounded-2xl overflow-hidden shadow-2xl">
                            {/* Placeholder for an image or generic stylized block if image is missing */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-white">
                                <div className="text-center p-10">
                                    <svg className="w-24 h-24 mx-auto mb-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-2xl font-medium opacity-90">Building Global Futures</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
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

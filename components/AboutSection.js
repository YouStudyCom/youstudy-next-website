import { useTranslation } from 'next-i18next';
import Link from 'next/link';

const AboutSection = () => {
    const { t } = useTranslation('common');

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
            {/* Decorator Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">

                    {/* Centered Title as requested */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">
                                {t('about_section.title')}
                            </span>
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16">

                        {/* Text Content */}
                        <div className="flex-1 text-center md:text-left rtl:md:text-right order-2 md:order-1">

                            <p className="text-xl text-gray-700 font-semibold mb-6 border-l-4 rtl:border-l-0 rtl:border-r-4 border-blue-500 pl-4 rtl:pl-0 rtl:pr-4">
                                {t('about_section.subtitle')}
                            </p>

                            <div className="text-gray-600 space-y-5 text-lg leading-relaxed text-justify">
                                <p>{t('about_section.description')}</p>
                                <p>{t('about_section.content_p1')}</p>
                                <p>{t('about_section.content_p2')}</p>
                            </div>

                            <div className="mt-10">
                                <Link
                                    href="/about-us"
                                    className="group inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3.5 px-8 rounded-full shadow-lg hover:shadow-blue-500/30 hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <span>{t('about_section.cta')}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Professional Icon / Visual */}
                        <div className="flex-1 order-1 md:order-2 flex justify-center">
                            <div className="relative w-72 h-72 md:w-96 md:h-96">
                                {/* Animated Circles */}
                                <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse opacity-50"></div>
                                <div className="absolute inset-4 bg-white rounded-full shadow-2xl flex items-center justify-center p-8 transform transition-transform hover:scale-105 duration-500 overflow-hidden">
                                    {/* Main Image: Logo instead of drawing */}
                                    {/* Using the logo icon as requested */}
                                    <img
                                        src="/android-chrome-512x512.png"
                                        alt="YouStudy"
                                        className="w-full h-full object-contain drop-shadow-sm"
                                    />

                                    {/* Floating Badges */}
                                    {/* "drawing one make instead of colored small one" -> Replaced emoji with the SVG */}
                                    <div className="absolute -top-4 -right-4 bg-white p-3 rounded-lg shadow-lg animate-bounce-subtle border border-gray-100 w-16 h-16 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                        </svg>
                                    </div>
                                    <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-lg shadow-lg animate-bounce-subtle delay-700 border border-gray-100">
                                        <span className="text-2xl">🌍</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 4s infinite ease-in-out;
                }
                .delay-700 {
                    animation-delay: 700ms;
                }
            `}</style>
        </section>
    );
};

export default AboutSection;

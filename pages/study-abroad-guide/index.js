import SEO from '../../components/SEO';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { destinations } from '../../data/destinations';
import { CollectionPageJsonLd } from 'next-seo';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ReadyToStudyAbroad from '../../components/ReadyToStudyAbroad';

export default function Destinations() {
    const router = useRouter();
    const { t } = useTranslation('common');
    const locale = router.locale || 'en';

    const canonicalUrl = `https://www.youstudy.com${locale === 'en' ? '' : '/' + locale}/study-abroad-guide`;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <SEO
                title={t('study_abroad_guide_seo.title')}
                description={t('study_abroad_guide_seo.description')}
                canonical={canonicalUrl}
                openGraph={{
                    url: canonicalUrl,
                    title: t('study_abroad_guide_seo.title'),
                    description: t('study_abroad_guide_seo.description'),
                    locale: locale,
                    site_name: 'YouStudy',
                }}
                keywords={t('study_abroad_guide_seo.keywords')}
            />

            <CollectionPageJsonLd
                name={t('study_abroad_guide_seo.title')}
                hasPart={destinations.map(dest => ({
                    '@type': 'EducationalOrganization',
                    name: dest.name[locale],
                    url: `https://www.youstudy.com/study-abroad-guide/${dest.slug}`,
                    description: dest.description[locale].replace(/<[^>]*>?/gm, ''), // Strip HTML
                    image: dest.image.startsWith('http') ? dest.image : `https://www.youstudy.com${dest.image.startsWith('/') ? '' : '/images/destinations/'}${dest.image}`
                }))}
            />

            <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <Breadcrumbs
                    items={[
                        { label: t('breadcrumbs.home'), href: '/' },
                        { label: t('breadcrumbs.study_abroad_guide'), isCurrent: true }
                    ]}
                />
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
                        {t('destinations.tag', 'Global Opportunities')}
                    </span>
                    <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4 text-center">
                        {t('study_abroad_guide_hero.title')}
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-500">
                        {t('study_abroad_guide_hero.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.map((dest, index) => (
                        <article
                            key={dest.id}
                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 flex flex-col group"
                        >
                            <div className="relative h-64 w-full bg-slate-200 overflow-hidden">
                                <Image
                                    src={
                                        dest.image.startsWith('http')
                                            ? dest.image
                                            : (dest.image.startsWith('/') ? dest.image : `/images/destinations/${dest.image}`)
                                    }
                                    alt={`Study in ${dest.name[locale]}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    priority={index < 2}
                                />
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
                                    <span className="text-white text-xs font-bold uppercase tracking-wider bg-blue-600/90 px-2 py-1 rounded inline-block">
                                        {dest.name[locale]}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {dest.name[locale]}
                                </h2>

                                <div
                                    className="text-slate-600 leading-relaxed mb-6 flex-1"
                                    dangerouslySetInnerHTML={{ __html: dest.description[locale] }}
                                />

                                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                    {/* <span className="text-sm text-slate-400 font-medium">Available Programs: 3</span> */}
                                    <Link href={`/study-abroad-guide/${dest.slug}`} className="text-blue-600 font-semibold text-sm hover:underline flex items-center gap-1">
                                        View Programs
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <ReadyToStudyAbroad />

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

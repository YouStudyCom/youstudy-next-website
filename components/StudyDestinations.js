import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { destinations } from '../data/destinations';
import { FaGlobeAmericas, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

export default function StudyDestinations({ destinations: propsDestinations }) {
    const { t } = useTranslation('common');
    const router = useRouter();
    const routerLocale = router.locale || 'en';
    const finalDestinations = propsDestinations || destinations;
    const locale = routerLocale;

    const getName = (data) => {
        if (!data) return '';
        if (typeof data === 'string') return data;
        return data[locale] || data['en'] || '';
    };

    const getDescription = (data) => {
        if (!data) return '';
        if (typeof data === 'string') return data;
        return data[locale] || data['en'] || '';
    };

    const getPrefixedName = (data) => {
        const name = getName(data);
        if (!name) return '';
        const lowerName = name.toLowerCase();
        if (lowerName.startsWith('study in') || lowerName.startsWith('الدراسة في')) {
            return name;
        }
        return `${t('destinations.study_in_prefix', 'Study in')} ${name}`;
    };

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-brand font-semibold tracking-wide uppercase text-sm">
                        {t('destinations.tag', 'Global Opportunities')}
                    </span>
                    <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
                        {t('destinations.title', 'Study Destinations')}
                    </h2>
                    <p className="max-w-2xl mx-auto text-xl text-slate-500">
                        {t('destinations.subtitle', 'Explore popular study destinations around the world and find the perfect place for your academic journey.')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {finalDestinations.map((destination) => (
                        <article
                            key={destination.id}
                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 flex flex-col group"
                        >
                            <div className="relative h-64 w-full bg-slate-200 overflow-hidden">
                                <Image
                                    src={destination.image.startsWith('http') || destination.image.startsWith('/')
                                        ? destination.image
                                        : `/images/destinations/${destination.image}`}
                                    alt={`${getPrefixedName(destination.name)} - Scenery`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
                                    <span className="text-white text-xs font-bold uppercase tracking-wider bg-[#187EBE] px-2 py-1 rounded inline-block">
                                        {getPrefixedName(destination.name)}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    <Link href={`/study-abroad-guide/${destination.slug}`} className="hover:text-blue-600 transition-colors">
                                        {getPrefixedName(destination.name)}
                                    </Link>
                                </h3>

                                <div
                                    className="text-slate-600 leading-relaxed mb-6 flex-1 line-clamp-3"
                                    dangerouslySetInnerHTML={{ __html: getDescription(destination.description) }}
                                />

                                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <Link
                                        href={`/study-abroad-guide/${destination.slug}`}
                                        className="text-blue-600 font-semibold text-sm hover:text-blue-800 flex items-center gap-1 group/link py-2"
                                        aria-label={`${t('destinations.learn_more', 'View Programs')} in ${getPrefixedName(destination.name)}`}
                                    >
                                        {locale === 'ar' ? `استكشف دليل ${getName(destination.name)}` : `Explore ${getName(destination.name)} Guide`}
                                        {locale === 'ar'
                                            ? <FaArrowLeft className="w-4 h-4 transform group-hover/link:-translate-x-1 transition-transform" />
                                            : <FaArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                                        }
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

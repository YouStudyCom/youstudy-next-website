import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { FaCalendarAlt, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

export default function RelatedArticles({ articles, locale, destinationSlug, fallbackImage }) {
    const { t } = useTranslation('common');

    if (!articles || articles.length === 0) {
        return null; // Return null to render nothing if there are no articles
    }

    // Helper to get localized string from potentially complex object
    const getName = (data) => {
        if (!data) return '';
        if (typeof data === 'object') return data[locale] || data['en'] || '';
        if (typeof data === 'string') {
            if (data.trim().startsWith('{')) {
                try {
                    const parsed = JSON.parse(data);
                    return parsed[locale] || parsed['en'] || data;
                } catch (e) {
                    return data;
                }
            }
            return data;
        }
        return '';
    };

    const resolveImagePath = (raw) => {
        // 1. Try Article Image
        if (raw) {
            if (raw.startsWith('http') || raw.startsWith('https')) return raw;
            if (raw.startsWith('/')) return raw;
            return `/gallery/blog/post/${raw}`;
        }
        // 2. Try Fallback Image (Destination Image)
        if (fallbackImage) {
            if (fallbackImage.startsWith('http') || fallbackImage.startsWith('https')) return fallbackImage;
            if (fallbackImage.startsWith('/')) return fallbackImage;
            return `/gallery/blog/post/${fallbackImage}`;
        }
        // 3. Default Placeholder
        return '/images/placeholders/study-placeholder.jpg';
    };

    return (
        <aside className="mt-20 border-t border-slate-200 pt-12">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {t('related_articles', locale === 'ar' ? 'مقالات ذات صلة' : 'Related Articles')}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => {
                    const title = getName(article.title);
                    const category = typeof article.category === 'object' ? (article.category?.name || '') : article.category;
                    const link = `/study-abroad-guide/${destinationSlug}/${article.slug}`;

                    return (
                        <Link
                            href={link}
                            key={article.id || article.slug}
                            className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 h-full"
                        >
                            {/* Image Container */}
                            <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                                <Image
                                    src={resolveImagePath(article.image)}
                                    alt={title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />

                                {/* Category Badge - Overlaid on Image Bottom Left */}
                                {category && (
                                    <div className="absolute bottom-4 left-4 z-10">
                                        <span className="bg-white/95 backdrop-blur-sm text-blue-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-wider">
                                            {category}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                {/* Date Line */}
                                <div className="flex items-center gap-2 text-slate-400 mb-3">
                                    <FaCalendarAlt className="w-3 h-3" />
                                    <time className="text-xs font-medium">
                                        {article.publishDate || article.created_at?.substring(0, 10)}
                                    </time>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {title}
                                </h3>

                                <div className="mt-auto pt-4 flex items-center text-blue-600 font-semibold text-sm group-hover:underline decoration-2 underline-offset-4">
                                    <span>{t('read_more', locale === 'ar' ? 'اقرأ المزيد' : 'Read More')}</span>
                                    {locale === 'ar'
                                        ? <FaArrowLeft className="mr-2 w-3 h-3 transform group-hover:-translate-x-1 transition-transform" />
                                        : <FaArrowRight className="ml-2 w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                                    }
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
}

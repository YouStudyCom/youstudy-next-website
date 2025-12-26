import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { FaCalendarAlt, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

export default function RelatedArticles({ articles, locale, destinationSlug }) {
    const { t } = useTranslation('common');

    if (!articles || articles.length === 0) {
        return null;
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
        if (!raw) return '/images/placeholders/study-placeholder.jpg'; // Fallback
        if (raw.startsWith('http') || raw.startsWith('/')) return raw;
        return `/gallery/blog/post/${raw}`;
    };

    return (
        <aside className="mt-16 border-t border-slate-200 pt-16">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {t('related_articles', locale === 'ar' ? 'مقالات ذات صلة' : 'Related Articles')}
                </h2>
                {/* Optional: View All Link could go here */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => {
                    const title = getName(article.title);
                    const category = typeof article.category === 'object' ? (article.category?.name || '') : article.category;
                    const link = `/study-abroad-guide/${destinationSlug}/${article.slug}`;

                    return (
                        <Link
                            href={link}
                            key={article.id}
                            className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:-translate-y-1"
                        >
                            {/* Image Container */}
                            <div className="relative w-full aspect-video overflow-hidden bg-slate-100">
                                <Image
                                    src={resolveImagePath(article.image)}
                                    alt={title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                {/* Category Badge */}
                                {category && (
                                    <div className="absolute top-4 left-4 right-auto bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                        {category}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 text-slate-400 text-xs mb-3">
                                    <FaCalendarAlt className="w-3 h-3" />
                                    <time>{article.publishDate || article.created_at?.substring(0, 10)}</time>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {title}
                                </h3>

                                <div className="mt-auto pt-4 flex items-center text-blue-600 font-semibold text-sm">
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

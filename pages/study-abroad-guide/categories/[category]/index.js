import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import SEO from '../../../../components/SEO';
import Image from 'next/image';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { siteConfig } from '../../../../data/siteConfig.mjs';
import ReadyToStudyAbroad from '../../../../components/ReadyToStudyAbroad';

export default function CategoryPage({ category, articles, locale: serverLocale }) {
    const router = useRouter();
    const { t } = useTranslation('common');
    const locale = serverLocale || router.locale;

    if (router.isFallback) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!category) {
        return <div className="min-h-screen flex items-center justify-center">Category not found</div>;
    }

    // Helper to resolve multilingual strings
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

    const getDescription = (data) => {
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

    // Category Name and Description
    // We assume 'category' prop is an object with name/description, or if we just have the slug we might need to derive it
    // For now, let's assume valid category object or at least slug
    // Dynamic Description Generator
    const generateDescription = (name, locale) => {
        if (locale === 'ar') {
            return `اكتشف كل ما تحتاج لمعرفته حول ${name} مع يوستدي. يغطي دليلنا الشامل نصائح أساسية، واستشارات من خبراء، وآخر التحديثات لمساعدتك في اتخاذ قرارات مستنيرة بشأن رحلتك للدراسة في الخارج. ابدأ استكشاف فرصك اليوم!`;
        }
        return `Discover everything you need to know about ${name} with YouStudy. Our comprehensive guide covers essential tips, expert advice, and the latest updates to help you make informed decisions about your study abroad journey. Start exploring your opportunities today!`;
    };

    // Category Name and Description
    const categoryName = getName(category.name) || category.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    // Use API description if available and robust, otherwise generate dynamic one
    let categoryDesc = getDescription(category.description);
    if (!categoryDesc || categoryDesc.length < 50) {
        categoryDesc = generateDescription(categoryName, locale);
    }

    // SEO
    const canonicalUrl = `https://www.youstudy.com${locale === 'en' ? '' : '/' + locale}/study-abroad-guide/categories/${category.slug}`;

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <SEO
                title={`${categoryName} - YouStudy`}
                description={categoryDesc}
                canonical={canonicalUrl}
                openGraph={{
                    url: canonicalUrl,
                    title: categoryName,
                    description: categoryDesc,
                    locale: locale,
                    site_name: 'YouStudy',
                }}
            />

            {/* Hero Section */}
            <div className="relative h-[40vh] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-slate-900 opacity-90"></div>
                {/* Optional: Add a pattern or generic image if no category image */}
                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
                        {categoryName}
                    </h1>
                    <p className="text-lg text-blue-100 font-medium max-w-2xl mx-auto">
                        {categoryDesc}
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <Breadcrumbs
                    items={[
                        { label: t('breadcrumbs.home'), href: '/' },
                        { label: t('breadcrumbs.study_abroad_guide'), href: '/study-abroad-guide' },
                        { label: categoryName, isCurrent: true }
                    ]}
                />

                {/* Articles Grid */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                            {locale === 'ar' ? 'المقالات المختارة' : 'Featured Articles'}
                        </h2>
                        <span className="hidden md:block h-px flex-1 bg-slate-200 mx-6"></span>
                        <span className="text-sm font-medium text-slate-500">
                            {articles.length} {locale === 'ar' ? 'مقال' : 'Articles'}
                        </span>
                    </div>
                    {articles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map((article) => (
                                <Link
                                    key={article.id}
                                    // LINK TO DESTINATION URL standard
                                    href={`/study-abroad-guide/${article.destination_slug || 'general'}/${article.slug}`}
                                    className="block group bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full"
                                >
                                    <article className="flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-blue-600 uppercase tracking-wider">
                                            <span className="bg-blue-50 px-2 py-1 rounded">
                                                {categoryName}
                                            </span>
                                            <time dateTime={article.publishDate} className="text-slate-400 font-normal">
                                                {article.publishDate}
                                            </time>
                                        </div>

                                        {article.image && (
                                            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-slate-100">
                                                <Image
                                                    src={article.image.startsWith('http') ? article.image : `/gallery/blog/post/${article.image}`}
                                                    alt={getName(article.title)}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}

                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-3 leading-tight">
                                            {getName(article.title)}
                                        </h3>
                                        <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                                            {getDescription(article.excerpt || article.seo_description)}
                                        </p>
                                        <div className="mt-auto flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                            {locale === 'ar' ? 'اقرأ الدليل' : 'Read Guide'}
                                            <span className="sr-only"> {t('about', 'about')} {getName(article.title)}</span>
                                            <svg className={`w-4 h-4 ${locale === 'ar' ? 'mr-1 rotate-180' : 'ml-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                            <h3 className="text-lg font-medium text-slate-900 mb-2">
                                {locale === 'ar' ? 'لا توجد مقالات' : 'No articles found'}
                            </h3>
                            <p className="text-slate-500">
                                {locale === 'ar' ? 'لم يتم العثور على مقالات في هذا القسم حالياً.' : 'There are no articles in this category yet.'}
                            </p>
                        </div>
                    )}
                </section>

                <ReadyToStudyAbroad />
            </main>
        </div>
    );
}

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking',
    };
}

// Manual Category Translations Map
const CATEGORY_TRANSLATIONS = {
    'choosing-where-to-study': {
        en: 'Choosing Where to Study',
        ar: 'اختيار وجهة الدراسة'
    },
    'getting-your-visa': {
        en: 'Getting Your Visa',
        ar: 'الحصول على التأشيرة'
    },
    'latest-news-scholarships': {
        en: 'Latest News & Scholarships',
        ar: 'آخر الأخبار والمنح الدراسية'
    },
    'post-study-life': {
        en: 'Post-Study Life',
        ar: 'الحياة بعد التخرج'
    },
    'choosing-a-subject': {
        en: 'Choosing a Subject',
        ar: 'اختيار التخصص'
    },
    'applying-to-a-university': {
        en: 'Applying to a University',
        ar: 'التقديم للجامعة'
    },
    'study-accommodation-costs': {
        en: 'Study & Accommodation Costs',
        ar: 'تكاليف الدراسة والسكن'
    },
    'once-you-arrive': {
        en: 'Once You Arrive',
        ar: 'عند الوصول'
    },
    'before-you-leave': {
        en: 'Before You Leave',
        ar: 'قبل السفر'
    },
    'your-first-step-in-studying-abroad': {
        en: 'Your First Step in Studying Abroad',
        ar: 'خطوتك الأولى للدراسة في الخارج'
    }
};

export async function getStaticProps({ params, locale }) {
    const { category: categorySlug } = params;
    let filteredArticles = [];

    // Default Category Object structure
    let category = {
        slug: categorySlug,
        name: {
            en: categorySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            ar: categorySlug.replace(/-/g, ' ')
        },
        description: { en: '', ar: '' }
    };

    // 1. Check if we have a manual translation for this slug
    if (CATEGORY_TRANSLATIONS[categorySlug]) {
        category.name = CATEGORY_TRANSLATIONS[categorySlug];
    }

    // 2. Attempt to fetch localized articles from API (especially for non-English)
    // This ensures we get specific language titles (e.g. Arabic) instead of default cache (English)
    if (locale !== 'en') {
        try {
            const { api } = await import('../../../../lib/api.mjs');
            // Construct endpoint: /api/categories/{slug}/articles
            const cmsUrl = siteConfig.api.baseUrl.cms;
            const apiUrl = `${cmsUrl}/api/categories/${categorySlug}/articles`;

            const res = await fetch(apiUrl, {
                headers: {
                    'language': locale,
                    'Accept': 'application/json'
                }
            });

            if (res.ok) {
                const apiData = await res.json();
                const apiArticles = Array.isArray(apiData) ? apiData : (apiData.data || []);

                if (apiArticles.length > 0) {
                    // Transform API articles to match our internal structure
                    filteredArticles = apiArticles.map(article => {
                        // Resolve Destination Slug for URL generation if missing
                        let destSlug = 'general';
                        if (article.destination_slug) {
                            destSlug = article.destination_slug;
                        } else if (article.destination && article.destination.slug) {
                            destSlug = article.destination.slug;
                        }

                        return {
                            ...article,
                            destination_slug: destSlug,
                            // Ensure we use the title from API which respects the 'language' header
                            title: article.title,
                            // Use raw excerpt or description from API
                            excerpt: article.excerpt || article.seo_description || article.metaDescription || null,
                            image: article.image || (article.destination ? article.destination.image : null) || null,
                            category: {
                                slug: categorySlug,
                                name: article.category ? article.category.name : category.name
                            }
                        };
                    });
                }
            }
        } catch (apiError) {
            console.warn(`[CategoryPage] API fetch failed for ${categorySlug}, falling back to cache:`, apiError);
        }
    }

    // 3. Fallback to Cache if API returned nothing (or if we are in EN and rely on cache)
    if (filteredArticles.length === 0) {
        try {
            // Load articles from local cache which is enriched with categories
            const articlesCache = (await import('../../../../data/articles-cache.json')).default;

            if (Array.isArray(articlesCache)) {
                filteredArticles = articlesCache.filter(a => {
                    if (!a.category) return false;

                    const catSlug = typeof a.category === 'object' ? a.category.slug : a.category_slug;
                    // Check 1: Exact Slug Match
                    if (catSlug && catSlug === categorySlug) return true;
                    return false;
                });

                // Map articles to ensure they have necessary fields for the UI
                filteredArticles = filteredArticles.map(article => {
                    // Resolve Destination Slug for URL generation
                    let destSlug = 'general';
                    if (article.destination_slug) {
                        destSlug = article.destination_slug;
                    } else if (article.destination && article.destination.slug) {
                        destSlug = article.destination.slug;
                    }

                    return {
                        ...article,
                        destination_slug: destSlug || null,
                        title: article.title || null,
                        excerpt: article.excerpt || article.seo_description || article.metaDescription || null,
                        image: article.image || (article.destination ? article.destination.image : null) || null
                    };
                });

                // Update Category Description from the first matching article if available (optional enhancement)
                // But KEEP our manual name translation as the source of truth if it exists
                if (filteredArticles.length > 0) {
                    const first = filteredArticles[0];
                    if (first.category && typeof first.category === 'object') {
                        category = {
                            ...category,
                            description: first.category.description || category.description,
                            // Ensure slug matches
                            slug: first.category.slug || categorySlug
                        };

                        // Only overwrite name if we DON'T have a manual translation
                        if (!CATEGORY_TRANSLATIONS[categorySlug]) {
                            category.name = first.category.name || category.name;
                        }
                    }
                }
            }
        } catch (e) {
            console.warn(`Failed to load cached articles for ${categorySlug}`, e);
        }
    }

    return {
        props: {
            category,
            articles: filteredArticles,
            locale,
            ...(await serverSideTranslations(locale, ['common'])),
        },
        revalidate: 60
    };
}

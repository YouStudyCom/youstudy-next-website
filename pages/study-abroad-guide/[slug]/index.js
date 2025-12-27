import { useRouter } from 'next/router';
import { FAQPageJsonLd } from 'next-seo';
import Breadcrumbs from '../../../components/Breadcrumbs';
import SEO from '../../../components/SEO';
import Image from 'next/image';
import Link from 'next/link';
import { destinations } from '../../../data/destinations';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import articlesCache from '../../../data/articles-cache.json';
import { useTranslation } from 'next-i18next';
import { siteConfig } from '../../../data/siteConfig.mjs';
import ReadyToStudyAbroad from '../../../components/ReadyToStudyAbroad';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useState, useEffect, useRef } from 'react';

export default function DestinationLandingPage({ destination, articles, locale: serverLocale }) {
    const router = useRouter();
    const { t } = useTranslation('common');
    const locale = serverLocale || router.locale;
    const faqData = t('faq', { returnObjects: true });

    // Infinite Scroll State
    const [visibleCount, setVisibleCount] = useState(15);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const observerTarget = useRef(null);

    const visibleArticles = articles.slice(0, visibleCount);
    const hasMore = visibleCount < articles.length;

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                    setIsLoadingMore(true);
                    // Simulate a small delay for better UX (optional) or just load instantly
                    setTimeout(() => {
                        setVisibleCount(prev => prev + 10);
                        setIsLoadingMore(false);
                    }, 500);
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, isLoadingMore]);

    // Fallback for isFallback state
    if (router.isFallback) {
        return <LoadingSpinner />;
    }

    if (!destination) {
        return <div className="min-h-screen flex items-center justify-center">Destination not found</div>;
    }

    // Determine values based on locale (handle Object, JSON String, or String structures)
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

    const destName = getName(destination.name);
    const destDescription = getDescription(destination.description);

    // Helper to resolve resolved image path
    const getImagePath = (img) => {
        if (!img) return null;
        if (img.startsWith('http')) return img;
        if (img.startsWith('/')) return img;
        return `/images/destinations/${img}`;
    };

    const imagePath = getImagePath(destination.image);

    // Safely access SEO or fallback to main content
    const seoTitle = destination.seo ? getName(destination.seo.title) : destName;
    const seoDesc = destination.seo ? getDescription(destination.seo.description) : destDescription.substring(0, 160);
    const seoKeywords = destination.seo ? getName(destination.seo.keywords) : '';

    // Dynamic Canonical URL
    const canonicalUrl = `https://www.youstudy.com${locale === 'en' ? '' : '/' + locale}/study-abroad-guide/${destination.slug}`;

    const placeSchema = {
        "@context": "https://schema.org",
        "@type": "AdministrativeArea",
        "name": destName,
        "description": seoDesc,
        "url": canonicalUrl,
        "image": imagePath ? (imagePath.startsWith('http') ? imagePath : `https://www.youstudy.com${imagePath}`) : undefined,
        "containsPlace": articles.map(a => ({
            "@type": "Article",
            "name": a.title,
            "url": `https://www.youstudy.com/study-abroad-guide/${destination.slug}/${a.slug}`
        }))
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <SEO
                title={seoTitle}
                description={seoDesc}
                canonical={canonicalUrl}
                openGraph={{
                    url: canonicalUrl,
                    title: seoTitle,
                    description: seoDesc,
                    locale: locale,
                    site_name: 'YouStudy',
                    images: [
                        {
                            url: imagePath?.startsWith('http') ? imagePath : `https://www.youstudy.com${imagePath}`,
                            alt: destName,
                        },
                    ],
                }}
                keywords={seoKeywords}
            >
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
                />
            </SEO>

            {Array.isArray(faqData) && (
                <FAQPageJsonLd
                    mainEntity={faqData.map((item) => ({
                        questionName: item.question,
                        acceptedAnswerText: item.answer,
                    }))}
                />
            )}

            {/* Hero Section */}
            <div className="relative h-[50vh] w-full bg-slate-900 overflow-hidden">
                {imagePath && (
                    <Image
                        src={imagePath}
                        alt={destName}
                        fill
                        className="object-cover opacity-40"
                        priority
                    />
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
                        {destName}
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl font-medium drop-shadow-md">
                        {seoDesc}
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <Breadcrumbs
                    items={[
                        { label: t('breadcrumbs.home'), href: '/' },
                        { label: t('breadcrumbs.study_abroad_guide'), href: '/study-abroad-guide' },
                        { label: destName, isCurrent: true }
                    ]}
                />

                {/* Overview Section */}
                <section className="mb-16 text-center">
                    <div
                        className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed prose prose-slate"
                        dangerouslySetInnerHTML={{ __html: destDescription }}
                    />
                </section>

                {/* Articles Grid Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center sm:text-left border-b border-slate-200 pb-4">
                        {locale === 'ar' ? 'أحدث المقالات والأدلة' : 'Latest Articles & Guides'}
                    </h2>

                    {articles.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {visibleArticles.map((article) => (
                                    <Link
                                        key={article.id}
                                        href={`/study-abroad-guide/${destination.slug}/${article.slug}`}
                                        className="block group bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full"
                                    >
                                        <article className="flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-blue-600 uppercase tracking-wider">
                                                <span className="bg-blue-50 px-2 py-1 rounded">
                                                    {article.category}
                                                </span>
                                                <time dateTime={article.publishDate} className="text-slate-400 font-normal">
                                                    {article.publishDate}
                                                </time>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-3 leading-tight">
                                                {getName(article.title)}
                                            </h3>
                                            {/* Added min-height to reduce layout shift if excerpts vary */}
                                            <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3 min-h-[4.5rem]">
                                                {getDescription(article.excerpt)}
                                            </p>
                                            <div className="mt-auto flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                                {locale === 'ar' ? 'اقرأ المزيد' : 'Read Article'}
                                                <svg className={`w-4 h-4 ${locale === 'ar' ? 'mr-1 rotate-180' : 'ml-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>

                            {/* Infinite Scroll Loader & Sentinel */}
                            {hasMore && (
                                <div ref={observerTarget} className="mt-12 flex justify-center py-4">
                                    {isLoadingMore ? (
                                        <div className="flex flex-col items-center space-y-2">
                                            {/* Inline Spinner matching Professional Brand */}
                                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                            <span className="text-sm text-slate-500 font-medium">
                                                {locale === 'ar' ? 'جارٍ تحميل المزيد...' : 'Loading more articles...'}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="h-4"></div> // Trigger area
                                    )}
                                </div>
                            )}

                            {!hasMore && articles.length > 0 && (
                                <div className="mt-12 text-center text-slate-400 text-sm italic">
                                    {locale === 'ar' ? 'لقد شاهدت جميع المقالات' : 'You have viewed all articles.'}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
                            {locale === 'ar' ? 'لا توجد مقالات متاحة حالياً.' : 'No articles available yet.'}
                        </div>
                    )}
                </section>

                {/* CTA */}
                {/* CTA */}
                <ReadyToStudyAbroad name={destName} />

            </main>
        </div>
    );
}

export async function getStaticPaths() {
    // Optimization: Do not pre-render all destinations at build time to avoid partial build failures due to API rate limits.
    // Allow ISR (Incremental Static Regeneration) to build pages on demand.
    return {
        paths: [],
        fallback: 'blocking',
    };
}

export async function getStaticProps({ params, locale }) {
    const { slug } = params;
    let destination = null;
    let articles = [];

    // 1. Try Fetching from API (ISR)
    try {
        const { api } = await import('../../../lib/api.mjs');
        const dests = await api.fetch('/api/destinations', {
            headers: {
                'language': locale,
                'Accept': 'application/json'
            }
        });
        const destList = Array.isArray(dests) ? dests : (dests.data || []);
        destination = destList.find(d => d.slug?.toLowerCase() === slug.toLowerCase());
    } catch (e) {
        console.warn(`ISR Fetch failed for ${slug}. Using Local Data.`);
    }

    // 2. Fallback: If API failed to find destination, look it up in local rich data
    if (!destination) {
        destination = destinations.find(d => d.slug.toLowerCase() === slug.toLowerCase());
    }

    // 3. Fetch Articles (ISR) if destination is known (either from API or Local)
    try {
        if (destination) {
            // Using raw fetch to ensure headers are passed exactly as in article page
            const apiUrl = `${siteConfig.api.baseUrl.cms}/api/destinations/${destination.slug}/articles`;
            // Use api.fetch to ensure consistent headers and auth if needed
            const artRes = await fetch(apiUrl, {
                headers: {
                    'language': locale,
                    'Accept': 'application/json'
                }
            });

            if (artRes.ok) {
                const artData = await artRes.json();
                const artList = Array.isArray(artData) ? artData : (artData.articles || artData.data || []);
                articles = artList.map(a => ({ ...a, destination_slug: destination.slug }));
            }
        }
    } catch (e) {
        console.warn(`ISR Fetch failed for articles. Using Local Data.`);
    }

    // Fallback: If API returned no articles, try local cache
    if (articles.length === 0 && Array.isArray(articlesCache)) {
        console.log(`[Resilience] Using local cache for articles in ${slug}`);
        const cachedArticles = articlesCache.filter(a => a.destination_slug === destination?.slug || a.destination?.slug === destination?.slug);
        if (cachedArticles.length > 0) {
            articles = cachedArticles;
        }
    }

    // Filter articles ensuring sufficient content depth for current locale (>15 chars)
    // Relaxed from 30 to 15 to catch short valid descriptions, and added robust key checking.
    articles = articles.filter(article => {
        let content = article.content;
        if (!content) return false;

        let text = '';
        if (typeof content === 'string') {
            const trimmed = content.trim();
            if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
                try {
                    const parsed = JSON.parse(trimmed);
                    // 1. Try exact locale
                    // 2. Try partial locale (e.g. 'ar' for 'ar-SA') if exact fails
                    text = parsed[locale] || parsed[locale.split('-')[0]];

                    // 3. Fallback: Check for case-insensitive keys (e.g. 'Ar', 'Arabic')
                    if (!text && typeof parsed === 'object') {
                        const matchKey = Object.keys(parsed).find(k => k.toLowerCase() === locale.toLowerCase() || k.toLowerCase().startsWith(locale.toLowerCase()));
                        if (matchKey) text = parsed[matchKey];
                    }
                } catch (e) {
                    text = content; // Parse failed, assumes string content
                }
            } else {
                text = content;
            }
        } else if (typeof content === 'object') {
            // Handle if content is already an object
            text = content[locale] || content[locale.split('-')[0]] || '';
            if (!text) {
                const matchKey = Object.keys(content).find(k => k.toLowerCase() === locale.toLowerCase() || k.toLowerCase().startsWith(locale.toLowerCase()));
                if (matchKey) text = content[matchKey];
            }
        }

        if (!text) return false;

        // Strip HTML tags to check real text length
        const cleanText = text.replace(/<[^>]*>?/gm, '').trim();
        // Use 15 chars as a safer lower limit
        return cleanText.length >= 15;
    });

    // 2. Always prefer Local Rich Data for the Destination Detail (Title/Desc/SEO) for bilingual consistency
    // The API might return non-localized strings depending on backend state, but our file is authoritative for UI text.
    const richDestination = destinations.find(d => d.slug.toLowerCase() === slug.toLowerCase());

    if (richDestination) {
        // Use the rich data, but keep articles from API if we found them
        destination = { ...richDestination };
    } else if (!destination) {
        // Try deprecated cache if rich data missing (unlikely)
        // ... (removed deprecated cache usage)
    }

    if (!destination) {
        return {
            notFound: true,
            revalidate: 60
        };
    }

    return {
        props: {
            destination,
            articles,
            locale, // Pass locale explicitly to ensure hydration matches server render
            ...(await serverSideTranslations(locale, ['common'])),
        },
        revalidate: 60,
    };
}

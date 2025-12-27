import { useRouter } from 'next/router';
import { ArticleJsonLd } from 'next-seo';
import Breadcrumbs from '../../../components/Breadcrumbs';
import SEO from '../../../components/SEO';
import Link from 'next/link';
import Image from 'next/image';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import articlesCache from '../../../data/articles-cache.json';
import { destinations } from '../../../data/destinations'; // Use rich bilingual data
// import destinationsCache from '../../../data/destinations-cache.json'; // Deprecated
import { siteConfig } from '../../../data/siteConfig.mjs';
import ReadyToStudyAbroad from '../../../components/ReadyToStudyAbroad';
import { useTranslation } from 'next-i18next';
import { cleanHtml } from '../../../lib/cleanHtml';
import LoadingSpinner from '../../../components/LoadingSpinner';



// ... (imports remain)

export default function ArticlePage({ article, destination, locale: serverLocale }) {
    const router = useRouter();
    const { t } = useTranslation('common');
    const locale = serverLocale || router.locale;

    if (router.isFallback) {
        return <LoadingSpinner />;
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Article not found</h1>
                <Link href="/" className="text-blue-600 hover:underline">Return Home</Link>
            </div>
        );
    }

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

    // cleanHTML function replaced by imported cleanHtml utility

    const destName = destination ? getName(destination.name) : 'Destination';
    const articleTitle = getName(article.title);
    // Prioritize seo_description from DB, then explicit excerpt, then metaDescription
    let articleExcerpt = getDescription(article.seo_description || article.excerpt || article.metaDescription);
    if (articleExcerpt && articleExcerpt.length > 300) {
        articleExcerpt = articleExcerpt.substring(0, 300) + '...';
    }
    const articleKeywords = getName(article.seo_keywords);
    const articleContent = cleanHtml(getDescription(article.content));

    const resolveImagePath = (raw) => {
        if (!raw) return null;
        if (raw.startsWith('http') || raw.startsWith('/')) return raw;
        return `/gallery/blog/post/${raw}`;
    };

    const articleUrl = `https://www.youstudy.com/study-abroad-guide/${destination?.slug}/${article.slug}`;
    const destinationUrl = `https://www.youstudy.com/study-abroad-guide/${destination?.slug}`;

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <SEO
                title={articleTitle}
                description={articleExcerpt}
                keywords={articleKeywords}
                canonical={articleUrl}
                openGraph={{
                    url: articleUrl,
                    title: articleTitle,
                    description: articleExcerpt,
                    type: 'article',
                    article: {
                        publishedTime: article.publishDate,
                        authors: [siteConfig.metadata.siteName],
                        tags: [typeof article.category === 'string' ? article.category : article.category?.name],
                    },
                    images: [
                        {
                            url: resolveImagePath(article.image || destination?.image) || '',
                            alt: articleTitle,
                        },
                    ],
                }}
            />
            <ArticleJsonLd
                url={articleUrl}
                title={articleTitle}
                images={[
                    resolveImagePath(article.image || destination?.image) || ''
                ]}
                datePublished={article.publishDate}
                authorName={[siteConfig.metadata.siteName]}
                publisherName={siteConfig.metadata.siteName}
                publisherLogo={`${siteConfig.metadata.siteUrl}/logo.png`}
                description={articleExcerpt}
                isAccessibleForFree={true}
            />


            <main className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
                <Breadcrumbs
                    items={[
                        { label: t('breadcrumbs.home'), href: '/' },
                        { label: t('breadcrumbs.study_abroad_guide'), href: '/study-abroad-guide' },
                        { label: destName, href: `/study-abroad-guide/${destination?.slug}` },
                        { label: articleTitle, isCurrent: true }
                    ]}
                />

                {/* Content Container */}

                <article>
                    {/* Header */}
                    <header className="mb-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide rounded-full">
                                {typeof article.category === 'object' && article.category !== null ? (article.category.name || '') : article.category}
                            </span>
                            <time className="text-slate-500 text-sm">{article.publishDate}</time>
                        </div>

                        {/* Creative Featured Image */}
                        {(article.image || destination?.image) && (
                            <div className="relative w-full h-[300px] md:h-[450px] mb-8 rounded-2xl overflow-hidden shadow-2xl group">
                                <Image
                                    src={resolveImagePath(article.image || destination?.image)}
                                    alt={articleTitle}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
                            </div>
                        )}
                        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                            {articleTitle}
                        </h1>
                        <div className="text-xl text-slate-600 leading-relaxed border-l-4 border-blue-600 pl-6 italic">
                            {articleExcerpt}
                        </div>
                    </header>

                    {/* Content Section */}
                    {/* Note: This is static for now, in a real dynamic app this would come from the article data too (e.g. article.content) */}
                    <div className="prose prose-2xl prose-slate max-w-none 
                        prose-headings:font-bold prose-headings:text-slate-900 
                        prose-p:leading-loose prose-p:text-slate-700
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-slate-900">

                        {articleContent ? (
                            <div dangerouslySetInnerHTML={{ __html: articleContent }} />
                        ) : (
                            <>
                                <p>
                                    Studying abroad is a transformative experience that opens doors to new cultures,
                                    world-class education, and career opportunities. As you consider <strong>{articleTitle}</strong>,
                                    it is essential to understand the key factors that will shape your journey.
                                </p>
                                {/* Static content logic can remain as fallback or generally we assume API gives content */}
                            </>
                        )}
                    </div>



                    <ReadyToStudyAbroad name={getName(destination?.name)} />

                </article>
            </main>
        </div>
    );
}

export async function getStaticPaths() {
    // Optimization: Do not pre-render all articles at build time.
    // Use ISR with blocking fallback to generate pages on first request.
    return {
        paths: [],
        fallback: 'blocking'
    };
}

export async function getStaticProps({ params, locale }) {
    const { slug, articleSlug } = params;

    let article = null;


    const destination = destinations.find(d => d.slug.toLowerCase() === slug.toLowerCase());

    try {
        const { api } = await import('../../../lib/api.mjs');
        // Use default URL if siteConfig is not fully populated in this context, 
        // though siteConfig usage in other files implies it works.
        // We'll trust the existing pattern: siteConfig.api.baseUrl.cms
        const baseUrl = siteConfig.api.baseUrl.cms;
        const apiUrl = `${baseUrl}${siteConfig.api.endpoints.cms.articles}/${articleSlug}`;

        // 1. Fetch Main Article
        const res = await fetch(apiUrl, {
            headers: {
                'language': locale,
                'Accept': 'application/json'
            },
        });

        if (res.ok) {
            const apiData = await res.json();
            const freshArticle = apiData.data || apiData;
            if (freshArticle && (freshArticle.title || freshArticle.id)) {
                article = freshArticle;

                // Validate Content Availability for Current Locale
                // Checks if title/content are JSON strings that missing current locale AND 'en' fallback
                const hasUsableContent = (field) => {
                    if (!field) return false;
                    if (typeof field === 'string' && field.trim().startsWith('{')) {
                        try {
                            const parsed = JSON.parse(field);
                            // If current locale exists, it's good.
                            if (parsed[locale]) return true;
                            // If 'en' fallback exists, it's good (standard fallback policy).
                            if (parsed['en']) return true;
                            // Otherwise, it's unusable (e.g. only 'ar' content when viewing 'en')
                            return false;
                        } catch (e) {
                            return true; // Assume plain string
                        }
                    }
                    return true; // Plain string or object
                };

                // Stricter check: If content is missing/unusable, treat article as not found 
                // so we can trigger the standard fallback logic (check English or redirect to destination).
                // We use OR logic here: if EITHER title OR content is unusable, we consider the article invalid for this view.
                if (!hasUsableContent(article.title) || !hasUsableContent(article.content)) {
                    console.log(`[SmartRedirect] Article ${articleSlug} has unusable content for ${locale}. Triggering fallbacks.`);
                    article = null;
                    // Do NOT return redirect here; let it fall through to the logic below 
                    // which checks for English version (if we are in non-En) or eventually redirects to destination.
                }
            }
        }

        // B. Smart Redirect Logic: If missing in non-English locale, check if it exists in English
        if (!article && locale !== 'en' && destination) {
            try {
                const resEn = await fetch(apiUrl, {
                    headers: {
                        'language': 'en', // Force English check
                        'Accept': 'application/json'
                    },
                });

                if (resEn.ok) {
                    const apiDataEn = await resEn.json();
                    const articleEn = apiDataEn.data || apiDataEn;

                    if (articleEn && (articleEn.title || articleEn.id)) {
                        // Article exists in English -> Redirect to Destination Guide in current locale
                        // Using permanent: false (Status 307/302) because the translation might be added later.
                        console.log(`[SmartRedirect] Article ${articleSlug} missing in ${locale} but found in EN. Redirecting.`);
                        return {
                            redirect: {
                                destination: `/study-abroad-guide/${articleEn.destination?.slug || destination?.slug}/${articleEn.slug || articleSlug}`,
                                locale: 'en',
                                permanent: false,
                            },
                        };
                    }
                }
            } catch (innerError) {
                console.warn(`Fallback fetch failed for ${articleSlug}:`, innerError);
            }
        }

    } catch (error) {
        console.warn(`Failed to fetch article from API: ${error.message}.`);
    }

    // Fallback: Use local cache if API failed
    if (!article && Array.isArray(articlesCache)) {
        console.log(`[Resilience] Using local cache for article: ${articleSlug}`);
        const cachedArticle = articlesCache.find(a => a.slug === articleSlug);
        if (cachedArticle) {
            article = cachedArticle;
        }
    }

    // If article is still not found after all attempts (API, En-fallback, Cache), 
    // but the destination is valid, redirect to the destination's main page instead of 404.
    if (!article && destination) {
        console.log(`[SmartRedirect] Article ${articleSlug} not found in ${locale} (and no suitable fallback). Redirecting to destination.`);
        return {
            redirect: {
                destination: `/study-abroad-guide/${destination.slug}`,
                permanent: false,
            },
        };
    }

    if (!article || !destination) {
        console.warn(`[ArticlePage] 404 triggered. Article: ${!!article}, Destination: ${!!destination}`);
        // If destination mismatch (rare if we found it by slug, but potential data issue)
        // Case-insensitive check for destination_slug
        const articleDestSlug = article?.destination_slug || article?.destination?.slug;
        if (article && articleDestSlug && articleDestSlug.toLowerCase() !== slug.toLowerCase()) {
            console.warn(`[ArticlePage] Destination mismatch. Article Dest: ${articleDestSlug}, URL Slug: ${slug}`);
            // If mismatch is found, we should ideally redirect to the correct URL for this article
            return {
                redirect: {
                    destination: `/study-abroad-guide/${articleDestSlug}/${article.slug}`,
                    permanent: false,
                }
            };
        }

        // If destination is invalid (and no article), return 404
        return { notFound: true };

        // If destination is invalid (and no article), return 404
        return { notFound: true };
    }

    return {
        props: {
            article,
            destination,

            locale,
            ...(await serverSideTranslations(locale, ['common'])),
        },
        revalidate: 60,
    };
}


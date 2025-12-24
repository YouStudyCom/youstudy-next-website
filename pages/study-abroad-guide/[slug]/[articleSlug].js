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

export default function ArticlePage({ article, destination, locale: serverLocale }) {
    const router = useRouter();
    const { t } = useTranslation('common');
    const locale = serverLocale || router.locale;

    if (router.isFallback) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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

    const cleanHTML = (html) => {
        if (!html || typeof html !== 'string') return '';

        let cleaned = html;

        // 1. Globally remove style, width, height, dir, lang attributes from ALL tags
        cleaned = cleaned
            .replace(/\s(style|width|height|dir|lang)="[^"]*"/gi, '')
            .replace(/\s(style|width|height|dir|lang)='[^']*'/gi, '');

        // 2. Remove 'class' attribute from all tags EXCEPT iframe and a (links)
        cleaned = cleaned.replace(/<([a-z0-9]+)\s+([^>]+)>/gi, (match, tagName, attrs) => {
            const lowerTag = tagName.toLowerCase();
            // Preserve class for iframes (embeds) and a (links)
            if (lowerTag === 'iframe' || lowerTag === 'a') {
                return match;
            }
            // For everything else, strip class
            return match
                .replace(/\sclass="[^"]*"/gi, '')
                .replace(/\sclass='[^']*'/gi, '');
        });

        // 3. Magic Video View: Wrap iframes in responsive container
        cleaned = cleaned.replace(/(<iframe[^>]*>.*?<\/iframe>)/gi, (match) => {
            // Add full width/height classes to the iframe itself
            const styledIframe = match.replace(/<iframe/i, '<iframe class="w-full h-full"');
            // Wrap in aspect-ratio container
            return `<div class="relative w-full aspect-video my-8 rounded-xl overflow-hidden shadow-2xl bg-black">${styledIframe}</div>`;
        });

        // 4. Remove legacy/empty tags
        return cleaned
            .replace(/<p[^>]*>(\s|&nbsp;)*<\/p>/gi, '')
            .replace(/<\/?font[^>]*>/gi, '')
            .replace(/<\/?span[^>]*>/gi, '');
    };

    const destName = destination ? getName(destination.name) : 'Destination';
    const articleTitle = getName(article.title);
    // Prioritize seo_description from DB, then explicit excerpt, then metaDescription
    let articleExcerpt = getDescription(article.seo_description || article.excerpt || article.metaDescription);
    if (articleExcerpt && articleExcerpt.length > 300) {
        articleExcerpt = articleExcerpt.substring(0, 300) + '...';
    }
    const articleKeywords = getName(article.seo_keywords);
    const articleContent = cleanHTML(getDescription(article.content));

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
                            url: (() => {
                                const raw = article.image || destination?.image;
                                if (!raw) return '';
                                const filename = raw.split('/').pop().split('?')[0];
                                return `/gallery/blog/post/${filename}`;
                            })(),
                            alt: articleTitle,
                        },
                    ],
                }}
            />
            <ArticleJsonLd
                url={articleUrl}
                title={articleTitle}
                images={[
                    (() => {
                        const raw = article.image || destination?.image;
                        if (!raw) return '';
                        const filename = raw.split('/').pop().split('?')[0];
                        return `/gallery/blog/post/${filename}`;
                    })()
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
                                    src={(() => {
                                        const raw = article.image || destination.image;
                                        const filename = raw.split('/').pop().split('?')[0];
                                        return `/gallery/blog/post/${filename}`;
                                    })()}
                                    alt={articleTitle}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
                            </div>
                        )}
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
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

    // 1. Initial State: Null (Do not use cache as per user request)
    let article = null;

    // 2. Find Destination in Rich Data
    const destination = destinations.find(d => d.slug.toLowerCase() === slug.toLowerCase());

    // 3. Attempt to fetch fresh data from API
    try {
        const { api } = await import('../../../lib/api.mjs');

        const apiUrl = `${siteConfig.api.baseUrl.cms}${siteConfig.api.endpoints.cms.articles}/${articleSlug}`;
        const res = await fetch(apiUrl, {
            headers: {
                'language': locale, // 👈 sent to Laravel
            },
        });

        if (res.ok) {
            const apiData = await res.json();
            const freshArticle = apiData.data || apiData;
            // Validate and assign
            if (freshArticle && (freshArticle.title || freshArticle.id)) {
                article = freshArticle;
            }
        }
    } catch (error) {
        console.warn(`Failed to fetch article from API: ${error.message}.`);
    }

    if (!article || !destination) {
        // If article exists but slug mismatch (e.g. wrong destination in url)
        if (article && article.destination_slug && article.destination_slug !== slug) {
            return { notFound: true };
        }
        // Strict check: if no article found in cache OR api, 404
        if (!article) return { notFound: true };
    }

    return {
        props: {
            article,
            destination, // Rich object
            locale,
            ...(await serverSideTranslations(locale, ['common'])),
        },
        revalidate: 60, // Revalidate every 60 seconds to keep data fresh
    };
}


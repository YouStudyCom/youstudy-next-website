import { useRouter } from 'next/router';
import SEO from '../../components/SEO';
import Image from 'next/image';
import Link from 'next/link';
import { subjects } from '../../data/subjects';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useTranslation } from 'next-i18next';
import ReadyToStudyAbroad from '../../components/ReadyToStudyAbroad';

export default function SubjectDetailPage({ subject, locale: serverLocale }) {
    const router = useRouter();
    const { t } = useTranslation('common');
    const locale = serverLocale || router.locale;

    // Fallback for isFallback state
    if (router.isFallback) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!subject) {
        return <div className="min-h-screen flex items-center justify-center">Subject not found</div>;
    }

    // Bilingual Helpers
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

    const subjectTitle = getName(subject.title);
    // Content might be in subject.content (Object) or subject.content[locale] if pre-processed
    // The helper helper 'getDescription' works for content too usually, but content might be just a string in some structures.
    // Let's rely on getName/getDescription logic which handles Objects and Strings.
    const contentHtml = cleanHTML(getDescription(subject.content));
    const descriptionText = subject.seo ? getDescription(subject.seo.description) : '';
    const keywordsText = subject.seo ? getDescription(subject.seo.keywords) : '';

    // Dynamic Canonical URL
    const canonicalUrl = `https://www.youstudy.com${locale === 'en' ? '' : '/' + locale}/subjectareas/${subject.slug}`;

    // Schema
    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": subjectTitle,
        "description": descriptionText,
        "author": {
            "@type": "Organization",
            "name": "YouStudy"
        },
        ...(subject.image && { "image": subject.image })
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            <SEO
                title={subjectTitle}
                description={descriptionText}
                keywords={keywordsText}
                canonical={canonicalUrl}
                schema={schema}
                image={subject.image}
            />


            <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <Breadcrumbs
                    items={[
                        { label: t('breadcrumbs.home'), href: '/' },
                        { label: t('breadcrumbs.subject_areas'), href: '/subjectareas' },
                        { label: subjectTitle, isCurrent: true }
                    ]}
                />



                <article>
                    {/* Header */}
                    <header className="mb-8 text-center sm:text-start">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide rounded-full mb-4">
                            <span className="text-xl">{subject.icon}</span>
                            <span>Subject Guide</span>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">
                            {subjectTitle}
                        </h1>
                        <div
                            className="text-xl text-slate-500 max-w-2xl leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: descriptionText }}
                        />
                    </header>

                    {/* Featured Image */}
                    {/* Only show if image is defined in data */}
                    {subject.image && (
                        <div className="relative w-full h-[400px] md:h-[500px] mb-12 rounded-xl overflow-hidden shadow-sm">
                            <Image
                                src={subject.image}
                                alt={subjectTitle}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 896px"
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Content Body */}
                    <div className="
                        prose prose-2xl prose-slate max-w-none mx-auto mb-12 
                        prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight 
                        prose-p:leading-loose prose-p:text-slate-700 
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-xl prose-img:shadow-sm
                        prose-li:text-slate-600 prose-li:marker:text-blue-500
                        prose-strong:text-slate-900 prose-strong:font-bold
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-slate-700
                    ">
                        {contentHtml ? (
                            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                        ) : (
                            <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
                                <h3 className="text-xl font-bold mb-4 text-slate-900">
                                    {locale === 'ar' ? 'لماذا تدرس هذا التخصص؟' : 'Why study this subject?'}
                                </h3>
                                <p className="text-slate-600 leading-relaxed mb-4">
                                    {descriptionText}
                                </p>
                                <p className="text-slate-600 leading-relaxed">
                                    {locale === 'ar'
                                        ? 'تواصل معنا للحصول على مزيد من التفاصيل حول أفضل الجامعات والبرامج المتاحة في هذا المجال.'
                                        : 'Contact us for more details about the best universities and programs available in this field.'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <ReadyToStudyAbroad name={subjectTitle} />
                </article>
            </main>
        </div>
    );
}

export async function getStaticPaths({ locales }) {
    const paths = [];

    // Generate paths for all subjects and all locales
    subjects.forEach(subject => {
        locales.forEach(locale => {
            paths.push({
                params: { slug: subject.slug },
                locale,
            });
        });
    });

    return {
        paths,
        fallback: false, // Return 404 for unknown slugs
    };
}

export async function getStaticProps({ params, locale }) {
    let subject = subjects.find(s => s.slug === params.slug);

    if (!subject) {
        return {
            notFound: true,
        };
    }

    // Dynamic Data Loading: Fetch from API to get fresh, localized content
    try {
        const { siteConfig } = await import('../../data/siteConfig.mjs');

        // Construct API URL
        // Use siteConfig.api.baseUrl.cms if available, or default to 127.0.0.1:8000
        const baseUrl = siteConfig?.api?.baseUrl?.cms || 'http://127.0.0.1:8000';
        const apiUrl = `${baseUrl}/api/articles/${params.slug}`;

        const res = await fetch(apiUrl, {
            headers: {
                'language': locale,
                'Accept': 'application/json',
            }
        });

        if (res.ok) {
            const data = await res.json();
            const apiSubject = data.data || data;

            if (apiSubject) {
                // Determine if we need to parse JSON strings or use properties directly
                // The API might return { title: "En String" } if language header works, 
                // OR it might return { title: "{\"en\":...}" } depending on backend.
                // We use our robust merging logic.

                const parseIfJson = (val) => {
                    if (typeof val === 'string' && val.trim().startsWith('{')) {
                        try { return JSON.parse(val); } catch (e) { return val; }
                    }
                    return val;
                };

                // 1. Title
                const apiTitle = apiSubject.title;
                const parsedTitle = parseIfJson(apiTitle);

                // If API returns a simple string (because we sent language header), use it for current locale
                // If it returns a bilingual object/string, merge it.
                if (typeof parsedTitle === 'object') {
                    subject = {
                        ...subject,
                        title: { ...subject.title, ...parsedTitle }
                    };
                } else if (parsedTitle) {
                    // It's a string, likely the localized title requested
                    subject = {
                        ...subject,
                        title: {
                            ...subject.title,
                            [locale]: parsedTitle
                        }
                    };
                }

                // 2. Content
                if (apiSubject.content) {
                    let rawContent = apiSubject.content;
                    // Strip inline styles
                    if (typeof rawContent === 'string') {
                        rawContent = rawContent.replace(/ style=["'][^"']*["']/gi, '');
                    }

                    const parsedContent = parseIfJson(rawContent);

                    if (typeof parsedContent === 'object') {
                        subject = {
                            ...subject,
                            content: { ...subject.content, ...parsedContent }
                        };
                    } else if (parsedContent) {
                        // Localized string from API
                        subject = {
                            ...subject,
                            content: {
                                ...subject.content,
                                [locale]: parsedContent
                            }
                        };
                    }
                }

                // 3. SEO
                // API might return standard SEO fields or custom ones
                if (apiSubject.seo_description || apiSubject.seo_keywords) {
                    const parsedDesc = parseIfJson(apiSubject.seo_description);
                    const parsedKeys = parseIfJson(apiSubject.seo_keywords);

                    const mergeSeoField = (current, incoming) => {
                        if (typeof incoming === 'object') return { ...current, ...incoming };
                        if (incoming) return { ...current, [locale]: incoming };
                        return current;
                    };

                    subject = {
                        ...subject,
                        seo: {
                            ...subject.seo,
                            description: mergeSeoField(subject.seo?.description, parsedDesc),
                            keywords: mergeSeoField(subject.seo?.keywords, parsedKeys)
                        }
                    };
                }

                // 4. Image
                if (apiSubject.image) {
                    let imgPath = apiSubject.image;
                    // If it's a full URL, trust it (unless we want to proxy it, but usually next/image handles it)
                    // If it's a relative path starting with /, trust it.
                    // Only if it's a bare filename do we prepend a default path.

                    const isUrl = imgPath.startsWith('http');
                    const isAbsolutePath = imgPath.startsWith('/');

                    if (!isUrl && !isAbsolutePath) {
                        // Fallback for bare filenames - assuming they might be in the legacy folder
                        // But purely guessing /gallery/blog/post/ is risky. 
                        // However, keeping legacy behavior for bare files ONLY.
                        imgPath = `/gallery/blog/post/${imgPath}`;
                    }
                    subject = { ...subject, image: imgPath };
                }
            }
        } else {
            console.warn(`API Fetch failed for subject ${params.slug} (Locale: ${locale}): ${res.status}`);
        }

    } catch (e) {
        console.error("Subject Detail API Error:", e);
        // Fallback to static data
    }

    return {
        props: {
            subject,
            locale,
            ...(await serverSideTranslations(locale, ['common'])),
        },
        revalidate: 60, // ISR: Revalidate every 60 seconds
    };
}


import { siteConfig } from '../data/siteConfig.mjs';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { useRouter } from 'next/router';

const SEO = ({ title, description, canonical, openGraph, keywords, languageAlternates, children }) => {
    const { locale } = useRouter();
    // Combine page-specific keywords with global keywords
    const globalKeywords = siteConfig.content[locale]?.keywords || '';
    const combinedKeywords = keywords
        ? `${keywords}, ${globalKeywords} `
        : globalKeywords;

    return (
        <>
            <NextSeo
                title={title}
                description={description}
                canonical={canonical}
                openGraph={openGraph}
                languageAlternates={languageAlternates}
                additionalMetaTags={[{ name: 'keywords', content: combinedKeywords }]}
            />
            <Head>
                {/* Specific Link Tags if needed */}
            </Head>
            {children}
        </>
    );
};

export default SEO;

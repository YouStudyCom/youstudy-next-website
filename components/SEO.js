import { NextSeo } from 'next-seo';
import Head from 'next/head';

const SEO = ({ title, description, canonical, openGraph, keywords, children }) => {
    return (
        <>
            <NextSeo
                title={title}
                description={description}
                canonical={canonical}
                openGraph={openGraph}
                languageAlternates={props.languageAlternates}
                additionalMetaTags={keywords ? [{ name: 'keywords', content: keywords }] : []}
            />
            <Head>
                {/* Specific Link Tags if needed */}
            </Head>
            {children}
        </>
    );
};

export default SEO;

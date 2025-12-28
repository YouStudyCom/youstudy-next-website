import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { DefaultSeo, OrganizationJsonLd } from 'next-seo';
import SEO from '../next-seo.config';
import { siteConfig } from '../data/siteConfig.mjs';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlobalInquiryForm from '../components/GlobalInquiryForm';
import WhatsAppButton from '../components/WhatsAppButton';
import { useVisitorData } from '../hooks/useVisitorData';
import GTMManager from '../components/GTMManager';
import FacebookPixel from '../components/FacebookPixel';
import LoadingSpinner from '../components/LoadingSpinner'; // Brand loader
import React from 'react';

import { Tajawal } from 'next/font/google';

const tajawal = Tajawal({
    subsets: ['arabic', 'latin'],
    weight: ['200', '300', '400', '500', '700', '800', '900'],
    variable: '--font-tajawal',
    display: 'swap',
});

function MyApp({ Component, pageProps }) {
    // Initialize visitor detection globally
    const visitorData = useVisitorData();
    const { locale, events } = useRouter();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleComplete = () => setLoading(false);

        events.on('routeChangeStart', handleStart);
        events.on('routeChangeComplete', handleComplete);
        events.on('routeChangeError', handleComplete);

        return () => {
            events.off('routeChangeStart', handleStart);
            events.off('routeChangeComplete', handleComplete);
            events.off('routeChangeError', handleComplete);
        };
    }, [events]);

    // Log for demonstration (User request: "Provide a structured output")
    if (!visitorData.isLoading && visitorData.country) {
        console.log("📍 Visitor Data Detected:", visitorData);
    }

    // Get localized schema data
    const schemaData = siteConfig.content[locale]?.schema || siteConfig.content.en.schema;

    return (
        <main className={tajawal.variable}>
            <DefaultSeo
                {...SEO}
                additionalMetaTags={[
                    {
                        name: 'keywords',
                        content: siteConfig.content[locale]?.keywords || '',
                    },
                ]}
            />

            {/* Optimized GTM Loading (Interaction-based) */}
            <GTMManager gtmId="GTM-KL7RPPMM" />

            {/* Direct Facebook Pixel Tracking */}
            <FacebookPixel />

            <OrganizationJsonLd
                type="EducationalOrganization"
                id="https://www.youstudy.com/#organization"
                logo="https://www.youstudy.com/logo.png"
                legalName={schemaData.legalName}
                name={schemaData.name}
                address={schemaData.address}
                contactPoint={[
                    {
                        telephone: siteConfig.contact.phone,
                        contactType: 'customer service',
                        areaServed: 'Global',
                        availableLanguage: ['English', 'Arabic'],
                    },
                ]}
                sameAs={siteConfig.socials.map(s => s.url)}
                url="https://www.youstudy.com"
            />

            <Navbar />
            {loading && <LoadingSpinner />}
            <Component {...pageProps} />
            <GlobalInquiryForm />
            <WhatsAppButton />
            <Footer />
        </main>
    );
}

export default appWithTranslation(MyApp);

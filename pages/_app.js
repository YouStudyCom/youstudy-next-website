import { appWithTranslation } from 'next-i18next';
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

import { Tajawal } from 'next/font/google';

const tajawal = Tajawal({
    subsets: ['arabic', 'latin'],
    weight: ['400', '500', '700'],
    variable: '--font-tajawal',
    display: 'swap',
});

function MyApp({ Component, pageProps }) {
    // Initialize visitor detection globally
    const visitorData = useVisitorData();

    // Log for demonstration (User request: "Provide a structured output")
    if (!visitorData.isLoading && visitorData.country) {
        console.log("📍 Visitor Data Detected:", visitorData);
    }

    return (
        <main className={tajawal.variable}>
            <DefaultSeo {...SEO} />

            {/* Optimized GTM Loading (Interaction-based) */}
            <GTMManager gtmId="GTM-KL7RPPMM" />

            <OrganizationJsonLd
                type="EducationalOrganization"
                id="https://www.youstudy.com/#organization"
                logo="https://www.youstudy.com/logo.png"
                legalName="YouStudy.com"
                name="YouStudy"
                address={{
                    streetAddress: '123 Education St',
                    addressLocality: 'London',
                    addressRegion: 'Greater London',
                    postalCode: 'SW1A 1AA',
                    addressCountry: 'GB',
                }}
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
            <Component {...pageProps} />
            <GlobalInquiryForm />
            <WhatsAppButton />
            <Footer />
        </main>
    );
}

export default appWithTranslation(MyApp);

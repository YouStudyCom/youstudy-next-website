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

function MyApp({ Component, pageProps }) {
    // Initialize visitor detection globally
    const visitorData = useVisitorData();

    // Log for demonstration (User request: "Provide a structured output")
    if (!visitorData.isLoading && visitorData.country) {
        console.log("📍 Visitor Data Detected:", visitorData);
    }

    return (
        <>
            <DefaultSeo {...SEO} />
            <Script id="gtm" strategy="afterInteractive">
                {`
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-KL7RPPMM');
                `}
            </Script>
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
        </>
    );
}

export default appWithTranslation(MyApp);

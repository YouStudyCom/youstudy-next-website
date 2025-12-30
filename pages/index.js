import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FAQPageJsonLd, OrganizationJsonLd } from 'next-seo';
import AboutSection from '../components/AboutSection';
import HeroSlider from '../components/HeroSlider';
import StepsSection from '../components/StepsSection';
import StudyDestinations from '../components/StudyDestinations';
import SubjectAreas from '../components/SubjectAreas';
import Testimonials from '../components/Testimonials';
import SEO from '../components/SEO';

export default function Home(props) {
    const { t } = useTranslation('common');
    const router = useRouter();
    const locale = router.locale || 'en';
    const canonicalUrl = `https://www.youstudy.com${locale === 'ar' ? '/ar' : ''}`;

    const faqData = t('faq', { returnObjects: true });

    return (
        <>
            <SEO
                title={t('seo.title')}
                description={t('seo.description')}
                canonical={canonicalUrl}
                openGraph={{
                    locale: locale === 'ar' ? 'ar_SA' : 'en_US',
                    url: canonicalUrl,
                    site_name: locale === 'ar' ? 'يوستدي' : 'YouStudy',
                }}
                keywords={t('seo.keywords')}
                languageAlternates={[
                    { hrefLang: 'en', href: 'https://www.youstudy.com' },
                    { hrefLang: 'ar', href: 'https://www.youstudy.com/ar' },
                ]}
            />



            <OrganizationJsonLd
                type="Organization"
                id="https://www.youstudy.com/#organization"
                logo="https://www.youstudy.com/logo.png"
                legalName="YouStudy UK Ltd"
                name="YouStudy"
                address={{
                    streetAddress: '71-75 Shelton Street',
                    addressLocality: 'London',
                    addressRegion: 'Greater London',
                    postalCode: 'WC2H 9JQ',
                    addressCountry: 'GB',
                }}
                contactPoint={[
                    {
                        telephone: '+44 203 608 2800',
                        contactType: 'customer service',
                        areaServed: ['GB', 'SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'JO', 'EG'],
                        availableLanguage: ['English', 'Arabic'],
                    },
                ]}
                sameAs={[
                    'https://www.facebook.com/YouStudyLimited/',
                    'https://x.com/YouStudyLimited',
                    'https://www.instagram.com/youstudylimited',
                    'https://www.youtube.com/channel/UC6skrV_aEz05NPATBz_8j7Q',
                    'https://www.linkedin.com/company/youstudy-com/',
                    'https://www.tiktok.com/@youstudy.com'
                ]}
                url="https://www.youstudy.com"
            />

            {Array.isArray(faqData) && (
                <FAQPageJsonLd
                    mainEntity={faqData.map((item) => ({
                        questionName: item.question,
                        acceptedAnswerText: item.answer,
                    }))}
                />
            )}

            <HeroSlider />
            <AboutSection />
            <StepsSection />
            <StudyDestinations destinations={props.destinations} />
            <SubjectAreas />
            <Testimonials />
        </>
    );
}
// This function loads translations for the page at build time
export async function getStaticProps({ locale }) {
    // Use the same static data as /study-abroad-guide to ensure consistency
    const { destinations } = await import('../data/destinations');

    return {
        props: {
            destinations: destinations || [],
            ...(await serverSideTranslations(locale, ['common'])),
        },
        revalidate: 60,
    };
}

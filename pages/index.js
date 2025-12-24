import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FAQPageJsonLd, BreadcrumbJsonLd } from 'next-seo';
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
            />
            <BreadcrumbJsonLd
                itemListElement={[
                    {
                        position: 1,
                        name: t('breadcrumbs.home'),
                        item: 'https://www.youstudy.com',
                    },
                ]}
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

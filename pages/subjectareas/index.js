import SEO from '../../components/SEO';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { subjects } from '../../data/subjects';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useTranslation } from 'next-i18next';
import ReadyToStudyAbroad from '../../components/ReadyToStudyAbroad';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

export default function SubjectsListingPage({ subjectsList }) {
    const router = useRouter();
    const { t } = useTranslation('common');
    const locale = router.locale || 'en';

    // Use data from props (which includes cache merge) or fallback to static import
    const displaySubjects = subjectsList || subjects;

    const canonicalUrl = `https://www.youstudy.com${locale === 'en' ? '' : `/${locale}`}/subjectareas`;

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <SEO
                title={t('subject_areas_page.title')}
                description={t('subject_areas_page.description')}
                canonical={canonicalUrl}
                openGraph={{
                    url: canonicalUrl,
                    title: t('subject_areas_page.title'),
                    description: t('subject_areas_page.description'),
                    site_name: 'YouStudy',
                }}
            />


            {/* Hero Section */}
            <div className="relative bg-slate-900 py-24 px-4 sm:px-6 lg:px-8 text-center">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-blue-900/20"></div>
                </div>
                <div className="relative max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                        {t('subject_areas_page.hero_title')}
                    </h1>
                    <p className="text-xl text-slate-200 leading-relaxed">
                        {t('subject_areas_page.hero_subtitle')}
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <Breadcrumbs
                    items={[
                        { label: t('breadcrumbs.home'), href: '/' },
                        { label: t('breadcrumbs.subject_areas'), isCurrent: true }
                    ]}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displaySubjects.map((subject) => (
                        <Link href={`/subjectareas/${subject.slug}`} key={subject.id} className="group">
                            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 h-full flex flex-col hover:-translate-y-1 overflow-hidden">

                                {/* Icon Header */}
                                <div className="p-6 pb-0 flex items-center gap-4">
                                    <span className="text-4xl bg-blue-50 w-16 h-16 flex items-center justify-center rounded-full group-hover:bg-blue-100 transition-colors">
                                        {subject.icon}
                                    </span>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors mt-0">
                                        {subject.title[locale]}
                                    </h2>
                                    <p className="text-slate-600 mb-6 flex-grow leading-relaxed line-clamp-3">
                                        {subject.seo.description[locale]}
                                    </p>
                                    <span className="text-blue-600 font-bold text-sm flex items-center mt-auto gap-2">
                                        {t('subject_areas_page.explore_programs')}
                                        {locale === 'ar' ? <FaArrowLeft /> : <FaArrowRight />}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <ReadyToStudyAbroad />

            </main>
        </div>
    );
}

export async function getStaticProps({ locale }) {
    // Clone static subjects to avoid mutating the original import reference if strictly used
    let subjectsData = [...subjects];

    try {
        const fs = require('fs');
        const path = require('path');
        const cachePath = path.join(process.cwd(), 'data', 'subjects-cache.json');

        if (fs.existsSync(cachePath)) {
            const cacheContent = fs.readFileSync(cachePath, 'utf8');
            const cachedSubjects = JSON.parse(cacheContent);

            if (Array.isArray(cachedSubjects)) {
                // Map over static subjects and merge with cache if found
                subjectsData = subjectsData.map(staticSub => {
                    const cachedSub = cachedSubjects.find(cs => cs.slug === staticSub.slug || cs.id === staticSub.id);
                    let finalSub = { ...staticSub };

                    if (cachedSub) {
                        let imgPath = cachedSub.image || staticSub.image;
                        if (imgPath && !imgPath.startsWith('http') && !imgPath.startsWith('/')) {
                            imgPath = `/images/subjects/${imgPath}`;
                        }

                        // Merge relevant list fields
                        finalSub = {
                            ...staticSub,
                            ...cachedSub,
                            title: { ...staticSub.title, ...(cachedSub.title || {}) },
                            seo: { ...staticSub.seo, ...(cachedSub.seo || {}) },
                            image: imgPath
                        };
                    }

                    // OPTIMIZATION: Return only fields needed for the listing page.
                    // Stripping 'content', 'faq', and other heavy fields to reduce JSON size.
                    return {
                        id: finalSub.id,
                        slug: finalSub.slug,
                        icon: finalSub.icon, // Ensure icon is preserved if static
                        image: finalSub.image,
                        title: finalSub.title,
                        seo: {
                            description: finalSub.seo?.description || {}
                        }
                    };
                });
            }
        }
    }
    } catch (e) {
    // Ignore cache errors
}

// Since we are modifying the data passed to the component, we need to pass it as props
// NOTE: The component currently imports `subjects` directly. 
// We should update the component to accept `subjects` as a prop appropriately.
// However, since `subjects` is imported at top level, we might have a conflict.
// Let's rely on the prop if passed, or import if not.
// Actually, to make this work, the Component function header must act on props.

return {
    props: {
        subjectsList: subjectsData,
        ...(await serverSideTranslations(locale, ['common'])),
    },
};
}

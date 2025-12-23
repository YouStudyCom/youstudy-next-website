import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { subjects } from '../data/subjects';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

export default function SubjectAreas({ subjects: propsSubjects }) {
    const { t } = useTranslation('common');
    const router = useRouter();
    const locale = router.locale || 'en';
    const finalSubjects = propsSubjects || subjects;

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {t('subject_areas_title', 'Subject Areas')}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {t('subject_areas_subtitle', 'Find your study path with these popular fields')}
                    </p>
                </div>

                {/* Mobile: Horizontal Scroll */}
                <div className="md:hidden flex overflow-x-auto space-x-4 pb-6 -mx-6 px-6 scrollbar-hide">
                    {finalSubjects.map((subject) => (
                        <div
                            key={subject.id}
                            className="flex-shrink-0 w-72 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col"
                        >
                            <div className="text-4xl mb-4">{subject.icon}</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                <Link href={`/subjectareas/${subject.slug}`} className="hover:text-blue-600 transition-colors">
                                    {subject.title[locale]}
                                </Link>
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 flex-grow">{subject.seo.description[locale]}</p>
                            <Link
                                href={`/subjectareas/${subject.slug}`}
                                className="text-blue-600 font-semibold text-sm hover:text-blue-800 inline-flex items-center mt-auto gap-1"
                            >
                                {t('explore', 'Explore')}
                                {locale === 'ar' ? <FaArrowLeft className="w-4 h-4" /> : <FaArrowRight className="w-4 h-4" />}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Desktop: Grid */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {finalSubjects.map((subject) => (
                        <div
                            key={subject.id}
                            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col group"
                        >
                            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{subject.icon}</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                <Link href={`/subjectareas/${subject.slug}`}>
                                    {subject.title[locale]}
                                </Link>
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 flex-grow">{subject.seo.description[locale]}</p>
                            <Link
                                href={`/subjectareas/${subject.slug}`}
                                className="text-blue-600 font-semibold text-sm hover:text-blue-800 inline-flex items-center mt-auto gap-1"
                            >
                                {t('explore', 'Explore')}
                                {locale === 'ar' ? <FaArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" /> : <FaArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />}
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/subjectareas"
                        className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 px-8 rounded-full transition duration-300"
                    >
                        {t('view_all_courses', 'View All Courses')}
                    </Link>
                </div>
            </div>
        </section>
    );
}

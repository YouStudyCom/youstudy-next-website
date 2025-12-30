import { useTranslation } from 'next-i18next';
import Link from 'next/link';

const AboutSection = () => {
    const { t } = useTranslation('common');

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                        {t('about_section.title')}
                    </h2>
                    <p className="text-xl text-primary font-medium mb-8">
                        {t('about_section.subtitle')}
                    </p>
                    <div className="text-gray-600 leading-relaxed text-lg space-y-6 text-justify md:text-center">
                        <p>{t('about_section.description')}</p>
                        <p>{t('about_section.content_p1')}</p>
                        <p>{t('about_section.content_p2')}</p>
                    </div>
                    <div className="mt-10">
                        <Link
                            href="/about"
                            className="inline-block bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-opacity-90 transition duration-300"
                        >
                            {t('about_section.cta')}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;

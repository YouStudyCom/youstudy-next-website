import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Image from 'next/image';
import InquiryForm from './InquiryForm';

export default function HeroSlider() {
    const { t } = useTranslation('common');
    const router = useRouter();
    const { locale } = router;

    const slides = [

        {
            id: 2,
            image: '/images/slides/YouStudy - Study abroad around the world.png',
            title: t('hero.title', 'Get Your Offer & Free Consultation'),
            subtitle: t('hero.subtitle', 'Begin your journey with professional support.')
        },
        {
            id: 3,
            image: '/images/slides/YouStudy - Study abroad around the world (2).png',
            title: t('hero.title', 'Get Your Offer & Free Consultation'),
            subtitle: t('hero.subtitle', 'Begin your journey with professional support.')
        },
        {
            id: 4,
            image: '/images/slides/YouStudy - Study abroad around the world3.png',
            title: t('hero.title', 'Get Your Offer & Free Consultation'),
            subtitle: t('hero.subtitle', 'Begin your journey with professional support.')
        }
    ];

    return (
        <div className="relative w-full h-[600px] md:h-[700px]" dir="ltr">
            {/* Slider */}
            <Swiper
                spaceBetween={0}
                centeredSlides={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="w-full h-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-full">
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                priority={index === 0}
                                loading={index === 0 ? "eager" : "lazy"}
                                fetchPriority={index === 0 ? "high" : "auto"}
                                className="object-cover"
                                sizes="100vw"
                                quality={75}
                            />
                            {/* Dark Overlay for contrast */}
                            <div className="absolute inset-0 bg-black/40"></div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Static Content Overlay (Left Side) - SEO friendly on mobile */}
            <div className="absolute inset-0 z-10 flex items-center justify-center md:justify-start pointer-events-none">
                <div className={`px-6 md:px-20 max-w-2xl text-center flex flex-col items-center ${locale === 'ar' ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} text-white sr-only md:not-sr-only md:block`} dir={t('dir', { returnObjects: true }) || (locale === 'ar' ? 'rtl' : 'ltr')}>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
                        {t('hero.title', 'Get Your Offer & Free Consultation')}
                    </h1>
                    <p className="text-xl md:text-2xl font-medium drop-shadow-md">
                        {t('hero.subtitle', 'Begin your journey with professional support.')}
                    </p>
                </div>
            </div>


            {/* Enquiry Form Overlay */}
            <div className="absolute top-0 right-0 z-10 w-full h-full flex items-center justify-center md:items-start md:pt-20 md:justify-end pointer-events-none">
                <div
                    className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-md mx-4 md:mr-20 pointer-events-auto border-t-4 border-blue-600 max-h-[85vh] overflow-y-auto"
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                >
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        {locale === 'ar' ? 'قدم طلبك الآن' : 'Enquire Now'}
                    </h3>
                    <InquiryForm />
                </div>
            </div>
        </div >
    );
}

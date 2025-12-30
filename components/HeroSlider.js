import { useState, useEffect } from 'react';
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

    const [promoText, setPromoText] = useState('');

    useEffect(() => {
        const enOptions = [
            "Free Educational Consultation",
            "100% Free Education Advice",
            "Free Academic Consultation",
            "No‑Cost Education Consultation",
            "Free Study Consultation",
            "Free Guidance Session"
        ];

        const arOptions = [
            "استشارات تعليمية مجانية",
            "استشارات تعليمة مجانية 100٪",
            "استشارات مجانية للطلاب",
            "استشارات دراسية مجانية"
        ];

        const options = locale === 'ar' ? arOptions : enOptions;
        const randomText = options[Math.floor(Math.random() * options.length)];
        setPromoText(randomText);
    }, [locale]);

    const slides = [

        {
            id: 2,
            image: '/images/slides/YouStudy - Study abroad around the world.webp',
            title: t('hero.title', 'Get Your Offer & Free Consultation'),
            subtitle: t('hero.subtitle', 'Begin your journey with professional support.')
        },
        {
            id: 3,
            image: '/images/slides/YouStudy - Study abroad around the world (2).webp',
            title: t('hero.title', 'Get Your Offer & Free Consultation'),
            subtitle: t('hero.subtitle', 'Begin your journey with professional support.')
        },
        {
            id: 4,
            image: '/images/slides/YouStudy - Study abroad around the world3.webp',
            title: t('hero.title', 'Get Your Offer & Free Consultation'),
            subtitle: t('hero.subtitle', 'Begin your journey with professional support.')
        }
    ];

    return (
        <div className="relative w-full h-[500px] md:h-[600px]" dir="ltr">
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
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                                quality={60}
                            />
                            {/* Dark Overlay for contrast */}
                            <div className="absolute inset-0 bg-black/40"></div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Static Content Overlay (Left Side) - SEO friendly on mobile */}
            <div className={`absolute inset-0 z-10 flex items-center justify-center md:justify-start pointer-events-none`}>
                <div className={`px-6 md:px-20 max-w-2xl text-center flex flex-col items-center ${locale === 'ar' ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} text-white pointer-events-auto transition-all duration-500`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>

                    {/* Main Heading - Optimized for Tajawal/Professional Look */}
                    <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 drop-shadow-lg tracking-normal ${locale === 'ar' ? 'leading-normal font-ar' : 'leading-tight'}`}>
                        {t('hero.title', 'Get Your Admission Offer + Free Study Abroad Consultation')}
                    </h1>

                    {/* Subtitle - Better hierarchy */}
                    <p className={`text-base md:text-lg font-medium mb-8 max-w-2xl text-white drop-shadow-md ${locale === 'ar' ? 'leading-relaxed' : 'leading-snug'}`}>
                        {t('hero.subtitle', 'Free guidance to choose courses, prepare applications, and receive your admission offer.')}
                    </p>

                    {/* Mobile/Desktop CTA Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            window.dispatchEvent(new Event('toggle-global-form'));
                        }}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-10 rounded-full text-lg shadow-xl hover:shadow-2xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform active:scale-95 md:hidden border border-blue-400/20 backdrop-blur-sm"
                    >
                        {t('hero.cta', locale === 'ar' ? 'احصل على استشارتك المجانية' : 'Get Your Free Consultation')}
                    </button>
                </div>
            </div>


            {/* Enquiry Form Overlay - Hidden on Mobile */}
            <div className="absolute top-0 right-0 z-10 w-full h-full hidden md:flex items-center justify-center md:items-start md:pt-16 md:justify-end pointer-events-none">
                <div
                    className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-[400px] mx-4 md:mr-20 pointer-events-auto overflow-hidden animate-fade-in-up"
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                >
                    <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-2 text-center">
                        <h3 className="text-xl font-bold text-white tracking-wide">
                            {locale === 'ar' ? 'قدم طلبك الآن' : 'Enquire Now'}
                        </h3>
                        <p className="text-blue-100 text-xs mt-1 opacity-90 animate-pulse">
                            {promoText || (locale === 'ar' ? 'استشارة تعليمية مجانية' : 'Free Educational Consultation')}
                        </p>
                    </div>

                    <div className="p-5">
                        <InquiryForm />
                    </div>
                </div>
            </div>
        </div >
    );
}

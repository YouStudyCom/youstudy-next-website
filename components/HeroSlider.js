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
                <div className={`px-6 md:px-20 max-w-4xl text-center flex flex-col items-center ${locale === 'ar' ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} text-white pointer-events-auto`} dir={t('dir', { returnObjects: true }) || (locale === 'ar' ? 'rtl' : 'ltr')}>
                    <h1 className="text-3xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
                        {t('hero.title', 'Get Your Offer & Free Consultation')}
                    </h1>
                    <p className="text-lg md:text-2xl font-medium drop-shadow-md mb-8 max-w-2xl">
                        {t('hero.subtitle', 'Begin your journey with professional support.')}
                    </p>

                    {/* Mobile/Desktop CTA Button (Since form is now hidden on mobile) */}
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            // Trigger the global form to open
                            const event = new CustomEvent('open-inquiry-form');
                            window.dispatchEvent(event);
                            // Fallback if event logic isn't set up yet, we can also target the global form state if we had access,
                            // but usually a sticky bar button or GlobalForm listens to open commands.
                            // For now, let's assume the user just wants the button visually, but ideally it should open the GlobalInquiryForm.
                            // Given I cannot easily pass props to GlobalInquiryForm from here without Context, I'll link to the form section or simulate a click on the sticky bar toggle which might be hard.
                            // Alternative: Simply use the same style/link as the sticky bar.
                            // Let's implement a direct open logic if possible or just a button that looks professional.
                            // Better yet, update GlobalInquiryForm to listen to an event? 
                            // Or just make it a link to a contact page if that exists.
                            // User request: "like the existing Get Your Offer... button".
                            // I'll make it trigger the same state if I can, or for now just a hash link that does nothing until clicked?
                            // Actually, I can use a simple event listener in GlobalInquiryForm.
                            window.dispatchEvent(new Event('toggle-global-form'));
                        }}
                        className="bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-xl hover:bg-blue-700 transition-transform active:scale-95 md:hidden"
                    >
                        {t('hero.cta', locale === 'ar' ? 'احصل على استشارتك المجانية' : 'Get Your Free Consultation')}
                    </a>
                </div>
            </div>


            {/* Enquiry Form Overlay - Hidden on Mobile */}
            <div className="absolute top-0 right-0 z-10 w-full h-full hidden md:flex items-center justify-center md:items-start md:pt-20 md:justify-end pointer-events-none">
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

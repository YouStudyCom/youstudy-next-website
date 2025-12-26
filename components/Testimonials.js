import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Image from 'next/image';

import { testimonials } from '../data/testimonials';
import { useRouter } from 'next/router';

export default function Testimonials() {
    const { t } = useTranslation('common');
    const router = useRouter();
    const locale = router.locale || 'en';
    const [expandedIds, setExpandedIds] = useState([]);

    const toggleExpand = (id) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const truncateText = (text, limit, isExpanded) => {
        if (!text) return '';
        if (text.length <= limit || isExpanded) return text;
        return text.slice(0, limit) + '...';
    };

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        {t('testimonials_title', 'What Our Students Are Saying!')}
                    </h2>
                    <div className="w-24 h-1.5 bg-brand mx-auto rounded-full opacity-80"></div>
                </div>

                <Swiper
                    spaceBetween={30}
                    centeredSlides={false}
                    autoplay={{
                        delay: 6000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    modules={[Autoplay, Pagination]}
                    className="pb-16 px-4"
                >
                    {testimonials.map((testimonial) => {
                        const comment = testimonial.comment[locale] || testimonial.comment.en;
                        const name = testimonial.name[locale] || testimonial.name.en;
                        const nationality = testimonial.nationality?.[locale] || testimonial.nationality?.en || testimonial.nationality;
                        const isExpanded = expandedIds.includes(testimonial.id);
                        const shouldTruncate = comment.length > 180;

                        return (
                            <SwiperSlide key={testimonial.id} className="h-auto">
                                <script
                                    type="application/ld+json"
                                    dangerouslySetInnerHTML={{
                                        __html: JSON.stringify({
                                            "@context": "https://schema.org/",
                                            "@type": "Review",
                                            "itemReviewed": {
                                                "@type": "Organization",
                                                "name": "YouStudy",
                                                "image": "https://www.youstudy.com/logo.png"
                                            },
                                            "reviewRating": {
                                                "@type": "Rating",
                                                "ratingValue": testimonial.rating.toString()
                                            },
                                            "author": {
                                                "@type": "Person",
                                                "name": name
                                            },
                                            "reviewBody": comment
                                        })
                                    }}
                                />
                                <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.1)] transition-all duration-300 border border-slate-100 h-full flex flex-col relative group overflow-hidden">
                                    {/* Decorative Quote Mark */}
                                    <div className="absolute top-4 right-6 text-9xl text-slate-50 opacity-50 font-serif leading-none select-none pointer-events-none group-hover:text-blue-50 transition-colors">
                                        &rdquo;
                                    </div>

                                    <div className="flex items-center gap-4 mb-6 relative z-10">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-brand to-blue-300">
                                                <Image
                                                    src={testimonial.image}
                                                    alt={name}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full rounded-full object-cover border-2 border-white"
                                                    onError={(e) => {
                                                        // Next/Image doesn't support direct onError like img. 
                                                        // Reviewing this limitations. Next.js usually requires handling this in state or using a default.
                                                        // For now, simple replacement, but note onError logic is different in Next Image which handles errors internally or via loading state.
                                                        // However, keeping simple replacement first.
                                                        // Actually, Next/Image onError is supported on client side but e.target.src assignment won't work same way.
                                                        // Better to just provide valid images or a validation layer.
                                                        // Simplified approach: just use Image.
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-900 leading-tight">
                                                {name}
                                            </h4>
                                            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                                                {nationality}
                                            </span>
                                            <div className="flex text-amber-400 text-sm gap-0.5">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <svg key={i} className="w-4 h-4 fill-current drop-shadow-sm" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex-grow">
                                        <p className="text-slate-600 leading-relaxed text-[15px] font-medium opacity-90">
                                            {truncateText(comment, 180, isExpanded)}
                                        </p>

                                        {shouldTruncate && (
                                            <button
                                                onClick={() => toggleExpand(testimonial.id)}
                                                className="mt-3 text-brand font-bold text-sm hover:underline inline-flex items-center gap-1 focus:outline-none"
                                            >
                                                {isExpanded ? (
                                                    <>{t('read_less', 'Read Less')} <span className="text-xs">▴</span></>
                                                ) : (
                                                    <>{t('read_more', 'Read More')} <span className="text-xs">▾</span></>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </section>
    );
}

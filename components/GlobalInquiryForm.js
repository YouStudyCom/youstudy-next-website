import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import InquiryForm from './InquiryForm';

export default function GlobalInquiryForm() {
    const router = useRouter();
    const { locale } = router;
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Visibility Logic
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);

        // Pages where form should ALWAYS be open on desktop (ignoring previous close preference)
        const alwaysOpenPages = [
            '/study-abroad-guide/[slug]/[articleSlug]',
            '/subjectareas/[slug]'
        ];
        const shouldForceOpen = !isMobile && alwaysOpenPages.includes(router.pathname);

        // If manually closed, respect that choice globally (UNLESS on forced pages)
        const hasClosed = sessionStorage.getItem('formClosed');
        if (hasClosed && !shouldForceOpen) {
            setIsOpen(false);
            return () => window.removeEventListener('resize', handleResize);
        }

        const isHomePage = router.pathname === '/';

        if (shouldForceOpen) {
            setIsOpen(true);
            return () => window.removeEventListener('resize', handleResize);
        }

        if (isHomePage) {
            // Home Page: Toggle based on scroll position (height of HeroSlider approx 700px)
            const handleScroll = () => {
                // Double check closing state inside handler
                if (sessionStorage.getItem('formClosed')) return;

                if (window.scrollY > 700) {
                    setIsOpen(true);
                } else {
                    setIsOpen(false);
                }
            };

            // Initial check
            handleScroll();
            window.addEventListener('scroll', handleScroll);

            return () => {
                window.removeEventListener('resize', handleResize);
                window.removeEventListener('scroll', handleScroll);
            };
        } else {
            // Other Pages: Always open by default
            setIsOpen(true);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [router.pathname, isMobile]);

    // Auto-open on mobile after 5 seconds
    useEffect(() => {
        if (isMobile && !isOpen && !sessionStorage.getItem('formClosed')) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isMobile]);

    const toggleForm = () => {
        if (isOpen) {
            sessionStorage.setItem('formClosed', 'true');
        }
        setIsOpen(!isOpen);
    };

    const closeMobileForm = () => {
        sessionStorage.setItem('formClosed', 'true');
        setIsOpen(false);
    };

    // Desktop Component: Sticky Sidebar
    if (!isMobile) {
        return (
            <div
                className={`fixed top-1/2 right-0 transform -translate-y-1/2 z-50 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-40px)]'}`}
                dir="ltr"
            >
                <div className="flex shadow-2xl rounded-l-xl overflow-hidden bg-white h-auto max-h-[80vh] border border-slate-200">
                    {/* Toggle Tab */}
                    <button
                        onClick={toggleForm}
                        className="bg-blue-600 text-white w-10 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors py-8"
                    >
                        <div
                            className={`transform whitespace-nowrap font-bold tracking-widest text-sm translate-y-2 flex items-center gap-2 ${locale === 'ar' ? 'rotate-90' : '-rotate-90'}`}
                            dir={locale === 'ar' ? 'rtl' : 'ltr'}
                        >
                            {isOpen ? (locale === 'ar' ? 'أغلق' : 'CLOSE') : (locale === 'ar' ? 'احصل على قبولك الجامعي واستشارتك مجاناً' : 'Get Your Offer & Free Consultation')}
                            {!isOpen && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                </svg>
                            )}
                        </div>
                    </button>

                    {/* Form Content */}
                    <div
                        className="w-80 p-6 overflow-y-auto"
                        dir={locale === 'ar' ? 'rtl' : 'ltr'}
                    >
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {locale === 'ar' ? 'تحدث مع مستشار' : 'Speak to an Advisor'}
                        </h3>
                        <p className="text-slate-500 text-sm mb-6">
                            {locale === 'ar' ? 'احصل على خطة دراسية مخصصة مجاناً.' : 'Get a personalized study plan for free.'}
                        </p>
                        <InquiryForm />
                    </div>
                </div>
            </div>
        );
    }

    // Mobile Component: Bottom Sticky Bar + Modal
    return (
        <>
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-50 md:hidden flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div>
                    <p className="font-bold text-slate-900 text-sm">{locale === 'ar' ? 'تفكر في الدراسة بالخارج؟' : 'Thinking of studying abroad?'}</p>
                    <p className="text-xs text-slate-500">{locale === 'ar' ? 'احصل على استشارة مجانية.' : 'Get free expert advice.'}</p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white font-bold px-5 py-2 rounded hover:bg-blue-700 transition text-sm"
                >
                    {locale === 'ar' ? 'احصل على معلومات' : 'Get Info'}
                </button>
            </div>

            {/* Mobile Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 p-4 transition-opacity md:hidden">
                    <div className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-md p-6 animate-slide-up sm:animate-fade-in relative">
                        <button
                            onClick={closeMobileForm}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {locale === 'ar' ? 'تحدث مع مستشار' : 'Speak to an Advisor'}
                        </h3>
                        <p className="text-slate-500 text-sm mb-6">
                            {locale === 'ar' ? 'احصل على خطة دراسية مخصصة مجاناً.' : 'Get a personalized study plan for free.'}
                        </p>
                        <InquiryForm />
                    </div>
                </div>
            )}
        </>
    );
}

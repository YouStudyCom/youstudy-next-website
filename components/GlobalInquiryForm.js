import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import InquiryForm from './InquiryForm';

export default function GlobalInquiryForm() {
    const router = useRouter();
    const { locale } = router;
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    // Initial Resize Check
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize(); // Check immediately
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-open logic (Desktop & Mobile)
    useEffect(() => {
        // If it's already open, or user closed it previously, do nothing
        if (isOpen || sessionStorage.getItem('formClosed')) return;

        // Timer to open after 10 seconds
        const timer = setTimeout(() => {
            // Re-check conditions inside timeout
            if (!sessionStorage.getItem('formClosed')) {
                // MODIFIED: On homepage, only auto-open if scrolled past the hero section (slider/form)
                // On other pages, auto-open is allowed.
                const isHomePage = router.pathname === '/';
                const isScrolledPastHero = typeof window !== 'undefined' && window.scrollY > 700;

                if (!isHomePage || isScrolledPastHero) {
                    setIsOpen(true);
                    setShowSidebar(true);
                }
            }
        }, 10000); // 10 seconds delay

        return () => clearTimeout(timer);
    }, [isOpen]); // Depend on isOpen so we don't set timer if already open

    // Visibility Logic (Immediate Setup)
    useEffect(() => {
        // Pages where form should ALWAYS be open on desktop (ignoring previous close preference)? 
        // User requested delay, so we should probably respect delay even here, OR maybe these specific pages need immediate action?
        // Let's assume the "30 second" rule applies generally to auto-opening.
        // But we still need to show the SIDEBAR (collapsed) on inner pages immediately.

        // Decide sidebar visibility based on Route
        const isHomePage = router.pathname === '/';

        if (isHomePage) {
            // Home Page: Hide completely on top, show button/form after scroll
            const handleScroll = () => {
                if (window.scrollY > 700) {
                    setShowSidebar(true);
                    // We REMOVED the auto-open on scroll logic here to respect the 30s timer preference
                    // The sidebar will appear (collapsed), and the timer will open it eventually if not closed.
                } else {
                    setShowSidebar(false);
                    // setIsOpen(false); // Do we want to auto-close on scroll up? Maybe annoying if user is typing.
                    // Better to keep it open if user opened it, or just hide the sidebar container.
                    // Original logic hid it. Let's keep hiding sidebar, but maybe not Reset isOpen state?
                    // actually if sidebar is hidden, form is hidden.
                }
            };

            handleScroll(); // Initial check
            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        } else {
            // Other Pages: Always show sidebar (collapsed or open)
            setShowSidebar(true);
        }

    }, [router.pathname, isMobile]);

    // Listener for custom open events (e.g. from Hero Button)
    useEffect(() => {
        const handleCustomToggle = () => {
            setShowSidebar(true); // Ensure it's visible
            setIsOpen(true);      // Open it
        };
        window.addEventListener('toggle-global-form', handleCustomToggle);
        return () => window.removeEventListener('toggle-global-form', handleCustomToggle);
    }, []);

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
        // showSidebar controls if the whole component (button included) is on screen
        // isOpen controls if the form panel is slid out

        // CSS Logic:
        // if !showSidebar -> translate-x-full (completely off screen)
        // if showSidebar && isOpen -> translate-x-0 (fully visible)
        // if showSidebar && !isOpen -> translate-x-[calc(100%-40px)] (only button visible)

        const translateClass = !showSidebar
            ? 'translate-x-full'
            : (isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-40px)]');
        // Logic: standard LTR transform for right-aligned sidebar.
        // Positive translate moves Right (off-screen).
        // 0 is fully visible.
        // calc(100%-40px) leaves 40px visible.

        return (
            <div
                className={`fixed top-1/2 right-0 transform -translate-y-1/2 z-50 transition-all duration-300 ease-in-out ${translateClass}`}
                dir="ltr"
            >
                <div className="flex shadow-2xl rounded-l-xl overflow-hidden bg-white h-auto max-h-[80vh] border border-slate-200">
                    {/* Toggle Tab */}
                    <button
                        onClick={toggleForm}
                        className="bg-blue-600 text-white w-10 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors py-8 outline-none"
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
                        className="w-80 p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
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
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-3 pb-5 z-50 md:hidden flex flex-col items-center shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-2xl">
                <div className="mb-2 w-full text-center">
                    <p className="font-bold text-slate-800 text-base">
                        {locale === 'ar' ? 'تفكر في الدراسة بالخارج؟' : 'Thinking of studying abroad?'}
                    </p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg flex items-center justify-center text-sm"
                >
                    <span>{locale === 'ar' ? 'احصل على قبولك الجامعي واستشارتك مجاناً' : 'Get Your Offer & Free Consultation'}</span>
                </button>
            </div>

            {/* Mobile Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 p-4 transition-opacity md:hidden">
                    <div className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-md p-6 animate-slide-up sm:animate-fade-in relative" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                        <button
                            onClick={closeMobileForm}
                            className={`absolute top-4 ${locale === 'ar' ? 'left-4' : 'right-4'} text-slate-400 hover:text-slate-600`}
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

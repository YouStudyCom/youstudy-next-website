import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { siteConfig } from '../data/siteConfig.mjs';


export default function Navbar() {
    const router = useRouter();
    const { locale, pathname, asPath } = router;
    const isRTL = locale === 'ar';
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Shadow on scroll
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 5);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper for active link
    const linkClass = (path) =>
        `transition ${pathname === path ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}`;

    // Language switcher with FULL RELOAD
    const switchLanguage = () => {
        const nextLocale = locale === 'en' ? 'ar' : 'en';
        // Construct the new path for full reload
        // Next.js handles locale routing, so for 'ar' we prepend /ar, for 'en' (default) we just use path
        // However, standard window.location needs the full URL or relative path correctly
        // We can use the locale subpath logic:
        setMenuOpen(false);
        // Using asPath preserves query params and dynamic routes
        const path = asPath;
        if (nextLocale === 'ar') {
            // Switch to Arabic: prepend /ar if not already there (it wouldn't be if current is en)
            window.location.href = `/ar${path}`;
        } else {
            // Switch to English: remove /ar prefix
            // Since we are currently in 'ar' (presumably), the path might be /ar/... or just /... if handled by next router
            // But window.location see the browser URL.
            // Safest way is to just let Next.js router tell us the path, but force reload via window.location
            // Actually, simply stripping /ar is risky if we are not careful. 
            // Better approach: use relative path but force reload? 
            // If we are at /ar/about-us -> /about-us
            const newPath = path.startsWith('/ar') ? path.replace('/ar', '') : path;
            window.location.href = newPath || '/'; // Fallback to root
        }
    };

    // Helper to get localized href for standard <a> tag
    const getHref = (path) => {
        if (locale === 'ar') {
            return `/ar${path === '/' ? '' : path}`;
        }
        return path;
    }

    return (
        <header
            className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-shadow ${scrolled ? 'shadow-md' : ''
                }`}
        >
            <div
                className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between"
            >
                {/* Logo */}
                <a href={getHref('/')} className="flex items-center gap-2">
                    <Image
                        src="/enlogo.webp"
                        alt="YouStudy"
                        width={180}
                        height={60}
                        priority
                        className="h-9 md:h-12 w-auto object-contain"
                    />
                </a>

                {/* Right Side: Desktop Menu + Mobile Controls */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-8 text-sm">
                        {siteConfig.content[locale].navigation.header.map((link) => (
                            <a key={link.path} href={getHref(link.path)} className={linkClass(link.path)}>
                                {link.label}
                            </a>
                        ))}

                        {/* Language Switcher Desktop */}
                        <button
                            onClick={switchLanguage}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:bg-white hover:shadow-md hover:text-blue-600 transition-all duration-300 group"
                        >
                            <div className="relative w-6 h-6 rounded-full overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                                <Image
                                    src={locale === 'en' ? 'https://flagcdn.com/w40/sa.png' : 'https://flagcdn.com/w40/gb.png'}
                                    alt={locale === 'en' ? 'Arabic' : 'English'}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="font-bold text-sm">
                                {locale === 'en' ? 'العربية' : 'English'}
                            </span>
                        </button>
                    </nav>

                    {/* Mobile Language Switcher (Compact & Professional) */}
                    <button
                        onClick={switchLanguage}
                        className="md:hidden flex items-center gap-1.5 p-1 pr-2.5 rounded-full border border-slate-100 bg-slate-50 text-slate-600 active:scale-95 transition-all duration-300"
                    >
                        <div className="relative w-7 h-7 rounded-full overflow-hidden shadow-sm ring-1 ring-white">
                            <Image
                                src={locale === 'en' ? 'https://flagcdn.com/w40/sa.png' : 'https://flagcdn.com/w40/gb.png'}
                                alt={locale === 'en' ? 'Arabic' : 'English'}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="font-bold text-[10px] uppercase tracking-wide">
                            {locale === 'en' ? 'AR' : 'EN'}
                        </span>
                    </button>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden p-2 text-gray-700 text-2xl"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle Menu"
                    >
                        ☰
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96' : 'max-h-0'
                    }`}
            >
                <nav
                    className={`flex flex-col px-6 py-4 space-y-4 text-sm text-gray-700 bg-white border-t border-gray-200 ${isRTL ? 'text-right' : 'text-left'
                        }`}
                >
                    {siteConfig.content[locale].navigation.header.map((link) => (
                        <a key={link.path} href={getHref(link.path)} className={linkClass(link.path)}>
                            {link.label}
                        </a>
                    ))}
                </nav>
            </div>
        </header>
    );
}

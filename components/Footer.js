import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { siteConfig } from '../data/siteConfig.mjs';
import { FaFacebookF, FaYoutube, FaTiktok, FaWhatsapp, FaPhoneAlt, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
    const router = useRouter();
    const { locale } = router;
    const t = siteConfig.content[locale];
    const { socials, contact } = siteConfig;

    const getIcon = (platform) => {
        switch (platform) {
            case 'facebook': return <FaFacebookF />;
            case 'x': return <FaXTwitter />;
            case 'instagram': return <FaInstagram />;
            case 'youtube': return <FaYoutube />;
            case 'tiktok': return <FaTiktok />;
            default: return null;
        }
    };

    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 font-sans" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

                    {/* Brand & Description */}
                    <div className="space-y-6 lg:col-span-1 h-card">
                        <Link href="/" locale={locale} className="inline-block u-url u-uid">
                            <span className="sr-only p-name">YouStudy</span>
                            <div className="relative h-12 w-40">
                                <Image
                                    src="/enlogo.webp"
                                    alt="YouStudy"
                                    fill
                                    className="object-contain object-left rtl:object-right filter brightness-0 invert u-logo"
                                />
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400 p-note">
                            {t.description}
                        </p>
                        <div className="flex gap-4 pt-2">
                            {socials.map((social) => (
                                <a
                                    key={social.platform}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer me"
                                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-lg"
                                >
                                    <span className="sr-only">{social.platform}</span>
                                    <span className="text-lg">{getIcon(social.platform)}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:pl-8 rtl:lg:pr-8">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 relative inline-block">
                            {t.quickLinksTitle}
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-600 rounded-full rtl:right-0"></span>
                        </h3>
                        <ul className="space-y-3">
                            {t.navigation.footer.slice(0, 4).map((link) => (
                                <li key={link.path}>
                                    <Link href={link.path} className="text-base text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-blue-500 transition-colors"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* More Links */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 relative inline-block">
                            {t.moreInfoTitle}
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-600 rounded-full rtl:right-0"></span>
                        </h3>
                        <ul className="space-y-3">
                            {t.navigation.footer.slice(4).map((link) => (
                                <li key={link.path}>
                                    <Link href={link.path} className="text-base text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-blue-500 transition-colors"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 relative inline-block">
                            {t.contactTitle}
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-600 rounded-full rtl:right-0"></span>
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 group">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-500 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <FaPhoneAlt />
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-500 uppercase font-semibold mb-1">{locale === 'ar' ? 'اتصل بنا' : 'Call Us'}</span>
                                    <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="text-white hover:text-blue-400 transition-colors font-medium dir-ltr block p-tel" dir="ltr">
                                        {contact.phoneDisplay}
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 group">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-green-500 shrink-0 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <FaWhatsapp className="text-xl" />
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-500 uppercase font-semibold mb-1">WhatsApp</span>
                                    <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-400 transition-colors font-medium dir-ltr block" dir="ltr">
                                        {contact.whatsappNumber}
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-800 text-center md:flex md:justify-between md:items-center">
                    <p className="text-slate-500 text-sm">
                        {t.copyright.replace('{year}', new Date().getFullYear())}
                    </p>
                    <div className="mt-4 md:mt-0 flex justify-center space-x-6 rtl:space-x-reverse text-sm">
                        <Link href="/terms" className="text-slate-500 hover:text-white transition">
                            {t.navigation.footer.find(l => l.path === '/terms')?.label || 'Privacy & Terms'}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

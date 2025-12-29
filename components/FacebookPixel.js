import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function FacebookPixel() {
    const router = useRouter();

    useEffect(() => {
        // Track pageview on route change (SPA Transition)
        const handleRouteChange = () => {
            if (window.fbq) {
                window.fbq('track', 'PageView');
            }
        };

        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);

    return null; // Initialization is now handled in _document.js
}

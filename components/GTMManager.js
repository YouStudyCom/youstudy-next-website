import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';

export default function GTMManager({ gtmId }) {
    const [loadGTM, setLoadGTM] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Function to trigger loading
        const triggerLoad = () => {
            if (!loadGTM) {
                setLoadGTM(true);
            }
        };

        // Event listeners for user interaction
        const events = ['scroll', 'mousemove', 'touchstart', 'keydown', 'click'];

        const handleInteraction = () => {
            triggerLoad();
            // Cleanup listeners immediately after first interaction to avoid overhead
            events.forEach(event => window.removeEventListener(event, handleInteraction));
        };

        events.forEach(event => window.addEventListener(event, handleInteraction, { passive: true }));

        // Fallback: Load after 4 seconds automatically if no interaction
        const timer = setTimeout(triggerLoad, 4000);

        return () => {
            events.forEach(event => window.removeEventListener(event, handleInteraction));
            clearTimeout(timer);
        };
    }, []);

    // Push routes to GTM on page change if GTM is loaded
    useEffect(() => {
        if (loadGTM && window.dataLayer) {
            window.dataLayer.push({ event: 'pageview', page: router.asPath });
        }
    }, [router.asPath, loadGTM]);

    if (!loadGTM) return null;

    return (
        <Script
            id="gtm"
            strategy="afterInteractive" // Already deferred by the parent component's logic
            dangerouslySetInnerHTML={{
                __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
                `,
            }}
        />
    );
}

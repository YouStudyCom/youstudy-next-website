import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';

const PIXEL_ID = '465604069228649';

export default function FacebookPixel() {
    const router = useRouter();

    useEffect(() => {
        // Track pageview on route change
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

    return (
        <>
            <Script
                id="fb-pixel"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${PIXEL_ID}');
                        fbq('track', 'PageView');
                    `,
                }}
            />
        </>
    );
}

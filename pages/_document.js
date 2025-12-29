import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        const { locale } = this.props.__NEXT_DATA__;
        const dir = locale === 'ar' ? 'rtl' : 'ltr';

        return (
            <Html lang={locale} dir={dir}>
                <Head>
                    <link rel="dns-prefetch" href="https://images.unsplash.com" />
                    <link rel="preconnect" href="https://images.unsplash.com" />

                    {/* Facebook Pixel Code */}
                    <script
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
                                fbq('init', '465604069228649');
                                fbq('track', 'PageView');
                            `,
                        }}
                    />
                    <noscript>
                        <img height="1" width="1" style={{ display: 'none' }}
                            src="https://www.facebook.com/tr?id=465604069228649&ev=PageView&noscript=1"
                        />
                    </noscript>
                    {/* End Facebook Pixel Code */}
                </Head>
                <body className={locale === 'ar' ? 'font-ar text-[18px] font-normal' : ''}>
                    <noscript>
                        <iframe
                            src="https://www.googletagmanager.com/ns.html?id=GTM-KL7RPPMM"
                            height="0"
                            width="0"
                            style={{ display: 'none', visibility: 'hidden' }}
                            title="Google Tag Manager"
                        ></iframe>
                    </noscript>

                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;

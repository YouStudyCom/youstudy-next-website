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

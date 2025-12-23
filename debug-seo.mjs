import * as NextSeoPkg from 'next-seo';
console.log('Keys:', Object.keys(NextSeoPkg));
try {
    console.log('DefaultSeo Type:', typeof NextSeoPkg.DefaultSeo);
    console.log('NextSeo Type:', typeof NextSeoPkg.NextSeo);
} catch (e) {
    console.error(e);
}

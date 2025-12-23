import * as NextSeoPkg from 'next-seo';
console.log('Keys:', JSON.stringify(Object.keys(NextSeoPkg)));
console.log('Have default?', !!NextSeoPkg.default);
if (NextSeoPkg.default) {
    console.log('Default keys:', Object.keys(NextSeoPkg.default));
}

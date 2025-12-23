import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Advice() {
    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold">Advice Page</h1>
        </div>
    );
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}

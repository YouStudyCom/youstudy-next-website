import Link from 'next/link';
import { BreadcrumbJsonLd } from 'next-seo';
import { useTranslation } from 'next-i18next';

export default function Breadcrumbs({ items }) {
    const { t } = useTranslation('common');

    // Filter valid items (ensure they have labels)
    const validItems = items.filter(item => item.label);

    // Prepare Schema Items
    const SITE_URL = 'https://www.youstudy.com';

    const schemaItems = validItems.map((item, index) => ({
        position: index + 1,
        name: item.label,
        item: item.href ? (item.href.startsWith('http') ? item.href : `${SITE_URL}${item.href}`) : undefined,
    }));

    if (!validItems.length) return null;

    return (
        <>
            {/* Structured Data */}
            <BreadcrumbJsonLd itemListElement={schemaItems} />

            {/* Visual Navigation */}
            <nav aria-label="Breadcrumb" className="mb-6 w-full overflow-hidden">
                <ol className="flex flex-nowrap items-center gap-2 text-sm text-slate-500">
                    {validItems.map((item, index) => {
                        const isLast = index === validItems.length - 1;

                        return (
                            <li key={index} className={`flex items-center min-w-0 ${isLast ? 'flex-1' : 'shrink'}`}>
                                {index > 0 && (
                                    <span className="mx-2 text-slate-400 select-none" aria-hidden="true">/</span>
                                )}

                                {isLast ? (
                                    <span
                                        className="font-medium text-slate-900 truncate block"
                                        aria-current="page"
                                        title={item.label}
                                    >
                                        {item.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="hover:text-blue-600 transition-colors duration-200 whitespace-nowrap truncate block"
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
}

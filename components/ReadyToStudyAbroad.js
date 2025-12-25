import React from 'react';
import { useRouter } from 'next/router';

export default function ReadyToStudyAbroad({ name }) {
    const { locale } = useRouter();

    const displayName = name || (locale === 'ar' ? 'رحلتك الدراسية' : 'your study journey');

    return (
        <div className="bg-blue-600 rounded-2xl p-8 sm:p-12 text-center text-white shadow-xl my-16">
            <h3 className="text-2xl font-bold mb-4">
                {locale === 'ar'
                    ? `هل أنت جاهز لبدء ${name ? name : 'رحلتك الدراسية'}؟`
                    : `Ready to start your journey in ${name ? name : 'Study Abroad'}?`}
            </h3>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                {locale === 'ar'
                    ? 'نحن نساعدك في كل خطوة من خطوات رحلتك الدراسية.'
                    : 'We help you with every step of your study abroad journey. Visa, admission, and more.'}
            </p>
            <button
                className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition shadow-lg"
                onClick={() => window.dispatchEvent(new Event('toggle-global-form'))}
            >
                {locale === 'ar' ? 'احصل على استشارة مجانية' : 'Get Free Advice'}
            </button>
        </div>
    );
}

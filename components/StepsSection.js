import { useTranslation } from 'next-i18next';
import Link from 'next/link';

export default function StepsSection() {
    const { t } = useTranslation('common');

    const steps = [
        {
            id: 1,
            icon: (
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            title: t('steps.step1_title', 'Send Your Enquiry'),
            description: t('steps.step1_desc', 'Click "Get Started" and complete our enquiry form to connect with a dedicated study abroad counsellor.'),
        },
        {
            id: 2,
            icon: (
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: t('steps.step2_title', 'Apply with YouStudy'),
            description: t('steps.step2_desc', 'Apply through YouStudy and let our experts guide you through your university application.'),
        },
        {
            id: 3,
            icon: (
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: t('steps.step3_title', 'Start Your Journey'),
            description: t('steps.step3_desc', 'Receive your offer, book your flight, and confidently begin your study abroad journey.'),
        },
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {t('steps.title', 'Ready to Study Abroad?')}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {t('steps.subtitle', 'We’re Here to Guide You Every Step of the Way')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            onClick={() => window.dispatchEvent(new CustomEvent('toggle-global-form'))}
                            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center border border-gray-100 cursor-pointer group hover:border-blue-200 hover:-translate-y-1"
                        >
                            <div className="mb-6 p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2 group-hover:text-blue-600 transition-colors">
                                <span className="text-blue-600 group-hover:underline">{step.id}.</span>
                                <span>{step.title}</span>
                            </h3>
                            <p className="text-gray-600 leading-relaxed group-hover:text-gray-700">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('toggle-global-form'))}
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full transition duration-300 transform hover:scale-105 shadow-lg text-lg cursor-pointer"
                    >
                        {t('steps.get_started', 'Get Started')}
                    </button>
                </div>
            </div>
        </section>
    );
}

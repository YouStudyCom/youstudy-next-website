import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useVisitorData } from '../hooks/useVisitorData';
import { useSourceTracking } from '../hooks/useSourceTracking';
import { siteConfig } from '../data/siteConfig.mjs';
import { countries } from '../data/countries';

const studyLevels = [
    { id: 25, en: 'Secondary School', ar: 'الثانوية العامة' },
    { id: 28, en: 'Foundation', ar: 'السنة التحضيرية' },
    { id: 3, en: 'Language', ar: 'برنامج لغة' },
    { id: 2, en: 'Undergraduate', ar: 'بكالوريوس' },
    { id: 31, en: "Pre-Master's", ar: 'برنامج تمهيدي للماجستير' },
    { id: 1, en: 'Postgraduate', ar: 'دراسات عليا (ماجستير)' },
    { id: 7, en: 'PhD', ar: 'دكتوراه' }
];

export default function InquiryForm({ className = "" }) {
    const router = useRouter();
    const { t } = useTranslation('common');
    const { locale, asPath } = router;

    // Visitor Data for Auto-fill
    const visitorData = useVisitorData();
    const { sourceId, channel, referrerId, schoolId } = useSourceTracking();
    const [selectedCountry, setSelectedCountry] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        mobileCountryCode: '',
        mobileCountryId: '',
        studyLevel: '',
        message: '',
        residenceCountry: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [errors, setErrors] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For custom country selector

    // Auto-select Residence and Mobile Code based on visitor data
    useEffect(() => {
        if (visitorData.country || visitorData.countryCode) {
            const matchedCountry = countries.find(c =>
                (visitorData.countryCode && c.code === visitorData.countryCode) ||
                (visitorData.country && (c.name.en.toLowerCase() === visitorData.country.toLowerCase() || c.name.ar === visitorData.country))
            );

            if (matchedCountry) {
                setFormData(prev => ({
                    ...prev,
                    residenceCountry: !prev.residenceCountry ? matchedCountry.id : prev.residenceCountry,
                    mobileCountryCode: !prev.mobileCountryCode ? matchedCountry.dialCode : prev.mobileCountryCode,
                    mobileCountryId: !prev.mobileCountryId ? matchedCountry.id : prev.mobileCountryId
                }));
                // Auto-select Nationality if not set
                if (!selectedCountry) {
                    setSelectedCountry(matchedCountry.id);
                }
            }
        }
    }, [visitorData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Name
        if (!formData.name.trim()) {
            newErrors.name = locale === 'ar' ? 'الاسم مطلوب' : 'Name is required';
        }

        // Email
        if (!formData.email.trim()) {
            newErrors.email = locale === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = locale === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email format';
        }

        // Mobile
        if (!formData.mobile.trim()) {
            newErrors.mobile = locale === 'ar' ? 'رقم الهاتف مطلوب' : 'Mobile number is required';
        }

        // Nationality
        if (!selectedCountry) {
            newErrors.country = locale === 'ar' ? 'يرجى اختيار الجنسية' : 'Please select your nationality';
        }

        // Study Level
        if (!formData.studyLevel) {
            newErrors.studyLevel = locale === 'ar' ? 'يرجى اختيار المستوى الدراسي' : 'Please select a study level';
        }

        // Message
        if (!formData.message.trim()) {
            newErrors.message = locale === 'ar' ? 'الاستفسار مطلوب' : 'Enquiry is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setStatus('submitting');

        try {
            // Prepare robust mobile number
            const prefix = formData.mobileCountryCode || '';
            const prefixNumeric = prefix.replace('+', '');
            let rawMobile = (formData.mobile || '').trim();

            // Remove any leading '+' or '0's
            let cleanMobile = rawMobile.replace(/^[\+0]+/, '');

            let finalMobile;

            // If the clean number already starts with the country code (e.g. 96655...), just add +
            if (prefixNumeric && cleanMobile.startsWith(prefixNumeric)) {
                finalMobile = `+${cleanMobile}`;
            } else {
                // Otherwise, join prefix and clean number
                finalMobile = `${prefix}${cleanMobile}`;
            }

            if (!cleanMobile) finalMobile = rawMobile; // Safety fallback

            // Generate unique event ID for deduplication
            const event_id = `lead_${Date.now()}`;

            const res = await fetch(siteConfig.api.endpoints.submitInquiry, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    event_id, // Sent for CAPI deduplication
                    mobile: finalMobile,
                    whatsapp: finalMobile,
                    selectedCountry,
                    sourceId,
                    sourceChannel: channel,
                    referrerId,
                    schoolId,
                    pageUrl: typeof window !== 'undefined' ? window.location.href : asPath,
                    visitorData: {
                        country: visitorData.country,
                        countryCode: visitorData.countryCode,
                        ip: visitorData.ip
                    }
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Submission failed');
            }

            // Trigger GTM Lead Event (DataLayer)
            if (typeof window !== 'undefined') {
                window.dataLayer = window.dataLayer || [];
                // Find readable names for parameters
                const nationalityObj = countries.find(c => c.id == selectedCountry);
                const studyLevelObj = studyLevels.find(l => l.id == formData.studyLevel);

                window.dataLayer.push({
                    'event': 'lead',
                    'eventCategory': 'Lead',
                    'eventAction': 'Submit',
                    'eventLabel': 'Free Consultation Form',
                    'revenue': 0, // Leads usually 0
                    'leadData': {
                        'content_name': 'Free Consultation Request',
                        'source': "Free Consultation Form",
                        'study_level': studyLevelObj ? studyLevelObj.en : formData.studyLevel,
                        'nationality': nationalityObj ? nationalityObj.name.en : selectedCountry,
                        'page_path': window.location.pathname,
                        'eventID': event_id
                    }
                });
            }

            setStatus('success');
            setFormData({ name: '', email: '', mobile: '', studyLevel: '', message: '', residenceCountry: '' });
            setSelectedCountry('');
            // Auto close or reset after few seconds?
            setTimeout(() => setStatus('idle'), 5000);

        } catch (error) {
            console.error('Submission Error:', error);
            setStatus('error');
            setErrors(prev => ({ ...prev, submit: error.message }));
        }
    };

    if (status === 'success') {
        return (
            <div className={`flex flex-col items-center justify-center p-8 h-full min-h-[400px] text-center bg-white rounded-lg animate-fade-in ${className}`}>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(74,222,128,0.5)] animate-bounce-subtle">
                    <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" className="animate-[dash_1s_ease-in-out]" />
                    </svg>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-600">
                    {locale === 'ar' ? 'خطوتك الأولى نحو المستقبل!' : "You've Taken the First Step!"}
                </h3>

                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto">
                    {locale === 'ar'
                        ? 'شكراً من القلب لثقتك بنا. نعدك بأن نكون معك في كل خطوة لتحقيق حلمك. مستشارك الشخصي يقرأ رسالتك الآن، وسيتواصل معك خلال 24 ساعة لنبدأ هذه الرحلة المميزة معاً.'
                        : 'Thank you from the heart for trusting us. We want you to know that we are truly excited to help you achieve your dreams. Your personal advisor is reading your message right now and will reach out within 24 hours so we can start this journey together.'}
                </p>

                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-green-400 w-full animate-[progress_2s_ease-in-out_infinite]"></div>
                </div>

                <button
                    onClick={() => setStatus('idle')}
                    className="text-blue-600 font-semibold hover:text-blue-800 transition-colors text-sm"
                >
                    {locale === 'ar' ? 'إرسال طلب آخر' : 'Send another request'}
                </button>

                <style jsx>{`
                    @keyframes dash {
                        0% { stroke-dasharray: 20; stroke-dashoffset: 20; opacity: 0; }
                        100% { stroke-dasharray: 20; stroke-dashoffset: 0; opacity: 1; }
                    }
                    @keyframes bounce-subtle {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                    @keyframes progress {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <form className={`space-y-3 ${className}`} onSubmit={handleSubmit}>
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {locale === 'ar' ? 'الاسم' : 'Name'} <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 outline-none text-sm bg-gray-50 focus:bg-white transition-colors ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
                    placeholder={locale === 'ar' ? 'اسمك الكريم' : 'Your Name'}
                />
                {errors.name && <p className="text-red-500 text-[10px] mt-0.5">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'} <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 outline-none text-sm bg-gray-50 focus:bg-white transition-colors ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
                    placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email}</p>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {locale === 'ar' ? 'رقم الموبايل' : 'Mobile number'} <span className="text-red-500">*</span>
                </label>
                <div className="flex relative items-stretch" dir="ltr">
                    {/* Custom Country Selector */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="h-full px-2 border border-r-0 rounded-l-md bg-gray-50 border-slate-200 flex items-center justify-center min-w-[60px] hover:bg-gray-100 transition-colors"
                        >
                            {formData.mobileCountryCode && countries.find(c => c.id === formData.mobileCountryId)?.code ? (
                                <div className="flex items-center gap-1">
                                    <Image
                                        src={`https://flagcdn.com/w40/${countries.find(c => c.id === formData.mobileCountryId).code.toLowerCase()}.png`}
                                        alt="flag"
                                        width={20}
                                        height={14}
                                        className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
                                    />
                                    <span className="text-[10px] text-slate-500">▼</span>
                                </div>
                            ) : (
                                <span className="text-xs text-slate-500">▼</span>
                            )}
                        </button>

                        {/* Dropdown List */}
                        {isDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                                <div className="absolute top-full left-0 mt-1 w-60 bg-white border border-slate-200 rounded shadow-xl z-50 max-h-48 overflow-y-auto">
                                    {countries.map((country) => (
                                        <button
                                            key={country.id}
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    mobileCountryCode: country.dialCode,
                                                    mobileCountryId: country.id
                                                }));
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-3 border-b last:border-0 border-slate-50"
                                        >
                                            {country.code && (
                                                <Image
                                                    src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                                    alt={country.code}
                                                    width={20}
                                                    height={12}
                                                    className="w-5 h-3 object-cover rounded-sm"
                                                />
                                            )}
                                            <span className="text-gray-500 font-mono text-xs w-10">{country.dialCode}</span>
                                            <span className="text-gray-700 truncate flex-1 text-xs">{country.name.en}</span>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className={`flex-1 px-3 py-2 border rounded-r-md focus:ring-2 outline-none text-sm bg-gray-50 focus:bg-white transition-colors ${errors.mobile ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
                        placeholder={locale === 'ar' ? '55...' : '55...'}
                    />
                </div>
                {errors.mobile && <p className="text-red-500 text-[10px] mt-0.5">{errors.mobile}</p>}
            </div>

            {/* Grid for Selects */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 truncate">
                        {locale === 'ar' ? 'الجنسية' : 'Nationality'} <span className="text-red-500">*</span>
                    </label>
                    <select
                        className={`w-full px-2 py-2 border rounded-md focus:ring-2 outline-none text-sm bg-gray-50 focus:bg-white ${errors.country ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
                        value={selectedCountry}
                        onChange={(e) => {
                            setSelectedCountry(e.target.value);
                            if (errors.country) setErrors(prev => ({ ...prev, country: null }));
                        }}
                    >
                        <option value="">{locale === 'ar' ? 'اختر...' : 'Select...'}</option>
                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.name[locale] || country.name.en}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 truncate">
                        {locale === 'ar' ? 'المستوى الدراسي' : 'Study Level'} <span className="text-red-500">*</span>
                    </label>
                    <select
                        className={`w-full px-2 py-2 border rounded-md focus:ring-2 outline-none text-sm bg-gray-50 focus:bg-white ${errors.studyLevel ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
                        name="studyLevel"
                        value={formData.studyLevel}
                        onChange={handleChange}
                    >
                        <option value="">{locale === 'ar' ? 'اختر...' : 'Select...'}</option>
                        {studyLevels.map((level) => (
                            <option key={level.id} value={level.id}>
                                {locale === 'ar' ? level.ar : level.en}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {locale === 'ar' ? 'استفسارك' : 'Enquiry'} <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 outline-none text-sm bg-gray-50 focus:bg-white transition-colors ${errors.message ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
                    rows="2"
                    placeholder={locale === 'ar' ? 'أخبرنا عن هدفك...' : 'Tell us about your goals...'}
                ></textarea>
                {errors.message && <p className="text-red-500 text-[10px] mt-0.5">{errors.message}</p>}
            </div>

            <button
                type="submit"
                disabled={status === 'submitting'}
                className={`w-full font-bold py-3 rounded-md transition text-sm shadow-lg transform hover:-translate-y-0.5 ${status === 'submitting' ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'} text-white`}
            >
                {status === 'submitting'
                    ? (locale === 'ar' ? 'جاري الإرسال...' : 'Sending...')
                    : t('steps.get_free_consultation', 'Get Free Consultation')
                }
            </button>

            {status === 'error' && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded text-center">
                    <p className="font-bold mb-1">{locale === 'ar' ? 'حدث خطأ' : 'Error'}</p>
                    <p>{errors.submit || (locale === 'ar' ? 'يرجى المحاولة مرة أخرى.' : 'Please try again.')}</p>
                </div>
            )}

            <p className="text-xs text-slate-500 text-center mt-2 px-4 leading-relaxed">
                {locale === 'ar' ? (
                    <>
                        بإرسال معلوماتك، فإنك توافق على <Link href="/terms" target="_blank" className="underline hover:text-blue-500">شروط</Link> و <Link href="/terms" target="_blank" className="underline hover:text-blue-500">سياسة الخصوصية</Link> الخاصة بـYouStudy.
                    </>
                ) : (
                    <>
                        By submitting your information, you agree to YouStudy’s <Link href="/terms" target="_blank" className="underline hover:text-blue-500">Terms</Link> and <Link href="/terms" target="_blank" className="underline hover:text-blue-500">Privacy Policy</Link>.
                    </>
                )}
            </p>
        </form>
    );
}

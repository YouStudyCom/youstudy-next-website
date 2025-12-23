export const siteConfig = {
    metadata: {
        siteName: 'YouStudy',
        siteUrl: 'https://www.youstudy.com',
        author: 'YouStudy UK Ltd',
        ahrefsAnalyticsKey: 'wUwh+2Xm+h2rIU5C1Ibh4Q',
        defaultLocale: 'en'
    },
    api: {
        baseUrl: {
            crm: 'http://127.0.0.1:8002',
            cms: 'http://127.0.0.1:8000'
        },
        endpoints: {
            // Frontend API Routes
            submitInquiry: '/api/submit-inquiry',
            destinations: '/api/destinations',
            articles: '/api/articles',

            // Backend Endpoints
            crm: {
                login: '/api/login',
                createStudent: '/api/students/create/'
            },
            cms: {
                articles: '/api/articles',
                storage: '/storage'
            }
        }
    },
    auth: {
        crm: {
            email: 'api@user.com',
            password: 'Amin770904030123*'
        }
    },
    contact: {
        phone: '+44 203 608 2800',
        phoneDisplay: '+44 203 608 2800',
        whatsapp: 'https://wa.me/442036082800',
        whatsappNumber: '+44 203 608 2800',
        email: 'apply@youstudy.com' // Assumed based on common patterns, can be updated
    },
    socials: [
        {
            platform: 'facebook',
            url: 'https://www.facebook.com/YouStudyLimited/'
        },
        {
            platform: 'x',
            url: 'https://x.com/YouStudyLimited'
        },
        {
            platform: 'instagram',
            url: 'https://www.instagram.com/youstudylimited'
        },
        {
            platform: 'youtube',
            url: 'https://www.youtube.com/channel/UC6skrV_aEz05NPATBz_8j7Q'
        },
        {
            platform: 'tiktok',
            url: 'https://www.tiktok.com/@youstudy.com'
        }
    ],
    content: {
        en: {
            description: "YouStudy is your trusted guide to studying abroad. We help students find the best universities and programs worldwide.",
            quickLinksTitle: "Quick Links",
            contactTitle: "Contact Us",
            moreInfoTitle: "More Info",
            copyright: "© {year} YouStudy. All rights reserved.",
            navigation: {
                header: [
                    { label: 'Home', path: '/' },
                    { label: 'Your Guide', path: '/study-abroad-guide' },
                    { label: 'Subject Areas', path: '/subjectareas' }
                ],
                footer: [
                    { label: 'Home', path: '/' },
                    { label: 'Advice', path: '/study-abroad-guide' },
                    { label: 'Subject Areas', path: '/subjectareas' },
                    { label: 'Contact Us', path: '/contact-us' },
                    { label: 'About Us', path: '/about-us' },
                    // { label: 'Careers', path: '/careers' },
                    { label: 'Legal Terms', path: '/terms' }
                ]
            }
        },
        ar: {
            description: "يوستدي هو دليلك الموثوق للدراسة في الخارج. نساعد الطلاب في العثور على أفضل الجامعات والبرامج الدراسية حول العالم.",
            quickLinksTitle: "روابط سريعة",
            contactTitle: "تواصل معنا",
            moreInfoTitle: "معلومات اخرى",
            copyright: "© {year} يوستدي. جميع الحقوق محفوظة.",
            navigation: {
                header: [
                    { label: 'الرئيسية', path: '/' },
                    { label: 'دليلك', path: '/study-abroad-guide' },
                    { label: 'المجالات', path: '/subjectareas' }
                ],
                footer: [
                    { label: 'الرئيسية', path: '/' },
                    { label: 'دليلك', path: '/study-abroad-guide' },
                    { label: 'التخصصات', path: '/subjectareas' },
                    { label: 'تواصل معنا', path: '/contact-us' },
                    { label: 'من نحن', path: '/about-us' },
                    // { label: 'الوظائف', path: '/careers' },
                    { label: 'الشروط القانونية', path: '/terms' }
                ]
            }
        }
    }
};

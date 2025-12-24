/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: '#187EBE',
                    light: '#3D9AD6',
                    dark: '#136396',
                    50: '#F0F8FC',
                    100: '#E0F0FA',
                }
            },
            animation: {
                blob: "blob 7s infinite",
            },
            fontFamily: {
                ar: ['Tajawal', 'sans-serif'],
            },
            keyframes: {
                blob: {
                    "0%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                    "33%": {
                        transform: "translate(30px, -50px) scale(1.1)",
                    },
                    "66%": {
                        transform: "translate(-20px, 20px) scale(0.9)",
                    },
                    "100%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],


}

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#E07B7B',
                'primary-dark': '#C96868',
                accent: '#FF8E8E',
                'bg-main': '#F5E6D3',
                card: '#FFFFFF',
                'text-dark': '#333333',
                border: '#F0D5D5',
                'grad-top': '#FF8A8A',
                'grad-bot': '#FFFCF7',
            },
            borderRadius: {
                '2xl': '1rem',
            },
        },
    },
    plugins: [],
}

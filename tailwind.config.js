/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0077C0', // Bright cerulean blue
                'primary-dark': '#00509E', // Deep royal blue
                accent: '#4AC6F6', // Bright cyan/sky blue
                'bg-main': '#F0F8FF', // Alice blue (very soft icy background)
                card: '#FFFFFF',
                'text-dark': '#2B3C5A', // Dark navy/slate for text
                border: '#BBDEFB', // Soft blue border
                'grad-top': '#0077C0',
                'grad-bot': '#E3F2FD',
            },
            borderRadius: {
                '2xl': '1rem',
            },
        },
    },
    plugins: [],
}

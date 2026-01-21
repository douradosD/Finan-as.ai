/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom colors if needed, but standard tailwind colors work well
                // We will rely on 'black', 'white', and 'yellow-400' mostly
                primary: '#FACC15', // Yellow-400
                background: '#000000',
                surface: '#18181B', // Zinc-900 for cards
            }
        },
    },
    plugins: [],
}

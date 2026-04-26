/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F9FAFB', // 60% Dominant (Light background)
        surface: '#FFFFFF',    // 30% Secondary (White cards/panels)
        surfaceDark: '#111827', // 30% Secondary contrast (Dark gray blocks)
        primary: '#EF4F5F',    // 10% Accent (Zomato-style vibrant red/pink)
        primaryHover: '#D43F4D',
        accent: '#FBBF24',
        textPrimary: '#111827',
        textSecondary: '#6B7280',
        textLight: '#FFFFFF',
        danger: '#EF4444',
        success: '#10B981'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}

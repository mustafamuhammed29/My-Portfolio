/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // تفعيل الوضع المظلم بناءً على الكلاس
  theme: {
    extend: {
      colors: {
        // تعريف الألوان باستخدام متغيرات CSS
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'card-background': 'var(--card-background)',
        'card-border': 'var(--card-border)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        primary: 'hsl(var(--primary-color-hsl))',
      }
    },
  },
  plugins: [],
}

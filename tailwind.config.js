/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main color: #667585 (sophisticated slate blue-gray)
        base: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e3e6ea',
          300: '#d0d7de',
          400: '#b1bcc8',
          500: '#667585',
          600: '#4a5d6e',
          700: '#3a4a5a',
          800: '#2d3a47',
          900: '#1f2936',
        },
        // Accent color: #92BBE8 (bright sky blue)
        accent: {
          50: '#f0f7ff',
          100: '#e0f0ff',
          200: '#c8e4ff',
          300: '#a3d3ff',
          400: '#7abeff',
          500: '#92BBE8',
          600: '#5a9fe6',
          700: '#3d82d4',
          800: '#2a6bc2',
          900: '#1a519f',
        },
        // White for cards
        white: {
          DEFAULT: '#ffffff',
        },
        // Background gradients using the two main colors
        bg: {
          primary: 'linear-gradient(135deg, #667585 0%, #92BBE8 100%)',
          light: 'linear-gradient(135deg, #f1f3f5 0%, #f0f7ff 100%)',
          soft: 'linear-gradient(135deg, #f8f9fa 0%, #e0f0ff 100%)',
          reverse: 'linear-gradient(135deg, #92BBE8 0%, #667585 100%)',
        },
        // Semantic colors derived from main colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(102, 117, 133, 0.1), 0 10px 20px -2px rgba(146, 187, 232, 0.05)',
        'soft-lg': '0 10px 15px -3px rgba(102, 117, 133, 0.1), 0 4px 6px -2px rgba(146, 187, 232, 0.05)',
        'card': '0 4px 6px -1px rgba(102, 117, 133, 0.1), 0 2px 4px -1px rgba(146, 187, 232, 0.05)',
        'card-hover': '0 20px 25px -5px rgba(102, 117, 133, 0.1), 0 10px 10px -5px rgba(146, 187, 232, 0.04)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667585 0%, #92BBE8 100%)',
        'gradient-light': 'linear-gradient(135deg, #f1f3f5 0%, #f0f7ff 100%)',
        'gradient-soft': 'linear-gradient(135deg, #f8f9fa 0%, #e0f0ff 100%)',
        'gradient-reverse': 'linear-gradient(135deg, #92BBE8 0%, #667585 100%)',
        'icon-gradient': 'linear-gradient(135deg, #667585 0%, #92BBE8 100%)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

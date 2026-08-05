/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--color-background) / <alpha-value>)',
        surface: 'hsl(var(--color-surface) / <alpha-value>)',
        elevated: 'hsl(var(--color-elevated) / <alpha-value>)',
        border: 'hsl(var(--color-border) / <alpha-value>)',
        foreground: 'hsl(var(--color-foreground) / <alpha-value>)',
        muted: 'hsl(var(--color-muted) / <alpha-value>)',
        primary: 'hsl(var(--color-primary) / <alpha-value>)',
        accent: 'hsl(var(--color-accent) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px hsl(var(--color-primary) / 0.22)',
      },
    },
  },
  plugins: [],
};

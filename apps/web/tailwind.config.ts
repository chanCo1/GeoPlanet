import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/widgets/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/entities/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand & Accent
        primary: '#fcd535',
        'primary-active': '#f0b90b',
        'primary-disabled': '#3a3a1f',
        'accent-turquoise': '#2dbdb6',

        // Surface
        ink: '#181a20',
        body: '#eaecef',
        'body-on-light': '#181a20',
        muted: '#707a8a',
        'muted-strong': '#929aa5',

        // Hairlines & Borders
        'hairline-on-light': '#eaecef',
        'hairline-on-dark': '#2b3139',
        'border-strong': '#cdd1d6',

        // Canvas & Surface
        'canvas-light': '#ffffff',
        'canvas-dark': '#0b0e11',
        'surface-card-dark': '#1e2329',
        'surface-elevated-dark': '#2b3139',
        'surface-soft-light': '#fafafa',
        'surface-strong-light': '#f5f5f5',

        // Text Colors
        'on-primary': '#181a20',
        'on-dark': '#ffffff',

        // Trading Semantics
        'trading-up': '#0ecb81',
        'trading-down': '#f6465d',

        // Info & Focus
        info: '#3b82f6',
        'info-ring': '#3b82f6',

        // Legacy CSS Variables
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },

      fontSize: {
        // Display
        'hero-display': ['64px', { lineHeight: '1.1', letterSpacing: '-1px' }],
        'display-lg': ['48px', { lineHeight: '1.1', letterSpacing: '-0.5px' }],
        'display-md': ['40px', { lineHeight: '1.15', letterSpacing: '-0.3px' }],
        'display-sm': ['32px', { lineHeight: '1.2', letterSpacing: '0' }],

        // Title
        'title-lg': ['24px', { lineHeight: '1.3', letterSpacing: '0' }],
        'title-md': ['20px', { lineHeight: '1.35', letterSpacing: '0' }],
        'title-sm': ['16px', { lineHeight: '1.4', letterSpacing: '0' }],

        // Number (BinancePlex)
        'number-display': ['40px', { lineHeight: '1.1', letterSpacing: '-0.3px' }],
        'number-md': ['16px', { lineHeight: '1.4', letterSpacing: '0' }],
        'number-sm': ['14px', { lineHeight: '1.4', letterSpacing: '0' }],

        // Body
        'body-md': ['14px', { lineHeight: '1.5', letterSpacing: '0' }],
        'body-sm': ['13px', { lineHeight: '1.5', letterSpacing: '0' }],

        // Caption
        caption: ['12px', { lineHeight: '1.4', letterSpacing: '0' }],

        // Button
        button: ['14px', { lineHeight: '1', letterSpacing: '0' }],

        // Navigation
        'nav-link': ['14px', { lineHeight: '1.4', letterSpacing: '0' }],
      },

      fontWeight: {
        400: '400',
        500: '500',
        600: '600',
        700: '700',
      },

      fontFamily: {
        // BinanceNova for display & body
        'binance-nova': ['BinanceNova', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        // BinancePlex for numbers
        'binance-plex': ['BinancePlex', 'BinanceNova', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },

      spacing: {
        xxs: '4px',
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
        section: '80px',
      },

      borderRadius: {
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        pill: '9999px',
      },

      height: {
        'btn-primary': '40px',
        'btn-subscribe': '28px',
        'input-default': '40px',
        'nav': '64px',
      },
    },
  },
  plugins: [],
};

export default config;

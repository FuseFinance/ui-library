/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', ...defaultTheme.fontFamily.sans],
        'serif': ['Inter', ...defaultTheme.fontFamily.serif],
        'mono': ['ui-monospace', 'SFMono-Regular'],     
      },  
      maxWidth: {
        xxs: '15rem',
      },
      spacing: {
        '0.8': '0.063rem',        
        '0.9': '0.125rem',
      }      

    },
    colors: {
      transparent: "transparent",
      black: '#000000',
      white: '#FFFFFF',
      red: {
        100: '#FAE0E1',
        300: '#F0A7AC',
        600: '#DA2828',
        800: '#971D1C',
      },
      blue: {
        100: '#E5ECFF',
        300: '#A1B7F9',
        400: '#819FFB',
        500: '#4268DA',
        600: '#0A38C2',
        700: '#042790',
        800: '#001861',
        900: '#002140',
      },
      gray: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E0E7F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        700: '#334155',
      },
      green: {
        100: '#DCFCE7',
        300: '#86EFAC',
        600: '#50A14F',
        800: '#166534'
      },
      violet: {
        100: '#6B21A8',
        300: '#F3E8FF',
        800: '#6B21A8'
      },
      pink: {
        100: '#FCE7FF',
        300: '#F9A8D4',
        800: '#9D174D'
      },
      yellow: {
        100: '#FEF3C7',
        300: '#FFBB55',
        500: '#92400E',
        600: '#D97706'
      },
    },
  },
  plugins: [],
};

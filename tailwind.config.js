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
        400: '#C54500',
      },
      blue: {
        50: '#F8FAFC',
        100: '#E5ECFF',
        200: '#CED9FC',
        300: '#A1B7F9',
        400: '#819FFB',
        500: '#4268DA',
        600: '#0A38C2',
        700: '#042790',
        800: '#001861',
        900: '#002140',
      },
      gray: {
        50: '#F9FAFC',
        100: '#F1F5F9',
        200: '#94A3B8',
        300: '#DCE6EE',
        400: '#9CA3AF',
        500: '#ADB8C6',
        600: '#8795A1',
        700: '#667481',
        800: '#464F5A',
      },
      green: {
        600: '#50A14F',
      },
      violet: {
        700: '#804AF1',
      },
      yellow: {
        300: '#FFBB55',
      },
    },
  },
  plugins: [],
};

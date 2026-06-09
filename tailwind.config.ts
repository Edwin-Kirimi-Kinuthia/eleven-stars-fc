import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pink: '#E91E8C',
        'pink-dark': '#C4186F',
        'pink-light': '#FF4DAE',
        gold: '#C9A84C',
        'gold-light': '#E8C76A',
        base: '#080808',
        surface: '#111111',
        'surface-2': '#1C1C1C',
        'surface-3': '#272727',
      },
      fontSize: {
        'clamp-h1': 'clamp(2.5rem, 8vw, 6rem)',
      },
    },
  },
  plugins: [],
}

export default config

const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    require('tailwind-corner-smoothing'),
    require('tailwindcss-animate'),
  ],
  darkMode: process.env.DARK_MODE ? process.env.DARK_MODE : 'class',
  content: [
    './app/**/*.{html,js,jsx,ts,tsx,mdx}',
    './components/**/*.{html,js,jsx,ts,tsx,mdx}',
    './utils/**/*.{html,js,jsx,ts,tsx,mdx}',
    './*.{html,js,jsx,ts,tsx,mdx}',
    './src/**/*.{html,js,jsx,ts,tsx,mdx}',
  ],
  presets: [require('nativewind/preset')],
  important: 'html',
  future: {
    hoverOnlyWhenSupported: true,
  },

  // ─── Safelist ───────────────────────────────────────────────────────────
  // Includes opacity modifiers (/5, /10, /15, /20, /30, /40, /50, /70, /80)
  safelist: [
    {
      pattern:
        /(bg|border|text|stroke|fill)-(background|surface|ink|line|primary|gold|indigo|green|red)(-(tint|muted|faint|soft|ink))?(\/(5|10|15|20|25|30|40|50|60|70|75|80|90))?/,
    },
  ],

  theme: {
    extend: {
      // ─── Typography ──────────────────────────────────────────────────────
      fontFamily: {
        // Fraunces
        fraunces: ['Fraunces_400Regular'],
        'fraunces-light': ['Fraunces_300Light'],

        // Playfair Display
        playfair: ['PlayfairDisplay_400Regular'],
        'playfair-medium': ['PlayfairDisplay_500Medium'],
        'playfair-bold': ['PlayfairDisplay_700Bold'],

        // Devanagari
        'tiro-devanagari-hindi': ['TiroDevanagariHindi_400Regular'],
        'noto-sans-devanagari': ['NotoSansDevanagari_400Regular'],

        // Merriweather
        'merriweather-light': ['Merriweather_300Light'],
        'merriweather-light-italic': ['Merriweather_300Light_Italic'],
        'merriweather-regular': ['Merriweather_400Regular'],
        'merriweather-italic': ['Merriweather_400Regular_Italic'],
        'merriweather-medium': ['Merriweather_500Medium'],
        'merriweather-semibold': ['Merriweather_600SemiBold'],
        'merriweather-bold': ['Merriweather_700Bold'],

        // Inter
        'inter-extralight': ['Inter_200ExtraLight'],
        'inter-light': ['Inter_300Light'],
        'inter-regular': ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
        'inter-extrabold': ['Inter_800ExtraBold'],
        'inter-black': ['Inter_900Black'],

        // Mono
        'ibm-mono-light': ['IBMPlexMono_300Light'],

        // Reset nativewind defaults
        heading: undefined,
        body: undefined,
        mono: undefined,

        // CSS variable–driven (web)
        jakarta: ['var(--font-plus-jakarta-sans)'],
        roboto: ['var(--font-roboto)'],
        code: ['var(--font-source-code-pro)'],
        inter: ['var(--font-inter)'],
        'space-mono': ['var(--font-space-mono)'],
      },

      fontWeight: {
        extrablack: '950',
      },
      fontSize: {
        '2xs': '10px',
      },

      // ─── Colors ──────────────────────────────────────────────────────────
      // Every value uses the <alpha-value> placeholder so opacity modifiers
      // (e.g. `bg-gold/30`, `border-primary/15`) work in NativeWind.
      colors: {
        // Page background — warm ivory paper
        background: 'oklch(0.97 0.015 75 / <alpha-value>)',

        // Surfaces — cards, sheets
        surface: {
          DEFAULT: 'rgb(255 255 255 / <alpha-value>)',
          tint: 'oklch(0.95 0.022 70 / <alpha-value>)',
        },

        // Ink — body text
        ink: {
          DEFAULT: 'oklch(0.22 0.02 40 / <alpha-value>)',
          muted: 'oklch(0.48 0.025 40 / <alpha-value>)',
          faint: 'oklch(0.65 0.02 40 / <alpha-value>)',
        },

        // Lines / dividers
        line: {
          DEFAULT: 'oklch(0.88 0.02 55 / <alpha-value>)',
          soft: 'oklch(0.92 0.015 55 / <alpha-value>)',
        },

        // Primary — deep kumkum maroon
        primary: {
          DEFAULT: 'oklch(0.46 0.15 28 / <alpha-value>)', // #9a2a23
          ink: 'rgb(255 255 255 / <alpha-value>)',
          soft: 'oklch(0.93 0.04 40 / <alpha-value>)',
        },

        // Gold — brass / auspicious accent
        gold: {
          DEFAULT: 'oklch(0.70 0.11 78 / <alpha-value>)',
          soft: 'oklch(0.94 0.05 82 / <alpha-value>)',
        },

        // Semantic accents
        indigo: 'oklch(0.30 0.08 270 / <alpha-value>)', // dusk / night
        green: 'oklch(0.52 0.09 150 / <alpha-value>)', // shubh #3f774d
        red: 'oklch(0.55 0.14 28 / <alpha-value>)',  // ashubh
      },

      // ─── Radii ───────────────────────────────────────────────────────────
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // Density card radii
        'card-compact': '14px',
        'card-regular': '18px',
        'card-comfortable': '22px',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },

      // ─── Spacing — density tokens ────────────────────────────────────────
      spacing: {
        'pad-compact': '14px',
        'pad-regular': '18px',
        'pad-comfortable': '22px',
        'gap-compact': '10px',
        'gap-regular': '14px',
        'gap-comfortable': '18px',
        'card-compact': '14px',
        'card-regular': '18px',
        'card-comfortable': '22px',
      },

      // ─── Shadows ─────────────────────────────────────────────────────────
      boxShadow: {
        'hard-1': '-2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-2': '0px 3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-3': '2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-4': '0px -3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-5': '0px 2px 10px 0px rgba(38, 38, 38, 0.10)',
        'soft-1': '0px 0px 10px rgba(38, 38, 38, 0.1)',
        'soft-2': '0px 0px 20px rgba(38, 38, 38, 0.2)',
        'soft-3': '0px 0px 30px rgba(38, 38, 38, 0.1)',
        'soft-4': '0px 0px 40px rgba(38, 38, 38, 0.1)',
      },

      // ─── Background images / gradients ───────────────────────────────────
      // ⚠ Gradients only render on web with NativeWind. For iOS/Android use
      // <LinearGradient/> from `expo-linear-gradient` with the same stops.
      backgroundImage: {
        'gradient-primary':
          'linear-gradient(155deg, oklch(0.46 0.15 28) 0%, oklch(0.32 0.10 25) 100%)',
        'gradient-moon-card':
          'linear-gradient(45deg, #020303 0%, #121316 45%, #242674 75%, #F5F2FF 98%)',
      },

      // ─── Animation ───────────────────────────────────────────────────────
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
};
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Design Token Integration
      colors: {
        // Primitive Colors - Direct mapping from design tokens
        primitive: {
          blue: {
            50: 'var(--primitive-blue-50)',
            100: 'var(--primitive-blue-100)',
            200: 'var(--primitive-blue-200)',
            300: 'var(--primitive-blue-300)',
            400: 'var(--primitive-blue-400)',
            500: 'var(--primitive-blue-500)',
            600: 'var(--primitive-blue-600)',
            700: 'var(--primitive-blue-700)',
            800: 'var(--primitive-blue-800)',
            900: 'var(--primitive-blue-900)',
            950: 'var(--primitive-blue-950)',
          },
          gray: {
            50: 'var(--primitive-gray-50)',
            100: 'var(--primitive-gray-100)',
            200: 'var(--primitive-gray-200)',
            300: 'var(--primitive-gray-300)',
            400: 'var(--primitive-gray-400)',
            500: 'var(--primitive-gray-500)',
            600: 'var(--primitive-gray-600)',
            700: 'var(--primitive-gray-700)',
            800: 'var(--primitive-gray-800)',
            900: 'var(--primitive-gray-900)',
            950: 'var(--primitive-gray-950)',
          },
          green: {
            50: 'var(--primitive-green-50)',
            100: 'var(--primitive-green-100)',
            200: 'var(--primitive-green-200)',
            300: 'var(--primitive-green-300)',
            400: 'var(--primitive-green-400)',
            500: 'var(--primitive-green-500)',
            600: 'var(--primitive-green-600)',
            700: 'var(--primitive-green-700)',
            800: 'var(--primitive-green-800)',
            900: 'var(--primitive-green-900)',
            950: 'var(--primitive-green-950)',
          },
          red: {
            50: 'var(--primitive-red-50)',
            100: 'var(--primitive-red-100)',
            200: 'var(--primitive-red-200)',
            300: 'var(--primitive-red-300)',
            400: 'var(--primitive-red-400)',
            500: 'var(--primitive-red-500)',
            600: 'var(--primitive-red-600)',
            700: 'var(--primitive-red-700)',
            800: 'var(--primitive-red-800)',
            900: 'var(--primitive-red-900)',
            950: 'var(--primitive-red-950)',
          },
          orange: {
            50: 'var(--primitive-orange-50)',
            100: 'var(--primitive-orange-100)',
            200: 'var(--primitive-orange-200)',
            300: 'var(--primitive-orange-300)',
            400: 'var(--primitive-orange-400)',
            500: 'var(--primitive-orange-500)',
            600: 'var(--primitive-orange-600)',
            700: 'var(--primitive-orange-700)',
            800: 'var(--primitive-orange-800)',
            900: 'var(--primitive-orange-900)',
            950: 'var(--primitive-orange-950)',
          },
          teal: {
            50: 'var(--primitive-teal-50)',
            100: 'var(--primitive-teal-100)',
            200: 'var(--primitive-teal-200)',
            300: 'var(--primitive-teal-300)',
            400: 'var(--primitive-teal-400)',
            500: 'var(--primitive-teal-500)',
            600: 'var(--primitive-teal-600)',
            700: 'var(--primitive-teal-700)',
            800: 'var(--primitive-teal-800)',
            900: 'var(--primitive-teal-900)',
            950: 'var(--primitive-teal-950)',
          },
          purple: {
            50: 'var(--primitive-purple-50)',
            100: 'var(--primitive-purple-100)',
            200: 'var(--primitive-purple-200)',
            300: 'var(--primitive-purple-300)',
            400: 'var(--primitive-purple-400)',
            500: 'var(--primitive-purple-500)',
            600: 'var(--primitive-purple-600)',
            700: 'var(--primitive-purple-700)',
            800: 'var(--primitive-purple-800)',
            900: 'var(--primitive-purple-900)',
            950: 'var(--primitive-purple-950)',
          },
        },

        // Semantic Colors - Theme-aware tokens
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          active: 'var(--color-primary-active)',
          disabled: 'var(--color-primary-disabled)',
          foreground: 'var(--color-primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          hover: 'var(--color-secondary-hover)',
          active: 'var(--color-secondary-active)',
          disabled: 'var(--color-secondary-disabled)',
          foreground: 'var(--color-secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          active: 'var(--color-accent-active)',
          disabled: 'var(--color-accent-disabled)',
          foreground: 'var(--color-accent-foreground)',
        },

        // State Colors
        success: {
          DEFAULT: 'var(--color-success)',
          hover: 'var(--color-success-hover)',
          foreground: 'var(--color-success-foreground)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          hover: 'var(--color-warning-hover)',
          foreground: 'var(--color-warning-foreground)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          hover: 'var(--color-error-hover)',
          foreground: 'var(--color-error-foreground)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          hover: 'var(--color-info-hover)',
          foreground: 'var(--color-info-foreground)',
        },

        // Surface Colors
        background: 'var(--color-background)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          secondary: 'var(--color-surface-secondary)',
          tertiary: 'var(--color-surface-tertiary)',
          hover: 'var(--color-surface-hover)',
          active: 'var(--color-surface-active)',
        },

        // Text Colors
        text: {
          DEFAULT: 'var(--color-text)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          disabled: 'var(--color-text-disabled)',
          'on-primary': 'var(--color-text-on-primary)',
          'on-secondary': 'var(--color-text-on-secondary)',
          'on-surface': 'var(--color-text-on-surface)',
        },

        // Border Colors
        border: {
          DEFAULT: 'var(--color-border)',
          secondary: 'var(--color-border-secondary)',
          tertiary: 'var(--color-border-tertiary)',
          focus: 'var(--color-border-focus)',
          error: 'var(--color-border-error)',
          success: 'var(--color-border-success)',
        },

        // Focus Ring
        'focus-ring': {
          DEFAULT: 'var(--color-focus-ring)',
          offset: 'var(--color-focus-ring-offset)',
        },
      },

      // Spacing - Design token integration
      spacing: {
        'px': 'var(--spacing-px)',
        '0.5': 'var(--spacing-0-5)',
        '1.5': 'var(--spacing-1-5)',
        '2.5': 'var(--spacing-2-5)',
        '3.5': 'var(--spacing-3-5)',
      },

      // Typography - Font families from design tokens
      fontFamily: {
        sans: ['var(--font-family-sans)'],
        serif: ['var(--font-family-serif)'],
        mono: ['var(--font-family-mono)'],
      },

      // Font sizes from design tokens
      fontSize: {
        'xs': ['var(--font-size-xs)', { lineHeight: 'var(--line-height-normal)' }],
        'sm': ['var(--font-size-sm)', { lineHeight: 'var(--line-height-normal)' }],
        'base': ['var(--font-size-base)', { lineHeight: 'var(--line-height-normal)' }],
        'lg': ['var(--font-size-lg)', { lineHeight: 'var(--line-height-normal)' }],
        'xl': ['var(--font-size-xl)', { lineHeight: 'var(--line-height-normal)' }],
        '2xl': ['var(--font-size-2xl)', { lineHeight: 'var(--line-height-tight)' }],
        '3xl': ['var(--font-size-3xl)', { lineHeight: 'var(--line-height-tight)' }],
        '4xl': ['var(--font-size-4xl)', { lineHeight: 'var(--line-height-tight)' }],
        '5xl': ['var(--font-size-5xl)', { lineHeight: 'var(--line-height-tight)' }],
        '6xl': ['var(--font-size-6xl)', { lineHeight: 'var(--line-height-tight)' }],
        '7xl': ['var(--font-size-7xl)', { lineHeight: 'var(--line-height-tight)' }],
        '8xl': ['var(--font-size-8xl)', { lineHeight: 'var(--line-height-none)' }],
        '9xl': ['var(--font-size-9xl)', { lineHeight: 'var(--line-height-none)' }],
      },

      // Font weights from design tokens
      fontWeight: {
        thin: 'var(--font-weight-thin)',
        extralight: 'var(--font-weight-extralight)',
        light: 'var(--font-weight-light)',
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
        extrabold: 'var(--font-weight-extrabold)',
        black: 'var(--font-weight-black)',
      },

      // Line heights from design tokens
      lineHeight: {
        none: 'var(--line-height-none)',
        tight: 'var(--line-height-tight)',
        snug: 'var(--line-height-snug)',
        normal: 'var(--line-height-normal)',
        relaxed: 'var(--line-height-relaxed)',
        loose: 'var(--line-height-loose)',
      },

      // Letter spacing from design tokens
      letterSpacing: {
        tighter: 'var(--letter-spacing-tighter)',
        tight: 'var(--letter-spacing-tight)',
        normal: 'var(--letter-spacing-normal)',
        wide: 'var(--letter-spacing-wide)',
        wider: 'var(--letter-spacing-wider)',
        widest: 'var(--letter-spacing-widest)',
      },

      // Border radius from design tokens
      borderRadius: {
        none: 'var(--border-radius-none)',
        sm: 'var(--border-radius-sm)',
        DEFAULT: 'var(--border-radius)',
        md: 'var(--border-radius-md)',
        lg: 'var(--border-radius-lg)',
        xl: 'var(--border-radius-xl)',
        '2xl': 'var(--border-radius-2xl)',
        '3xl': 'var(--border-radius-3xl)',
        full: 'var(--border-radius-full)',
      },

      // Border widths from design tokens
      borderWidth: {
        DEFAULT: 'var(--border-width-default)',
        2: 'var(--border-width-2)',
        4: 'var(--border-width-4)',
        8: 'var(--border-width-8)',
      },

      // Box shadows from design tokens
      boxShadow: {
        none: 'var(--shadow-none)',
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        inner: 'var(--shadow-inner)',
      },

      // Breakpoints from design tokens
      screens: {
        sm: 'var(--breakpoint-sm)',
        md: 'var(--breakpoint-md)',
        lg: 'var(--breakpoint-lg)',
        xl: 'var(--breakpoint-xl)',
        '2xl': 'var(--breakpoint-2xl)',
      },

      // Component-specific utilities
      height: {
        'button-sm': 'var(--button-height-sm)',
        'button-md': 'var(--button-height-md)',
        'button-lg': 'var(--button-height-lg)',
        'input-sm': 'var(--input-height-sm)',
        'input-md': 'var(--input-height-md)',
        'input-lg': 'var(--input-height-lg)',
      },

      // Transitions and animations from design tokens
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
        slower: 'var(--duration-slower)',
      },

      transitionTimingFunction: {
        linear: 'var(--easing-linear)',
        ease: 'var(--easing-ease)',
        'ease-in': 'var(--easing-ease-in)',
        'ease-out': 'var(--easing-ease-out)',
        'ease-in-out': 'var(--easing-ease-in-out)',
        bounce: 'var(--easing-bounce)',
        smooth: 'var(--easing-smooth)',
      },

      // Z-index scale from design tokens
      zIndex: {
        dropdown: 'var(--z-index-dropdown)',
        sticky: 'var(--z-index-sticky)',
        fixed: 'var(--z-index-fixed)',
        'modal-backdrop': 'var(--z-index-modal-backdrop)',
        modal: 'var(--z-index-modal)',
        popover: 'var(--z-index-popover)',
        tooltip: 'var(--z-index-tooltip)',
        notification: 'var(--z-index-notification)',
      },
    },
  },
  plugins: [
    // Custom plugin to add design system utilities
    function({ addUtilities }: any) {
      addUtilities({
        // Theme switching utilities
        '.theme-light': {
          '[data-theme]': 'light'
        },
        '.theme-dark': {
          '[data-theme]': 'dark'
        },
        '.theme-high-contrast': {
          '[data-theme]': 'high-contrast'
        },

        // Component utility classes
        '.btn-height-sm': {
          height: 'var(--button-height-sm)'
        },
        '.btn-height-md': {
          height: 'var(--button-height-md)'
        },
        '.btn-height-lg': {
          height: 'var(--button-height-lg)'
        },

        '.input-height-sm': {
          height: 'var(--input-height-sm)'
        },
        '.input-height-md': {
          height: 'var(--input-height-md)'
        },
        '.input-height-lg': {
          height: 'var(--input-height-lg)'
        },

        // Card utilities
        '.card-padding-sm': {
          padding: 'var(--card-padding-sm)'
        },
        '.card-padding-md': {
          padding: 'var(--card-padding-md)'
        },
        '.card-padding-lg': {
          padding: 'var(--card-padding-lg)'
        },

        // Focus ring utilities
        '.focus-ring': {
          '&:focus': {
            outline: '2px solid var(--color-focus-ring)',
            outlineOffset: '2px'
          },
          '&:focus-visible': {
            outline: '2px solid var(--color-focus-ring)',
            outlineOffset: '2px'
          }
        },

        // Text utilities
        '.text-balance': {
          textWrap: 'balance'
        },
        '.text-pretty': {
          textWrap: 'pretty'
        }
      })
    }
  ],
}

export default config
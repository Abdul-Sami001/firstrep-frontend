/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Mobile-First Breakpoints
    screens: {
      'xs': '0px',      // Mobile phones
      'sm': '640px',    // Large phones
      'md': '768px',    // Tablets
      'lg': '1024px',   // Small laptops
      'xl': '1280px',   // Desktops
      '2xl': '1536px',  // Large desktops
    },
    extend: {
      // Mobile-First Spacing System
      spacing: {
        'xs': '0.25rem',   // 4px - Tight spacing
        'sm': '0.5rem',    // 8px - Small spacing
        'md': '0.75rem',   // 12px - Medium spacing
        'lg': '1rem',      // 16px - Large spacing
        'xl': '1.5rem',    // 24px - Extra large
        '2xl': '2rem',     // 32px - Section spacing
        '3xl': '3rem',     // 48px - Hero spacing
        '4xl': '4rem',     // 64px - Page spacing
        // Touch-friendly spacing
        'touch': '2.75rem', // 44px - Minimum touch target
        'touch-sm': '2.25rem', // 36px - Small touch target
      },
      // Mobile-First Typography
      fontSize: {
        // Mobile Base
        'xs': ['0.75rem', { lineHeight: '1rem' }],     // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],    // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
        '5xl': ['3rem', { lineHeight: '1' }],          // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }],       // 60px
        // Mobile-First Responsive Typography
        'mobile-h1': ['1.5rem', { lineHeight: '2rem' }],    // 24px - Mobile h1
        'mobile-h2': ['1.25rem', { lineHeight: '1.75rem' }], // 20px - Mobile h2
        'mobile-h3': ['1.125rem', { lineHeight: '1.5rem' }], // 18px - Mobile h3
        'tablet-h1': ['2rem', { lineHeight: '2.5rem' }],     // 32px - Tablet h1
        'tablet-h2': ['1.5rem', { lineHeight: '2rem' }],     // 24px - Tablet h2
        'desktop-h1': ['3rem', { lineHeight: '1' }],        // 48px - Desktop h1
        'desktop-h2': ['2.25rem', { lineHeight: '2.5rem' }], // 36px - Desktop h2
      },
      // Mobile-First Container
      maxWidth: {
        'mobile': '100%',
        'tablet': '768px',
        'desktop': '1200px',
        'wide': '1400px',
      },
      // Mobile-First Heights
      height: {
        'mobile-header': '3.5rem',    // 56px - Mobile header
        'tablet-header': '4rem',     // 64px - Tablet header
        'desktop-header': '4.5rem',  // 72px - Desktop header
        'touch': '2.75rem',         // 44px - Touch target
        'touch-sm': '2.25rem',      // 36px - Small touch target
      },
      minHeight: {
        'touch': '2.75rem',         // 44px - Minimum touch target
        'touch-sm': '2.25rem',      // 36px - Small touch target
        'screen-mobile': '100vh',
      },
      // Mobile-First Border Radius
      borderRadius: {
        'none': '0px',
        'sm': '0.125rem',   // 2px
        'DEFAULT': '0.25rem', // 4px
        'md': '0.375rem',   // 6px
        'lg': '0.5rem',     // 8px
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
        'full': '9999px',
        // Legacy support
        'lg-legacy': '.5625rem', // 9px
        'md-legacy': '.375rem',  // 6px
        'sm-legacy': '.1875rem', // 3px
      },
      // Mobile-First Colors (Enhanced)
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          border: "hsl(var(--card-border))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
          border: "hsl(var(--popover-border))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          border: "var(--primary-border)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          border: "var(--secondary-border)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
          border: "var(--muted-border)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          border: "var(--accent-border)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          border: "var(--destructive-border)",
        },
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          ring: "hsl(var(--sidebar-ring))",
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          border: "hsl(var(--sidebar-border))",
        },
        "sidebar-primary": {
          DEFAULT: "hsl(var(--sidebar-primary))",
          foreground: "hsl(var(--sidebar-primary-foreground))",
          border: "var(--sidebar-primary-border)",
        },
        "sidebar-accent": {
          DEFAULT: "hsl(var(--sidebar-accent))",
          foreground: "hsl(var(--sidebar-accent-foreground))",
          border: "var(--sidebar-accent-border)",
        },
        status: {
          online: "rgb(34 197 94)",
          away: "rgb(245 158 11)",
          busy: "rgb(239 68 68)",
          offline: "rgb(156 163 175)",
        },
        // Mobile-First Theme Colors
        'mobile-primary': '#1a1a1a',
        'mobile-bg': '#ffffff',
        'mobile-text': '#000000',
        'mobile-accent': '#dc2626',
      },
      // Mobile-First Font Family
      fontFamily: {
        sans: ["Inter", "var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      // Mobile-First Grid System
      gridTemplateColumns: {
        'mobile': 'repeat(1, minmax(0, 1fr))',
        'tablet': 'repeat(2, minmax(0, 1fr))',
        'desktop': 'repeat(3, minmax(0, 1fr))',
        'wide': 'repeat(4, minmax(0, 1fr))',
      },
      // Mobile-First Gap System
      gap: {
        'mobile': '1rem',    // 16px
        'tablet': '1.5rem',  // 24px
        'desktop': '2rem',   // 32px
      },
      // Mobile-First Padding System
      padding: {
        'mobile': '1rem',    // 16px
        'tablet': '1.5rem',  // 24px
        'desktop': '2rem',   // 32px
      },
      // Mobile-First Margin System
      margin: {
        'mobile': '1rem',    // 16px
        'tablet': '1.5rem',  // 24px
        'desktop': '2rem',   // 32px
      },
      // Mobile-First Keyframes
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Mobile-First Animations
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      // Mobile-First Animations
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
      // Mobile-First Transitions
      transitionDuration: {
        'mobile': '150ms',
        'tablet': '200ms',
        'desktop': '250ms',
      },
      // Mobile-First Z-Index
      zIndex: {
        'mobile-menu': '50',
        'dropdown': '40',
        'modal': '60',
        'toast': '70',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    // Mobile-First Plugin
    function ({ addUtilities }) {
      const newUtilities = {
        '.touch-target': {
          'min-width': '44px',
          'min-height': '44px',
        },
        '.touch-target-sm': {
          'min-width': '36px',
          'min-height': '36px',
        },
        '.mobile-container': {
          'width': '100%',
          'padding-left': '1rem',
          'padding-right': '1rem',
          'margin-left': 'auto',
          'margin-right': 'auto',
        },
        '.tablet-container': {
          '@media (min-width: 768px)': {
            'padding-left': '1.5rem',
            'padding-right': '1.5rem',
          },
        },
        '.desktop-container': {
          '@media (min-width: 1024px)': {
            'max-width': '1200px',
            'padding-left': '2rem',
            'padding-right': '2rem',
          },
        },
      }
      addUtilities(newUtilities)
    }
  ],
};
import type { Config } from 'tailwindcss'
const { fontFamily } = require('tailwindcss/defaultTheme')

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
        'max-md': { max: '768px' }
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        'main-color': 'var(--main-color, #FF2E4D)',
        'search-page-bg': '#F8F8F8',
        'search-header': 'rgba(0, 0, 0, 0.45)',
        'default-search-content-color': 'rgba(0, 0, 0, 0.85)',
        'default-search-content-dark-color': 'rgba(255, 255, 288, 0.85)',
        'out-line': '#f0f0f0',
        'header-search': '#d5d5d5',
        'btn-dark-color': 'rgba(255, 255, 255, 0.25)',
        'chat-dark-bg': '#1F1F1F',
        'chat-dark-option': 'rgba(255, 255, 255, 0.75)',
        'follow-up-btn': 'rgba(0, 0, 0, 0.25)',
        'follow-up-btn-border': 'rgba(255, 255, 255, 0.1)',
        'cancel-btn': 'rgba(255, 255, 255, 0.45)',
        'history-active': '#F4F4F4',
        'avatar-dropdown': '#f5f5f5',
        'avatar-dropdown-bg': '#FFE1E5',
        'avatar-dropdown-dark-bg': '#2b2b2b',
        'markmap-txt': 'rgba(0, 0, 0, 0.65)',
        'markmap-btn-bg': '#0B0D10',
        'header-bottom-border': 'rgba(235,235,235, 1)',
        'mobile-dark-header-dropdown': '#202020',
        'background-dark': '#0A0A0A',
        'mobile-chat-title-border': 'rgba(0, 0, 0, 0.10)',
        'mobile-chat-title-border-dark': 'rgba(255, 255, 255, 0.25)',
        'mobile-chat-text-dark': 'rgba(255, 255, 255, 0.85)',
        'mobile-markmap-drawer': '#333333',
        'slogan-text': 'rgba(0, 0, 0, 0.75)',
        'icon-opacity': 'rgba(255, 255, 255, 0.65)',
        'search-icon-bg': 'rgba(255,46,77,0.05)',
        'separate-line': '#d9d9d9',
        'information-source-box': 'rgba(231,231,231,1)',
        'search-border-color': '#474747',
        'default-search-text': 'rgba(214,214,214,0.2)',
        'history-box': 'rgba(247,247,247,0.9)',
        'history-item': '#E8E8E8',
        'history-box-dark': 'rgba(17,17,17,0.9)',
        'history-item-dark': 'rgba(64,64,64,1)',
        'share-btn': '#eee',
        'markmap-box': 'rgba(0, 0, 0, 0.1)',
        'markmap-dark-box': '#313131',
        'markmap-dark-border-box': 'rgba(255,255,255,.1)',
        'information-source': 'rgba(20, 20, 20, 0.65)',
        'information-hover-source': 'rgba(214,214,214,0.2)',
        'information-source-dark-box': '#212121',
        'active-language': 'rgba(0, 0, 0, 0.05)',
        'active-dark-language': 'rgba(255, 255, 255, 0.05)',
        'search-icon': '#2F3333',
        'search-box': '#EFEFEF',
        'default-search-box': '#242727',
        'footer-color': 'rgba(28,28,28,0.45)',
        'devider-line': '#DBDBDB',
        'header-bottom': '#ececec',
        'chat-box': '#1C1D1D',
        'markmap-action': '#4D4D4D',
        'follow-up-btn-box': '#202222',
        'home-box': '#1C1C1C',
        'close-login': '#999',
        'login-modal': '#272727',
        'mobile-header-back': 'rgba(235,235,235,1.00)',
        'mobile-login': 'rgba(10,10,10,1)',
        'popover-background': '#191A1A',
        'mobile-share-modal': '#141414',
        'search-bar-btn': '#FD384F',
        'mobile-share-content': '#323337',
        'share-way-btn': '#A0A0A0',
        'mobile-share-img-box': '#C6C6C6',
        'collect-star': 'rgba(255,203,0,1)',
        'collect-text': '#979797',
        'collect-close': '#D4D4D4',
        'mobile-collect-container': '#0D0D0D',
        'share-card-footer': '#4F4D4E',
        'share-card-avatar': '#FFE1E5',
        'share-markdown-box': 'rgba(216, 216, 216, 0.2)',
        'answer-product-card': 'rgba(151, 151, 151, 0.12)',
        'product-bg-tag': '#eee',
        'product-text-tag': 'rgba(238,238,238,1)',
        'lowest-price-text': '#818181',
        'price-text': '#FD384F',
        'travel-box': 'rgba(216,216,216,0.45)',
        'travel-card': '#242727',
        'trends-text': 'rgba(255,255,255,0.88)',
        'explor-more': 'rgba(253,56,79,0.69)',
        'trends-like': '#9F9F9F',
        'product-reasons-tag': 'rgba(255, 243, 245, 0.76)',
        'product-icon': 'rgba(0, 0, 0, 0.5) !important'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans]
      },
      borderColor: {
        'btn-border': '#D9D9D9'
      },
      spacing: {
        'screen-88': 'calc(100vh - 72px)',
        'screen-48': 'calc(100vh - 48px)',
        'mind-map-left': 'calc((100vw - 81px) / 2)',
        'screen-150': 'calc(100vh - 150px)',
        'source-item': 'calc((100% - 78px)/3)',
        'mobile-source-item': 'calc((100% - 66px)/2)'
      },
      backgroundImage: {
        'mobile-follow-up-input-gradient':
          'linear-gradient(180deg, rgba(31,31,31,0.00) 0%, #1C1D1D 35%, #1C1D1D 100%)',
        'follow-up-input-gradient':
          'linear-gradient(180deg, rgba(28,28,28,0.25) 0%, #1C1D1D 30%, #1C1D1D 100%);',
        'light-follow-up-input-gradient':
          'linear-gradient(180deg, rgba(255,255,255,0.00) 0%, #FFFFFF 30%, #FFFFFF 100%)',
        'list-scroll-gradient':
          'linear-gradient(180deg, #FFFFFF 5.88%, rgba(255,255,255,0) 100%)',
        'product-detail-slider':
          'linear-gradient(0deg, #FE2E2E 0%, #FFA5F7 100%)',
        'product-detail-slider-bg':
          'linear-gradient(0deg, #9E9E9E 0%, #FFFFFF 100%)',
        'product-detail-btn-buy':
          'linear-gradient(180deg, #FF6987 0%, #FD384F 100%)'
      },
      width: {
        'follow-input': 'calc(100% - 32px)',
        'mindmap-mask': 'calc(100% - 64px)',
        'chat-list-wrap': 'calc(100% - 48px)',
        '100vh': '100vh',
        'product-detail-markmap': 'calc(100% - 840px)',
        'default-tends': 'calc(100% - 40px)'
      },
      height: {
        'home-history': 'calc(100vh - 124px)',
        '100vw': '100vw',
        'mobile-share-image-content': 'calc(100% - 208px)'
      },
      boxShadow: {
        'btn-shadow':
          '0 6px 16px -8px rgba(0,0,0,0.08), 0 9px 28px 0 rgba(0,0,0,0.05)',
        'comment-head':
          '1px 1px 8px 8px rgba(214,214,214,0.15), 1px 1px 8px 8px rgba(214,214,214,0.15)',
        'information-source': '2px 4px 19px 0 rgba(0,0,0,0.14)',
        'share-box':
          '0 6px 16px -8px rgba(0,0,0,0.08), 0 9px 28px 0 rgba(0,0,0,0.05);',
        'terminate-answer-box':
          '0 3px 6px -4px rgba(0,0,0,0.12), 0 6px 16px 0 rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05)',
        'search-box-shadow': '2px 2px 12px 0 rgba(228,228,228,0.35)',
        'search-box-dark-shadow': '2px 2px 12px 0 rgba(27,24,24,0.35)',
        'share-card':
          '0 -1px 0 0 #EBEBEB, 0 -2px 20px 0 rgba(154,154,154,0.25)',
        'pover-box-shadow': '2px 4px 16px 0 rgba(136,136,136,0.14)',
        'history-box-shadow':
          '0 6px 16px 0 rgba(0, 0, 0, 0.08),  0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        'search-btn': '0 4px 10px 0 rgba(135,167,171,0.50)',
        'collect-box': '0 2px 10px 10px rgba(244,244,244,0.50)',
        'collect-box-dark': '0 2px 10px 10px rgba(35,35,35,0.50)',
        'mobile-collect-box': '0 2px 10px 10px rgba(77,77,77,0.50)',
        'product-card': '2px 2px 6px 6px rgba(240, 240, 240, 0.5)',
        'home-mode-btn': '2px 2px 5px 0px rgba(217, 217, 217, 0.50)'
      },
      flexBasis: {
        'search-second-spacing': 'calc(28.6% - 20px)',
        'search-first-spacing': 'calc(33.3% - 20px)'
      }
    }
  },
  variants: {
    extend: {
      opacity: ['disabled']
    }
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')]
} satisfies Config

export default config

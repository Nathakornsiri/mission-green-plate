/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Game zone only (dark forest green — replaces space black)
        game: {
          dark: '#0D2B1A',
          card: '#122D1C',
          border: '#1E4A2E',
          green: '#22c55e',
          gold: '#f59e0b',
          purple: '#a855f7',
          red: '#ef4444',
          blue: '#3b82f6',
        },
        // New CI brand colors
        gp: {
          sky: '#EEF8FF',        // 60% base background
          ivory: '#FFF9F0',      // 60% base alt background
          card: '#FFFFFF',
          border: '#B2DFDB',
          'green': '#4CAF50',    // 30% vibrant apple green
          'green-dark': '#2E7D32',
          'green-mid': '#388E3C',
          'green-light': '#C8E6C9',
          'green-soft': '#E8F5E9',
          orange: '#FF6B35',     // 10% carrot orange
          yellow: '#FFD600',     // 10% lemon yellow
          text: '#1B4332',       // primary text
          muted: '#52796F',      // muted text
          soft: '#6B9080',       // very muted
        },
      },
      animation: {
        // Existing
        'float': 'float 3s ease-in-out infinite',
        'shake': 'shake 0.4s ease-in-out',
        'glow-green': 'glowGreen 2s ease-in-out infinite',
        'glow-red': 'glowRed 1s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'damage-float': 'damageFloat 1s ease-out forwards',
        'poison-drip': 'poisonDrip 0.5s ease-in-out infinite alternate',
        'kill-flash': 'killFlash 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        // New CI animations
        'bounce-happy': 'bounceHappy 0.6s ease-out',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'tree-grow': 'treeGrow 0.8s cubic-bezier(0.34,1.56,0.64,1)',
        'zero-pop': 'zeroPop 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px) rotate(-2deg)' },
          '40%': { transform: 'translateX(8px) rotate(2deg)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
        glowGreen: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(76,175,80,0.4)' },
          '50%': { boxShadow: '0 0 24px rgba(76,175,80,0.9), 0 0 48px rgba(76,175,80,0.3)' },
        },
        glowRed: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(239,68,68,0.4)' },
          '50%': { boxShadow: '0 0 24px rgba(239,68,68,0.9)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        damageFloat: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-60px) scale(1.4)', opacity: '0' },
        },
        poisonDrip: {
          '0%': { filter: 'hue-rotate(0deg) saturate(1.5)' },
          '100%': { filter: 'hue-rotate(30deg) saturate(2)' },
        },
        killFlash: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '30%': { opacity: '0', transform: 'scale(1.5)' },
          '60%': { opacity: '0.5', transform: 'scale(0.5)' },
          '100%': { opacity: '0', transform: 'scale(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceHappy: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.2) rotate(5deg)' },
          '60%': { transform: 'scale(0.95) rotate(-3deg)' },
          '80%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-8deg)' },
          '75%': { transform: 'rotate(8deg)' },
        },
        treeGrow: {
          '0%': { transform: 'scaleY(0) translateY(20px)', opacity: '0', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(1) translateY(0)', opacity: '1', transformOrigin: 'bottom' },
        },
        zeroPop: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '70%': { transform: 'scale(1.2) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(76,175,80,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(76,175,80,0)' },
        },
      },
      fontFamily: {
        game: ['"Noto Sans Thai"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

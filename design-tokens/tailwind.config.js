/** @type {import('tailwindcss').Config} */
// LittMer design tokens → Tailwind v3 preset
// Use as: { presets: [require('./design-tokens/tailwind.config.js')] }

module.exports = {
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#f6ecd6',
          deep:    '#efe1c2',
          warm:    '#f3e3c1',
          card:    '#fff8e8',
          soft:    '#fce8d6',
        },
        ink: {
          DEFAULT: '#2a2418',
          soft:    '#5a4f3a',
          muted:   '#a89668',
        },
        accent: {
          DEFAULT: '#c5462e',
          hover:   '#a83923',
          blue:    '#1f4d8f',
          mustard: '#e0a84a',
          moss:    '#5a8a5a',
          purple:  '#7a4ab8',
          flag:    '#ba0c2f',
        },
        cat: {
          economy:    '#fce8d6',
          society:    '#a8c4d8',
          science:    '#9ec8b8',
          work:       '#e8d4a8',
          education:  '#d4c4e0',
          culture:    '#f0c8d0',
          health:     '#fcd9c8',
          transport:  '#c8d8b8',
          nature:     '#b4d4b4',
          home:       '#f4d8a4',
          food:       '#fce0c0',
          family:     '#f0d4dc',
          bureau:     '#d4d8e8',
          sport:      '#bcd4d8',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body:    ['Nunito', 'system-ui', 'sans-serif'],
        hand:    ['Caveat', 'cursive'],
      },
      fontSize: {
        // [size, lineHeight]
        'display-xl': ['84px', { lineHeight: '0.96', letterSpacing: '-0.025em' }],
        'display-lg': ['54px', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-md': ['38px', { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'display-sm': ['28px', { lineHeight: '1.1' }],
        'display-xs': ['24px', { lineHeight: '1.1' }],
        'body-xl':    ['19px', { lineHeight: '1.6'  }],
        'body-lg':    ['17px', { lineHeight: '1.55' }],
        'body-md':    ['15px', { lineHeight: '1.5'  }],
        'body-sm':    ['13.5px',{ lineHeight: '1.45' }],
        'body-xs':    ['12px', { lineHeight: '1.4'  }],
        'hand-lg':    ['32px', { lineHeight: '1' }],
        'hand-md':    ['22px', { lineHeight: '1' }],
        'hand-sm':    ['20px', { lineHeight: '1' }],
      },
      fontWeight: {
        regular:  '400',
        medium:   '500',
        semibold: '600',
        bold:     '700',
        black:    '800',
      },
      letterSpacing: {
        tightish: '-0.025em',
        snug:     '-0.02em',
        wider:    '0.06em',
        caps:     '0.14em',
      },
      spacing: {
        // 4px base — Tailwind's defaults already cover most;
        // add semantic ones used in the design.
        'gutter':    '36px',
        'section':   '80px',
      },
      maxWidth: {
        container: '1240px',
      },
      borderRadius: {
        sm:   '8px',
        md:   '14px',
        lg:   '18px',
        xl:   '22px',
        pill: '9999px',
      },
      borderWidth: {
        DEFAULT: '2px',
        thin:    '1.5px',
        thick:   '2.5px',
      },
      boxShadow: {
        // Hard offset — never soft
        'card-sm': '2px 2px 0 #2a2418',
        'card':    '3px 3px 0 #2a2418',
        'card-lg': '4px 4px 0 #2a2418',
        'card-xl': '6px 6px 0 #2a2418',
      },
      transitionTimingFunction: {
        DEFAULT: 'ease',
      },
      transitionDuration: {
        fast: '150ms',
      },
      translate: {
        'lift':    '-1px',
        'lift-lg': '-2px',
      },
    },
  },
  plugins: [],
};

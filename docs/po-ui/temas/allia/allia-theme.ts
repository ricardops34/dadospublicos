import {
  PoTheme,
  PoThemeA11yEnum,
  PoThemeTypeEnum
} from '@po-ui/ng-components';

const alliaLightAAA = {
  color: {
    action: {
      default: '#9E1F63',
      hover: '#C31055',
      pressed: '#662D91',
      focus: '#00AEA5',
      disabled: '#C4C4C4'
    },
    brand: {
      '01': {
        lighter: '#F5E6F0',
        light: '#DC4872',
        base: '#9E1F63',
        dark: '#7C174E',
        darkest: '#5B2675'
      },
      '02': {
        lighter: '#F4F1F7',
        light: '#8E68B5',
        base: '#662D91',
        dark: '#5B2675',
        darkest: '#4A1E63'
      },
      '03': {
        lighter: '#E8F8F7',
        light: '#59C9C2',
        base: '#00AEA5',
        dark: '#005357',
        darkest: '#004461'
      }
    },
    neutral: {
      light: {
        '00': '#FFFFFF',
        '05': '#F5F4FA',
        '10': '#F4F1F7',
        '20': '#ECECEC',
        '30': '#D9D9D9'
      },
      mid: {
        '40': '#A09FA8',
        '60': '#6C6B75'
      },
      dark: {
        '70': '#625D53',
        '80': '#5B5B71',
        '90': '#323232',
        '95': '#000000'
      }
    }
  },
  onRoot: {
    '--font-family': "'Onest', 'Segoe UI', sans-serif",
    '--font-family-theme': "'Onest', 'Segoe UI', sans-serif",
    '--border-radius': '18px',
    '--border-radius-md': '18px',
    '--border-radius-lg': '26px',
    '--border-radius-xl': '32px',
    '--border-radius-pill': '999px',
    '--color-page-background': '#F5F4FA',
    '--color-card-background': '#FFFFFF',
    '--color-overlay-backdrop': 'rgba(50, 50, 50, 0.55)',
    '--shadow-color': 'rgba(102, 45, 145, 0.16)',
    '--shadow-color-hover': 'rgba(158, 31, 99, 0.20)',
    '--outline-color-focused': '#00AEA5',
    '--po-density-header-padding': '2rem',
    '--po-density-content-padding': '1.5rem',
    '--po-density-footer-padding': '1.25rem',
    '--po-density-gap-header-content': '1.25rem',
    '--po-density-gap-spacing': '1rem',
    '--po-density-floating-padding': '0.75rem'
  },
  perComponent: {
    'po-button': {
      '--font-weight': '700',
      '--border-radius': '999px',
      '--padding': '0 1.5rem',
      '--color-button-primary': '#9E1F63',
      '--color-primary-hover': '#C31055',
      '--color-primary-pressed': '#662D91',
      '--text-color-primary': '#FFFFFF',
      '--color-button-secondary': '#FFFFFF',
      '--color-secondary-hover': '#F5E6F0',
      '--color-secondary-pressed': '#F4F1F7',
      '--border-color-secondary': '#9E1F63',
      '--text-color-secondary': '#9E1F63'
    },
    'po-widget': {
      '--border-radius': '28px',
      '--box-shadow': '0 18px 40px rgba(102, 45, 145, 0.12)'
    },
    'po-container': {
      '--border-radius': '28px',
      '--box-shadow': '0 18px 40px rgba(102, 45, 145, 0.10)'
    },
    'po-page-default': {
      '--background-color': '#F5F4FA'
    },
    'po-toolbar': {
      '--background-color-toolbar': '#FFFFFF',
      '--border-color-toolbar': '#ECECEC',
      '--title-color': '#323232'
    },
    'po-menu': {
      '--background-color-menu-panel': '#662D91',
      '--color-menu-panel': '#FFFFFF',
      '--background-color-item-selected': '#F5E6F0',
      '--color-item-selected': '#9E1F63'
    },
    'po-tag': {
      '--border-radius': '999px'
    },
    'po-modal': {
      '--border-radius': '28px'
    },
    'po-table': {
      '--border-radius': '24px',
      '--header-background': '#F4F1F7'
    }
  }
};

const alliaLightAA = {
  ...alliaLightAAA,
  onRoot: {
    ...alliaLightAAA.onRoot,
    '--border-radius': '16px',
    '--po-density-header-padding': '1.5rem',
    '--po-density-content-padding': '1.25rem'
  }
};

const alliaDarkAAA = {
  color: {
    action: {
      default: '#FBBA33',
      hover: '#FFBF41',
      pressed: '#F6A000',
      focus: '#00AEA5',
      disabled: '#6C6B75'
    },
    brand: {
      '01': {
        lighter: '#5B2675',
        light: '#DC4872',
        base: '#FBBA33',
        dark: '#F6A000',
        darkest: '#C98500'
      },
      '02': {
        lighter: '#3B284D',
        light: '#8E68B5',
        base: '#662D91',
        dark: '#5B2675',
        darkest: '#C7A9E7'
      },
      '03': {
        lighter: '#09393B',
        light: '#00AEA5',
        base: '#59C9C2',
        dark: '#005357',
        darkest: '#B2F2EF'
      }
    },
    neutral: {
      light: {
        '00': '#1E1B24',
        '05': '#25212D',
        '10': '#2B2734',
        '20': '#3A3544',
        '30': '#4A4554'
      },
      mid: {
        '40': '#908A9D',
        '60': '#C7C2D1'
      },
      dark: {
        '70': '#D9D5E2',
        '80': '#ECE9F2',
        '90': '#F8F7FB',
        '95': '#FFFFFF'
      }
    }
  },
  onRoot: {
    '--font-family': "'Onest', 'Segoe UI', sans-serif",
    '--font-family-theme': "'Onest', 'Segoe UI', sans-serif",
    '--border-radius': '18px',
    '--border-radius-md': '18px',
    '--border-radius-lg': '26px',
    '--border-radius-pill': '999px',
    '--color-page-background': '#1E1B24',
    '--color-card-background': '#25212D',
    '--color-overlay-backdrop': 'rgba(0, 0, 0, 0.7)',
    '--shadow-color': 'rgba(0, 0, 0, 0.35)',
    '--shadow-color-hover': 'rgba(0, 0, 0, 0.45)',
    '--outline-color-focused': '#59C9C2',
    '--po-density-header-padding': '2rem',
    '--po-density-content-padding': '1.5rem',
    '--po-density-footer-padding': '1.25rem',
    '--po-density-gap-header-content': '1.25rem',
    '--po-density-gap-spacing': '1rem',
    '--po-density-floating-padding': '0.75rem'
  },
  perComponent: {
    'po-button': {
      '--font-weight': '700',
      '--border-radius': '999px',
      '--padding': '0 1.5rem',
      '--color-button-primary': '#FBBA33',
      '--color-primary-hover': '#FFBF41',
      '--color-primary-pressed': '#F6A000',
      '--text-color-primary': '#1E1B24',
      '--border-color-secondary': '#FBBA33',
      '--text-color-secondary': '#FBBA33',
      '--color-secondary-hover': '#3B284D',
      '--color-secondary-pressed': '#5B2675'
    },
    'po-widget': {
      '--border-radius': '28px',
      '--box-shadow': '0 18px 40px rgba(0, 0, 0, 0.28)'
    },
    'po-container': {
      '--border-radius': '28px',
      '--box-shadow': '0 18px 40px rgba(0, 0, 0, 0.22)'
    },
    'po-toolbar': {
      '--background-color-toolbar': '#25212D',
      '--border-color-toolbar': '#3A3544',
      '--title-color': '#F8F7FB'
    },
    'po-menu': {
      '--background-color-menu-panel': '#25212D',
      '--color-menu-panel': '#F8F7FB',
      '--background-color-item-selected': '#3B284D',
      '--color-item-selected': '#FBBA33'
    },
    'po-tag': {
      '--border-radius': '999px'
    },
    'po-modal': {
      '--border-radius': '28px'
    },
    'po-table': {
      '--border-radius': '24px',
      '--header-background': '#2B2734'
    }
  }
};

const alliaDarkAA = {
  ...alliaDarkAAA,
  onRoot: {
    ...alliaDarkAAA.onRoot,
    '--border-radius': '16px',
    '--po-density-header-padding': '1.5rem',
    '--po-density-content-padding': '1.25rem'
  }
};

export const alliaPoUiTheme: PoTheme = {
  name: 'allia',
  type: [
    {
      light: alliaLightAAA,
      dark: alliaDarkAAA,
      a11y: PoThemeA11yEnum.AAA
    },
    {
      light: alliaLightAA,
      dark: alliaDarkAA,
      a11y: PoThemeA11yEnum.AA
    }
  ],
  active: {
    type: PoThemeTypeEnum.light,
    a11y: PoThemeA11yEnum.AAA
  }
};

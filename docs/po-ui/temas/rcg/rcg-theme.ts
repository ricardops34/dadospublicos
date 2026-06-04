import {
  PoTheme,
  PoThemeA11yEnum,
  PoThemeTypeEnum
} from '@po-ui/ng-components';

const rcgLightAAA = {
  color: {
    action: {
      default: '#4097CC',
      hover: '#5AA8D8',
      pressed: '#076085',
      focus: '#B51B7E',
      disabled: '#C9D5DB'
    },
    brand: {
      '01': {
        lighter: '#EAF5FB',
        light: '#81A6B4',
        base: '#4097CC',
        dark: '#2F7EAF',
        darkest: '#076085'
      },
      '02': {
        lighter: '#E6F0F4',
        light: '#A7C0CB',
        base: '#81A6B4',
        dark: '#5F8796',
        darkest: '#496A76'
      },
      '03': {
        lighter: '#F8E7F1',
        light: '#D25FA7',
        base: '#B51B7E',
        dark: '#8D145F',
        darkest: '#640C42'
      }
    },
    neutral: {
      light: {
        '00': '#FFFFFF',
        '05': '#F7FAFC',
        '10': '#EEF4F7',
        '20': '#DCE6EB',
        '30': '#C9D5DB'
      },
      mid: {
        '40': '#A5B4BC',
        '60': '#6F848F'
      },
      dark: {
        '70': '#4E6571',
        '80': '#31444D',
        '90': '#17242A',
        '95': '#000000'
      }
    }
  },
  onRoot: {
    '--font-family': "'Roboto', 'Segoe UI', sans-serif",
    '--font-family-theme': "'Roboto', 'Segoe UI', sans-serif",
    '--border-radius': '12px',
    '--border-radius-md': '12px',
    '--border-radius-lg': '18px',
    '--border-radius-xl': '24px',
    '--border-radius-pill': '999px',
    '--color-page-background': '#F7FAFC',
    '--color-card-background': '#FFFFFF',
    '--shadow-color': 'rgba(64, 151, 204, 0.14)',
    '--shadow-color-hover': 'rgba(7, 96, 133, 0.20)',
    '--outline-color-focused': '#B51B7E',
    '--po-density-header-padding': '1.5rem',
    '--po-density-content-padding': '1.25rem',
    '--po-density-footer-padding': '1rem',
    '--po-density-gap-header-content': '1rem',
    '--po-density-gap-spacing': '0.875rem',
    '--po-density-floating-padding': '0.625rem'
  },
  perComponent: {
    'po-button': {
      '--font-weight': '600',
      '--border-radius': '999px',
      '--padding': '0 1.35rem',
      '--color-button-primary': '#4097CC',
      '--color-primary-hover': '#5AA8D8',
      '--color-primary-pressed': '#076085',
      '--text-color-primary': '#FFFFFF',
      '--border-color-secondary': '#4097CC',
      '--text-color-secondary': '#076085',
      '--color-secondary-hover': '#EAF5FB',
      '--color-secondary-pressed': '#DCE6EB'
    },
    'po-widget': {
      '--border-radius': '20px',
      '--box-shadow': '0 14px 34px rgba(64, 151, 204, 0.10)'
    },
    'po-container': {
      '--border-radius': '20px',
      '--box-shadow': '0 14px 32px rgba(64, 151, 204, 0.08)'
    },
    'po-toolbar': {
      '--background-color-toolbar': '#FFFFFF',
      '--border-color-toolbar': '#DCE6EB',
      '--title-color': '#17242A'
    },
    'po-menu': {
      '--background-color-menu-panel': '#076085',
      '--color-menu-panel': '#FFFFFF',
      '--background-color-item-selected': '#EAF5FB',
      '--color-item-selected': '#076085'
    },
    'po-tag': {
      '--border-radius': '999px'
    },
    'po-modal': {
      '--border-radius': '22px'
    },
    'po-table': {
      '--border-radius': '18px',
      '--header-background': '#EEF4F7'
    },
    'po-page-default': {
      '--background-color': '#F7FAFC'
    }
  }
};

const rcgLightAA = {
  ...rcgLightAAA,
  onRoot: {
    ...rcgLightAAA.onRoot,
    '--border-radius': '10px',
    '--po-density-header-padding': '1.25rem',
    '--po-density-content-padding': '1rem'
  }
};

const rcgDarkAAA = {
  color: {
    action: {
      default: '#81A6B4',
      hover: '#9AB9C5',
      pressed: '#4097CC',
      focus: '#D25FA7',
      disabled: '#5C6E76'
    },
    brand: {
      '01': {
        lighter: '#183746',
        light: '#4097CC',
        base: '#81A6B4',
        dark: '#5F8796',
        darkest: '#C4D6DE'
      },
      '02': {
        lighter: '#1E3038',
        light: '#5F8796',
        base: '#076085',
        dark: '#064A67',
        darkest: '#8ED0F0'
      },
      '03': {
        lighter: '#341827',
        light: '#B51B7E',
        base: '#D25FA7',
        dark: '#8D145F',
        darkest: '#F2B7DA'
      }
    },
    neutral: {
      light: {
        '00': '#162126',
        '05': '#1B2A30',
        '10': '#213139',
        '20': '#30434C',
        '30': '#415760'
      },
      mid: {
        '40': '#7A909B',
        '60': '#B2C3CB'
      },
      dark: {
        '70': '#CFDCE2',
        '80': '#E4EDF1',
        '90': '#F4F8FA',
        '95': '#FFFFFF'
      }
    }
  },
  onRoot: {
    '--font-family': "'Roboto', 'Segoe UI', sans-serif",
    '--font-family-theme': "'Roboto', 'Segoe UI', sans-serif",
    '--border-radius': '12px',
    '--border-radius-md': '12px',
    '--border-radius-lg': '18px',
    '--border-radius-pill': '999px',
    '--color-page-background': '#162126',
    '--color-card-background': '#1B2A30',
    '--shadow-color': 'rgba(0, 0, 0, 0.28)',
    '--shadow-color-hover': 'rgba(0, 0, 0, 0.36)',
    '--outline-color-focused': '#D25FA7',
    '--po-density-header-padding': '1.5rem',
    '--po-density-content-padding': '1.25rem',
    '--po-density-footer-padding': '1rem',
    '--po-density-gap-header-content': '1rem',
    '--po-density-gap-spacing': '0.875rem',
    '--po-density-floating-padding': '0.625rem'
  },
  perComponent: {
    'po-button': {
      '--font-weight': '600',
      '--border-radius': '999px',
      '--padding': '0 1.35rem',
      '--color-button-primary': '#81A6B4',
      '--color-primary-hover': '#9AB9C5',
      '--color-primary-pressed': '#4097CC',
      '--text-color-primary': '#162126',
      '--border-color-secondary': '#81A6B4',
      '--text-color-secondary': '#E4EDF1',
      '--color-secondary-hover': '#213139',
      '--color-secondary-pressed': '#30434C'
    },
    'po-widget': {
      '--border-radius': '20px',
      '--box-shadow': '0 18px 40px rgba(0, 0, 0, 0.26)'
    },
    'po-container': {
      '--border-radius': '20px',
      '--box-shadow': '0 18px 40px rgba(0, 0, 0, 0.22)'
    },
    'po-toolbar': {
      '--background-color-toolbar': '#1B2A30',
      '--border-color-toolbar': '#30434C',
      '--title-color': '#F4F8FA'
    },
    'po-menu': {
      '--background-color-menu-panel': '#17242A',
      '--color-menu-panel': '#F4F8FA',
      '--background-color-item-selected': '#213139',
      '--color-item-selected': '#9AB9C5'
    },
    'po-tag': {
      '--border-radius': '999px'
    },
    'po-modal': {
      '--border-radius': '22px'
    },
    'po-table': {
      '--border-radius': '18px',
      '--header-background': '#213139'
    }
  }
};

const rcgDarkAA = {
  ...rcgDarkAAA,
  onRoot: {
    ...rcgDarkAAA.onRoot,
    '--border-radius': '10px',
    '--po-density-header-padding': '1.25rem',
    '--po-density-content-padding': '1rem'
  }
};

export const rcgPoUiTheme: PoTheme = {
  name: 'rcg',
  type: [
    {
      light: rcgLightAAA,
      dark: rcgDarkAAA,
      a11y: PoThemeA11yEnum.AAA
    },
    {
      light: rcgLightAA,
      dark: rcgDarkAA,
      a11y: PoThemeA11yEnum.AA
    }
  ],
  active: {
    type: PoThemeTypeEnum.light,
    a11y: PoThemeA11yEnum.AAA
  }
};

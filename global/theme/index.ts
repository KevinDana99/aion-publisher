import { createTheme } from '@mantine/core'

const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#1A1B1E',
  cursorType: 'pointer',

  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },

  fontFamily: "'Helvetica Neue', Helvetica, Arial, Verdana, sans-serif",
  fontFamilyMonospace: "'SF Mono', Monaco, 'Cascadia Code', monospace",

  headings: {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, Verdana, sans-serif",
    fontWeight: '700'
  },

  other: {
    glassBackground: 'rgba(255, 255, 255, 0.8)',
    glassBorder: 'rgba(255, 255, 255, 0.3)'
  },

  components: {
    Button: {
      defaultProps: {
        variant: 'filled',
        loaderProps: { type: 'dots' }
      },
      styles: {
        root: {
          fontWeight: 500,
          transition: 'all 0.2s ease'
        }
      }
    },
    Card: {
      defaultProps: {
        padding: 'lg',
        shadow: 'sm',
        radius: 'lg',
        withBorder: false
      },
      styles: {
        root: {
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }
      }
    },
    Paper: {
      defaultProps: {
        radius: 'lg',
        shadow: 'sm'
      },
      styles: {
        root: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }
      }
    },
    Input: {
      styles: {
        input: {
          backgroundColor: '#FAFAFA',
          border: '1px solid #E5E5E5',
          transition: 'all 0.2s ease',
          '&:focus': {
            borderColor: '#228BE6',
            boxShadow: '0 0 0 3px rgba(34, 139, 230, 0.1)'
          }
        }
      }
    },
    TextInput: {
      styles: {
        input: {
          backgroundColor: '#FAFAFA',
          border: '1px solid #E5E5E5',
          transition: 'all 0.2s ease',
          '&:focus': {
            borderColor: '#228BE6',
            boxShadow: '0 0 0 3px rgba(34, 139, 230, 0.1)'
          }
        }
      }
    },
    PasswordInput: {
      styles: {
        input: {
          backgroundColor: '#FAFAFA',
          border: '1px solid #E5E5E5',
          transition: 'all 0.2s ease',
          '&:focus': {
            borderColor: '#228BE6',
            boxShadow: '0 0 0 3px rgba(34, 139, 230, 0.1)'
          }
        }
      }
    },
    Modal: {
      defaultProps: {
        radius: 'lg',
        shadow: 'xl'
      }
    },
    Anchor: {
      styles: {
        root: {
          fontWeight: 500,
          transition: 'color 0.2s ease'
        }
      }
    }
  },

  breakpoints: {
    xs: '36em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    xl: '88em'
  }
})

export default theme

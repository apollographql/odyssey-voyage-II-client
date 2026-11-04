import './reset.css';
import {colors} from '@apollo/space-kit/colors';
import {createSystem, defaultConfig, defineConfig} from '@chakra-ui/react';

const {grey, silver, midnight} = colors;

const toTokens = values =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, {value}])
  );

const config = defineConfig({
  globalCss: {
    body: {
      color: 'gray.800'
    }
  },
  theme: {
    tokens: {
      colors: {
        brand: toTokens({
          black: '#12151A',
          white: '#FCFDFF',
          light: '#DEE2E7',
          100: '#D9CFFF',
          200: '#AD9BF6',
          300: '#7156D9',
          400: '#3F20BA',
          midnight: '#1B2240',
          error: '#9C2323'
        }),
        indigo: toTokens({
          darkest: '#2D1F66',
          dark: '#3F20BA',
          light: '#AD9BF6'
        }),
        gray: toTokens({
          50: silver.light,
          100: silver.base,
          200: silver.dark,
          300: silver.darker,
          400: grey.light,
          500: grey.dark,
          600: midnight.dark,
          800: midnight.darker,
          900: midnight.darkest,
          dark: '#5A6270'
        })
      },
      fonts: {
        heading: {value: "'Source Sans Pro', sans-serif"},
        body: {value: "'Source Sans Pro', sans-serif"},
        mono: {value: "'Source Code Pro', monospace"}
      }
    },
    recipes: {
      button: {
        base: {
          fontWeight: 'bold',
          borderRadius: '0.25rem'
        },
        variants: {
          size: {
            sm: {px: 4, py: 3},
            md: {px: 6, py: 4}
          },
          variant: {
            solid: {
              bg: 'indigo.dark',
              color: 'white',
              _hover: {bg: 'indigo.darkest'}
            },
            outline: {
              borderWidth: '2px',
              borderColor: 'purple.500',
              color: 'purple.500'
            },
            ghost: {
              _hover: {bg: 'indigo.dark', color: 'white'}
            },
            link: {
              color: 'indigo.dark',
              px: 0,
              height: 'auto',
              _hover: {textDecoration: 'underline'}
            }
          }
        }
      }
    }
  }
});

export default createSystem(defaultConfig, config);

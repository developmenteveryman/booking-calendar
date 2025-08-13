import { globalStyle } from '@vanilla-extract/css';

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
});

globalStyle('html, body, #root', {
  display: 'block',
  width: '100%',
  height: '100vh',
  overflowX: 'hidden',
  margin: 0,
  padding: 0,
  lineHeight: 1.6,
  fontSize: '16px',
  fontFamily: 'Open Sans, sans-serif',
  fontWeight: '800',
  scrollBehavior: 'smooth',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  textRendering: 'optimizeLegibility',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      scrollBehavior: 'auto',
    },
  },
});
globalStyle('a', {
  textDecoration: 'none',
  color: '#000000',
});

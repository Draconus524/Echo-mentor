import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff', // Neon cyan
    },
    secondary: {
      main: '#ff4081', // Neon pink
    },
    background: {
      default: '#121212', // Dark gray
      paper: '#1e1e1e', // Slightly lighter gray
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h5: {
      fontWeight: 700,
      letterSpacing: '0.5px',
    },
    body1: {
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 229, 255, 0.2)',
          background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          padding: '10px 20px',
          '&:hover': {
            boxShadow: '0 0 15px rgba(0, 229, 255, 0.5)',
          },
        },
      },
    },
  },
});

export default theme;
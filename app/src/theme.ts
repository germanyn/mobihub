import { createTheme, ThemeOptions } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const createAppTheme = (options?: ThemeOptions) => createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  ...options,
});

export default createAppTheme;

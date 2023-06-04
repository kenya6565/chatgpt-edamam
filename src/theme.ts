import { createTheme } from '@mui/material';
import { grey } from '@mui/material/colors';

// Theme definition
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: grey[50],
    },
    background: {
      default: grey[900],
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': {
            borderColor: grey[50],
          },
          '&.Mui-focused fieldset': {
            borderColor: grey[50],
          },
        },
        input: {
          color: grey[50],
        },
      },
    },
  },
});

export default theme;

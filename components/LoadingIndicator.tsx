import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingIndicator = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="200px"
  >
    <CircularProgress />
    <Typography ml={2}>少々お待ちください...</Typography>
  </Box>
);

export default LoadingIndicator;

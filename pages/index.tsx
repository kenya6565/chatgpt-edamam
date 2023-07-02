import { Button, Typography, Box, Container, Paper } from '@mui/material';
import Link from 'next/link';

const HomePage = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          my: 4,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ color: '#fff', fontWeight: 'bold' }}
          >
            Welcome to Qiita GPT!
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ color: '#fff' }}
          >
            The smart article search engine
          </Typography>
          <Link href="/chat" passHref>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mt: 3 }}
            >
              Start
            </Button>
          </Link>
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage;

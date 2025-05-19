import React from 'react';
import { Container, Typography, Box } from '@material-ui/core';

const App: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Welcome to Staple
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="textSecondary">
          A production-quality React application
        </Typography>
      </Box>
    </Container>
  );
};

export default App; 
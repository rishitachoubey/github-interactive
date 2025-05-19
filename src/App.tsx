import React, { useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import GitHubRepoList from './components/GitHubRepoList';
import CreateRepoPage from './pages/CreateRepoPage';

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container>
          <Box my={4}>
            <Typography color="error" variant="h5">
              Something went wrong:
            </Typography>
            <Typography color="error">
              {this.state.error?.toString()}
            </Typography>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h2" component="h1" gutterBottom>
              GitHub Interactive App
            </Typography>
            <Typography variant="h5" component="h2" color="textSecondary">
              GitHub Interactive React Application
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            size="large"
            onClick={() => navigate('/create-repo')}
          >
            Create Repository
          </Button>
        </Box>
        <ErrorBoundary>
          <GitHubRepoList />
        </ErrorBoundary>
      </Box>
    </Container>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-repo" element={<CreateRepoPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App; 
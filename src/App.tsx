import React from 'react';
import { Container, Typography, Box, Button } from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { Add as AddIcon } from '@material-ui/icons';
import GitHubRepoList from './components/GitHubRepoList';
import CreateRepoPage from './pages/CreateRepoPage';

const HomePage: React.FC = () => {
  const history = useHistory();

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
            onClick={() => history.push('/create-repo')}
          >
            Create Repository
          </Button>
        </Box>
        <GitHubRepoList />
      </Box>
    </Container>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/create-repo" component={CreateRepoPage} />
      </Switch>
    </Router>
  );
};

export default App; 
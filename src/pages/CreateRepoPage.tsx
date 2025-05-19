import React from 'react';
import { Container, Box, Typography, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import CreateRepoForm from '../components/CreateRepoForm';

const CreateRepoPage: React.FC = () => {
  const history = useHistory();

  const handleRepoCreated = (repository: any) => {
    console.log('Repository created:', repository);
    history.push('/'); // Navigate back to home after successful creation
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Box display="flex" alignItems="center" mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => history.push('/')}
            style={{ marginRight: 16 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            Create New Repository
          </Typography>
        </Box>
        <CreateRepoForm onSuccess={handleRepoCreated} />
      </Box>
    </Container>
  );
};

export default CreateRepoPage; 
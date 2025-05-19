import React, { useEffect } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreateRepoForm from '../components/CreateRepoForm';

const CreateRepoPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (repository: any) => {
    navigate('/');
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Box display="flex" alignItems="center" mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            style={{ marginRight: 16 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            Create New Repository
          </Typography>
        </Box>
        <CreateRepoForm onSuccess={handleSuccess} />
      </Box>
    </Container>
  );
};

export default CreateRepoPage; 
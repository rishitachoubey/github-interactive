import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import {
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  CircularProgress,
  Snackbar,
  SnackbarContent,
  FormControl,
  FormHelperText,
  Grid,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

const GET_REPOS = gql`
  query {
    viewer {
      repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
        nodes {
          id
          name
          description
          url
          stargazerCount
          forkCount
          updatedAt
          owner {
            login
          }
        }
      }
    }
  }
`;

const CREATE_REPOSITORY = gql`
  mutation CreateRepository(
    $name: String!
    $description: String
    $visibility: RepositoryVisibility!
  ) {
    createRepository(
      input: {
        name: $name
        description: $description
        visibility: $visibility
      }
    ) {
      repository {
        id
        name
        description
        url
        visibility
        stargazerCount
        forkCount
        updatedAt
        owner {
          login
        }
      }
    }
  }
`;

interface CreateRepoFormProps {
  onSuccess?: (repository: any) => void;
}

const CreateRepoForm: React.FC<CreateRepoFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'PUBLIC' as 'PUBLIC' | 'PRIVATE',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [createRepository, { loading }] = useMutation(CREATE_REPOSITORY, {
    onCompleted: (data) => {
      setShowSuccess(true);
      setFormData({ name: '', description: '', visibility: 'PUBLIC' });
      if (onSuccess) {
        onSuccess(data.createRepository.repository);
      }
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setShowError(true);
    },
    refetchQueries: [
      {
        query: GET_REPOS,
      },
    ],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    console.log('CreateRepoForm mounted');
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Repository name is required';
    } else if (!/^[a-zA-Z0-9-_]+$/.test(formData.name)) {
      newErrors.name = 'Repository name can only contain letters, numbers, hyphens, and underscores';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Repository name must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 350) {
      newErrors.description = 'Description must be less than 350 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form', formData);
    if (!validateForm()) return;

    try {
      await createRepository({
        variables: {
          name: formData.name,
          description: formData.description || null,
          visibility: formData.visibility,
        },
      });
      console.log('Repository creation mutation sent');
    } catch (error) {
      console.error('Error in mutation', error);
      // Error is handled in onError callback
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'visibility' ? (checked ? 'PRIVATE' : 'PUBLIC') : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Paper elevation={3} style={{ padding: 24, marginTop: 32 }}>
      <Typography variant="h5" gutterBottom>
        Create New Repository
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Create a new repository to start collaborating on your project
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid sx={{ width: '100%' }}>
            <FormControl error={!!errors.name} fullWidth>
              <TextField
                label="Repository Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                fullWidth
                variant="outlined"
                inputProps={{
                  'aria-label': 'Repository name',
                  maxLength: 100,
                }}
              />
              <FormHelperText>
                Only letters, numbers, hyphens, and underscores are allowed
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid sx={{ width: '100%' }}>
            <TextField
              label="Description (optional)"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description || `${formData.description.length}/350 characters`}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              inputProps={{
                'aria-label': 'Repository description',
                maxLength: 350,
              }}
            />
          </Grid>

          <Grid sx={{ width: '100%' }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="visibility"
                  checked={formData.visibility === 'PRIVATE'}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Make this repository private"
            />
          </Grid>

          <Grid sx={{ width: '100%' }}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                size="large"
              >
                {loading ? 'Creating...' : 'Create Repository'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <SnackbarContent
          message="Repository created successfully!"
          style={{ backgroundColor: '#4caf50', color: 'white' }}
        />
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <SnackbarContent
          message={errorMessage}
          style={{ backgroundColor: '#f44336', color: 'white' }}
          action={<ErrorIcon style={{ color: 'white' }} />}
        />
      </Snackbar>
    </Paper>
  );
};

export default CreateRepoForm; 
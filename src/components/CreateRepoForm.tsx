import React, { useState } from 'react';
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
  Alert,
  FormControl,
  FormHelperText,
} from '@material-ui/core';
import { Alert as AlertIcon } from '@material-ui/icons';

const CREATE_REPOSITORY = gql`
  mutation CreateRepository(
    $name: String!
    $description: String
    $private: Boolean!
  ) {
    createRepository(
      input: {
        name: $name
        description: $description
        private: $private
      }
    ) {
      repository {
        id
        name
        description
        url
        isPrivate
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
    private: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [createRepository, { loading }] = useMutation(CREATE_REPOSITORY, {
    onCompleted: (data) => {
      setShowSuccess(true);
      setFormData({ name: '', description: '', private: false });
      if (onSuccess) {
        onSuccess(data.createRepository.repository);
      }
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setShowError(true);
    },
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Repository name is required';
    } else if (!/^[a-zA-Z0-9-_]+$/.test(formData.name)) {
      newErrors.name = 'Repository name can only contain letters, numbers, hyphens, and underscores';
    }

    if (formData.description && formData.description.length > 350) {
      newErrors.description = 'Description must be less than 350 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createRepository({
        variables: {
          name: formData.name,
          description: formData.description || null,
          private: formData.private,
        },
      });
    } catch (error) {
      // Error is handled in onError callback
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'private' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Paper style={{ padding: 24, marginTop: 32 }}>
      <Typography variant="h5" gutterBottom>
        Create New Repository
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
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
              inputProps={{
                'aria-label': 'Repository name',
              }}
            />
            <FormHelperText>
              Only letters, numbers, hyphens, and underscores are allowed
            </FormHelperText>
          </FormControl>

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
            inputProps={{
              'aria-label': 'Repository description',
              maxLength: 350,
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="private"
                checked={formData.private}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Make this repository private"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            style={{ marginTop: 16 }}
          >
            {loading ? 'Creating...' : 'Create Repository'}
          </Button>
        </Box>
      </form>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Repository created successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
      >
        <Alert
          severity="error"
          icon={<AlertIcon />}
          onClose={() => setShowError(false)}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CreateRepoForm; 
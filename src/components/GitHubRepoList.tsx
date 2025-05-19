import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { List, ListItem, ListItemText, CircularProgress, Typography, Paper, Alert, Box } from '@mui/material';
import RepoDetailsModal from './RepoDetailsModal';

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

interface SelectedRepo {
  name: string;
  owner: string;
}

const GitHubRepoList: React.FC = () => {
  const [selectedRepo, setSelectedRepo] = useState<SelectedRepo | null>(null);
  const { loading, error, data } = useQuery(GET_REPOS, {
    onError: (error) => {
      console.error('GraphQL Error:', error);
    },
    onCompleted: (data) => {
      console.log('Query completed:', data);
    }
  });

  useEffect(() => {
    console.log('GitHubRepoList mounted, loading:', loading, 'error:', error, 'data:', data);
  }, [loading, error, data]);

  const handleRepoClick = (repo: any) => {
    console.log('Repo clicked:', repo);
    setSelectedRepo({
      name: repo.name,
      owner: repo.owner.login,
    });
  };

  const handleCloseModal = () => {
    setSelectedRepo(null);
  };

  if (loading) {
    console.log('Loading repositories...');
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    console.error('Error loading repositories:', error);
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error loading repositories: {error.message}
        {error.networkError && (
          <Typography variant="body2">
            Network error: {error.networkError.message}
          </Typography>
        )}
      </Alert>
    );
  }

  if (!data?.viewer) {
    console.error('No viewer data in response:', data);
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Unable to fetch repository data. Please check your GitHub token.
      </Alert>
    );
  }

  const repos = data.viewer.repositories?.nodes || [];
  console.log('Rendering repositories:', repos.length);

  return (
    <Paper style={{ padding: 24, marginTop: 32 }}>
      <Typography variant="h4" gutterBottom>My GitHub Repositories</Typography>
      {repos.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          No repositories found.
        </Alert>
      ) : (
        <List>
          {repos.map((repo: any) => (
            <ListItem 
              key={repo.id} 
              onClick={() => handleRepoClick(repo)}
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemText
                primary={repo.name}
                secondary={repo.description || 'No description'}
              />
              <Typography variant="body2" color="textSecondary" style={{ marginLeft: 16 }}>
                ⭐ {repo.stargazerCount} | Forks: {repo.forkCount}
              </Typography>
            </ListItem>
          ))}
        </List>
      )}

      {selectedRepo && (
        <RepoDetailsModal
          open={!!selectedRepo}
          onClose={handleCloseModal}
          repoName={selectedRepo.name}
          repoOwner={selectedRepo.owner}
        />
      )}
    </Paper>
  );
};

export default GitHubRepoList; 
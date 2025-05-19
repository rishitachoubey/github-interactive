import React, { useState, useEffect } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { List, ListItem, ListItemText, CircularProgress, Typography, Paper, Alert, Box, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, Button } from '@mui/material';
import RepoDetailsModal from './RepoDetailsModal';
import { UPDATE_REPOSITORY } from '../graphql/mutations';
import EditIcon from '@mui/icons-material/Edit';

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
  const { loading, error, data } = useQuery(GET_REPOS);
  const [editingRepoId, setEditingRepoId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [updateRepository, { loading: updating }] = useMutation(UPDATE_REPOSITORY, {
    refetchQueries: [{ query: GET_REPOS }],
  });

  const handleRepoClick = (repo: any) => {
    setSelectedRepo({
      name: repo.name,
      owner: repo.owner.login,
    });
  };

  const handleCloseModal = () => {
    setSelectedRepo(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
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
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Unable to fetch repository data. Please check your GitHub token.
      </Alert>
    );
  }

  const repos = data.viewer.repositories?.nodes || [];

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
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
              secondaryAction={
                <>
                  <Tooltip title="Edit Description">
                    <IconButton edge="end" onClick={e => { e.stopPropagation(); setEditingRepoId(repo.id); setEditDescription(repo.description || ''); }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </>
              }
              onClick={() => handleRepoClick(repo)}
            >
              <ListItemText
                primary={repo.name}
                secondary={
                  editingRepoId === repo.id ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <TextField
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                        size="small"
                        variant="standard"
                        placeholder="Description"
                        autoFocus
                        sx={{ minWidth: 200 }}
                      />
                      <Button
                        size="small"
                        color="primary"
                        disabled={updating}
                        onClick={async e => {
                          e.stopPropagation();
                          await updateRepository({ variables: { repositoryId: repo.id, description: editDescription } });
                          setEditingRepoId(null);
                        }}
                      >Save</Button>
                      <Button size="small" onClick={e => { e.stopPropagation(); setEditingRepoId(null); }}>Cancel</Button>
                    </Box>
                  ) : (
                    repo.description || 'No description'
                  )
                }
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
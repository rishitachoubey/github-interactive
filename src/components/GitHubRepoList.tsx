import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { List, ListItem, ListItemText, CircularProgress, Typography, Paper } from '@material-ui/core';
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
  const { loading, error, data } = useQuery(GET_REPOS);

  const handleRepoClick = (repo: any) => {
    setSelectedRepo({
      name: repo.name,
      owner: repo.owner.login,
    });
  };

  const handleCloseModal = () => {
    setSelectedRepo(null);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  const repos = data?.viewer?.repositories?.nodes || [];

  return (
    <Paper style={{ padding: 24, marginTop: 32 }}>
      <Typography variant="h4" gutterBottom>My GitHub Repositories</Typography>
      <List>
        {repos.map((repo: any) => (
          <ListItem 
            key={repo.id} 
            button 
            onClick={() => handleRepoClick(repo)}
            style={{ cursor: 'pointer' }}
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
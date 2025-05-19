import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { List, ListItem, ListItemText, CircularProgress, Typography, Paper } from '@material-ui/core';

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
        }
      }
    }
  }
`;

const GitHubRepoList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_REPOS);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  const repos = data?.viewer?.repositories?.nodes || [];

  return (
    <Paper style={{ padding: 24, marginTop: 32 }}>
      <Typography variant="h4" gutterBottom>My GitHub Repositories</Typography>
      <List>
        {repos.map((repo: any) => (
          <ListItem key={repo.id} button component="a" href={repo.url} target="_blank">
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
    </Paper>
  );
};

export default GitHubRepoList; 
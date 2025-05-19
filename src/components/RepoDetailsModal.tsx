import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Chip,
  Divider,
  IconButton,
  Tabs,
  Tab,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SortIcon from '@mui/icons-material/Sort';
import { useTheme, alpha } from '@mui/material/styles';

const ITEMS_PER_PAGE = 10;

const GET_REPO_DETAILS = gql`
  query GetRepoPullRequests(
    $owner: String!
    $name: String!
    $first: Int!
    $after: String
    $states: [PullRequestState!]
    $orderBy: IssueOrder
  ) {
    repository(owner: $owner, name: $name) {
      pullRequests(
        first: $first
        after: $after
        states: $states
        orderBy: $orderBy
      ) {
        nodes {
          id
          title
          state
          createdAt
          closedAt
          url
          author {
            login
            avatarUrl
          }
          number
          reviewDecision
          comments {
            totalCount
          }
          commits {
            totalCount
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

type PullRequestState = 'OPEN' | 'CLOSED' | 'MERGED';
type SortField = 'CREATED_AT' | 'UPDATED_AT';
type SortDirection = 'ASC' | 'DESC';

interface RepoDetailsModalProps {
  open: boolean;
  onClose: () => void;
  repoName: string;
  repoOwner: string;
}

const RepoDetailsModal: React.FC<RepoDetailsModalProps> = ({ open, onClose, repoName, repoOwner }) => {
  const [activeTab, setActiveTab] = useState<PullRequestState>('OPEN');
  const [sortField, setSortField] = useState<SortField>('CREATED_AT');
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC');
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const theme = useTheme();

  const { loading, error, data, fetchMore } = useQuery(GET_REPO_DETAILS, {
    variables: {
      owner: repoOwner,
      name: repoName,
      first: ITEMS_PER_PAGE,
      states: activeTab === 'OPEN' ? ['OPEN'] : ['CLOSED', 'MERGED'],
      orderBy: { field: sortField, direction: sortDirection },
    },
    skip: !open,
  });

  useEffect(() => {
    console.log('RepoDetailsModal mounted', { open, onClose, repoName, repoOwner });
    return () => {
      console.log('RepoDetailsModal unmounted');
    };
  }, []);

  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: PullRequestState) => {
    setActiveTab(newValue);
    setEndCursor(null);
  };

  const handleLoadMore = () => {
    if (!data?.repository?.pullRequests?.pageInfo?.hasNextPage) return;

    fetchMore({
      variables: {
        after: data.repository.pullRequests.pageInfo.endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          repository: {
            ...prev.repository,
            pullRequests: {
              ...fetchMoreResult.repository.pullRequests,
              nodes: [
                ...prev.repository.pullRequests.nodes,
                ...fetchMoreResult.repository.pullRequests.nodes,
              ],
            },
          },
        };
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'OPEN':
        return 'primary';
      case 'CLOSED':
        return 'default';
      case 'MERGED':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getReviewDecisionColor = (decision: string | null) => {
    switch (decision) {
      case 'APPROVED':
        return 'primary';
      case 'CHANGES_REQUESTED':
        return 'secondary';
      case 'REVIEW_REQUIRED':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{
        bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.95) : undefined,
        color: theme.palette.text.primary
      }}>
        <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Grid sx={{ flexGrow: 1 }}>
            <Typography variant="h6" color="textPrimary">
              {repoOwner}/{repoName} - Pull Requests
            </Typography>
          </Grid>
          <Grid>
            <IconButton onClick={onClose} size="small" sx={{ color: theme.palette.text.primary }}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>

      <Box px={2} pt={2} pb={0} sx={{
        bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.92) : undefined,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid sx={{ flexGrow: 1 }}>
            <Tabs value={activeTab} onChange={handleTabChange} textColor="inherit" indicatorColor="primary">
              <Tab label="Open" value="OPEN" />
              <Tab label="Closed" value="CLOSED" />
            </Tabs>
          </Grid>
          <Grid>
            <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                label="Sort By"
                sx={{ color: theme.palette.text.primary }}
              >
                <MenuItem value="CREATED_AT">Created Date</MenuItem>
                <MenuItem value="UPDATED_AT">Updated Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <Button
              variant="outlined"
              size="small"
              startIcon={<SortIcon />}
              onClick={() => setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC')}
              sx={{ color: theme.palette.text.primary, borderColor: theme.palette.divider }}
            >
              {sortDirection === 'ASC' ? 'Ascending' : 'Descending'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <DialogContent sx={{
        bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.90) : undefined,
        color: theme.palette.text.primary,
        minHeight: 300
      }}>
        {loading && !data && <CircularProgress />}
        {error && <Typography color="error">Error loading pull requests: {error.message}</Typography>}
        {data && (
          <>
            <List sx={{ bgcolor: 'transparent' }}>
              {data.repository.pullRequests.nodes.map((pr: any) => (
                <React.Fragment key={pr.id}>
                  <ListItem
                    component="a"
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.default, 0.7) : undefined,
                      borderRadius: 2,
                      mb: 1,
                      '&:hover': {
                        bgcolor: theme.palette.action.hover
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                          <Typography variant="subtitle1" color="textPrimary">
                            #{pr.number} {pr.title}
                          </Typography>
                          <Chip
                            label={pr.state}
                            size="small"
                            color={getStateColor(pr.state)}
                            sx={{
                              bgcolor: pr.state === 'OPEN'
                                ? theme.palette.success.dark
                                : pr.state === 'MERGED'
                                ? theme.palette.secondary.dark
                                : theme.palette.grey[700],
                              color: theme.palette.getContrastText(
                                pr.state === 'OPEN'
                                  ? theme.palette.success.dark
                                  : pr.state === 'MERGED'
                                  ? theme.palette.secondary.dark
                                  : theme.palette.grey[700]
                              ),
                              fontWeight: 600
                            }}
                          />
                          {pr.reviewDecision && (
                            <Chip
                              label={pr.reviewDecision.toLowerCase()}
                              size="small"
                              color={getReviewDecisionColor(pr.reviewDecision)}
                              sx={{
                                bgcolor: pr.reviewDecision === 'APPROVED'
                                  ? theme.palette.info.dark
                                  : pr.reviewDecision === 'CHANGES_REQUESTED'
                                  ? theme.palette.error.dark
                                  : theme.palette.grey[700],
                                color: theme.palette.getContrastText(
                                  pr.reviewDecision === 'APPROVED'
                                    ? theme.palette.info.dark
                                    : pr.reviewDecision === 'CHANGES_REQUESTED'
                                    ? theme.palette.error.dark
                                    : theme.palette.grey[700]
                                ),
                                fontWeight: 600
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box mt={1}>
                          <Typography variant="body2" color="textSecondary">
                            Created by {pr.author.login} on {formatDate(pr.createdAt)}
                          </Typography>
                          <Box display="flex" gap={2} mt={0.5}>
                            <Typography variant="body2" color="textSecondary">
                              💬 {pr.comments.totalCount} comments
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              🔄 {pr.commits.totalCount} commits
                            </Typography>
                            {pr.closedAt && (
                              <Typography variant="body2" color="textSecondary">
                                Closed on {formatDate(pr.closedAt)}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider sx={{ bgcolor: theme.palette.divider }} />
                </React.Fragment>
              ))}
              {data.repository.pullRequests.nodes.length === 0 && (
                <Typography variant="body1" color="textSecondary" style={{ padding: '16px' }}>
                  No pull requests found for this repository.
                </Typography>
              )}
            </List>
            {data.repository.pullRequests.pageInfo.hasNextPage && (
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  variant="outlined"
                  onClick={handleLoadMore}
                  disabled={loading}
                  sx={{ color: theme.palette.text.primary, borderColor: theme.palette.divider }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Load More'}
                </Button>
              </Box>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RepoDetailsModal; 
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import RepoDetailsModal from '../RepoDetailsModal';
import { GET_REPO_DETAILS } from '../../graphql/queries';

const mockPullRequests = {
  request: {
    query: GET_REPO_DETAILS,
    variables: {
      owner: 'test',
      name: 'test-repo',
      first: 10,
      states: ['OPEN'],
      orderBy: { field: 'CREATED_AT', direction: 'DESC' }
    }
  },
  result: {
    data: {
      repository: {
        pullRequests: {
          nodes: [
            {
              id: '1',
              title: 'Test PR 1',
              state: 'OPEN',
              createdAt: '2024-01-01T00:00:00Z',
              closedAt: null,
              url: 'https://github.com/test/test-repo/pull/1',
              author: {
                login: 'test-user',
                avatarUrl: 'https://github.com/avatar.png'
              },
              number: 1,
              reviewDecision: 'APPROVED',
              comments: {
                totalCount: 5
              },
              commits: {
                totalCount: 3
              }
            },
            {
              id: '2',
              title: 'Test PR 2',
              state: 'CLOSED',
              createdAt: '2024-01-02T00:00:00Z',
              closedAt: '2024-01-03T00:00:00Z',
              url: 'https://github.com/test/test-repo/pull/2',
              author: {
                login: 'test-user-2',
                avatarUrl: 'https://github.com/avatar2.png'
              },
              number: 2,
              reviewDecision: 'CHANGES_REQUESTED',
              comments: {
                totalCount: 2
              },
              commits: {
                totalCount: 1
              }
            }
          ],
          pageInfo: {
            hasNextPage: true,
            endCursor: 'cursor2'
          }
        }
      }
    }
  }
};

const mockEmptyPullRequests = {
  request: {
    query: GET_REPO_DETAILS,
    variables: {
      owner: 'test',
      name: 'test-repo',
      first: 10,
      states: ['OPEN'],
      orderBy: { field: 'CREATED_AT', direction: 'DESC' }
    }
  },
  result: {
    data: {
      repository: {
        pullRequests: {
          nodes: [],
          pageInfo: {
            hasNextPage: false,
            endCursor: null
          }
        }
      }
    }
  }
};

const mockError = {
  request: {
    query: GET_REPO_DETAILS,
    variables: {
      owner: 'test',
      name: 'test-repo',
      first: 10,
      states: ['OPEN'],
      orderBy: { field: 'CREATED_AT', direction: 'DESC' }
    }
  },
  error: new Error('Failed to fetch pull requests')
};

describe('RepoDetailsModal', () => {
  test('renders modal when open', async () => {
    render(
      <MockedProvider mocks={[mockPullRequests]} addTypename={false}>
        <RepoDetailsModal open={true} onClose={() => {}} repoName="test-repo" repoOwner="test" />
      </MockedProvider>
    );

    // Check if modal title is rendered
    expect(screen.getByText('test/test-repo - Pull Requests')).toBeInTheDocument();

    // Check if tabs are rendered
    expect(screen.getByRole('tab', { name: 'Open' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Closed' })).toBeInTheDocument();

    // Check if sort controls are rendered
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Descending')).toBeInTheDocument();
  });

  test('renders loading state', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RepoDetailsModal open={true} onClose={() => {}} repoName="test-repo" repoOwner="test" />
      </MockedProvider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders error state', async () => {
    render(
      <MockedProvider mocks={[mockError]} addTypename={false}>
        <RepoDetailsModal open={true} onClose={() => {}} repoName="test-repo" repoOwner="test" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading pull requests/i)).toBeInTheDocument();
    });
  });

  test('renders empty state', async () => {
    render(
      <MockedProvider mocks={[mockEmptyPullRequests]} addTypename={false}>
        <RepoDetailsModal open={true} onClose={() => {}} repoName="test-repo" repoOwner="test" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/No pull requests found for this repository/i)).toBeInTheDocument();
    });
  });

  test('renders pull requests list', async () => {
    render(
      <MockedProvider mocks={[mockPullRequests]} addTypename={false}>
        <RepoDetailsModal open={true} onClose={() => {}} repoName="test-repo" repoOwner="test" />
      </MockedProvider>
    );

    // Wait for pull requests to load
    await waitFor(() => {
      expect(screen.getByText('#1 Test PR 1')).toBeInTheDocument();
    });

    // Check if pull requests are rendered with correct information
    expect(screen.getByText('#1 Test PR 1')).toBeInTheDocument();
    expect(screen.getByText('#2 Test PR 2')).toBeInTheDocument();
    expect(screen.getAllByText((content) => content.includes('Created by test-user')).length).toBeGreaterThan(0);
    expect(screen.getByText('💬 5 comments')).toBeInTheDocument();
    expect(screen.getByText('🔄 3 commits')).toBeInTheDocument();

    // Check if state chips are rendered
    expect(screen.getByText('OPEN')).toBeInTheDocument();
    expect(screen.getByText('CLOSED')).toBeInTheDocument();

    // Check if review decision chips are rendered
    expect(screen.getByText('approved')).toBeInTheDocument();
    expect(screen.getByText('changes_requested')).toBeInTheDocument();
  });

  test('handles tab changes', async () => {
    const closedTabMock = {
      request: {
        query: GET_REPO_DETAILS,
        variables: {
          owner: 'test',
          name: 'test-repo',
          first: 10,
          states: ['CLOSED', 'MERGED'],
          orderBy: { field: 'CREATED_AT', direction: 'DESC' }
        }
      },
      result: mockPullRequests.result
    };

    render(
      <MockedProvider mocks={[mockPullRequests, closedTabMock]} addTypename={false}>
        <RepoDetailsModal open={true} onClose={() => {}} repoName="test-repo" repoOwner="test" />
      </MockedProvider>
    );

    // Wait for initial pull requests to load
    await waitFor(() => {
      expect(screen.getByText('#1 Test PR 1')).toBeInTheDocument();
    });

    // Click on Closed tab
    fireEvent.click(screen.getByRole('tab', { name: 'Closed' }));

    // Wait for closed pull requests to load
    await waitFor(() => {
      expect(screen.getByText('#2 Test PR 2')).toBeInTheDocument();
    });
  });

  test('handles sort changes', async () => {
    const updatedAtMock = {
      request: {
        query: GET_REPO_DETAILS,
        variables: {
          owner: 'test',
          name: 'test-repo',
          first: 10,
          states: ['OPEN'],
          orderBy: { field: 'UPDATED_AT', direction: 'DESC' }
        }
      },
      result: mockPullRequests.result
    };

    render(
      <MockedProvider mocks={[mockPullRequests, updatedAtMock]} addTypename={false}>
        <RepoDetailsModal open={true} onClose={() => {}} repoName="test-repo" repoOwner="test" />
      </MockedProvider>
    );

    // Wait for initial pull requests to load
    await waitFor(() => {
      expect(screen.getByText('#1 Test PR 1')).toBeInTheDocument();
    });

    // Change sort field to Updated Date
    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Updated Date'));

    // Wait for sorted pull requests to load
    await waitFor(() => {
      expect(screen.getByText('#1 Test PR 1')).toBeInTheDocument();
    });
  });

  test('handles sort direction toggle', async () => {
    const ascendingMock = {
      request: {
        query: GET_REPO_DETAILS,
        variables: {
          owner: 'test',
          name: 'test-repo',
          first: 10,
          states: ['OPEN'],
          orderBy: { field: 'CREATED_AT', direction: 'ASC' }
        }
      },
      result: mockPullRequests.result
    };

    render(
      <MockedProvider mocks={[mockPullRequests, ascendingMock]} addTypename={false}>
        <RepoDetailsModal open={true} onClose={() => {}} repoName="test-repo" repoOwner="test" />
      </MockedProvider>
    );

    // Wait for initial pull requests to load
    await waitFor(() => {
      expect(screen.getByText('#1 Test PR 1')).toBeInTheDocument();
    });

    // Toggle sort direction
    fireEvent.click(screen.getByText('Descending'));

    // Wait for sorted pull requests to load
    await waitFor(() => {
      expect(screen.getByText('#1 Test PR 1')).toBeInTheDocument();
    });
  });

  test('handles load more', async () => {
    const loadMoreMock = {
      request: {
        query: GET_REPO_DETAILS,
        variables: {
          owner: 'test',
          name: 'test-repo',
          first: 10,
          after: 'cursor2',
          states: ['OPEN'],
          orderBy: { field: 'CREATED_AT', direction: 'DESC' }
        }
      },
      result: {
        data: {
          repository: {
            pullRequests: {
              nodes: [
                {
                  id: '3',
                  title: 'Test PR 3',
                  state: 'OPEN',
                  createdAt: '2024-01-04T00:00:00Z',
                  closedAt: null,
                  url: 'https://github.com/test/test-repo/pull/3',
                  author: {
                    login: 'test-user-3',
                    avatarUrl: 'https://github.com/avatar3.png'
                  },
                  number: 3,
                  reviewDecision: 'REVIEW_REQUIRED',
                  comments: {
                    totalCount: 1
                  },
                  commits: {
                    totalCount: 2
                  }
                }
              ],
              pageInfo: {
                hasNextPage: false,
                endCursor: null
              }
            }
          }
        }
      }
    };

    render(
      <MockedProvider mocks={[mockPullRequests, loadMoreMock]} addTypename={false}>
        <RepoDetailsModal open={true} onClose={() => {}} repoName="test-repo" repoOwner="test" />
      </MockedProvider>
    );

    // Wait for initial pull requests to load
    await waitFor(() => {
      expect(screen.getByText('#1 Test PR 1')).toBeInTheDocument();
    });

    // Click load more button
    fireEvent.click(screen.getByText('Load More'));

    // Wait for additional pull requests to load
    await waitFor(() => {
      expect(screen.getByText('#3 Test PR 3')).toBeInTheDocument();
    });
  });

  test('calls onClose when close button is clicked', async () => {
    const onClose = jest.fn();
    render(
      <MockedProvider mocks={[mockPullRequests]} addTypename={false}>
        <RepoDetailsModal open={true} onClose={onClose} repoName="test-repo" repoOwner="test" />
      </MockedProvider>
    );

    // Wait for modal to load
    await waitFor(() => {
      expect(screen.getByText('test/test-repo - Pull Requests')).toBeInTheDocument();
    });

    // Click close button
    fireEvent.click(screen.getAllByRole('button')[0]);

    // Check if onClose was called
    expect(onClose).toHaveBeenCalled();
  });
}); 
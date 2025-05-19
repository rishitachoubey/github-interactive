import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import GitHubRepoList from '../GitHubRepoList';
import { GET_REPOS } from '../../graphql/queries';

const mockRepos = {
  request: {
    query: GET_REPOS
  },
  result: {
    data: {
      viewer: {
        repositories: {
          nodes: [
            {
              id: '1',
              name: 'test-repo-1',
              description: 'Test repo 1 description',
              url: 'https://github.com/test/test-repo-1',
              stargazerCount: 10,
              forkCount: 5,
              updatedAt: '2024-01-01T00:00:00Z',
              owner: {
                login: 'test'
              }
            },
            {
              id: '2',
              name: 'test-repo-2',
              description: null,
              url: 'https://github.com/test/test-repo-2',
              stargazerCount: 0,
              forkCount: 0,
              updatedAt: '2024-01-02T00:00:00Z',
              owner: {
                login: 'test'
              }
            }
          ]
        }
      }
    }
  }
};

const mockEmptyRepos = {
  request: {
    query: GET_REPOS
  },
  result: {
    data: {
      viewer: {
        repositories: {
          nodes: []
        }
      }
    }
  }
};

const mockError = {
  request: {
    query: GET_REPOS
  },
  error: new Error('Failed to fetch repositories')
};

describe('GitHubRepoList', () => {
  test('renders loading state', () => {
    render(
      <MockedProvider>
        <GitHubRepoList />
      </MockedProvider>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders error state', async () => {
    render(
      <MockedProvider mocks={[mockError]} addTypename={false}>
        <GitHubRepoList />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading repositories/i)).toBeInTheDocument();
    });
  });

  test('renders empty state', async () => {
    render(
      <MockedProvider mocks={[mockEmptyRepos]} addTypename={false}>
        <GitHubRepoList />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/No repositories found/i)).toBeInTheDocument();
    });
  });

  test('renders list of repositories', async () => {
    render(
      <MockedProvider mocks={[mockRepos]} addTypename={false}>
        <GitHubRepoList />
      </MockedProvider>
    );

    // Wait for repositories to load
    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    // Check if both repositories are rendered
    expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    expect(screen.getByText('test-repo-2')).toBeInTheDocument();
    
    // Check if descriptions are rendered correctly
    expect(screen.getByText('Test repo 1 description')).toBeInTheDocument();
    expect(screen.getByText('No description')).toBeInTheDocument();
    
    // Check if stats are rendered
    expect(screen.getByText('⭐ 10 | Forks: 5')).toBeInTheDocument();
    expect(screen.getByText('⭐ 0 | Forks: 0')).toBeInTheDocument();
  });

  test('opens modal when clicking on a repository', async () => {
    render(
      <MockedProvider mocks={[mockRepos]} addTypename={false}>
        <GitHubRepoList />
      </MockedProvider>
    );

    // Wait for repositories to load
    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    });

    // Click on a repository
    fireEvent.click(screen.getByText('test-repo-1'));

    // Check if modal is opened with correct repository info
    await waitFor(() => {
      expect(screen.getByText('test/test-repo-1 - Pull Requests')).toBeInTheDocument();
    });
  });

  test('handles network error', async () => {
    const networkErrorMock = {
      request: {
        query: GET_REPOS
      },
      error: new Error('Network error') as Error & { networkError?: Error }
    };
    networkErrorMock.error.networkError = new Error('Network error');

    render(
      <MockedProvider mocks={[networkErrorMock]} addTypename={false}>
        <GitHubRepoList />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Network error/i).length).toBeGreaterThan(0);
    });
  });

  test('handles missing viewer data', async () => {
    const noViewerMock = {
      request: {
        query: GET_REPOS
      },
      result: {
        data: {
          viewer: null
        }
      }
    };

    render(
      <MockedProvider mocks={[noViewerMock]} addTypename={false}>
        <GitHubRepoList />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Unable to fetch repository data/i)).toBeInTheDocument();
    });
  });
}); 
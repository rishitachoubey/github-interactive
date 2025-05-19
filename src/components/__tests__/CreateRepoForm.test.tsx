import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import CreateRepoForm from '../CreateRepoForm';
import '@testing-library/jest-dom';
import { CREATE_REPOSITORY } from '../../graphql/mutations';

const mockCreateRepo = {
  request: {
    query: CREATE_REPOSITORY,
    variables: {
      name: 'test-repo',
      description: 'Test description',
      visibility: 'PUBLIC'
    }
  },
  result: {
    data: {
      createRepository: {
        repository: {
          id: '1',
          name: 'test-repo',
          description: 'Test description',
          visibility: 'PUBLIC',
          url: 'https://github.com/test/test-repo',
          stargazerCount: 0,
          forkCount: 0,
          updatedAt: '2024-01-01T00:00:00Z',
          owner: {
            login: 'test'
          }
        }
      }
    }
  }
};

const mockCreateRepoNullDesc = {
  request: {
    query: CREATE_REPOSITORY,
    variables: {
      name: 'test-repo',
      description: null,
      visibility: 'PUBLIC'
    }
  },
  result: mockCreateRepo.result
};

describe('CreateRepoForm', () => {
  test('handles successful repository creation', async () => {
    const mocks = [mockCreateRepo, mockCreateRepoNullDesc];
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreateRepoForm />
      </MockedProvider>
    );

    // Fill out form
    fireEvent.change(screen.getByLabelText(/Repository Name/i), { 
      target: { value: 'test-repo' } 
    });
    fireEvent.change(screen.getByLabelText(/Description/i), { 
      target: { value: 'Test description' } 
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Create Repository/i }));

    // Wait for success
    await waitFor(() => {
      expect(screen.queryByText((content) => /Repository name is required/i.test(content))).not.toBeInTheDocument();
    });
  });

  test('handles repository creation error', async () => {
    const errorMock = {
      request: {
        query: CREATE_REPOSITORY,
        variables: {
          name: 'test-repo',
          description: 'Test description',
          visibility: 'PUBLIC'
        }
      },
      error: new Error('Repository creation failed')
    };

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <CreateRepoForm />
      </MockedProvider>
    );

    // Fill out form
    fireEvent.change(screen.getByLabelText(/Repository Name/i), { 
      target: { value: 'test-repo' } 
    });
    fireEvent.change(screen.getByLabelText(/Description/i), { 
      target: { value: 'Test description' } 
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Create Repository/i }));

    // Wait for error message
    expect(await screen.findByTestId('repo-create-error')).toBeInTheDocument();
  });

  test('toggles repository visibility', async () => {
    render(
      <MockedProvider>
        <CreateRepoForm />
      </MockedProvider>
    );

    const visibilityCheckbox = screen.getByRole('checkbox');
    expect(visibilityCheckbox).not.toBeChecked();

    fireEvent.click(visibilityCheckbox);
    expect(visibilityCheckbox).toBeChecked();
  });
}); 
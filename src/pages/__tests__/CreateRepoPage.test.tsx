import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import CreateRepoPage from '../CreateRepoPage';

const mocks: any[] = [];

test('renders CreateRepoPage', () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter>
        <CreateRepoPage />
      </MemoryRouter>
    </MockedProvider>
  );
  expect(screen.getAllByText(/Create New Repository/i).length).toBeGreaterThan(0);
  expect(screen.getByLabelText(/Repository Name/i)).toBeInTheDocument();
}); 
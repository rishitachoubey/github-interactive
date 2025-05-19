import { gql } from '@apollo/client';

export const CREATE_REPOSITORY = gql`
  mutation CreateRepository($name: String!, $description: String, $visibility: RepositoryVisibility!) {
    createRepository(input: { name: $name, description: $description, visibility: $visibility }) {
      id
      name
      description
      visibility
    }
  }
`;

export const UPDATE_REPOSITORY = gql`
  mutation UpdateRepository($repositoryId: ID!, $description: String) {
    updateRepository(input: {repositoryId: $repositoryId, description: $description}) {
      repository {
        id
        name
        description
        visibility
      }
    }
  }
`;

export const DELETE_REPOSITORY = gql`
  mutation DeleteRepository($repositoryId: ID!) {
    deleteRepository(input: {repositoryId: $repositoryId}) {
      repository {
        id
        name
      }
    }
  }
`; 
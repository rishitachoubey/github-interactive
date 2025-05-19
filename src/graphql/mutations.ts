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
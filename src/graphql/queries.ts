import { gql } from '@apollo/client';

export const GET_REPOS = gql`
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

export const GET_REPO_DETAILS = gql`
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
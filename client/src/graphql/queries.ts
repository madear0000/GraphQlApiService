import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers($limit: Int, $offset: Int, $username: String) {
    users(limit: $limit, offset: $offset, username: $username) {
      id
      username
      password
      icon
      posts {
        id
        title
      }
    }
  }
`;

export const GET_DASHBOARD = gql`
  query GetDashboard {
    dashboard {
      totalUsers
      totalPosts
      totalComments
      totalLikes
      userStats {
        id
        username
        postCount
        commentCount
        likeCount
      }
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts($limit: Int, $offset: Int) {
    posts(limit: $limit, offset: $offset) {
      id
      title
      body
      author {
        id
        username
        icon
      }
      comments {
        id
        text
        author {
          id
          username
          icon
        }
        createdAt
      }
      likes {
        id
        author {
          id
        }
      }
      createdAt
    }
  }
`;

export const GET_POST = gql`
  query GetPost($id: Int!) {
    post(id: $id) {
      id
      title
      body
      author {
        id
        username
        icon
      }
      comments {
        id
        text
        author {
          id
          username
          icon
        }
        createdAt
      }
      likes {
        id
        author {
          id
        }
      }
      createdAt
    }
  }
`;
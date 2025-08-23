import { gql } from '@apollo/client';

// Получить всех пользователей
export const GET_USERS = gql`
  query GetUsers($limit: Int, $offset: Int, $username: String) {
    users(limit: $limit, offset: $offset, username: $username) {
      id
      username
      icon
      posts {
        id
        title
      }
    }
  }
`;

// Получить дашборд
export const GET_DASHBOARD = gql`
  query GetDashboard {
    dashboard {
      totalUsers
      totalPosts
      totalComments
      totalLikes
      users {
        id
        username
        postCount
        commentCount
        likesCount
      }
    }
  }
`;

// Получить посты
export const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      body
      comments {
        id
        text
      }
      likes {
        id
      }
    }
  }
`;
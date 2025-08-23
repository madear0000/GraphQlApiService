import { gql } from '@apollo/client';

// Создать пользователя
export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!, $icon: String!) {
    createUser(username: $username, password: $password, icon: $icon) {
      id
      username
      icon
    }
  }
`;

// Создать пост
export const CREATE_POST = gql`
  mutation CreatePost($authorId: Int!, $title: String!, $body: String!) {
    createPost(authorId: $authorId, title: $title, body: $body) {
      id
      title
      body
    }
  }
`;

// Создать комментарий
export const CREATE_COMMENT = gql`
  mutation CreateComment($postId: Int!, $authorId: Int!, $text: String!) {
    createComment(postId: $postId, authorId: $authorId, text: $text) {
      id
      text
    }
  }
`;

// Вход пользователя (кастомная мутация)
export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    users(username: $username) {
      id
      username
      password
      icon
    }
  }
`;
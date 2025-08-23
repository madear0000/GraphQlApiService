import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        icon
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($username: String!, $password: String!, $icon: String!) {
    register(username: $username, password: $password, icon: $icon) {
      token
      user {
        id
        username
        icon
      }
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($title: String!, $body: String!, $token: String!) {
    createPost(title: $title, body: $body, token: $token) {
      id
      title
      body
      author {
        id
        username
        icon
      }
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($postId: Int!, $text: String!, $token: String!) {
    createComment(postId: $postId, text: $text, token: $token) {
      id
      text
      author {
        id
        username
        icon
      }
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: Int!, $token: String!) {
    likePost(postId: $postId, token: $token)
  }
`;

export const UNLIKE_POST = gql`
  mutation UnlikePost($postId: Int!, $token: String!) {
    unlikePost(postId: $postId, token: $token)
  }
`;

export const GET_ME = gql`
  query GetMe($token: String!) {
    me(token: $token) {
      id
      username
      icon
    }
  }
`;
export interface User {
  id: number;
  username: string;
  password: string;
  icon: string;
  posts?: Post[];
  isAdmin?: boolean;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  author_id: number;
  author?: User;
  comments?: Comment[];
  likes?: Like[];
  createdAt?: string;
}

export interface Comment {
  id: number;
  text: string;
  post_id: number;
  author_id: number;
  author?: User;
  createdAt?: string;
}

export interface Like {
  id: number;
  author_id: number;
  post_id: number;
}

export interface UserStats {
  id: number;
  username: string;
  postCount: number;
  commentCount: number;
  likeCount: number;
}

export interface DashboardData {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  userStats: UserStats[];
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  icon: string;
}

export interface UsersQueryVariables {
  limit?: number;
  offset?: number;
  username?: string;
}

export interface CreatePostData {
  title: string;
  body: string;
}

// Добавим эти типы к существующим

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface QueryResponse<T> {
  data: T;
  pagination?: PaginationInfo;
  errors?: ApiError[];
}
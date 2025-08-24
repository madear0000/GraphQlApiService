import { LoginData, RegisterData, CreatePostData } from '../types';

export const validateLogin = (data: LoginData): Partial<LoginData> => {
  const errors: Partial<LoginData> = {};
  
  if (!data.username || data.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters long';
  }
  
  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }
  
  return errors;
};

export const validateRegister = (data: RegisterData): Partial<RegisterData> => {
  const errors: Partial<RegisterData> = {};
  
  if (!data.username || data.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters long';
  }
  
  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }
  
  if (!data.icon) {
    errors.icon = 'Please select an icon';
  }
  
  return errors;
};

export const validatePost = (data: CreatePostData): Partial<CreatePostData> => {
  const errors: Partial<CreatePostData> = {};
  
  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  }
  
  if (!data.body || data.body.trim().length < 10) {
    errors.body = 'Content must be at least 10 characters long';
  }
  
  return errors;
};
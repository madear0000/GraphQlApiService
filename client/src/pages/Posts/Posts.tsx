import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_POSTS } from '../../api/queries';
import { PostCard } from '../../components/PostCard/PostCard';
import './Posts.css';

export function Posts() {
  const { loading, error, data } = useQuery(GET_POSTS);

  if (loading) return <div className="loading">Загрузка постов...</div>;
  if (error) return <div className="error">Ошибка: {error.message}</div>;

  return (
    <div className="posts-page">
      <h1>Все посты</h1>
      <div className="posts-list">
        {data.posts.map((post: any) => (
          <PostCard 
            key={post.id}
            title={post.title}
            content={post.body}
            author={post.author?.username || 'Неизвестный автор'}
            comments={post.comments}
          />
        ))}
      </div>
    </div>
  );
}
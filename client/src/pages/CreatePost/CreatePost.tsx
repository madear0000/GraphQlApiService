import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_POST } from '../../api/mutations';
import './CreatePost.css';

export function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      navigate('/posts');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const authorId = parseInt(localStorage.getItem('userId') || '1');
    
    createPost({
      variables: {
        authorId: authorId,
        title: title,
        body: content
      }
    });
  };

  return (
    <div className="create-post-page">
      <h1>Новый пост</h1>
      {error && <div className="error">Ошибка: {error.message}</div>}
      <form onSubmit={handleSubmit} className="post-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Заголовок"
          required
          disabled={loading}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Содержание поста"
          required
          rows={6}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Публикация...' : 'Опубликовать'}
        </button>
      </form>
    </div>
  );
}
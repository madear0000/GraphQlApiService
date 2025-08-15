import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

export function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет вызов API для сохранения
    console.log('Создан пост:', { title, content });
    navigate('/posts');
  };

  return (
    <div className="create-post-page">
      <h1>Новый пост</h1>
      <form onSubmit={handleSubmit} className="post-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Заголовок"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Содержание поста"
          required
          rows={6}
        />
        <button type="submit">Опубликовать</button>
      </form>
    </div>
  );
}
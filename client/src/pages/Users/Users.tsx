import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../../api/queries';
import './Users.css';

export function Users() {
  const { loading, error, data } = useQuery(GET_USERS, {
    variables: { limit: 10, offset: 0 }
  });

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error.message}</div>;

  return (
    <div className="users-page">
      <h1>Пользователи</h1>
      <div className="users-grid">
        {data.users.map((user: any) => (
          <div key={user.id} className="user-card">
            <div className="user-avatar">
              <img src={user.icon} alt={user.username} />
            </div>
            <h3 className="user-name">{user.username}</h3>
            <p className="user-posts">Постов: {user.posts.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
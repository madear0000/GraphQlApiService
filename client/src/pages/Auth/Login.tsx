import React from 'react';
import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { LOGIN_USER } from '../../api/queries';
import './Auth.css';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [loginUser, { loading, error }] = useLazyQuery(LOGIN_USER, {
    onCompleted: (data) => {
      if (data.users.length > 0 && data.users[0].password === password) {
        const user = data.users[0];
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userId', user.id);
        localStorage.setItem('username', user.username);
        navigate(from, { replace: true });
      } else {
        alert('Неверные учетные данные');
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({ variables: { username } });
  };

  return (
    <div className="auth-container">
      <h1>Вход</h1>
      {error && <div className="error">Ошибка: {error.message}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Имя пользователя"
          required
          disabled={loading}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
}
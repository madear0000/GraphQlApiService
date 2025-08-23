import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет вызов API для регистрации
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/');
  };

  return (
    <div className="auth-container">
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Имя пользователя"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p className="auth-link">
        Уже есть аккаунт? <Link to="/login">Войдите</Link>
      </p>
    </div>
  );
}
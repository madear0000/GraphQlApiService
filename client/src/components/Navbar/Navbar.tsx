import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

export function Navbar() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <h1 className="logo">GraphQL Blog</h1>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Главная
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Пользователи
        </NavLink>
        <NavLink to="/posts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Посты
        </NavLink>
        
        {isAuthenticated ? (
          <>
            <NavLink to="/create-post" className="nav-link create-btn">
              + Создать пост
            </NavLink>
            <button onClick={handleLogout} className="nav-link logout-btn">
              Выйти
            </button>
          </>
        ) : (
          <NavLink to="/login" className="nav-link auth-btn">
            Войти
          </NavLink>
        )}
      </div>
    </nav>
  );
}
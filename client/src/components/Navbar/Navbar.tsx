import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export function Navbar() {
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
        <NavLink to="/create-post" className="nav-link create-btn">
          + Создать пост
        </NavLink>
      </div>
    </nav>
  );
}
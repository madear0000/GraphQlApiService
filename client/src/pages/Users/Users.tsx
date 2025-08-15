import React from 'react'
import { Link } from 'react-router-dom'
import './Users.css'

const users = [
  { id: 1, name: 'Иван Иванов', posts: 5 },
  { id: 2, name: 'Мария Петрова', posts: 12 }
]

export function Users() {
  return (
    <div className="users-page">
      <h1>Пользователи</h1>
      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-avatar">
              {user.name.charAt(0)}
            </div>
            <h3 className="user-name">{user.name}</h3>
            <p className="user-posts">Постов: {user.posts}</p>
            <Link to={`/posts?userId=${user.id}`} className="user-link">
              Посмотреть посты
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
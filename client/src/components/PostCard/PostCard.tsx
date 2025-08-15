import React from 'react'
import './PostCard.css'

type PostCardProps = {
  title: string
  content: string
  author: string
}

export function PostCard({ title, content, author }: PostCardProps) {
  return (
    <div className="post-card">
      <h3 className="post-title">{title}</h3>
      <div className="post-author">Автор: {author}</div>
      <p className="post-content">{content}</p>
    </div>
  )
}
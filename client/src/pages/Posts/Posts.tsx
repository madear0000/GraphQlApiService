import React from 'react';
import { useState } from 'react';
import { PostCard } from '../../components/PostCard/PostCard';
import './Posts.css';

type Comment = {
  id: number;
  text: string;
  author: string;
};

type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  comments: Comment[];
};

export function Posts() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: 'Пример поста',
      content: 'Это содержимое первого поста...',
      author: 'Иван Иванов',
      comments: [
        { id: 1, text: 'Отличный пост!', author: 'Мария' },
      ],
    },
  ]);

  const [newComment, setNewComment] = useState('');

  const addComment = (postId: number) => {
    if (!newComment.trim()) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now(),
              text: newComment,
              author: 'Текущий пользователь',
            },
          ],
        };
      }
      return post;
    }));
    
    setNewComment('');
  };

  return (
    <div className="posts-page">
      <h1>Все посты</h1>
      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-container">
            <PostCard 
              title={post.title}
              content={post.content}
              author={post.author}
            />
            <div className="comments-section">
              <h3>Комментарии ({post.comments.length})</h3>
              <div className="comment-list">
                {post.comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <strong>{comment.author}:</strong> {comment.text}
                  </div>
                ))}
              </div>
              <div className="add-comment">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Добавить комментарий..."
                />
                <button onClick={() => addComment(post.id)}>
                  Отправить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
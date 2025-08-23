import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { LIKE_POST, UNLIKE_POST, CREATE_COMMENT } from '../../graphql/mutations';
import { Post, Comment } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { Heart, MessageCircle, Send } from 'lucide-react';
import Button from '../common/Button';
import { formatDate } from '../../utils/helpers';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuthStore();
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(
    post.likes?.some(like => like.author?.id === user?.id) || false
  );

  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const [createComment] = useMutation(CREATE_COMMENT, {
    update(cache, { data: { createComment: newComment } }) {
      cache.modify({
        id: cache.identify(post),
        fields: {
          comments(existingComments = []) {
            return [...existingComments, newComment];
          },
        },
      });
    },
  });

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikePost({ variables: { postId: post.id } });
        setIsLiked(false);
      } else {
        await likePost({ variables: { postId: post.id } });
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await createComment({
        variables: {
          postId: post.id,
          text: commentText.trim()
        }
      });
      setCommentText('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={post.author?.icon}
          alt={post.author?.username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold">{post.author?.username}</h3>
          <p className="text-gray-500 text-sm">
            {post.createdAt && formatDate(post.createdAt)}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-3">{post.title}</h2>
      <p className="text-gray-700 mb-4">{post.body}</p>

      <div className="flex items-center space-x-6 text-gray-600 mb-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 transition-colors ${
            isLiked ? 'text-red-500' : 'hover:text-red-500'
          }`}
        >
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{post.likes?.length || 0}</span>
        </button>
        <div className="flex items-center space-x-1">
          <MessageCircle size={20} />
          <span>{post.comments?.length || 0}</span>
        </div>
      </div>

      {/* Comments section */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Comments</h4>
        <div className="space-y-3 mb-4">
          {post.comments?.map((comment: Comment) => (
            <div key={comment.id} className="flex items-start space-x-3">
              <img
                src={comment.author?.icon}
                alt={comment.author?.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="font-semibold text-sm">{comment.author?.username}</p>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  {comment.createdAt && formatDate(comment.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleComment} className="flex space-x-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button type="submit" className="px-3">
            <Send size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PostCard;
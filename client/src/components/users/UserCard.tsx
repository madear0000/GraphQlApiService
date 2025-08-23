import React from 'react';
import { User } from '../../types';
import { MessageSquare, User as UserIcon } from 'lucide-react';

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={user.icon}
          alt={user.username}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-lg">{user.username}</h3>
          <p className="text-gray-500 text-sm">User ID: {user.id}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-gray-600">
        <div className="flex items-center space-x-1">
          <MessageSquare size={16} />
          <span>{user.posts?.length || 0} posts</span>
        </div>
        <div className="flex items-center space-x-1">
          <UserIcon size={16} />
          <span>{user.isAdmin ? 'Admin' : 'User'}</span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
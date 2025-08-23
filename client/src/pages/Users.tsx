import React from 'react';
import UserList from '../components/users/UserList';

const Users: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Users</h1>
      <p className="text-gray-600">Browse all registered users and their activity</p>
      <UserList />
    </div>
  );
};

export default Users;
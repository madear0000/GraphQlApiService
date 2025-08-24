import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_USERS } from '../../graphql/queries';
import { User } from '../../types';
import UserCard from './UserCard';
import LoadingSpinner from '../common/LoadingSpinner';

const UserList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_USERS, {
    variables: { limit: 50 }
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.users.map((user: User) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserList;
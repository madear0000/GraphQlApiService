import { useQuery } from '@apollo/client/react';
import { GET_USERS } from '../graphql/queries';
import { User } from '../types';

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useUsers = (limit: number = 50): UseUsersResult => {
  const { loading, error, data, refetch } = useQuery(GET_USERS, {
    variables: { limit },
    fetchPolicy: 'cache-and-network'
  });

  return {
    users: data?.users || [],
    loading,
    error,
    refetch
  };
};
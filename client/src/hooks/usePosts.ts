import { useQuery } from '@apollo/client/react';
import { GET_POSTS } from '../graphql/queries';
import { Post, QueryResponse } from '../types';

interface UsePostsResult {
  posts: Post[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const usePosts = (limit: number = 20): UsePostsResult => {
  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    variables: { limit },
    fetchPolicy: 'cache-and-network'
  });

  return {
    posts: data?.posts || [],
    loading,
    error,
    refetch
  };
};
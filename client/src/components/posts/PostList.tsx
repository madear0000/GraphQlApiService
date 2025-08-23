import React from 'react';
import { useQuery } from '@apollo/client/react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { GET_POSTS } from '../../graphql/queries';
import { Post } from '../../types';
import PostCard from './PostCard';

const PostList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_POSTS, {
    variables: { limit: 20 }
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        Error loading posts: {error.message}
      </Alert>
    );
  }

  return (
    <Row>
      {data.posts.map((post: Post) => (
        <Col key={post.id} lg={8} className="mx-auto mb-4">
          <PostCard post={post} />
        </Col>
      ))}
    </Row>
  );
};

export default PostList;
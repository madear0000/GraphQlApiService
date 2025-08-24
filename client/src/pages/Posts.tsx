import React, { useState } from 'react';
import { Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import PostList from '../components/posts/PostList';
import CreatePost from '../components/posts/CreatePost';
import { Plus } from 'lucide-react';

const Posts: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div>
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="h2 fw-bold">Posts</h1>
          <p className="text-muted mb-0">Browse and interact with community posts</p>
        </Col>
        <Col xs="auto">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="d-flex align-items-center gap-2"
          >
            <Plus size={18} />
            Create Post
          </Button>
        </Col>
      </Row>

      <PostList />

      <CreatePost
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onPostCreated={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default Posts;
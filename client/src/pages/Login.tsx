import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Alert } from 'react-bootstrap';
import LoginForm from '../components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <Row className="justify-content-center">
      <Col md={6} lg={5}>
        <Card className="shadow border-0">
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-primary">Welcome Back</h2>
              <p className="text-muted">Sign in to your account</p>
            </div>
            
            <LoginForm />
            
            <div className="text-center mt-4">
              <p className="text-muted">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary text-decoration-none fw-semibold">
                  Register here
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
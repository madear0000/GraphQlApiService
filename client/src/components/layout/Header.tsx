import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Image } from 'react-bootstrap';
import { useAuthStore } from '../../store/authStore';
import { LogOut, User, Home, Users, FileText, Plus } from 'lucide-react';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm mb-4" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-3">
          <span className="bg-primary text-white rounded px-2 py-1 me-2">G</span>
          GraphQL Blog
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {isAuthenticated && (
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/"
                className={`d-flex align-items-center gap-1 ${
                  location.pathname === '/' ? 'active text-primary fw-semibold' : 'text-secondary'
                }`}
              >
                <Home size={18} />
                Dashboard
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/users"
                className={`d-flex align-items-center gap-1 ${
                  location.pathname === '/users' ? 'active text-primary fw-semibold' : 'text-secondary'
                }`}
              >
                <Users size={18} />
                Users
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/posts"
                className={`d-flex align-items-center gap-1 ${
                  location.pathname === '/posts' ? 'active text-primary fw-semibold' : 'text-secondary'
                }`}
              >
                <FileText size={18} />
                Posts
              </Nav.Link>
            </Nav>
          )}

          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <Button
                  as={Link}
                  to="/posts"
                  variant="primary"
                  size="sm"
                  className="me-2 d-flex align-items-center gap-1"
                >
                  <Plus size={16} />
                  New Post
                </Button>
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center gap-2 bg-light rounded-pill px-2 py-1">
                    <Image
                      src={user?.icon}
                      alt={user?.username}
                      roundedCircle
                      width={32}
                      height={32}
                      className="border"
                    />
                    <span className="text-dark fw-medium d-none d-md-block">
                      {user?.username}
                    </span>
                  </div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={logout}
                    className="d-flex align-items-center gap-1"
                  >
                    <LogOut size={16} />
                    <span className="d-none d-md-block">Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="d-flex gap-2">
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-primary"
                  size="sm"
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  size="sm"
                >
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { LOGIN } from '../../graphql/mutations';
import { LoginData } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { validateLogin } from '../../utils/validation';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<LoginData>({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<LoginData>>({});
  const [showError, setShowError] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const [loginMutation, { loading, error }] = useMutation(LOGIN);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setShowError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateLogin(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const { data } = await loginMutation({
        variables: formData
      });

      if (data.login) {
        login(data.login.token, data.login.user);
        onSuccess?.();
      }
    } catch (err) {
      setShowError(true);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && showError && (
        <Alert variant="danger" className="mb-3">
          {error.message}
        </Alert>
      )}
      
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          isInvalid={!!errors.username}
          placeholder="Enter your username"
          required
        />
        <Form.Control.Feedback type="invalid">
          {errors.username}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          isInvalid={!!errors.password}
          placeholder="Enter your password"
          required
        />
        <Form.Control.Feedback type="invalid">
          {errors.password}
        </Form.Control.Feedback>
      </Form.Group>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-100"
        disabled={loading}
      >
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </Form>
  );
};

export default LoginForm;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
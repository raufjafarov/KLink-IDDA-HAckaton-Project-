
import React from 'react';
import { Navigate } from 'react-router-dom';
import { checkAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!checkAuth()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

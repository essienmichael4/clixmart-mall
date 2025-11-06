import React from 'react';
import { Navigate } from 'react-router-dom';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  // This is a placeholder for your actual authentication logic.
  // You would typically check for a token in localStorage, a user context, etc.
  const isAuthenticated = localStorage.getItem('authToken') !== null; // Example check

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

interface ProtectedRouteProps {   // creating the props interface for the ProtectedRoute component. It expects a single prop called children, which is of type React.JSX.Element. This means that the component will receive a React element as its child, which it will render if the user is authenticated.
  children: React.JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Kick unauthenticated users back to login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextType } from './AuthContext';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);  // Taking the context value from the AuthContext using the useContext hook. This allows us to access the authentication state and functions defined in the AuthProvider component.
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


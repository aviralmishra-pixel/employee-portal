import React from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-600">
        Binmile Employee Portal
      </div>
      
      {/* Top Right User Detail Block */}
      {user && (
        <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500">@{user.userId}</p>
          </div>
          <div className="h-8 w-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <button 
            onClick={handleLogout}
            className="ml-4 text-sm bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
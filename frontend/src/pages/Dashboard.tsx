import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto p-8">
        <div className="relative">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">
              You are currently logged into the <span className="font-bold text-blue-600">{user?.department}</span> department workspace.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
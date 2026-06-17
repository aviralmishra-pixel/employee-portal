import React from 'react';
import { Link } from 'react-router-dom'; // <-- 1. IMPORT ADDED HERE
import Navbar from '../components/Navbar';
import { useAuth } from '../context/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
        
        <div className="relative bg-white rounded-xl border-gray-100 p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Welcome Back {user?.name} !!
            </h1>
            <p className="text-gray-600 text-center">
              You are currently logged into the <span className="font-bold text-blue-600">{user?.department}</span> department workspace.
            </p>
          </div>
        </div>

        <main className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <Link to="/profile" className="text-xl font-semibold text-gray-800 hover:text-blue-600 block mb-2 text-left">
                Profile Overview &rarr;
              </Link>
              <p className="text-gray-600">View and update your personal information.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <Link to="/department-resources" className="text-xl font-semibold text-gray-800 hover:text-blue-600 block mb-2 text-left">
                Department Resources &rarr;
              </Link>
              <p className="text-gray-600">Access tools and documents relevant to your department.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <button className="text-xl font-semibold text-gray-800 mb-2">Company Announcements</button>
              <p className="text-gray-600">Stay updated with the latest news and updates from the company.</p>
            </div>
          </div>
        </main>
    </div>
  );
};

export default Dashboard;
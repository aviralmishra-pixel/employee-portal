import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/useAuth';
import { Link } from 'react-router-dom';

const ProfileOverview: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
 
      <main className="max-w-4xl mx-auto p-8">
        
        {/* Navigation placeholder - we will activate this in the next phase */}
        <div className="mb-6">
         <Link to="/dashboard" className="text-sm font-medium text-yellow-600 hover:text-blue-800 flex items-center gap-1">
          ← Back to Dashboard
         </Link>
        </div>

        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          
          <div className="h-32 bg-gray-200"></div>

          <div className="p-8 relative">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              {user?.name || 'Employee Profile'}
            </h1>
            <p className="text-black font-medium mb-6">
              {user?.department || 'General'} Department Workspace
            </p>

            <hr className="border-gray-100 mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Full Name
                </label>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-700 font-medium">
                  {user?.name || 'N/A'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Assigned Department
                </label>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-700 font-medium">
                  {user?.department || 'N/A'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Account Status
                </label>
                <div>
                  <span className="inline-block p-2 bg-green-50 text-green-700 rounded-lg font-medium text-sm px-4">
                    Active
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action Button Placeholder */}
            <div className="mt-8 flex justify-end">
              <button className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg shadow-sm transition-colors text-sm">
                Edit Profile Details
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileOverview;
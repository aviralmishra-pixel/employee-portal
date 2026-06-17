import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AxiosError } from 'axios';

const Register: React.FC = () => { 
  const [formData, setFormData] = useState({ name: '', userId: '', department: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Mapping userId to username to match your backend auth controller setup
      await api.post('/register', { 
        name: formData.name, 
        username: formData.userId, 
        department: formData.department, 
        password: formData.password 
      });
      navigate('/login');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>
      console.log(error);
      setError(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Register New Employee</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input type="text" placeholder="Full Name" className="border p-2 rounded"
            onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <input type="text" placeholder="User ID (Username)" className="border p-2 rounded"
            onChange={(e) => setFormData({...formData, userId: e.target.value})} required />
          <input type="text" placeholder="Department" className="border p-2 rounded"
            onChange={(e) => setFormData({...formData, department: e.target.value})} required />
          <input type="password" placeholder="Password" className="border p-2 rounded"
            onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <button type="submit" className="bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700">
            Create Account
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
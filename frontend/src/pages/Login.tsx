import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../services/api';
import { AxiosError } from 'axios';

const Login: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username: userId, password });
      const { token, employee } = response.data;
      login(token, {
        name: employee.name,
        userId: employee.username,
        department: employee.department,
      });
      navigate('/dashboard');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Employee Login</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="User ID (Username)" 
            className="border p-2 rounded focus:outline-blue-500"
            value={userId} 
            onChange={(e) => setUserId(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="border p-2 rounded focus:outline-blue-500"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition-colors">
            Sign In
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-600">
          No account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
        </p>
      </div>
    </div> 
  );
};

export default Login;
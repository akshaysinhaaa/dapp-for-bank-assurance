import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building2, Users, AlertCircle } from 'lucide-react';
import { authenticateEmployee } from '../data/employees';
import { useAuth } from '../context/AuthContext';

interface AdminLoginProps {
  type: 'insurance' | 'bank';
}

function AdminLogin({ type }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = authenticateEmployee(username, password);
    
    if (employee && employee.role === type) {
      login(employee);
      if (type === 'insurance') {
        navigate('/insurance-dashboard');
      } else {
        navigate('/bank-dashboard');
      }
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const getIcon = () => {
    return type === 'insurance' ? (
      <Building2 className="h-12 w-12 text-blue-600" />
    ) : (
      <Users className="h-12 w-12 text-blue-600" />
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          {getIcon()}
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {type === 'insurance' ? 'Insurance Company Login' : 'Bank Employee Login'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {type === 'insurance' 
              ? 'Access your insurance company dashboard'
              : 'Access your bank employee dashboard'
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Demo Credentials:
          </p>
          <p className="text-xs text-gray-500">
            {type === 'insurance' ? 'Username: insurance_admin1 / Password: ins123' : 'Username: bank_admin1 / Password: bank123'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
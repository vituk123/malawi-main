import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/core/Input';
import Button from '../../components/core/Button';
import { signIn } from '../../services/api'; // Assuming you'll add this function

const SignInPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await signIn(username, password);
      console.log('Sign-in successful:', response);
      // Handle successful login, e.g., store token, redirect
      navigate('/'); // Redirect to home page or dashboard
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sign-in failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              id="username"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
        <p className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;

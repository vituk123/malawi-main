import React from 'react';
import { useForm } from 'react-hook-form';
import api, { signIn } from '../../services/api';
import useAuthStore from '../../store/authStore';
import Input from '../core/Input';
import Button from '../core/Button';

const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const setAuth = useAuthStore((state) => state.setAuth);

  const onSubmit = async (data: any) => {
    try {
      const response = await signIn(data.username, data.password);
      setAuth(response.data.accessToken, response.data.refreshToken, response.data.id, response.data.username, response.data.email, response.data.roles);
      // Optionally redirect or show success message
      alert('Login successful!');
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      alert(`Login failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Login</h2>
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Username</label>
        <Input
          id="username"
          type="text"
          {...register('username', { required: true })}
          hasError={!!errors.username}
          placeholder="Enter your username"
        />
        {errors.username && <span className="text-red-500 text-xs mt-1">Username is required</span>}
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Password</label>
        <Input
          id="password"
          type="password"
          {...register('password', { required: true })}
          hasError={!!errors.password}
          placeholder="Enter your password"
        />
        {errors.password && <span className="text-red-500 text-xs mt-1">Password is required</span>}
      </div>
      <Button type="submit" className="w-full" variant="primary">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;

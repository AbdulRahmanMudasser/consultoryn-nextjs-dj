'use client';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { login, register, logout, forgotPassword, resetPassword } from '../lib/api/authApi';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const clearMessages = () => {
    setAuthError(null);
    setAuthSuccess(null);
  };

  const handleLogin = async (credentials) => {
    clearMessages();
    try {
      const data = await login(credentials);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setAuthSuccess('Login successful!');
      router.push('/dashboard');
    } catch (error) {
      setAuthError(error.response?.data?.error || 'Login failed');
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    clearMessages();
    try {
      const data = await register(userData);
      setAuthSuccess(data.message || 'Registration successful!');
      router.push('/login');
    } catch (error) {
      setAuthError(error.response?.data?.error || 'Registration failed');
      throw error;
    }
  };

  const handleLogout = async () => {
    clearMessages();
    try {
      await logout(token);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      setToken(null);
      setUser(null);
      queryClient.clear();
      router.push('/login');
    }
  };

  const handleForgotPassword = async (email) => {
    clearMessages();
    try {
      const data = await forgotPassword(email);
      setAuthSuccess(data.message || 'Password reset email sent!');
    } catch (error) {
      setAuthError(error.response?.data?.error || 'Forgot password failed');
      throw error;
    }
  };

  const handleResetPassword = async (data) => {
    clearMessages();
    try {
      const response = await resetPassword(data);
      setAuthSuccess(response.message || 'Password reset successful!');
      router.push('/login');
    } catch (error) {
      setAuthError(error.response?.data?.error || 'Reset password failed');
      throw error;
    }
  };

  return {
    user,
    token,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    authError,
    authSuccess,
    clearMessages,
    isAuthenticated: !!token,
  };
};
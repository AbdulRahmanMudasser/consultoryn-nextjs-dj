import axios from 'axios';

const authApi = axios.create({
  baseURL: '/api/auth',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export const login = async (credentials) => {
  try {
    const response = await authApi.post('/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login API error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack,
    });
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await authApi.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Register API error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack,
    });
    throw error;
  }
};

export const logout = async (token) => {
  try {
    const response = await authApi.post('/logout', { token });
    return response.data;
  } catch (error) {
    console.error('Logout API error:', {
      message: error.message,
      status: error.response?.status,
      stack: error.stack,
    });
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await authApi.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Forgot password API error:', {
      message: error.message,
      status: error.response?.status,
      stack: error.stack,
    });
    throw error;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await authApi.post('/reset-password', data);
    return response.data;
  } catch (error) {
    console.error('Reset password API error:', {
      message: error.message,
      status: error.response?.status,
      stack: error.stack,
    });
    throw error;
  }
};
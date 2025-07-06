
'use client';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion } from 'framer-motion';

export default function AuthForm({ type, token }) {
  const { login, register, authError, authSuccess } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    role: 'client',
    token: token || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === 'login') {
        await login({ email: formData.email, password: formData.password });
      } else if (type === 'signup') {
        await register({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          role: formData.role,
        });
      } else if (type === 'forgot-password') {
        await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        }).then((res) => res.json());
      } else if (type === 'reset-password') {
        await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: formData.token,
            password: formData.password,
            confirm_password: formData.confirmPassword,
          }),
        }).then((res) => res.json());
      }
    } catch (err) {
      // Error handled by useAuth
    }
  };

  return (
    <Card className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border border-[rgb(var(--gold))]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[rgb(var(--navy))]">
          {type === 'signup' && 'Sign Up'}
          {type === 'login' && 'Login'}
          {type === 'forgot-password' && 'Reset Password'}
          {type === 'reset-password' && 'Set New Password'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {(type === 'signup' || type === 'login' || type === 'forgot-password') && (
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-[rgb(var(--navy))] focus:ring-[rgb(var(--gold))]"
              />
            </div>
          )}
          {type === 'signup' && (
            <div>
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="border-[rgb(var(--navy))] focus:ring-[rgb(var(--gold))]"
              />
            </div>
          )}
          {(type === 'signup' || type === 'login' || type === 'reset-password') && (
            <div>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="border-[rgb(var(--navy))] focus:ring-[rgb(var(--gold))]"
              />
            </div>
          )}
          {(type === 'signup' || type === 'reset-password') && (
            <div>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="border-[rgb(var(--navy))] focus:ring-[rgb(var(--gold))]"
              />
            </div>
          )}
          {type === 'signup' && (
            <div>
              <Select onValueChange={handleRoleChange} defaultValue="client">
                <SelectTrigger className="border-[rgb(var(--navy))] focus:ring-[rgb(var(--gold))]">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="consultant">Consultant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {authError && <p className="text-red-500">{authError}</p>}
          {authSuccess && <p className="text-green-500">{authSuccess}</p>}
          <Button
            type="submit"
            className="w-full bg-[rgb(var(--navy))] text-white hover:bg-[rgb(var(--gold))] hover:text-[rgb(var(--navy))]"
          >
            {type === 'signup' && 'Create Account'}
            {type === 'login' && 'Login'}
            {type === 'forgot-password' && 'Send Reset Link'}
            {type === 'reset-password' && 'Reset Password'}
          </Button>
        </motion.form>
        {(type === 'login' || type === 'signup') && (
          <div className="mt-4 text-center">
            {type === 'login' && (
              <p>
                Don’t have an account?{' '}
                <a href="/signup" className="text-[rgb(var(--gold))] hover:underline">
                  Sign Up
                </a>
              </p>
            )}
            {type === 'signup' && (
              <p>
                Already have an account?{' '}
                <a href="/login" className="text-[rgb(var(--gold))] hover:underline">
                  Login
                </a>
              </p>
            )}
            {type === 'login' && (
              <p className="mt-2">
                <a href="/forgot-password" className="text-[rgb(var(--gold))] hover:underline">
                  Forgot Password?
                </a>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
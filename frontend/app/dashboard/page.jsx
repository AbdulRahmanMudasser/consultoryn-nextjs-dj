'use client';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // useAuth redirects to /login
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--platinum))]">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full border border-[rgb(var(--gold))]">
        <h1 className="text-2xl font-bold mb-6 text-[rgb(var(--navy))]">Welcome to Your Dashboard</h1>
        <p className="mb-4">Hello, {user?.username || 'User'}! You are logged in to Consultoryn.</p>
        <Button
          onClick={logout}
          className="w-full bg-[rgb(var(--navy))] text-white hover:bg-[rgb(var(--gold))] hover:text-[rgb(var(--navy))]"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
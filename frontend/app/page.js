'use client';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; // Redirecting to dashboard
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-[rgb(var(--platinum))] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full border border-[rgb(var(--gold))]">
        <h1 className="text-3xl font-bold mb-6 text-[rgb(var(--navy))] text-center">Welcome to Consultoryn</h1>
        <p className="mb-6 text-[rgb(var(--navy))] text-center">
          A premium consultation platform connecting clients and consultants with elegance and efficiency.
        </p>
        <div className="flex flex-col space-y-4">
          <Button
            asChild
            className="w-full bg-[rgb(var(--navy))] text-white hover:bg-[rgb(var(--gold))] hover:text-[rgb(var(--navy))]"
          >
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full border-[rgb(var(--navy))] text-[rgb(var(--navy))] hover:bg-[rgb(var(--gold))] hover:text-[rgb(var(--navy))]"
          >
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
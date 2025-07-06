'use client';
import AuthForm from '../../../components/AuthForm';
import AnimatedSVG from '../../../components/AnimatedSVG';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const { token } = useParams();
  return (
    <motion.div
      className="min-h-screen flex flex-col lg:flex-row"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="hidden lg:flex w-full lg:w-1/2 bg-[rgb(var(--navy))] items-center justify-center">
        <AnimatedSVG />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <AuthForm type="reset-password" token={token} />
      </div>
    </motion.div>
  );
}
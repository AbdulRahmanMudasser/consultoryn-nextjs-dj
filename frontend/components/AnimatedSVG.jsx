'use client';
import { motion } from 'framer-motion';

export default function AnimatedSVG() {
  return (
    <motion.svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      initial={{ scale: 0.8, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
    >
      <circle cx="150" cy="150" r="100" fill="none" stroke="[rgb(var(--gold))]" strokeWidth="8" />
      <path
        d="M100 200 Q150 100 200 200"
        fill="none"
        stroke="[rgb(var(--platinum))]"
        strokeWidth="6"
      />
      <circle cx="150" cy="150" r="20" fill="[rgb(var(--gold))]" />
    </motion.svg>
  );
}
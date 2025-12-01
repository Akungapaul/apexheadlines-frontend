import React from 'react';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { motion } from 'framer-motion';

export const ReadingProgressBar: React.FC = () => {
  const progress = useReadingProgress();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary-600 origin-left z-50"
      style={{ scaleX: progress / 100 }}
      initial={{ scaleX: 0 }}
      transition={{ duration: 0.1 }}
    />
  );
};

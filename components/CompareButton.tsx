import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';
import { ArrowRight } from 'lucide-react';

interface CompareButtonProps {
  onClick: () => void;
}

export const CompareButton: React.FC<CompareButtonProps> = ({ onClick }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Button
      onClick={onClick}
      className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg"
    >
      <span className="flex items-center gap-2 text-white">
        Compare
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowRight className="w-4 h-4" />
        </motion.span>
      </span>
    </Button>
  </motion.div>
);

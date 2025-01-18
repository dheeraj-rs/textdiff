import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CompareButtonProps } from '@/types';

export const CompareButton: React.FC<CompareButtonProps> = ({ onClick,isDisabled }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <motion.button
      onClick={onClick}
      className={`w-full sm:w-auto mx-auto px-8 lg:px-36 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-200 ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-0.5 transform'
      }`}
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      disabled={isDisabled}>
      <span className="flex items-center gap-2 text-white">
      Compare Texts
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowRight className="w-4 h-4" />
        </motion.span>
      </span>
    </motion.button>
  </motion.div>
);

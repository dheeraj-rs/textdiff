import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ComparisonLine as ComparisonLineType } from '../types/comparison';

interface ComparisonLineProps {
  line: ComparisonLineType;
  index: number;
}

export const ComparisonLine: React.FC<ComparisonLineProps> = ({ line, index }) => {
  const baseClassName = "py-2 font-mono whitespace-pre relative group flex";
  const lineNumberClass = "select-none w-12 text-xs text-gray-400 border-r border-gray-200 pr-2 text-right mr-3 flex-shrink-0";
  const contentClass = "flex-1 relative";

  const getTypeProps = (type: ComparisonLineType['type']) => {
    switch (type) {
      case 'missing':
        return {
          className: "bg-red-50 border-l-4 border-red-500",
          label: "Removed line",
          tooltipColor: "bg-red-800"
        };
      case 'extra':
        return {
          className: "bg-green-50 border-l-4 border-green-500",
          label: "Added line",
          tooltipColor: "bg-green-800"
        };
      case 'different':
        return {
          className: "bg-yellow-50 border-l-4 border-yellow-500",
          label: "Modified line",
          tooltipColor: "bg-yellow-800"
        };
      default:
        return {
          className: "hover:bg-gray-50/30",
          label: "",
          tooltipColor: ""
        };
    }
  };

  const { className: typeClass, label, tooltipColor } = getTypeProps(line.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: line.type === 'extra' ? 20 : 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseClassName} ${typeClass}`}
    >
      <span className={lineNumberClass}>
        {index + 1}
        {line.type !== 'matched' && (
          <ChevronRight className="inline-block w-3 h-3 ml-1 text-gray-400" />
        )}
      </span>
      <div className={contentClass}>
        <AnimatePresence>
          {label && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute invisible group-hover:visible -top-8 left-12 ${tooltipColor} text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg`}
            >
              {label}
              <div className={`absolute -bottom-1 left-4 w-2 h-2 ${tooltipColor} transform rotate-45`} />
            </motion.div>
          )}
        </AnimatePresence>
        {line.isHtml ? (
          <div dangerouslySetInnerHTML={{ __html: line.text }} />
        ) : (
          line.text
        )}
      </div>
    </motion.div>
  );
};
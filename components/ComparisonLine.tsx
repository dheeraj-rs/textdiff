import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { ComparisonLine as ComparisonLineType } from '../types/comparison';

interface ComparisonLineProps {
  line: ComparisonLineType;
  index: number;
  onLineClick: () => void;
  onTextSelect: () => void;
  isCopied: boolean;
}

export const ComparisonLine: React.FC<ComparisonLineProps> = ({
  line,
  index,
  onLineClick,
  isCopied
}) => {
  const [selectedText, setSelectedText] = useState<string>('');
  const isSelecting = useRef(false);
  const mouseDownTime = useRef<number>(0);

  const handleMouseDown = () => {
    isSelecting.current = false;
    mouseDownTime.current = Date.now();
  };

  const handleMouseUp = async () => {
    const selection = window.getSelection();
    const mouseUpTime = Date.now();
    const timeDiff = mouseUpTime - mouseDownTime.current;

    if (selection && selection.toString().trim() && timeDiff > 200) {
      // User has selected text
      isSelecting.current = true;
      const selectedText = selection.toString().trim();
      setSelectedText(selectedText);
      
      try {
        await navigator.clipboard.writeText(selectedText);
        // Show copy feedback for selected text
        setTimeout(() => {
          setSelectedText('');
          selection.removeAllRanges();
        }, 1000);
      } catch (err) {
        console.error('Failed to copy selection:', err);
      }
    } else if (!isSelecting.current && line.type !== "matched") {
      // User clicked the line without selecting text
      onLineClick();
    }
  };

  const getTypeProps = (type: ComparisonLineType['type']) => {
    switch (type) {
      case 'missing':
        return {
          className: "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500",
          label: "Removed line",
          tooltipColor: "bg-red-800"
        };
      case 'extra':
        return {
          className: "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500",
          label: "Added line",
          tooltipColor: "bg-green-800"
        };
      case 'different':
        return {
          className: "bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500",
          label: "Modified line",
          tooltipColor: "bg-yellow-800"
        };
      default:
        return {
          className: "hover:bg-gray-50 dark:hover:bg-gray-800/50",
          label: "",
          tooltipColor: ""
        };
    }
  };

  const { className: typeClass, label, tooltipColor } = getTypeProps(line.type);

  return (
    <motion.div
      className={`group py-2 font-mono whitespace-pre relative flex ${typeClass} ${
        line.type !== "matched" ? "cursor-pointer hover:bg-opacity-75" : ""
      }`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Line Number */}
      <span 
        className="select-none w-12 text-xs text-gray-400 border-r border-gray-200 pr-2 text-right mr-3 flex-shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          if (line.type !== "matched") {
            onLineClick();
          }
        }}
      >
        {index + 1}
        {line.type !== 'matched' && (
          <ChevronRight className="inline-block w-3 h-3 ml-1 text-gray-400" />
        )}
      </span>

      {/* Content */}
      <div className="flex-1 relative select-text">
        {/* Tooltip for line type */}
        {label && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute invisible group-hover:visible -top-8 left-12 ${tooltipColor} text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg z-10`}
          >
            {label}
            <div className={`absolute -bottom-1 left-4 w-2 h-2 ${tooltipColor} transform rotate-45`} />
          </motion.div>
        )}

        {/* Copy Feedback */}
        {(isCopied || selectedText) && line.type !== "matched" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute -right-8 top-1/2 -translate-y-1/2 flex items-center gap-2"
          >
            <span className="text-xs text-green-500">
              {selectedText ? 'Word copied!' : 'Line copied!'}
            </span>
            <Check className="w-4 h-4 text-green-500" />
          </motion.div>
        )}

        {/* Line Content */}
        <div className={`${line.type !== "matched" ? "hover:bg-opacity-75" : ""}`}>
          {line.isHtml ? (
            <div dangerouslySetInnerHTML={{ __html: line.text }} />
          ) : (
            line.text
          )}
        </div>
      </div>
    </motion.div>
  );
};
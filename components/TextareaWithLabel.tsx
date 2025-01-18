import React from "react";
import { motion } from "framer-motion";
import { Textarea } from "./textarea";
import { ClipboardPaste, Trash2 } from "lucide-react";
import { TextareaWithLabelProps } from "@/types";

export const TextareaWithLabel: React.FC<TextareaWithLabelProps> = ({
  label,
  value,
  onChange,
  className = "",
  placeholder = "Enter text to compare...",
  onPaste,
  onClear,
}) => (
  <div className={`flex flex-col h-full space-y-4 ${className}`}>
    {/* Header Section */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
      {/* Label */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
      >
        {label}
      </motion.h3>

      {/* Buttons Container */}
      <div className="flex space-x-3">
        {/* Clear Button */}
        <motion.button
          onClick={onClear}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-sm text-gray-600 flex items-center space-x-1 border border-transparent hover:border-gray-300 dark:hover:border-gray-700 rounded-md px-2 py-1 transition-colors"
          >
          <Trash2 className="w-4 h-4" />
          <span className="font-medium">Clear</span>
        </motion.button>

        {/* Paste Button */}
        <motion.button
          onClick={onPaste}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-sm text-gray-600 flex items-center space-x-1 border border-transparent hover:border-gray-300 dark:hover:border-gray-700 rounded-md px-2 py-1 transition-colors"
          >
          <ClipboardPaste className="w-4 h-4" />
          <span className="font-medium">Paste</span>
        </motion.button>
      </div>
    </div>

    {/* Textarea Container */}
    <div className="relative flex-1 min-h-[50vh] h-full group">
      <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg opacity-30 group-hover:opacity-50 transition-opacity blur-sm" />
      <Textarea
        value={value}
        onChange={onChange}
        className="relative w-full h-full min-h-[40vh] md:min-h-[60vh] rounded-lg font-mono bg-white dark:bg-gray-900 shadow-sm resize-none p-4"
        placeholder={placeholder}
        aria-label={label}
      />
    </div>
  </div>
);
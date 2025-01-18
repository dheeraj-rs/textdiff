import React from "react";
import { motion } from "framer-motion";
import { Textarea } from "./textarea";

interface TextareaWithLabelProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  placeholder?: string;
}

export const TextareaWithLabel: React.FC<TextareaWithLabelProps> = ({
  label,
  value,
  onChange,
  className = "",
  placeholder = "Enter text to compare...",
}) => (
  <div className={`textarea-with-label flex flex-col h-full ${className}`}>
    <motion.h3
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="animate-gradient"
    >
      {label}
    </motion.h3>
    <div className="textarea-container group flex-1 min-h-[40vh] md:min-h-[60vh]">
      <div className="gradient-overlay" />
      <Textarea
        value={value}
        onChange={onChange}
        className={`textarea w-full h-full min-h-[40vh] md:min-h-[60vh] ${className}`}
        placeholder={placeholder}
        aria-label={label}
      />
    </div>
  </div>
);
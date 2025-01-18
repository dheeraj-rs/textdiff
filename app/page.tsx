"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextareaWithLabel } from "../components/TextareaWithLabel";
import { ComparisonSection } from "../components/ComparisonSection";
import { CompareButton } from "../components/CompareButton";
import { compareLines, formatJSON } from "../lib/text-comparison";
import { ComparisonResult } from "../types/comparison";

const TextComparison: React.FC = () => {
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");
  const [comparison, setComparison] = useState<ComparisonResult>({
    left: [],
    right: [],
  });
  const [showComparison, setShowComparison] = useState(false);

  const compareTexts = () => {
    try {
      const formattedLeftText = formatJSON(leftText);
      const formattedRightText = formatJSON(rightText);

      const leftLines = formattedLeftText.split("\n");
      const rightLines = formattedRightText.split("\n");

      const result = compareLines(leftLines, rightLines);
      setComparison(result);
      setShowComparison(true); // Show comparison section
    } catch (error) {
      console.error("Error comparing texts:", error);
    }
  };

  const handleBack = () => {
    setShowComparison(false); // Show textarea sections
  };

  return (
    <div className="w-full mx-auto p-8 space-y-8">
      {/* Header Section (Only shown when !showComparison) */}
      <AnimatePresence>
        {!showComparison && (
          <motion.header
            key="header"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
              Text Compare!
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Compare and analyze text differences with ease.
            </p>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {!showComparison ? (
          <motion.div
            key="textareas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="space-y-8"
          >
            <div className="grid grid-cols-2 gap-8">
              <TextareaWithLabel
                label="Original Text"
                value={leftText}
                onChange={(e) => setLeftText(e.target.value)}
              />
              <TextareaWithLabel
                label="Modified Text"
                value={rightText}
                onChange={(e) => setRightText(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <CompareButton onClick={compareTexts} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="space-y-8"
          >
            {/* Back Button */}
            <div className="flex justify-end">
              <button
                onClick={handleBack}
                className="back-button"
              >
                Back
              </button>
            </div>

            {/* Comparison Sections */}
            <div className="grid grid-cols-2 gap-8">
              <ComparisonSection
                title="Original Version"
                lines={comparison.left}
              />
              <ComparisonSection
                title="Modified Version"
                lines={comparison.right}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TextComparison;
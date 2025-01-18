"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextareaWithLabel } from "../components/TextareaWithLabel";
import { ComparisonSection } from "../components/ComparisonSection";
import { CompareButton } from "../components/CompareButton";
import { compareLines, formatText } from "../lib/text-comparison";
import { ComparisonResult } from "../types";
import { ComparisonHeader } from "@/components/ComparisonHeader";

const TextComparison: React.FC = () => {
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");
  const [comparison, setComparison] = useState<ComparisonResult>({
    left: [],
    right: [],
  });
  const [showComparison, setShowComparison] = useState(false);
  const [showOnlyChanges, setShowOnlyChanges] = useState(false);
  const [formatType, setFormatType] = useState("auto");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(false);

  const handlePaste = async (
    setText: React.Dispatch<React.SetStateAction<string>>
  ) => {
    try {
      const text = await navigator.clipboard.readText();
      setText(text);
    } catch (error) {
      console.error("Failed to paste:", error);
    }
  };

  const handleClear = (
    setText: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setText("");
  };

  const handleBack = () => {
    setShowComparison(false);
  };

  const compareTexts = React.useCallback(() => {
    try {
      let processedLeftText = leftText;
      let processedRightText = rightText;
      // Apply formatting
      if (formatType !== "none") {
        processedLeftText = formatText(processedLeftText, formatType);
        processedRightText = formatText(processedRightText, formatType);
      }
      // Apply case sensitivity
      if (!caseSensitive) {
        processedLeftText = processedLeftText.toLowerCase();
        processedRightText = processedRightText.toLowerCase();
      }
      // Apply whitespace trimming
      if (trimWhitespace) {
        processedLeftText = processedLeftText
          .split("\n")
          .map((line) => line.trim())
          .join("\n");
        processedRightText = processedRightText
          .split("\n")
          .map((line) => line.trim())
          .join("\n");
      }
      const leftLines = processedLeftText.split("\n");
      const rightLines = processedRightText.split("\n");
      const result = compareLines(leftLines, rightLines);
      setComparison(result);
      setShowComparison(true);
    } catch (error) {
      console.error("Error comparing texts:", error);
    }
  }, [leftText, rightText, formatType, caseSensitive, trimWhitespace]);

  // Update comparison when format settings change
  React.useEffect(() => {
    if (showComparison && (leftText || rightText)) {
      compareTexts();
    }
  }, [
    formatType,
    caseSensitive,
    trimWhitespace,
    compareTexts,
    leftText,
    rightText,
    showComparison,
  ]);

  return (
    <div className="w-full mx-auto p-4 space-y-8">
      {/* Header Section) */}
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

      <AnimatePresence>
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
                onPaste={() => handlePaste(setLeftText)}
                onClear={() => handleClear(setLeftText)}
              />
              <TextareaWithLabel
                label="Modified Text"
                value={rightText}
                onChange={(e) => setRightText(e.target.value)}
                onPaste={() => handlePaste(setRightText)}
                onClear={() => handleClear(setRightText)}
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
          >
            <ComparisonHeader
              handleBack={handleBack}
              setShowOnlyChanges={setShowOnlyChanges}
              showOnlyChanges={showOnlyChanges}
              formatType={formatType}
              caseSensitive={caseSensitive}
              trimWhitespace={trimWhitespace}
              setFormatType={setFormatType}
              setCaseSensitive={setCaseSensitive}
              setTrimWhitespace={setTrimWhitespace}
            />
            <div className="grid grid-cols-2 gap-8">
              <ComparisonSection
                title="Original Version"
                lines={comparison.left}
                showOnlyChanges={showOnlyChanges}
              />
              <ComparisonSection
                title="Modified Version"
                lines={comparison.right}
                showOnlyChanges={showOnlyChanges}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TextComparison;

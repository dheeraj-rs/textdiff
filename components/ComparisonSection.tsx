import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "./card";
import { ComparisonLine as ComparisonLineType } from "../types/comparison";
import { ComparisonLine } from "./ComparisonLine";
import { Filter } from "lucide-react";
import { Switch } from "./Switch";

interface ComparisonSectionProps {
  title: string;
  lines: ComparisonLineType[];
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  title,
  lines,
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showOnlyChanges, setShowOnlyChanges] = useState(false);
  
  // Filter lines but keep original indices
  const displayedLines = showOnlyChanges 
    ? lines.map((line, idx) => ({ ...line, originalIndex: idx }))
          .filter(line => line.type !== "matched")
    : lines.map((line, idx) => ({ ...line, originalIndex: idx }));

  const copyContent = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => {
        setCopiedText(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  // Handle line click for copying entire line
  const handleLineClick = (line: ComparisonLineType & { originalIndex: number }) => {
    copyContent(line.text);
  };

  // Handle word selection for copying selected text
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    
    const selectedText = selection.toString().trim();
    if (selectedText) {
      copyContent(selectedText);
      // Keep the selection visible
      setTimeout(() => {
        selection.removeAllRanges();
      }, 500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Title and Filter Toggle */}
      <div className="flex justify-between items-center">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
        >
          {title}
        </motion.h3>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Show Changes Only</span>
            <Switch
              checked={showOnlyChanges}
              onCheckedChange={setShowOnlyChanges}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-full p-4">
                <AnimatePresence>
                  {displayedLines.map((line) => (
                    <motion.div
                      key={line.originalIndex}
                      initial={{ opacity: 0, x: line.type !== "matched" ? -20 : 0 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ComparisonLine 
                        line={line}
                        index={line.originalIndex}
                        onLineClick={() => handleLineClick(line)}
                        onTextSelect={handleTextSelection}
                        isCopied={copiedText === line.text}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
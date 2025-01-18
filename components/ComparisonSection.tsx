import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "./card";
import { ComparisonLine as ComparisonLineType } from "../types/comparison";
import { ComparisonLine } from "./ComparisonLine";

interface ComparisonSectionProps {
  title: string;
  lines: ComparisonLineType[];
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  title,
  lines,
}) => {
  return (
    <div className="space-y-2">
      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
      >
        {title}
      </motion.h3>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-full p-4">
                <AnimatePresence>
                  {lines.map((line, idx) => (
                    <ComparisonLine key={idx} line={line} index={idx} />
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
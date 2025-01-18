import React from "react";
import { Filter, ArrowBigLeft } from "lucide-react";
import { Switch } from "./Switch";
import {
  CaseSensitive,
  AlignHorizontalJustifyCenter,
  Type,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { ComparisonHeaderProps } from "@/types";


export const ComparisonHeader: React.FC<ComparisonHeaderProps> = ({
  showOnlyChanges,
  setShowOnlyChanges,
  handleBack,
  formatType = 'auto',
  caseSensitive = true,
  trimWhitespace = false,
  setFormatType,
  setCaseSensitive,
  setTrimWhitespace,
}) => {
  const getButtonClasses = (isActive: boolean) => {
    return `text-base ${
      isActive 
        ? "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800" 
        : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
    } flex items-center gap-2 space-x-1 border rounded-md px-2 py-1 transition-all duration-200`;
  };

  return (
    <motion.div
      className="sticky top-0 py-1 flex items-center justify-end gap-5 z-50 dark:bg-gray-900/80 backdrop-blur-sm backdrop-saturate-150 rounded-b-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Select 
        value={formatType} 
        onValueChange={setFormatType}
      >
        <SelectTrigger className={`w-32 ${formatType !== 'none' ? 'border-purple-300 dark:border-purple-800' : ''}`}>
          <Type className={`w-4 h-4 mr-2 ${formatType !== 'none' ? 'text-purple-600' : ''}`} />
          <SelectValue placeholder="Format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auto">
            <span className="flex items-center gap-2">
              Auto
            </span>
          </SelectItem>
          <SelectItem value="json">
            <span className="flex items-center gap-2">
              JSON
            </span>
          </SelectItem>
          <SelectItem value="html">
            <span className="flex items-center gap-2">
              HTML
            </span>
          </SelectItem>
          <SelectItem value="sql">
            <span className="flex items-center gap-2">
              SQL
            </span>
          </SelectItem>
          <SelectItem value="none">
            <span className="flex items-center gap-2">
              Text
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <button
        onClick={() => setCaseSensitive?.(!caseSensitive)}
        className={getButtonClasses(caseSensitive)}
        title="Toggle case sensitivity"
      >
        <CaseSensitive className="w-4 h-4" />
        Case Sensitive
      </button>

      <button
        onClick={() => setTrimWhitespace?.(!trimWhitespace)}
        className={getButtonClasses(trimWhitespace)}
        title="Toggle whitespace trimming"
      >
        <AlignHorizontalJustifyCenter className="w-4 h-4" />
        Trim Whitespace
      </button>

      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <Filter className={`w-4 h-4 ${showOnlyChanges ? 'text-purple-600' : 'text-gray-500'}`} />
          <span className="text-sm text-gray-600">Show Changes Only</span>
          <Switch
            checked={showOnlyChanges}
            onCheckedChange={setShowOnlyChanges}
            className={showOnlyChanges ? 'bg-purple-600' : ''}
          />
        </div>
      </div>

      <button
        onClick={handleBack}
        className="text-base text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-1 border rounded-md px-2 py-1 transition-colors"
      >
        <ArrowBigLeft className="w-4 h-4" />
        <span>Back to Textarea</span>
      </button>
    </motion.div>
  );
};
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

interface ComparisonHeaderProps {
  showOnlyChanges: boolean;
  setShowOnlyChanges: (value: boolean) => void;
  handleBack: () => void;
  formatType?: string;
  caseSensitive?: boolean;
  trimWhitespace?: boolean;
  setFormatType: (value: string) => void;
  setCaseSensitive?: (value: boolean) => void;
  setTrimWhitespace?: (value: boolean) => void;
}

export const ComparisonHeader = ({
  showOnlyChanges,
  setShowOnlyChanges,
  handleBack,
  formatType = 'auto',
  caseSensitive = true,
  trimWhitespace = false,
  setFormatType,
  setCaseSensitive,
  setTrimWhitespace,
}: ComparisonHeaderProps) => {

  const getButtonClasses = (isActive: boolean): string => {
    return `text-base ${
      isActive 
        ? "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800" 
        : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
    } flex items-center gap-2 border rounded-md transition-all duration-200 
    sm:px-2 sm:py-1 px-1.5 py-1`;
  };

  return (
    <motion.div
      className="sticky top-0 py-1 mb-2 flex flex-wrap items-center gap-2 sm:gap-5 z-50 dark:bg-gray-900/80 backdrop-blur-sm backdrop-saturate-150 rounded-b-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center gap-2 order-1 sm:order-none">
        <Select 
          value={formatType} 
          onValueChange={setFormatType}
        >
          <SelectTrigger className={`w-24 sm:w-32 ${formatType !== 'none' ? 'border-purple-300 dark:border-purple-800' : ''}`}>
            <Type className={`w-4 h-4 ${formatType !== 'none' ? 'text-purple-600' : ''}`} />
            <SelectValue placeholder="Format" className="hidden sm:block" />
          </SelectTrigger>
          <SelectContent>
            {['auto', 'json', 'html', 'sql', 'none'].map((value) => (
              <SelectItem key={value} value={value}>
                <span className="flex items-center gap-2">
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 order-2 sm:order-none">
        <button
          onClick={() => setCaseSensitive?.(!caseSensitive)}
          className={getButtonClasses(caseSensitive)}
          title="Toggle case sensitivity"
        >
          <CaseSensitive className="w-4 h-4" />
          <span className="hidden sm:inline">Case Sensitive</span>
        </button>

        <button
          onClick={() => setTrimWhitespace?.(!trimWhitespace)}
          className={getButtonClasses(trimWhitespace)}
          title="Toggle whitespace trimming"
        >
          <AlignHorizontalJustifyCenter className="w-4 h-4" />
          <span className="hidden sm:inline">Trim Whitespace</span>
        </button>
      </div>

      <div className="flex items-center gap-2 ml-auto order-3">
        <div className="flex items-center gap-2">
          <Filter className={`w-4 h-4 ${showOnlyChanges ? 'text-purple-600' : 'text-gray-500'}`} />
          <span className="hidden sm:inline text-sm text-gray-600">Show Changes Only</span>
          <Switch
            checked={showOnlyChanges}
            onCheckedChange={setShowOnlyChanges}
            className={showOnlyChanges ? 'bg-purple-600' : ''}
          />
        </div>
      </div>

      <button
        onClick={handleBack}
        className="text-base text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 border rounded-md px-2 py-1 transition-colors order-4"
        title="Back to Textarea"
      >
        <ArrowBigLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back to Textarea</span>
      </button>
    </motion.div>
  );
};

export default ComparisonHeader;
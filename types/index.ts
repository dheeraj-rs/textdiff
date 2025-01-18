import { buttonVariants } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";


export interface ComparisonLineType {
    text: string;
    type: 'missing' | 'extra' | 'different' | 'matched';
    isHtml: boolean;
  }
  
  export interface ComparisonResult {
    left: ComparisonLineType[];
    right: ComparisonLineType[];
  }

  export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
      VariantProps<typeof buttonVariants> {
    asChild?: boolean;
  }

  export interface CompareButtonProps {
    onClick: () => void;
  }


  export interface ComparisonHeaderProps {
    showOnlyChanges?: boolean;
    setShowOnlyChanges?: (show: boolean) => void;
    handleBack?: () => void;
    formatType?: string;
    caseSensitive?: boolean;
    trimWhitespace?: boolean;
    setFormatType?: (formatType: string) => void;
    setCaseSensitive?: (caseSensitive: boolean) => void;
    setTrimWhitespace?: (trimWhitespace: boolean) => void;
  }

  export interface ComparisonLineProps {
    line: {
      type: 'missing' | 'extra' | 'different' | 'matched';
      text: string;
      isHtml?: boolean;
    };
    index: number;
    onLineClick: () => void;
    onTextSelect?: () => void;
    isCopied: boolean;
  }
  
  export interface ComparisonSectionProps {
    title: string;
    lines: ComparisonLineType[];
    showOnlyChanges?: boolean;
  }


  export interface TextareaWithLabelProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
    placeholder?: string;
    onPaste?: () => void;
    onClear?: () => void;
  }
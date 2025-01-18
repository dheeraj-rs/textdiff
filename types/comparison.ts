export interface ComparisonLine {
    text: string;
    type: 'missing' | 'extra' | 'different' | 'matched';
    isHtml: boolean;
  }
  
  export interface ComparisonResult {
    left: ComparisonLine[];
    right: ComparisonLine[];
  }
  
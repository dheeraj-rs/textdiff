import { ComparisonResult } from "@/types/comparison";

/**
 * Formats a JSON string with proper indentation.
 * If the input is not valid JSON, it returns the original string.
 */
export const formatJSON = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return jsonString;
  }
};

/**
 * Finds the differences between two strings at the letter level.
 * Returns two arrays representing the differences in each string.
 */
export const findLetterDifferences = (str1: string, str2: string): [string[], string[]] => {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));

  // Fill the matrix
  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // Deletion
          matrix[i][j - 1] + 1, // Insertion
          matrix[i - 1][j - 1] + 1 // Substitution
        );
      }
    }
  }

  // Backtrack to find the differences
  let i = len1;
  let j = len2;
  const diff1: string[] = [];
  const diff2: string[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && str1[i - 1] === str2[j - 1]) {
      diff1.unshift(str1[i - 1]);
      diff2.unshift(str2[j - 1]);
      i--;
      j--;
    } else if (j > 0 && (i === 0 || matrix[i][j - 1] <= matrix[i - 1][j])) {
      diff1.unshift("");
      diff2.unshift(str2[j - 1]);
      j--;
    } else {
      diff1.unshift(str1[i - 1]);
      diff2.unshift("");
      i--;
    }
  }

  return [diff1, diff2];
};

/**
 * Finds the differences between two strings at the word level.
 * Returns two HTML strings with highlighted differences.
 */
export const findWordDifferences = (str1: string, str2: string): [string, string] => {
  const tokenize = (str: string): string[] => {
    return str.match(/[^\s\{\}\[\],:]+|\s+|[:,.{}\[\]]/g) || [];
  };

  const tokens1 = tokenize(str1);
  const tokens2 = tokenize(str2);

  let result1 = "";
  let result2 = "";
  let i = 0;
  let j = 0;

  while (i < tokens1.length || j < tokens2.length) {
    if (i >= tokens1.length) {
      // Token only in str2 (addition)
      result2 += `<span class="inline-block animate-highlight-addition bg-green-100">${tokens2[j]}</span>`;
      result1 += '<span class="inline-block bg-transparent">&nbsp;</span>'.repeat(tokens2[j].length);
      j++;
    } else if (j >= tokens2.length) {
      // Token only in str1 (deletion)
      result1 += `<span class="inline-block animate-highlight-deletion bg-red-100">${tokens1[i]}</span>`;
      result2 += '<span class="inline-block bg-transparent">&nbsp;</span>'.repeat(tokens1[i].length);
      i++;
    } else if (tokens1[i] === tokens2[j]) {
      // Tokens match
      result1 += tokens1[i];
      result2 += tokens2[j];
      i++;
      j++;
    } else if (/^\s+$/.test(tokens1[i]) && /^\s+$/.test(tokens2[j])) {
      // Handle whitespace differences
      const space = " ".repeat(Math.max(tokens1[i].length, tokens2[j].length));
      result1 += space;
      result2 += space;
      i++;
      j++;
    } else {
      // Tokens differ, find letter-level differences
      const [letterDiff1, letterDiff2] = findLetterDifferences(tokens1[i], tokens2[j]);

      let diffStr1 = "";
      let diffStr2 = "";

      letterDiff1.forEach((char, idx) => {
        if (char === letterDiff2[idx]) {
          // Characters match
          diffStr1 += char;
          diffStr2 += char;
        } else {
          // Characters differ
          if (char) {
            diffStr1 += `<span class="bg-red-200 text-red-900">${char}</span>`;
          }
          if (letterDiff2[idx]) {
            diffStr2 += `<span class="bg-green-200 text-green-900">${letterDiff2[idx]}</span>`;
          }
        }
      });

      result1 += `<span class="inline-block animate-highlight-deletion bg-red-50">${diffStr1}</span>`;
      result2 += `<span class="inline-block animate-highlight-addition bg-green-50">${diffStr2}</span>`;
      i++;
      j++;
    }
  }

  return [result1, result2];
};

/**
 * Compares two arrays of lines and returns a ComparisonResult object.
 */
export const compareLines = (leftLines: string[], rightLines: string[]): ComparisonResult => {
  const result: ComparisonResult = {
    left: [],
    right: [],
  };

  let i = 0;
  let j = 0;

  while (i < leftLines.length || j < rightLines.length) {
    const leftLine = leftLines[i] || "";
    const rightLine = rightLines[j] || "";

    const isStructure = (line: string): boolean => /^[\s]*[{}\[\],][\s]*$/.test(line);

    if (leftLine === rightLine) {
      result.left.push({ text: leftLine, type: "matched", isHtml: false });
      result.right.push({ text: rightLine, type: "matched", isHtml: false });
      i++;
      j++;
    } else if (isStructure(leftLine) && isStructure(rightLine)) {
      result.left.push({ text: leftLine, type: "matched", isHtml: false });
      result.right.push({ text: rightLine, type: "matched", isHtml: false });
      i++;
      j++;
    } else {
      if (!leftLine.trim()) {
        result.left.push({ text: " ".repeat(rightLine.length), type: "missing", isHtml: false });
        result.right.push({ text: rightLine, type: "extra", isHtml: false });
        j++;
        continue;
      }
      if (!rightLine.trim()) {
        result.left.push({ text: leftLine, type: "extra", isHtml: false });
        result.right.push({ text: " ".repeat(leftLine.length), type: "missing", isHtml: false });
        i++;
        continue;
      }

      let found = false;
      let lookAhead = 1;
      const maxLookAhead = 3;

      while (!found && lookAhead < maxLookAhead) {
        if (j + lookAhead < rightLines.length && leftLine.trim() === rightLines[j + lookAhead].trim()) {
          for (let k = 0; k < lookAhead; k++) {
            result.left.push({ text: " ".repeat(rightLines[j + k].length), type: "missing", isHtml: false });
            result.right.push({ text: rightLines[j + k], type: "extra", isHtml: false });
          }
          found = true;
          j += lookAhead;
        } else if (i + lookAhead < leftLines.length && rightLine.trim() === leftLines[i + lookAhead].trim()) {
          for (let k = 0; k < lookAhead; k++) {
            result.left.push({ text: leftLines[i + k], type: "extra", isHtml: false });
            result.right.push({ text: " ".repeat(leftLines[i + k].length), type: "missing", isHtml: false });
          }
          found = true;
          i += lookAhead;
        }
        lookAhead++;
      }

      if (!found) {
        if (leftLine.trim() !== rightLine.trim()) {
          const [leftDiff, rightDiff] = findWordDifferences(leftLine, rightLine);
          result.left.push({ text: leftDiff, type: "different", isHtml: true });
          result.right.push({ text: rightDiff, type: "different", isHtml: true });
        } else {
          result.left.push({ text: leftLine, type: "matched", isHtml: false });
          result.right.push({ text: rightLine, type: "matched", isHtml: false });
        }
        i++;
        j++;
      }
    }
  }

  return result;
};
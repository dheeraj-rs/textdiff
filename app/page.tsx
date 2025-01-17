"use client";
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/card';
import { Button } from '@/components/button';
import { Textarea } from '@/components/textarea';
import { ArrowRight, ChevronRight } from 'lucide-react';

const Home = () => {
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [comparison, setComparison] = useState({
    left: [],
    right: []
  });

  const formatJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString;
    }
  };

  const findWordDifferences = (str1, str2) => {
    const tokenize = (str) => {
      return str.match(/[^\s\{\}\[\],:]+|\s+|[:,.{}\[\]]/g) || [];
    };

    const tokens1 = tokenize(str1);
    const tokens2 = tokenize(str2);
    
    let result1 = '';
    let result2 = '';
    let i = 0;
    let j = 0;

    while (i < tokens1.length || j < tokens2.length) {
      if (i >= tokens1.length) {
        result2 += `<span class="inline-block animate-highlight-addition bg-green-100">${tokens2[j]}</span>`;
        result1 += '<span class="inline-block bg-transparent">&nbsp;</span>'.repeat(tokens2[j].length);
        j++;
      } else if (j >= tokens2.length) {
        result1 += `<span class="inline-block animate-highlight-deletion bg-red-100">${tokens1[i]}</span>`;
        result2 += '<span class="inline-block bg-transparent">&nbsp;</span>'.repeat(tokens1[i].length);
        i++;
      } else if (tokens1[i] === tokens2[j]) {
        result1 += tokens1[i];
        result2 += tokens2[j];
        i++;
        j++;
      } else if (/^\s+$/.test(tokens1[i]) && /^\s+$/.test(tokens2[j])) {
        const space = ' '.repeat(Math.max(tokens1[i].length, tokens2[j].length));
        result1 += space;
        result2 += space;
        i++;
        j++;
      } else {
        result1 += `<span class="inline-block animate-highlight-deletion bg-red-100">${tokens1[i]}</span>`;
        result2 += `<span class="inline-block animate-highlight-addition bg-green-100">${tokens2[j]}</span>`;
        i++;
        j++;
      }
    }

    return [result1, result2];
  };

  const compareLines = (leftLines, rightLines) => {
    const result = {
      left: [],
      right: []
    };
    
    let i = 0;
    let j = 0;
    
    while (i < leftLines.length || j < rightLines.length) {
      const leftLine = leftLines[i] || '';
      const rightLine = rightLines[j] || '';
      
      const isStructure = (line) => /^[\s]*[{}\[\],][\s]*$/.test(line);
      
      if (leftLine === rightLine) {
        result.left.push({ text: leftLine, type: 'matched', isHtml: false });
        result.right.push({ text: rightLine, type: 'matched', isHtml: false });
        i++;
        j++;
      } else if (isStructure(leftLine) && isStructure(rightLine)) {
        result.left.push({ text: leftLine, type: 'matched', isHtml: false });
        result.right.push({ text: rightLine, type: 'matched', isHtml: false });
        i++;
        j++;
      } else {
        let found = false;
        let lookAhead = 1;
        const maxLookAhead = 3;
        
        while (!found && lookAhead < maxLookAhead) {
          if (j + lookAhead < rightLines.length && 
              leftLine.trim() === rightLines[j + lookAhead].trim()) {
            for (let k = 0; k < lookAhead; k++) {
              result.left.push({ 
                text: ' '.repeat(rightLines[j + k].length), 
                type: 'missing', 
                isHtml: false 
              });
              result.right.push({ 
                text: rightLines[j + k], 
                type: 'extra', 
                isHtml: false 
              });
            }
            found = true;
            j += lookAhead;
          } else if (i + lookAhead < leftLines.length && 
                     rightLine.trim() === leftLines[i + lookAhead].trim()) {
            for (let k = 0; k < lookAhead; k++) {
              result.left.push({ 
                text: leftLines[i + k], 
                type: 'extra', 
                isHtml: false 
              });
              result.right.push({ 
                text: ' '.repeat(leftLines[i + k].length), 
                type: 'missing', 
                isHtml: false 
              });
            }
            found = true;
            i += lookAhead;
          }
          lookAhead++;
        }
        
        if (!found) {
          const [leftDiff, rightDiff] = findWordDifferences(leftLine, rightLine);
          result.left.push({ text: leftDiff, type: 'different', isHtml: true });
          result.right.push({ text: rightDiff, type: 'different', isHtml: true });
          i++;
          j++;
        }
      }
    }
    
    return result;
  };

  const compareTexts = useCallback(() => {
    try {
      const formattedLeftText = formatJSON(leftText);
      const formattedRightText = formatJSON(rightText);

      const leftLines = formattedLeftText.split('\n');
      const rightLines = formattedRightText.split('\n');
      
      const result = compareLines(leftLines, rightLines);
      setComparison(result);
    } catch (error) {
      console.error('Error comparing texts:', error);
    }
  }, [leftText, rightText]);

  const ComparisonLine = ({ line, index }) => {
    const baseClassName = "py-2 font-mono whitespace-pre transition-all duration-300 relative group flex";
    
    const typeStyles = {
      missing: "bg-red-50 opacity-80 border-l-4 border-red-500",
      extra: "bg-green-50 opacity-80 border-l-4 border-green-500 animate-slide-in",
      different: "bg-yellow-50 opacity-80 border-l-4 border-yellow-500 animate-pulse-once",
      matched: "hover:bg-gray-50/30"
    };

    const lineNumberClass = "select-none w-12 text-xs text-gray-400 border-r border-gray-200 pr-2 text-right mr-3 flex-shrink-0";
    const contentClass = "flex-1 relative";

    const className = `${baseClassName} ${typeStyles[line.type]}`;

    const LineNumber = () => (
      <span className={lineNumberClass}>
        {index + 1}
        {line.type !== 'matched' && (
          <ChevronRight className="inline-block w-3 h-3 ml-1 text-gray-400" />
        )}
      </span>
    );

    const getChangeType = () => {
      switch (line.type) {
        case 'extra':
          return (
            <div className="absolute invisible group-hover:visible -top-8 left-12 bg-green-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
              Added line
              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-green-800 transform rotate-45"></div>
            </div>
          );
        case 'missing':
          return (
            <div className="absolute invisible group-hover:visible -top-8 left-12 bg-red-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
              Removed line
              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-red-800 transform rotate-45"></div>
            </div>
          );
        case 'different':
          return (
            <div className="absolute invisible group-hover:visible -top-8 left-12 bg-yellow-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
              Modified line
              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-yellow-800 transform rotate-45"></div>
            </div>
          );
        default:
          return null;
      }
    };

    if (line.isHtml) {
      return (
        <div className={className}>
          <LineNumber />
          <div className={contentClass}>
            {getChangeType()}
            <div 
              dangerouslySetInnerHTML={{ 
                __html: line.text.replace(
                  /<span class="(animate-highlight-[^"]+)">/g,
                  (match, className) => {
                    if (className.includes('deletion')) {
                      return '<span class="inline-block relative group/change"><span class="absolute -top-4 invisible group-hover/change:visible bg-red-800 text-white px-1 py-0.5 rounded text-xs whitespace-nowrap shadow-sm">Removed<div class="absolute -bottom-1 left-4 w-2 h-2 bg-red-800 transform rotate-45"></div></span><span class="bg-red-100 text-red-900 px-0.5 rounded">';
                    }
                    return '<span class="inline-block relative group/change"><span class="absolute -top-4 invisible group-hover/change:visible bg-green-800 text-white px-1 py-0.5 rounded text-xs whitespace-nowrap shadow-sm">Added<div class="absolute -bottom-1 left-4 w-2 h-2 bg-green-800 transform rotate-45"></div></span><span class="bg-green-100 text-green-900 px-0.5 rounded">';
                  }
                )
                .replace(/<\/span>/g, '</span></span>')
              }} 
            />
          </div>
        </div>
      );
    }

    return (
      <div className={className}>
        <LineNumber />
        <div className={contentClass}>
          {getChangeType()}
          {line.text}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-8 space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Original Text
          </h3>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <Textarea
              value={leftText}
              onChange={(e) => setLeftText(e.target.value)}
              className="relative h-48 font-mono bg-white/90 backdrop-blur-sm rounded-lg border-0 shadow-lg transition-transform duration-300 hover:translate-y-0.5"
              placeholder="Enter JSON here..."
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Modified Text
          </h3>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <Textarea
              value={rightText}
              onChange={(e) => setRightText(e.target.value)}
              className="relative h-48 font-mono bg-white/90 backdrop-blur-sm rounded-lg border-0 shadow-lg transition-transform duration-300 hover:translate-y-0.5"
              placeholder="Enter JSON here..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={compareTexts}
          className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <span className="flex items-center gap-2 text-white">
            Compare
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Original Version
          </h3>
          <Card className="overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-xl transform transition-all duration-300 hover:scale-[1.01]">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-full p-4">
                  {comparison.left.map((line, idx) => (
                    <ComparisonLine key={idx} line={line} index={idx} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Modified Version
          </h3>
          <Card className="overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-xl transform transition-all duration-300 hover:scale-[1.01]">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-full p-4">
                  {comparison.right.map((line, idx) => (
                    <ComparisonLine key={idx} line={line} index={idx} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        @keyframes highlight-addition {
          0% { 
            background-color: rgba(34, 197, 94, 0.1);
            transform: translateY(-2px);
          }
          50% { 
            background-color: rgba(34, 197, 94, 0.3);
            transform: translateY(0);
          }
          100% { 
            background-color: rgba(34, 197, 94, 0.1);
            transform: translateY(0);
          }
        }

        @keyframes highlight-deletion {
          0% { 
            background-color: rgba(239, 68, 68, 0.1);
            transform: translateY(-2px);
          }
          50% { 
            background-color: rgba(239, 68, 68, 0.3);
            transform: translateY(0);
          }
          100% { 
            background-color: rgba(239, 68, 68, 0.1);
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          0% { 
            transform: translateX(10px);
            opacity: 0;
          }
          100% { 
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes pulse-once {
          0% { 
            background-color: transparent;
            transform: scale(1);
          }
          50% { 
            background-color: rgba(234, 179, 8, 0.1);
            transform: scale(1.001);
          }
          100% { 
            background-color: transparent;
            transform: scale(1);
          }
        }

        .animate-highlight-addition {
          animation: highlight-addition 1s ease-in-out;
          animation-fill-mode: forwards;
        }

        .animate-highlight-deletion {
          animation: highlight-deletion 1s ease-in-out;
          animation-fill-mode: forwards;
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
          animation-fill-mode: forwards;
        }

        .animate-pulse-once {
          animation: pulse-once 1s ease-in-out;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;
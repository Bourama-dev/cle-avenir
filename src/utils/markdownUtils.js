import React from 'react';

/**
 * A simple markdown parser for basic formatting without external heavy libraries.
 * Handles: **bold**, *italic*, - lists, 1. lists, and simple line breaks.
 */
export const renderMarkdown = (text) => {
  if (!text) return null;

  // 1. Split by double newlines to paragraphs
  const paragraphs = text.split(/\n\n+/);

  return paragraphs.map((paragraph, pIndex) => {
    // Check if it's a list
    if (paragraph.match(/^[*-] /m)) {
       const listItems = paragraph.split(/\n/).filter(line => line.trim().length > 0);
       return (
         <ul key={pIndex} className="list-disc pl-5 mb-4 space-y-1">
           {listItems.map((item, i) => {
             const cleanItem = item.replace(/^[*-] /, '');
             return <li key={i}>{parseInline(cleanItem)}</li>;
           })}
         </ul>
       );
    }
    
    // Check if it's a numbered list
    if (paragraph.match(/^\d+\. /m)) {
        const listItems = paragraph.split(/\n/).filter(line => line.trim().length > 0);
        return (
          <ol key={pIndex} className="list-decimal pl-5 mb-4 space-y-1">
            {listItems.map((item, i) => {
              const cleanItem = item.replace(/^\d+\. /, '');
              return <li key={i}>{parseInline(cleanItem)}</li>;
            })}
          </ol>
        );
     }

    return (
      <p key={pIndex} className="mb-3 leading-relaxed text-slate-700">
        {parseInline(paragraph)}
      </p>
    );
  });
};

const parseInline = (text) => {
  // Regex for bold: **text**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    // Simple italic: *text* (basic support)
    const italicParts = part.split(/(\*.*?\*)/g);
    return italicParts.map((subPart, subIndex) => {
        if (subPart.startsWith('*') && subPart.endsWith('*') && subPart.length > 2) {
            return <em key={`${index}-${subIndex}`} className="italic">{subPart.slice(1, -1)}</em>;
        }
        return subPart;
    });
  });
};
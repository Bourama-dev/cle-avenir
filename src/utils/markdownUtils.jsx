import React from 'react';

/**
 * A simple markdown parser for basic formatting without external heavy libraries.
 * Handles: **bold**, *italic*, - lists, 1. lists, [links](url), and simple line breaks.
 */
export const renderMarkdown = (text) => {
  if (!text) return null;

  // Some models wrap a long line right between `]` and `(` in a link — stitch
  // it back onto one line first so it isn't mistaken for a new list item or
  // missed by the link regex below.
  const normalized = text.replace(/\]\s*\n+\s*\(/g, '](');

  // 1. Split by double newlines to paragraphs
  const paragraphs = normalized.split(/\n\n+/);

  return paragraphs.map((paragraph, pIndex) => {
    // Check if it's a list
    if (paragraph.match(/^[*-] /m)) {
       const listItems = mergeListLines(paragraph.split(/\n/), /^[*-] /);
       return (
         <ul key={pIndex} className="list-disc pl-5 mb-4 space-y-1">
           {listItems.map((item, i) => <li key={i}>{parseInline(item)}</li>)}
         </ul>
       );
    }

    // Check if it's a numbered list
    if (paragraph.match(/^\d+\. /m)) {
        const listItems = mergeListLines(paragraph.split(/\n/), /^\d+\. /);
        return (
          <ol key={pIndex} className="list-decimal pl-5 mb-4 space-y-1">
            {listItems.map((item, i) => <li key={i}>{parseInline(item)}</li>)}
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

// Groups raw lines into list items: a line matching `markerRe` starts a new
// item, any other non-empty line is a wrapped continuation of the previous
// item (rather than becoming its own bare, un-bulleted list entry).
const mergeListLines = (lines, markerRe) => {
  const items = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    if (markerRe.test(line)) {
      items.push(line.replace(markerRe, ''));
    } else if (items.length > 0) {
      items[items.length - 1] += ' ' + line.trim();
    } else {
      items.push(line.trim());
    }
  }
  return items;
};

// Only these origins are trusted for a rendered link — internal CléAvenir
// routes, or genuinely external targets we intentionally support elsewhere
// (mailto/tel). Anything else (a model hallucinating an external job-board
// URL, for instance) renders as plain text instead of a clickable link.
const isTrustedHref = (href) =>
  href.startsWith('/') || href.startsWith('mailto:') || href.startsWith('tel:');

const parseInline = (text) => {
  // Links first: [texte](url) — so bold/italic below only ever sees plain text
  const linkParts = text.split(/(\[[^\]]+\]\([^)\s]+\))/g);
  return linkParts.map((part, index) => {
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      if (!isTrustedHref(href)) return label;
      return (
        <a
          key={index}
          href={href}
          className="text-violet-600 underline decoration-violet-300 hover:text-violet-800 font-medium"
        >
          {label}
        </a>
      );
    }
    return parseBoldItalic(part, index);
  });
};

const parseBoldItalic = (text, index) => {
  // Regex for bold: **text**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, subIndex) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${index}-${subIndex}`} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    // Simple italic: *text* (basic support)
    const italicParts = part.split(/(\*.*?\*)/g);
    return italicParts.map((subPart, italicIndex) => {
        if (subPart.startsWith('*') && subPart.endsWith('*') && subPart.length > 2) {
            return <em key={`${index}-${subIndex}-${italicIndex}`} className="italic">{subPart.slice(1, -1)}</em>;
        }
        return subPart;
    });
  });
};

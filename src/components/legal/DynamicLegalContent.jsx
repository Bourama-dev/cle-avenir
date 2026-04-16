import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react';

/**
 * Renders legal document content fetched from the database.
 * If loading → spinner. If no DB content → renders children (JSX fallback).
 */
const DynamicLegalContent = ({ dbContent, loading, children }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
      </div>
    );
  }

  if (dbContent?.content) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-slate prose-lg max-w-none
          prose-headings:font-bold prose-headings:text-slate-900
          prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-strong:text-slate-800
          prose-ul:text-slate-600 prose-li:my-1
          prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-indigo-400 prose-blockquote:text-slate-500
          prose-hr:border-slate-200">
          <ReactMarkdown>{dbContent.content}</ReactMarkdown>
        </div>
        {dbContent.created_at && (
          <p className="max-w-4xl mx-auto px-6 text-xs text-slate-400 pb-8">
            Dernière mise à jour : {new Date(dbContent.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}
      </div>
    );
  }

  // Fallback : contenu JSX hardcodé de la page
  return <>{children}</>;
};

export default DynamicLegalContent;

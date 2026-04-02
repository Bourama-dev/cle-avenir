import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import './FAQSearch.css';

const FAQSearch = ({ onSearch, searchTerm }) => {
  return (
    <div className="faq-search-container">
      <motion.div 
        className="faq-search-wrapper"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-slate-400" />
          </div>
          <input
            type="text"
            className="faq-search-input"
            placeholder="Rechercher une question (ex: 'prix', 'test', 'compte')..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default FAQSearch;
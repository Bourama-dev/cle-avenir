import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  HelpCircle, 
  BrainCircuit, 
  FileText, 
  User, 
  CreditCard, 
  ShieldCheck 
} from 'lucide-react';
import './FAQCategories.css';

const categories = [
  { id: 'all', label: 'Toutes', icon: LayoutGrid },
  { id: 'general', label: 'Général', icon: HelpCircle },
  { id: 'test', label: 'Le test', icon: BrainCircuit },
  { id: 'results', label: 'Les résultats', icon: FileText },
  { id: 'account', label: 'Mon compte', icon: User },
  { id: 'pricing', label: 'Tarifs', icon: CreditCard },
  { id: 'security', label: 'Sécurité', icon: ShieldCheck },
];

const FAQCategories = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="faq-categories-container">
      <div className="faq-categories-scroll">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`faq-category-btn ${isActive ? 'active' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`faq-category-icon ${isActive ? 'active' : ''}`}>
                <Icon size={20} />
              </div>
              <span className="font-medium">{category.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default FAQCategories;
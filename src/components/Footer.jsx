import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  MapPin, 
  ShieldCheck,
  Globe,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
        {/* Brand Column */}
        <div className="space-y-6 lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-2xl group">
             <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white text-lg">C</span>
             </div>
             CléAvenir
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            La première plateforme d'orientation propulsée par l'IA qui vous accompagne de la découverte de soi jusqu'au premier emploi.
          </p>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Suivez-nous</h4>
            <div className="flex gap-3">
              <a href="https://facebook.com/cleavenir" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors" title="Facebook">
                <Facebook size={16} />
              </a>
              <a href="https://twitter.com/cleavenir" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-black hover:text-white transition-colors" title="X (Twitter)">
                <Twitter size={16} />
              </a>
              <a href="https://instagram.com/cleavenir" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:text-white transition-colors border-0" title="Instagram">
                <Instagram size={16} />
              </a>
              <a href="https://linkedin.com/company/cleavenir" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-colors" title="LinkedIn">
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h3 className="text-white font-bold text-lg mb-6">Produit</h3>
          <ul className="space-y-4 text-sm">
            <li>
              <Link to="/metiers" className="hover:text-indigo-400 transition-colors">
                Explorer la liste des métiers
              </Link>
            </li>
            <li>
              <Link to="/test-orientation" className="hover:text-indigo-400 transition-colors">
                Test d'orientation
              </Link>
            </li>
            <li>
              <Link to="/offres-emploi" className="hover:text-indigo-400 transition-colors">
                Offres d'emploi
              </Link>
            </li>
            <li>
              <Link to="/formations" className="hover:text-indigo-400 transition-colors">
                Trouver une formation
              </Link>
            </li>
             <li>
              <Link to="/tarifs" className="hover:text-indigo-400 transition-colors">
                Tarifs & Plans
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Conformity Column */}
        <div>
          <h3 className="text-white font-bold text-lg mb-6">Légal & Conformité</h3>
          <ul className="space-y-4 text-sm">
            <li>
              <Link to="/privacy" className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                <ShieldCheck size={14} /> Politique de Confidentialité
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-indigo-400 transition-colors">
                Conditions d'Utilisation
              </Link>
            </li>
            <li>
              <Link to="/legal" className="hover:text-indigo-400 transition-colors">
                Mentions Légales
              </Link>
            </li>
             <li>
              <Link to="/a-propos" className="hover:text-indigo-400 transition-colors">
                À propos
              </Link>
            </li>
            <li>
              <Link to="/gestion-cookies" className="hover:text-indigo-400 transition-colors">
                Gestion des Cookies
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h3 className="text-white font-bold text-lg mb-6">Nous contacter</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="shrink-0 text-indigo-500 mt-1" size={16} />
              <span>30 rue du Fbg Saint Vincent,<br />45000 Orléans, France</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="shrink-0 text-indigo-500" size={16} />
              <a href="mailto:contact@cleavenir.com" className="hover:text-white">contact@cleavenir.com</a>
            </li>
            <li className="pt-4 flex flex-wrap items-center gap-3">
                <Link to="/contact" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold transition-colors">
                    Nous écrire
                </Link>
                <Link to="/status" className="flex items-center gap-2 text-xs text-green-400 hover:text-green-300 transition-colors">
                    <Activity size={14} /> Status
                </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} CléAvenir. Tous droits réservés.</p>
        <div className="flex items-center gap-6 flex-wrap">
          <span className="flex items-center gap-2">
             <Globe size={14} /> Français (FR)
          </span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Confidentialité</Link>
            <span className="text-slate-700">|</span>
            <Link to="/terms" className="hover:text-white transition-colors">CGU</Link>
            <span className="text-slate-700">|</span>
            <Link to="/legal" className="hover:text-white transition-colors">Légal</Link>
          </div>
          <span>Version 2.5.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
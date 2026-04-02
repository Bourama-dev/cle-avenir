import React from 'react';
import { Building2, MapPin, Globe, Mail, Phone, Hash, Calendar, Clock, CheckCircle } from 'lucide-react';

const InfoRow = ({ icon: Icon, label, value, isLink = false }) => (
  <div className="est-info-item">
    <span className="est-info-label">
      <Icon className="w-3 h-3 text-slate-400" />
      {label}
    </span>
    {isLink && value && value !== 'Non renseigné' ? (
      <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="est-info-value text-indigo-600 hover:underline truncate">
        {value}
      </a>
    ) : (
      <span className="est-info-value truncate">{value}</span>
    )}
  </div>
);

const EstablishmentInfo = ({ establishment }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseigné';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="est-card">
      <div className="flex items-center justify-between mb-6">
         <h3 className="text-lg font-semibold text-slate-800">Informations</h3>
         <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Actif
         </span>
      </div>
      
      <p className="text-xs text-slate-500 mb-6 italic">Détails administratifs et coordonnées</p>

      <div className="est-info-grid">
        <InfoRow icon={Building2} label="Type" value={establishment?.type || 'Lycée'} />
        <InfoRow icon={MapPin} label="Adresse" value={`${establishment?.address || ''} ${establishment?.city || ''}`} />
        <InfoRow icon={Globe} label="Site Web" value={establishment?.website || 'Non renseigné'} isLink />
        <InfoRow icon={Mail} label="Email Contact" value={establishment?.contact_email || 'Non renseigné'} />
        <InfoRow icon={Phone} label="Téléphone" value={establishment?.phone || 'Non renseigné'} />
        
        <div className="h-px bg-slate-100 my-2" />
        
        <InfoRow icon={Hash} label="Code Établissement" value={establishment?.uai || 'Non renseigné'} />
        <InfoRow icon={Calendar} label="Créé le" value={formatDate(establishment?.created_at)} />
        <InfoRow icon={Clock} label="Dernière connexion" value={formatDate(establishment?.last_login_at || establishment?.updated_at) || 'Jamais'} />
      </div>
    </div>
  );
};

export default EstablishmentInfo;
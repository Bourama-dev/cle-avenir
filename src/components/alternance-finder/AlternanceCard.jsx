import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Briefcase, Calendar, GraduationCap, ExternalLink } from 'lucide-react';

const AlternanceCard = ({ alternance, index, isSaved, onSave }) => {

  const handleCardClick = (e) => {
    e.stopPropagation();
    if (alternance.url) {
      window.open(alternance.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-2xl p-6 card-hover cursor-pointer relative flex flex-col justify-between shadow-md"
      onClick={handleCardClick}
    >
      <div>
        <div className="flex items-start justify-between mb-2">
            <div>
                <p className="text-primary text-sm font-medium">{alternance.company}</p>
                <h3 className="text-xl font-bold text-foreground mb-2">{alternance.title}</h3>
            </div>
          <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); onSave(alternance); }}>
            <Star className={`h-5 w-5 ${isSaved ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
          </Button>
        </div>
        <p className="text-muted-foreground mb-4 text-sm h-20 overflow-hidden">{alternance.description}</p>
      </div>
      
      <div>
        <div className="space-y-2 mb-6 text-sm">
          {alternance.rythm && <div className="flex items-center text-muted-foreground"><Briefcase className="h-4 w-4 mr-2 text-primary" />{alternance.rythm}</div>}
          {alternance.level && <div className="flex items-center text-muted-foreground"><GraduationCap className="h-4 w-4 mr-2 text-accent" />Niveau: {alternance.level}</div>}
          {alternance.duration && <div className="flex items-center text-muted-foreground"><Calendar className="h-4 w-4 mr-2 text-secondary" />Durée: {alternance.duration}</div>}
          {alternance.location && <div className="flex items-center text-muted-foreground"><MapPin className="h-4 w-4 mr-2 text-purple-400" />{alternance.location}</div>}
        </div>

        <Button asChild className="w-full">
          <a href={alternance.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
            Voir l'offre <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </Button>
      </div>
    </motion.div>
  );
};

export default AlternanceCard;
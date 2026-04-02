import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Building, MapPin } from 'lucide-react';

const TrendCard = ({ icon: Icon, title, value, data, color }) => (
    <motion.div 
        className="bg-card p-4 rounded-xl shadow-sm border border-border"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <div className="flex items-center mb-2">
            <Icon className={`w-6 h-6 mr-3 ${color}`} />
            <p className="text-sm font-semibold text-muted-foreground">{title}</p>
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {data && <p className="text-xs text-muted-foreground truncate">{data}</p>}
    </motion.div>
);

const MarketTrends = ({ trends }) => {
    if (!trends) return null;

    const { nbOffres, topSecteurs, topRegions } = trends;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8"
        >
            <h2 className="text-2xl font-bold text-foreground mb-4">Tendances du marché</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TrendCard 
                    icon={TrendingUp}
                    title="Offres disponibles"
                    value={nbOffres ? nbOffres.toLocaleString() : "N/A"}
                    color="text-primary"
                />
                <TrendCard 
                    icon={Building}
                    title="Secteur principal"
                    value={topSecteurs.length > 0 ? topSecteurs[0].libelle : "N/A"}
                    data={topSecteurs.length > 0 ? `${topSecteurs[0].nbOffres.toLocaleString()} offres` : ""}
                    color="text-accent"
                />
                <TrendCard 
                    icon={MapPin}
                    title="Région la plus active"
                    value={topRegions.length > 0 ? topRegions[0].libelle : "N/A"}
                    data={topRegions.length > 0 ? `${topRegions[0].nbOffres.toLocaleString()} offres` : ""}
                    color="text-secondary"
                />
            </div>
        </motion.div>
    );
};

export default MarketTrends;
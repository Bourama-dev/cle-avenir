import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SettingsPreview = ({ settings }) => {
  const { theme_primary_color, theme_secondary_color, theme_font_family } = settings;

  const containerStyle = {
    fontFamily: theme_font_family || 'Inter, sans-serif',
  };

  const primaryStyle = {
    backgroundColor: theme_primary_color || '#3b82f6',
    color: '#ffffff'
  };
  
  // Helper to approximate a lighter shade for backgrounds
  const primaryLightStyle = {
    backgroundColor: theme_primary_color ? `${theme_primary_color}20` : '#3b82f620',
    color: theme_primary_color || '#3b82f6'
  };

  return (
    <Card className="h-full border-dashed border-2 bg-slate-50/50" style={containerStyle}>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wider text-slate-500">Aperçu du Thème</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sample Header */}
        <div className="p-4 rounded-lg bg-white shadow-sm border border-slate-100">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={primaryStyle}>L</div>
              <div className="h-2 w-24 bg-slate-200 rounded"></div>
           </div>
           <div className="space-y-2">
              <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
              <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
           </div>
        </div>

        {/* Sample Buttons */}
        <div className="space-y-2">
           <p className="text-xs text-slate-500 font-medium">Boutons</p>
           <div className="flex gap-2 flex-wrap">
              <div className="px-4 py-2 rounded-md text-sm font-medium shadow-sm" style={primaryStyle}>Primary Action</div>
              <div className="px-4 py-2 rounded-md text-sm font-medium border bg-white text-slate-700">Secondary</div>
              <div className="px-4 py-2 rounded-md text-sm font-medium" style={primaryLightStyle}>Ghost / Accent</div>
           </div>
        </div>

        {/* Sample Badges */}
        <div className="space-y-2">
            <p className="text-xs text-slate-500 font-medium">Badges & Tags</p>
            <div className="flex gap-2">
               <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={primaryLightStyle}>Nouveau</span>
               <Badge variant="outline">Standard</Badge>
               <Badge className="bg-slate-800">Dark</Badge>
            </div>
        </div>
        
        {/* Sample Typography */}
         <div className="space-y-2">
            <p className="text-xs text-slate-500 font-medium">Typographie</p>
            <div className="p-3 bg-white rounded border border-slate-100">
               <h4 className="text-lg font-bold mb-1" style={{ color: theme_secondary_color }}>Titre de section</h4>
               <p className="text-sm text-slate-600">Ceci est un exemple de texte pour visualiser la police choisie.</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsPreview;
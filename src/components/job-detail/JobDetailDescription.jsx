import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle2 } from 'lucide-react';

const JobDetailDescription = ({ job }) => {
  return (
    <div className="space-y-8">
      {/* Main Description */}
      <Card className="border-none shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white pb-6">
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg mr-3">
              <FileText className="w-5 h-5" />
            </div>
            Description du poste
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div 
            className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed
            prose-headings:font-bold prose-headings:text-slate-900 
            prose-a:text-rose-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-slate-900 prose-strong:font-bold
            prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-rose-400"
            dangerouslySetInnerHTML={{ __html: job.description }} 
          />
        </CardContent>
      </Card>

      {/* Skills & Profile */}
      {(job.skills?.length > 0) && (
        <Card className="border-none shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white pb-6">
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              Compétences requises
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <Badge 
                  key={i} 
                  variant="secondary" 
                  className="bg-slate-50 text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors px-3 py-1.5 text-sm font-medium"
                >
                  {typeof skill === 'object' ? skill.name : skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobDetailDescription;
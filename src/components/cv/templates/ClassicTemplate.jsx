import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Building2 } from 'lucide-react';

export const ClassicTemplate = ({ data }) => {
  const {
    personalInfo = {},
    summary = "",
    experiences = [],
    education = [],
    skills = [],
    languages = [],
    interests = []
  } = data;

  return (
    <div className="w-full bg-white shadow-2xl overflow-hidden print:shadow-none min-h-[1100px] flex flex-col font-serif text-slate-900 p-12">
      
      {/* Header Centered */}
      <header className="border-b-2 border-slate-800 pb-6 mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-wide uppercase mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-xl text-slate-600 italic mb-4">{personalInfo.title}</p>
        
        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-700">
          {personalInfo.email && <span className="flex items-center gap-1"><Mail size={12}/> {personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1">| <Phone size={12}/> {personalInfo.phone}</span>}
          {personalInfo.location && <span className="flex items-center gap-1">| <MapPin size={12}/> {personalInfo.location}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1">| <Linkedin size={12}/> {personalInfo.linkedin}</span>}
        </div>
      </header>

      {/* Main Content - Single Column */}
      <div className="space-y-8">
        
        {/* Summary */}
        {summary && (
          <section>
            <h3 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 pb-1">Profil</h3>
            <p className="text-justify leading-relaxed text-slate-800">
              {summary}
            </p>
          </section>
        )}

        {/* Experience */}
        <section>
          <h3 className="text-lg font-bold uppercase border-b border-slate-300 mb-4 pb-1">Expérience Professionnelle</h3>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-lg">{exp.title}</h4>
                  <span className="text-sm font-medium text-slate-600 italic">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <div className="text-slate-700 font-semibold mb-2 flex items-center gap-2">
                   {exp.company}
                </div>
                <p className="text-slate-800 text-sm whitespace-pre-line leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h3 className="text-lg font-bold uppercase border-b border-slate-300 mb-4 pb-1">Formation</h3>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <h4 className="font-bold">{edu.degree}</h4>
                  <p className="text-slate-700 italic">{edu.school}</p>
                </div>
                <span className="text-sm text-slate-600 font-medium">{edu.year}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Skills & Others Grid */}
        <div className="grid grid-cols-2 gap-8">
            <section>
                <h3 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 pb-1">Compétences</h3>
                <ul className="list-disc list-inside text-sm space-y-1 text-slate-800">
                    {skills.map((skill, i) => <li key={i}>{skill}</li>)}
                </ul>
            </section>
            <section>
                 {languages.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 pb-1">Langues</h3>
                        <ul className="text-sm space-y-1 text-slate-800">
                            {languages.map((l, i) => <li key={i}><span className="font-semibold">{l.name}:</span> {l.level}</li>)}
                        </ul>
                    </div>
                 )}
                 {interests.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 pb-1">Intérêts</h3>
                        <p className="text-sm text-slate-800">{interests.join(', ')}</p>
                    </div>
                 )}
            </section>
        </div>

      </div>
    </div>
  );
};
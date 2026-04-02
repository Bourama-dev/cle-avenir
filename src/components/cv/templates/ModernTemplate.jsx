import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Building2 } from 'lucide-react';

export const ModernTemplate = ({ data }) => {
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
    <div className="w-full bg-white shadow-2xl overflow-hidden print:shadow-none min-h-[1100px] flex flex-col font-sans text-slate-800 relative">
      {/* Decorative Top Bar */}
      <div className="h-2 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 w-full" />

      {/* Header */}
      <header className="px-8 py-10 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-16 bg-violet-100 rounded-full blur-3xl opacity-50 translate-x-10 -translate-y-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2 uppercase">
              {personalInfo.firstName || 'Votre'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">{personalInfo.lastName || 'Nom'}</span>
            </h1>
            <p className="text-xl font-medium text-slate-600">{personalInfo.title || 'Intitulé du poste'}</p>
          </div>
          
          <div className="flex flex-col gap-2 text-sm text-slate-600">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white rounded-full shadow-sm text-violet-600"><Mail size={14} /></div>
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white rounded-full shadow-sm text-violet-600"><Phone size={14} /></div>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white rounded-full shadow-sm text-violet-600"><MapPin size={14} /></div>
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white rounded-full shadow-sm text-violet-600"><Linkedin size={14} /></div>
                <span>{personalInfo.linkedin}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Left Column (Sidebar) */}
        <aside className="w-full md:w-1/3 bg-slate-900 text-slate-300 p-8 space-y-8 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          {/* Skills */}
          {skills.length > 0 && (
            <section className="relative z-10">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
                <span className="text-violet-400">#</span> Compétences
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-slate-800 text-slate-200 rounded-md text-sm font-medium border border-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section className="relative z-10">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
                 <span className="text-violet-400">ABC</span> Langues
              </h3>
              <ul className="space-y-2">
                {languages.map((lang, index) => (
                  <li key={index} className="flex justify-between items-center text-sm">
                    <span className="text-white font-medium">{lang.name}</span>
                    <span className="text-slate-400">{lang.level}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <section className="relative z-10">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
                 <span className="text-violet-400">♥</span> Intérêts
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {interests.join(' • ')}
              </p>
            </section>
          )}
        </aside>

        {/* Right Column (Main Content) */}
        <main className="w-full md:w-2/3 p-8 space-y-8 bg-white">
          
          {/* Summary */}
          {summary && (
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-1 bg-violet-600 mr-3 rounded-full"></span>
                Profil
              </h3>
              <p className="text-slate-600 leading-relaxed text-justify">
                {summary}
              </p>
            </section>
          )}

          {/* Experience */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-8 h-1 bg-violet-600 mr-3 rounded-full"></span>
              Expériences Professionnelles
            </h3>
            <div className="space-y-6 border-l-2 border-slate-100 ml-3 pl-6">
              {experiences.length > 0 ? experiences.map((exp, index) => (
                <div key={index} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white bg-violet-600 shadow-sm"></div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h4 className="font-bold text-slate-900 text-lg">{exp.title}</h4>
                    <span className="text-sm font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                      {exp.startDate} - {exp.endDate || "Présent"}
                    </span>
                  </div>
                  <div className="text-slate-500 font-medium mb-2 flex items-center gap-1 text-sm">
                    <Building2 className="w-3 h-3" /> {exp.company}
                  </div>
                  <p className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              )) : (
                <p className="text-slate-400 italic text-sm">Ajoutez vos expériences...</p>
              )}
            </div>
          </section>

          {/* Education */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-8 h-1 bg-violet-600 mr-3 rounded-full"></span>
              Formation
            </h3>
            <div className="grid gap-4">
              {education.length > 0 ? education.map((edu, index) => (
                <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                    <p className="text-slate-600 text-sm">{edu.school}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
                    {edu.year}
                  </span>
                </div>
              )) : (
                <p className="text-slate-400 italic text-sm">Ajoutez vos formations...</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
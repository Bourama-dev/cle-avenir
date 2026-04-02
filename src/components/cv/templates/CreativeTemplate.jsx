import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Trophy, Star } from 'lucide-react';

export const CreativeTemplate = ({ data }) => {
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
    <div className="w-full bg-white shadow-2xl overflow-hidden print:shadow-none min-h-[1100px] flex flex-col font-sans text-slate-800">
      
      {/* Header with Unique Shape */}
      <div className="bg-emerald-900 text-emerald-50 p-12 pb-24 relative clip-path-slant">
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
         <div className="relative z-10">
            <h1 className="text-5xl font-bold mb-2">{personalInfo.firstName} <span className="font-light text-emerald-300">{personalInfo.lastName}</span></h1>
            <p className="text-2xl font-medium opacity-90">{personalInfo.title}</p>
         </div>
      </div>

      {/* Contact Info Bar - Floating */}
      <div className="mx-12 -mt-12 relative z-20 bg-white shadow-lg rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-emerald-900 font-medium">
         <div className="flex items-center gap-2 overflow-hidden"><Mail className="text-emerald-500 w-4 h-4 shrink-0" /> <span className="truncate">{personalInfo.email}</span></div>
         <div className="flex items-center gap-2"><Phone className="text-emerald-500 w-4 h-4 shrink-0" /> {personalInfo.phone}</div>
         <div className="flex items-center gap-2"><MapPin className="text-emerald-500 w-4 h-4 shrink-0" /> {personalInfo.location}</div>
         <div className="flex items-center gap-2"><Linkedin className="text-emerald-500 w-4 h-4 shrink-0" /> {personalInfo.linkedin}</div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-8 p-12 pt-16">
         
         {/* Main Content */}
         <div className="col-span-2 space-y-10">
            {summary && (
               <section>
                  <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                     <Star className="fill-emerald-100 text-emerald-600" /> A propos
                  </h3>
                  <div className="bg-emerald-50 p-6 rounded-2xl rounded-tl-none">
                     <p className="text-emerald-900 leading-relaxed">{summary}</p>
                  </div>
               </section>
            )}

            <section>
               <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                  <Trophy className="fill-emerald-100 text-emerald-600" /> Expérience
               </h3>
               <div className="space-y-8">
                  {experiences.map((exp, i) => (
                     <div key={i} className="pl-4 border-l-4 border-emerald-200">
                        <h4 className="text-lg font-bold text-slate-900">{exp.title}</h4>
                        <div className="text-emerald-700 font-semibold text-sm mb-2">{exp.company} • {exp.startDate} - {exp.endDate}</div>
                        <p className="text-slate-600 text-sm">{exp.description}</p>
                     </div>
                  ))}
               </div>
            </section>
         </div>

         {/* Sidebar */}
         <div className="col-span-1 space-y-8">
            
            <section>
               <h3 className="font-bold text-emerald-900 mb-4 border-b-2 border-emerald-100 pb-2">Compétences</h3>
               <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                     <span key={i} className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-full">{s}</span>
                  ))}
               </div>
            </section>

            <section>
               <h3 className="font-bold text-emerald-900 mb-4 border-b-2 border-emerald-100 pb-2">Formation</h3>
               <div className="space-y-4">
                  {education.map((edu, i) => (
                     <div key={i} className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-xs font-bold text-emerald-600 mb-1">{edu.year}</div>
                        <div className="font-bold text-sm text-slate-900">{edu.degree}</div>
                        <div className="text-xs text-slate-500">{edu.school}</div>
                     </div>
                  ))}
               </div>
            </section>

            <section>
               <h3 className="font-bold text-emerald-900 mb-4 border-b-2 border-emerald-100 pb-2">Langues</h3>
               <div className="space-y-2">
                  {languages.map((l, i) => (
                     <div key={i} className="flex justify-between text-sm">
                        <span>{l.name}</span>
                        <span className="font-bold text-emerald-600">{l.level}</span>
                     </div>
                  ))}
               </div>
            </section>

         </div>

      </div>
    </div>
  );
};
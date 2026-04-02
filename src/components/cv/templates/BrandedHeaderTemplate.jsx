import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

export const BrandedHeaderTemplate = ({ data }) => {
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
      
      {/* Brand Header */}
      <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white p-10 pb-20 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        
        {/* Logo Placement */}
        <div className="absolute top-6 right-8 flex items-center gap-2 opacity-90">
             <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
               <img-replace src="https://horizons-cdn.hostinger.com/2a3aa4e1-f89b-4701-ac95-2a5df475caa5/2d1c5f0606596e085f2619b523ecab85.png" alt="CléAvenir logo" className="w-4 h-4" />
             </div>
             <span className="font-bold tracking-tight text-white">
               CléAvenir
             </span>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto w-full text-center space-y-4">
           <h1 className="text-5xl font-bold tracking-tight mb-2">
             {personalInfo.firstName} {personalInfo.lastName}
           </h1>
           <p className="text-2xl font-light text-pink-100 tracking-wide uppercase">{personalInfo.title}</p>
        </div>
      </header>

      {/* Floating Contact Card */}
      <div className="max-w-4xl mx-auto w-full px-8 relative z-20 -mt-10">
         <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-slate-600">
            {personalInfo.email && <div className="flex items-center gap-2 hover:text-pink-600 transition-colors"><Mail size={16} className="text-violet-500"/> {personalInfo.email}</div>}
            {personalInfo.phone && <div className="flex items-center gap-2 hover:text-pink-600 transition-colors"><Phone size={16} className="text-violet-500"/> {personalInfo.phone}</div>}
            {personalInfo.location && <div className="flex items-center gap-2 hover:text-pink-600 transition-colors"><MapPin size={16} className="text-violet-500"/> {personalInfo.location}</div>}
            {personalInfo.linkedin && <div className="flex items-center gap-2 hover:text-pink-600 transition-colors"><Linkedin size={16} className="text-violet-500"/> {personalInfo.linkedin}</div>}
         </div>
      </div>

      <div className="max-w-4xl mx-auto w-full p-8 grid grid-cols-1 md:grid-cols-3 gap-10 mt-4">
         
         {/* Main Column */}
         <div className="md:col-span-2 space-y-10">
            {summary && (
              <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                 <h3 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-wider text-pink-600">Profil</h3>
                 <p className="text-slate-700 leading-relaxed text-justify">
                   {summary}
                 </p>
              </section>
            )}

            <section>
               <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-wider border-b-2 border-slate-100 pb-2 flex justify-between items-center">
                 Expérience
                 <span className="w-8 h-1 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"></span>
               </h3>
               <div className="space-y-8">
                 {experiences.map((exp, index) => (
                   <div key={index} className="group">
                      <div className="flex justify-between items-start mb-1">
                         <h4 className="text-xl font-bold text-slate-900 group-hover:text-violet-600 transition-colors">{exp.title}</h4>
                         <span className="text-xs font-bold text-slate-500 border border-slate-200 px-2 py-1 rounded bg-white whitespace-nowrap">
                           {exp.startDate} - {exp.endDate}
                         </span>
                      </div>
                      <div className="text-pink-600 font-semibold mb-3 text-sm">{exp.company}</div>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {exp.description}
                      </p>
                   </div>
                 ))}
               </div>
            </section>

             <section>
               <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-wider border-b-2 border-slate-100 pb-2 flex justify-between items-center">
                 Formation
                 <span className="w-8 h-1 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"></span>
               </h3>
               <div className="space-y-4">
                 {education.map((edu, index) => (
                   <div key={index} className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <div>
                         <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                         <p className="text-slate-500 text-sm">{edu.school}</p>
                      </div>
                      <span className="text-violet-600 font-bold text-sm">{edu.year}</span>
                   </div>
                 ))}
               </div>
            </section>
         </div>

         {/* Right Sidebar (Details) */}
         <div className="space-y-8">
            {skills.length > 0 && (
              <section className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                 <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-pink-400 relative z-10">Compétences</h3>
                 <div className="flex flex-col gap-2 relative z-10">
                   {skills.map((skill, index) => (
                     <span key={index} className="pb-2 border-b border-slate-700/50 last:border-0 font-medium text-sm">
                       {skill}
                     </span>
                   ))}
                 </div>
              </section>
            )}

            {languages.length > 0 && (
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-violet-600">Langues</h3>
                 <div className="space-y-3">
                   {languages.map((lang, index) => (
                     <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                           <span className="font-bold text-slate-700">{lang.name}</span>
                           <span className="text-slate-500">{lang.level}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 w-3/4 rounded-full"></div>
                        </div>
                     </div>
                   ))}
                 </div>
              </section>
            )}

            {interests.length > 0 && (
              <section>
                 <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-slate-400 text-sm">Intérêts</h3>
                 <div className="flex flex-wrap gap-2">
                   {interests.map((interest, index) => (
                     <span key={index} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                       {interest}
                     </span>
                   ))}
                 </div>
              </section>
            )}
         </div>

      </div>
    </div>
  );
};
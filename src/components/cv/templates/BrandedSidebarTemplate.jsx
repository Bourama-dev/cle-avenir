import React from 'react';
import { Mail, Phone, MapPin, Linkedin, GraduationCap, Briefcase, Languages, Heart } from 'lucide-react';

export const BrandedSidebarTemplate = ({ data }) => {
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
    <div className="w-full bg-white shadow-2xl overflow-hidden print:shadow-none min-h-[1100px] flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* Sidebar with Brand Colors */}
      <aside className="w-full md:w-1/3 bg-slate-900 text-white p-8 relative overflow-hidden flex flex-col">
        {/* Brand Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-900 to-violet-900/50 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-violet-600 z-10"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        {/* CléAvenir Logo Integration */}
        <div className="relative z-10 mb-10 flex items-center gap-2 opacity-80 border-b border-slate-800 pb-6">
           <div className="p-1.5 bg-gradient-to-br from-pink-500 to-violet-600 rounded-lg flex items-center justify-center">
             <img-replace src="https://horizons-cdn.hostinger.com/2a3aa4e1-f89b-4701-ac95-2a5df475caa5/2d1c5f0606596e085f2619b523ecab85.png" alt="CléAvenir logo" className="w-4 h-4" />
           </div>
           <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
             CléAvenir
           </span>
        </div>

        <div className="relative z-10 space-y-8 flex-1">
           {/* Contact Info */}
           <div className="space-y-4 text-sm">
              {personalInfo.email && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-pink-500 shrink-0">
                    <Mail size={14} />
                  </div>
                  <span className="text-slate-300 break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-pink-500 shrink-0">
                    <Phone size={14} />
                  </div>
                  <span className="text-slate-300">{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-pink-500 shrink-0">
                    <MapPin size={14} />
                  </div>
                  <span className="text-slate-300">{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-pink-500 shrink-0">
                    <Linkedin size={14} />
                  </div>
                  <span className="text-slate-300 break-all">{personalInfo.linkedin}</span>
                </div>
              )}
           </div>

           {/* Skills */}
           {skills.length > 0 && (
            <section>
               <h3 className="text-pink-400 font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
                 <div className="w-4 h-0.5 bg-pink-500"></div> Compétences
               </h3>
               <div className="flex flex-wrap gap-2">
                 {skills.map((skill, index) => (
                   <span key={index} className="px-2 py-1 bg-slate-800/50 border border-slate-700 rounded text-xs text-slate-300">
                     {skill}
                   </span>
                 ))}
               </div>
            </section>
           )}

           {/* Languages */}
           {languages.length > 0 && (
            <section>
               <h3 className="text-pink-400 font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
                 <div className="w-4 h-0.5 bg-pink-500"></div> Langues
               </h3>
               <div className="space-y-2 text-sm">
                 {languages.map((lang, index) => (
                   <div key={index} className="flex justify-between items-center border-b border-slate-800 pb-1 last:border-0">
                     <span className="text-slate-200">{lang.name}</span>
                     <span className="text-slate-500 text-xs">{lang.level}</span>
                   </div>
                 ))}
               </div>
            </section>
           )}
           
           {/* Interests */}
           {interests.length > 0 && (
            <section>
               <h3 className="text-pink-400 font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
                 <div className="w-4 h-0.5 bg-pink-500"></div> Intérêts
               </h3>
               <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-slate-400">
                  {interests.map((interest, index) => (
                    <span key={index} className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-violet-500"></span> {interest}
                    </span>
                  ))}
               </div>
            </section>
           )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full md:w-2/3 p-10 bg-white relative">
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-600 to-pink-500 md:hidden"></div>
         
         {/* Name & Title */}
         <div className="mb-10 border-b-2 border-slate-100 pb-8">
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">{personalInfo.firstName}</span> <span className="text-pink-600">{personalInfo.lastName}</span>
            </h1>
            <p className="text-2xl text-violet-600 font-medium">{personalInfo.title}</p>
         </div>

         <div className="space-y-10">
            {summary && (
              <section>
                 <p className="text-slate-600 leading-relaxed text-lg">
                   {summary}
                 </p>
              </section>
            )}

            {/* Experience */}
            <section>
               <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                 <div className="p-2 bg-pink-50 rounded-lg text-pink-600"><Briefcase size={20}/></div>
                 Expérience Professionnelle
               </h3>
               <div className="space-y-8 pl-4 border-l-2 border-slate-100">
                  {experiences.map((exp, index) => (
                    <div key={index} className="relative pl-6">
                       <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-pink-500 shadow-sm"></div>
                       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                          <h4 className="text-lg font-bold text-slate-900">{exp.title}</h4>
                          <span className="text-sm font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                            {exp.startDate} - {exp.endDate}
                          </span>
                       </div>
                       <div className="text-violet-600 font-semibold mb-3">{exp.company}</div>
                       <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                         {exp.description}
                       </p>
                    </div>
                  ))}
               </div>
            </section>

            {/* Education */}
            <section>
               <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                 <div className="p-2 bg-pink-50 rounded-lg text-pink-600"><GraduationCap size={20}/></div>
                 Formation
               </h3>
               <div className="grid gap-4">
                  {education.map((edu, index) => (
                    <div key={index} className="flex gap-4 items-start p-4 rounded-xl border border-slate-100 hover:border-pink-100 transition-colors bg-slate-50/50">
                       <div className="text-sm font-bold text-violet-600 min-w-[60px]">{edu.year}</div>
                       <div>
                          <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                          <p className="text-slate-600 text-sm">{edu.school}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
         </div>
      </main>
    </div>
  );
};
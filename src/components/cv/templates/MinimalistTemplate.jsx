import React from 'react';

export const MinimalistTemplate = ({ data }) => {
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
    <div className="w-full bg-white shadow-2xl overflow-hidden print:shadow-none min-h-[1100px] flex flex-col font-sans text-slate-900 p-16">
      
      {/* Header - Left Aligned, Massive Name */}
      <header className="mb-16">
        <h1 className="text-6xl font-black tracking-tighter mb-4 leading-none">
          {personalInfo.firstName}<br/>
          <span className="text-slate-400">{personalInfo.lastName}</span>
        </h1>
        <div className="flex justify-between items-end border-t-4 border-black pt-4">
            <p className="text-xl font-bold uppercase tracking-widest">{personalInfo.title}</p>
            <div className="text-right text-sm font-medium space-y-1">
                <p>{personalInfo.email}</p>
                <p>{personalInfo.phone}</p>
                <p>{personalInfo.location}</p>
                {personalInfo.linkedin && <p className="text-slate-500">{personalInfo.linkedin}</p>}
            </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column - Details */}
        <div className="col-span-4 space-y-12">
            {/* Contact is up top, moving to skills */}
            
            {skills.length > 0 && (
                <section>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-slate-400">Compétences</h3>
                    <div className="flex flex-col gap-2">
                        {skills.map((s, i) => <span key={i} className="font-bold border-b border-slate-100 pb-1">{s}</span>)}
                    </div>
                </section>
            )}

            {languages.length > 0 && (
                <section>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-slate-400">Langues</h3>
                    <div className="space-y-2">
                        {languages.map((l, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span className="font-bold">{l.name}</span>
                                <span className="text-slate-500">{l.level}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {education.length > 0 && (
                <section>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-slate-400">Formation</h3>
                    <div className="space-y-6">
                        {education.map((edu, i) => (
                            <div key={i}>
                                <div className="font-black text-sm">{edu.year}</div>
                                <div className="font-bold">{edu.degree}</div>
                                <div className="text-sm text-slate-500">{edu.school}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>

        {/* Right Column - Main */}
        <div className="col-span-8 space-y-12 border-l border-slate-100 pl-8">
            {summary && (
                <section>
                    <p className="text-lg font-medium leading-relaxed">
                        {summary}
                    </p>
                </section>
            )}

            <section>
                <h3 className="text-xs font-black uppercase tracking-widest mb-8 text-slate-400">Expérience</h3>
                <div className="space-y-10">
                    {experiences.map((exp, i) => (
                        <div key={i} className="relative">
                            <div className="flex justify-between items-baseline mb-2">
                                <h4 className="text-xl font-bold">{exp.title}</h4>
                                <span className="text-sm font-mono text-slate-400">{exp.startDate} — {exp.endDate}</span>
                            </div>
                            <div className="text-sm font-bold uppercase tracking-wide mb-3 text-slate-500">{exp.company}</div>
                            <p className="text-slate-800 text-sm leading-7">
                                {exp.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
            
            {interests.length > 0 && (
                <section className="pt-8 border-t border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-slate-400">Intérêts</h3>
                    <p className="text-sm font-medium">{interests.join(' / ')}</p>
                </section>
            )}

        </div>

      </div>
    </div>
  );
};
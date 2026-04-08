import React from 'react';
import { CVData } from '../types';
import { cn } from '../lib/utils';
import { Mail, Phone, MapPin, Globe, Award, BookOpen, Briefcase, User, CheckSquare, Heart, FileText } from 'lucide-react';

interface TemplateProps {
  data: CVData;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
};

// 1. Classic Minimal
export const ClassicMinimalTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ data }, ref) => {
  const { theme, personalInfo, careerObjective, education, computerSkills, workExperience, selectedSections } = data;
  return (
    <div ref={ref} className={cn("bg-white w-[210mm] p-[20mm] mx-auto shadow-lg print:shadow-none", theme.fontStyle)} style={{ minHeight: `${297 * theme.pageCount}mm` }}>
      <header className="text-center mb-10">
        <h1 className="text-4xl font-light tracking-widest uppercase mb-4" style={{ color: theme.primaryColor }}>{personalInfo.name}</h1>
        <div className="flex justify-center gap-6 text-xs text-gray-500 uppercase tracking-widest">
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.presentDistrict && <span>{personalInfo.presentDistrict}</span>}
        </div>
      </header>
      <div className="space-y-8">
        {selectedSections.includes('careerObjective') && (
          <section>
            <p className="text-center text-gray-600 italic leading-relaxed max-w-2xl mx-auto" style={{ fontSize: `${theme.fontSize}pt` }}>{careerObjective}</p>
          </section>
        )}
        {selectedSections.includes('education') && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 text-center text-gray-400">Education</h2>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i} className="text-center">
                  <h3 className="font-bold" style={{ fontSize: `${theme.fontSize}pt` }}>{edu.examName}</h3>
                  <p className="text-gray-500" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{edu.instituteName} • {edu.passingYear}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
});

// 2. Classic Elegant
export const ClassicElegantTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ data }, ref) => {
  const { theme, personalInfo, careerObjective, education, workExperience, selectedSections } = data;
  return (
    <div ref={ref} className={cn("bg-white w-[210mm] p-[15mm] mx-auto shadow-lg print:shadow-none font-serif", theme.fontStyle)} style={{ minHeight: `${297 * theme.pageCount}mm` }}>
      <header className="border-b-4 border-double pb-6 mb-8 text-center" style={{ borderColor: theme.primaryColor }}>
        <h1 className="text-4xl mb-2" style={{ color: theme.primaryColor }}>{personalInfo.name}</h1>
        <p className="text-sm italic text-gray-600">{personalInfo.presentVillage}, {personalInfo.presentDistrict} | {personalInfo.phone} | {personalInfo.email}</p>
      </header>
      <div className="space-y-6">
        {selectedSections.includes('workExperience') && (
          <section>
            <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor }}>Professional Experience</h2>
            {workExperience.map((work, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between font-bold">
                  <span>{work.position}</span>
                  <span>{work.duration}</span>
                </div>
                <p className="italic text-gray-700">{work.companyName}</p>
                <p className="text-sm mt-1">{work.description}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
});

// 3. Classic Bold
export const ClassicBoldTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ data }, ref) => {
  const { theme, personalInfo, education, computerSkills, selectedSections } = data;
  return (
    <div ref={ref} className={cn("bg-white w-[210mm] p-[15mm] mx-auto shadow-lg print:shadow-none", theme.fontStyle)} style={{ minHeight: `${297 * theme.pageCount}mm` }}>
      <header className="flex items-center gap-8 mb-10 bg-gray-900 text-white p-8 -mx-[15mm] -mt-[15mm]">
        {personalInfo.photo && <img src={personalInfo.photo} className="w-32 h-32 object-cover border-4 border-white" />}
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter">{personalInfo.name}</h1>
          <p className="text-xl opacity-80 font-bold mt-1" style={{ color: theme.primaryColor }}>Curriculum Vitae</p>
        </div>
      </header>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1 space-y-6">
          <section>
            <h2 className="text-lg font-black uppercase mb-3" style={{ color: theme.primaryColor }}>Contact</h2>
            <div className="space-y-2 text-sm">
              <p><b>P:</b> {personalInfo.phone}</p>
              <p><b>E:</b> {personalInfo.email}</p>
              <p><b>A:</b> {personalInfo.presentDistrict}</p>
            </div>
          </section>
        </div>
        <div className="col-span-2 space-y-8">
          {selectedSections.includes('education') && (
            <section>
              <h2 className="text-2xl font-black uppercase mb-4 border-l-8 pl-4" style={{ color: theme.primaryColor, borderColor: theme.primaryColor }}>Education</h2>
              {education.map((edu, i) => (
                <div key={i} className="mb-4">
                  <h3 className="text-xl font-bold">{edu.examName}</h3>
                  <p className="font-bold text-gray-500">{edu.instituteName} | {edu.passingYear}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
});

// 4. Modern Creative
export const ModernCreativeTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ data }, ref) => {
  const { theme, personalInfo, careerObjective, computerSkills, selectedSections } = data;
  return (
    <div ref={ref} className={cn("bg-white w-[210mm] mx-auto shadow-lg print:shadow-none flex", theme.fontStyle)} style={{ minHeight: `${297 * theme.pageCount}mm` }}>
      <div className="w-1/3 bg-gray-50 p-8 border-r">
        <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-8 border-8 border-white shadow-lg">
          <img src={personalInfo.photo || 'https://picsum.photos/seed/user/200/200'} className="w-full h-full object-cover" />
        </div>
        <section className="mb-8">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Contact</h2>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3"><Phone size={14} /> {personalInfo.phone}</div>
            <div className="flex items-center gap-3"><Mail size={14} /> {personalInfo.email}</div>
          </div>
        </section>
      </div>
      <div className="w-2/3 p-12">
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-2" style={{ color: theme.primaryColor }}>{personalInfo.name?.split(' ')[0]}<br/><span className="text-gray-200">{personalInfo.name?.split(' ').slice(1).join(' ')}</span></h1>
        <div className="h-2 w-24 mb-12" style={{ backgroundColor: theme.primaryColor }} />
        {selectedSections.includes('careerObjective') && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            <p className="text-gray-600 leading-relaxed">{careerObjective}</p>
          </section>
        )}
      </div>
    </div>
  );
});

// 5. Modern Compact
export const ModernCompactTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ data }, ref) => {
  const { theme, personalInfo, education, workExperience, selectedSections } = data;
  return (
    <div ref={ref} className={cn("bg-white w-[210mm] p-8 mx-auto shadow-lg print:shadow-none flex gap-8", theme.fontStyle)} style={{ minHeight: `${297 * theme.pageCount}mm` }}>
      <div className="w-1/4 space-y-6">
        <div className="w-full aspect-square bg-gray-200 rounded-2xl overflow-hidden">
          {personalInfo.photo && <img src={personalInfo.photo} className="w-full h-full object-cover" />}
        </div>
        <section>
          <h2 className="text-xs font-bold uppercase text-gray-400 mb-2">Info</h2>
          <p className="text-xs font-bold">{personalInfo.phone}</p>
          <p className="text-xs font-bold truncate">{personalInfo.email}</p>
        </section>
      </div>
      <div className="flex-1">
        <h1 className="text-4xl font-black mb-6">{personalInfo.name}</h1>
        <div className="space-y-8">
          {selectedSections.includes('workExperience') && (
            <section>
              <h2 className="text-sm font-black uppercase tracking-widest mb-4 inline-block px-2 py-1 bg-gray-900 text-white">Experience</h2>
              <div className="space-y-4">
                {workExperience.map((work, i) => (
                  <div key={i}>
                    <h3 className="font-bold">{work.position}</h3>
                    <p className="text-xs text-indigo-600 font-bold">{work.companyName}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
});

// 6. Modern Split
export const ModernSplitTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ data }, ref) => {
  const { theme, personalInfo, careerObjective, education, selectedSections } = data;
  return (
    <div ref={ref} className={cn("bg-white w-[210mm] mx-auto shadow-lg print:shadow-none", theme.fontStyle)} style={{ minHeight: `${297 * theme.pageCount}mm` }}>
      <header className="grid grid-cols-2 h-48">
        <div className="bg-gray-900 text-white p-12 flex flex-col justify-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter">{personalInfo.name}</h1>
          <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs mt-2">Professional Profile</p>
        </div>
        <div className="p-12 flex flex-col justify-center border-b" style={{ backgroundColor: `${theme.primaryColor}11` }}>
          <div className="space-y-1 text-sm font-bold">
            <p>{personalInfo.phone}</p>
            <p>{personalInfo.email}</p>
            <p>{personalInfo.presentDistrict}</p>
          </div>
        </div>
      </header>
      <div className="p-12">
        {selectedSections.includes('careerObjective') && (
          <section className="mb-12">
            <h2 className="text-2xl font-black mb-4 flex items-center gap-4">
              <span className="w-12 h-1 bg-gray-900" />
              Objective
            </h2>
            <p className="text-gray-600 leading-relaxed pl-16">{careerObjective}</p>
          </section>
        )}
      </div>
    </div>
  );
});

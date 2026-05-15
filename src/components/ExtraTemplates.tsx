import React from 'react';
import { CVData } from '../types';
import { cn } from '../lib/utils';
import { Mail, Phone, MapPin, Globe, Award, BookOpen, Briefcase, User, CheckSquare, Heart, FileText, Info, Check } from 'lucide-react';

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

const formatAddress = (village: string, po: string, upazila: string, district: string) => {
  const parts = [];
  if (village) parts.push(village);
  if (po) parts.push(po);
  if (upazila) parts.push(upazila);
  if (district) parts.push(district);
  return parts.join(', ');
};

// 1. Classic Elegant
export const ClassicElegantTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ data }, ref) => {
  const { theme, personalInfo, careerObjective, education, computerSkills, trainings, workExperience, languageProficiency, selfAssessment, hobbies, declaration, customSection, selectedSections, references } = data;
  
  const presentAddressLine = formatAddress(personalInfo.presentVillage, personalInfo.presentPostOffice, personalInfo.presentUpazila, personalInfo.presentDistrict);
  const permanentAddressLine = formatAddress(personalInfo.permanentVillage, personalInfo.permanentPostOffice, personalInfo.permanentUpazila, personalInfo.permanentDistrict);

  return (
    <div 
      ref={ref} 
      className={cn("bg-white w-[210mm] mx-auto shadow-lg print:shadow-none font-serif relative cv-paper", theme.fontStyle)} 
      style={{ 
        minHeight: `${297 * theme.pageCount}mm`,
        padding: `${theme.pageMargin}mm`
      }}
    >
      <header className={cn(
        "border-b-4 border-double pb-6 mb-8 text-center -mx-6 p-6 transition-all shrink-0",
        theme.headerStyle === 'black' ? "bg-black text-white" : (theme.headerStyle === 'primary' ? "bg-indigo-600 text-white" : "")
      )}
      style={{ 
        borderColor: theme.primaryColor,
        backgroundColor: theme.headerStyle === 'black' ? '#000000' : (theme.headerStyle === 'primary' ? theme.primaryColor : 'transparent'),
        color: (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? (theme.primaryColor === '#ffd700' && theme.headerStyle === 'primary' ? '#000000' : '#ffffff') : 'inherit'
      }}>
        <h1 
          contentEditable={theme.editableMode} 
          suppressContentEditableWarning 
          className="text-4xl mb-2 font-serif uppercase tracking-widest outline-none focus:ring-1 focus:ring-indigo-300" 
          style={{ color: (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? 'inherit' : theme.primaryColor }}
        >
          {personalInfo.name || 'YOUR NAME'}
        </h1>
        <p className={cn("text-sm italic", (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? "text-white/80" : "text-gray-600")}>
          <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{presentAddressLine}</span> 
          {personalInfo.phone && <span className="mx-1">|</span>}
          {personalInfo.phone && <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.phone}</span>}
          {personalInfo.email && <span className="mx-1">|</span>}
          {personalInfo.email && <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.email}</span>}
        </p>
      </header>
      
      <div className="space-y-8 flex-1 overflow-y-auto thin-scrollbar" style={{ lineHeight: theme.lineSpacing === -50 ? 0.7 : theme.lineSpacing }}>
        {selectedSections.map((sectionId) => {
          if (sectionId === 'careerObjective' && careerObjective) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Career Objective</h2>
                <p contentEditable={theme.editableMode} suppressContentEditableWarning className="text-justify leading-relaxed outline-none focus:ring-1 focus:ring-indigo-300" style={{ fontSize: `${theme.fontSize}pt` }}>{careerObjective}</p>
              </section>
            );
          }

          if (sectionId === 'education' && education.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Academic Qualification</h2>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between font-bold" style={{ fontSize: `${theme.fontSize}pt` }}>
                        <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{edu.examName}</span>
                        <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{edu.passingYear}</span>
                      </div>
                      <p className="italic text-gray-700" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                        <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{edu.instituteName}</span> | <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{edu.board} Board</span>
                      </p>
                      <p style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                        Group: <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{edu.subject}</span> | Result: <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{edu.gpa} ({edu.gpaType})</span>
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'workExperience' && workExperience.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Professional Experience</h2>
                {workExperience.map((work) => (
                  <div key={work.id} className="mb-4">
                    <div className="flex justify-between font-bold" style={{ fontSize: `${theme.fontSize}pt` }}>
                      <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{work.position}</span>
                      <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{work.duration}</span>
                    </div>
                    <p contentEditable={theme.editableMode} suppressContentEditableWarning className="italic text-gray-700 outline-none" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{work.companyName}</p>
                    <p contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none mt-1 whitespace-pre-wrap" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{work.description}</p>
                  </div>
                ))}
              </section>
            );
          }

          if (sectionId === 'trainings' && trainings && trainings.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Professional Trainings</h2>
                <div className="space-y-4">
                  {trainings.map((training) => (
                    <div key={training.id} className="mb-4">
                      <div className="flex justify-between font-bold" style={{ fontSize: `${theme.fontSize}pt` }}>
                        <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{training.subject}</span>
                        <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{training.duration}</span>
                      </div>
                      <p contentEditable={theme.editableMode} suppressContentEditableWarning className="italic text-gray-700 outline-none" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{training.instituteName}</p>
                      {training.description && <p contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none mt-1 whitespace-pre-wrap" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{training.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'computerSkills' && computerSkills.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Computer Skills</h2>
                <div className="space-y-2">
                  {computerSkills.map((skill) => (
                    <div key={skill.id} style={{ fontSize: `${theme.fontSize}pt` }}>
                      {skill.hasTraining && (
                        <p className="italic text-gray-600 mb-1" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                          Completed <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{skill.duration}</span> training from <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{skill.instituteName}</span>.
                        </p>
                      )}
                      <p>Proficient in <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{skill.skills.join(', ')}</span>.</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'languageProficiency' && languageProficiency.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Language Proficiency</h2>
                <p contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none" style={{ fontSize: `${theme.fontSize}pt` }}>{languageProficiency.join(', ')}</p>
              </section>
            );
          }

          if (sectionId === 'selfAssessment' && selfAssessment.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Self Assessment</h2>
                <ul className="list-disc list-inside space-y-1" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                  {selfAssessment.map((item, i) => <li key={`self-${i}-${item}`} contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{item}</li>)}
                </ul>
              </section>
            );
          }

          if (sectionId === 'hobbies' && hobbies.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Hobbies & Interests</h2>
                <p contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none" style={{ fontSize: `${theme.fontSize}pt` }}>{hobbies.join(', ')}</p>
              </section>
            );
          }

          if (sectionId === 'personalInfo') {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Personal Details</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                  <p><strong>Father's Name:</strong> <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.fathersName}</span></p>
                  <p><strong>Mother's Name:</strong> <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.mothersName}</span></p>
                  <p><strong>Date of Birth:</strong> <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{formatDate(personalInfo.dob)}</span></p>
                  <p><strong>Gender:</strong> <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.gender}</span></p>
                  <p><strong>Nationality:</strong> <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.nationality}</span></p>
                  <p><strong>Religion:</strong> <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.religion}</span></p>
                  <p><strong>Marital Status:</strong> <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.maritalStatus}</span></p>
                  <p><strong>NID No:</strong> <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.nid}</span></p>
                  <p><strong>Birth Reg No:</strong> <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.birthRegNo}</span></p>
                  <p><strong>Blood Group:</strong> <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.bloodGroup}</span></p>
                  <p><strong>Height:</strong> <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.heightFeet || personalInfo.heightInches ? `${personalInfo.heightFeet || '0'}' ${personalInfo.heightInches || '0'}"` : ''}</span></p>
                  <p><strong>Weight:</strong> <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.weight ? `${personalInfo.weight} Kg` : ''}</span></p>
                  <p className="col-span-2"><strong>Permanent Address:</strong> <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{permanentAddressLine}</span></p>
                </div>
              </section>
            );
          }

          if (sectionId === 'references' && references && references.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>References</h2>
                <div className="grid grid-cols-2 gap-8">
                  {references.map((ref) => (
                    <div key={ref.id} style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                      <p contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold outline-none">{ref.name}</p>
                      <p><span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{ref.position}</span> | <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{ref.organization}</span></p>
                      <p>Phone: <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{ref.phone}</span></p>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'custom' && customSection && customSection.fields.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>{customSection.title}</h2>
                <div className="space-y-2" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                  {customSection.fields.map((field) => (
                    <p key={field.id}><strong>{field.label}:</strong> <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{field.value}</span></p>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'declaration' && declaration) {
            return (
              <section key={sectionId} className="mt-8 break-inside-avoid">
                <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Declaration</h2>
                <p contentEditable={theme.editableMode} suppressContentEditableWarning className="italic text-gray-600 outline-none whitespace-pre-wrap" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{declaration}</p>
                <div className="mt-12 flex flex-col items-end">
                  {personalInfo.signature && <img src={personalInfo.signature} className="h-10 mb-2" />}
                  <div className="w-48 border-t border-gray-900 pt-1 text-center font-bold" style={{ fontSize: `${theme.fontSize}pt` }}>
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.name}</span>
                  </div>
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
});

// 2. Modern Minimalist
export const ModernMinimalistTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ data }, ref) => {
  const { theme, personalInfo, careerObjective, education, computerSkills, trainings, workExperience, languageProficiency, selfAssessment, hobbies, declaration, customSection, selectedSections, references } = data;
  
  const presentAddressLine = formatAddress(personalInfo.presentVillage, personalInfo.presentPostOffice, personalInfo.presentUpazila, personalInfo.presentDistrict);

  return (
    <div 
      ref={ref} 
      className={cn("bg-white w-[210mm] mx-auto shadow-lg print:shadow-none font-sans relative cv-paper overflow-hidden", theme.fontStyle)} 
      style={{ 
        minHeight: `${297 * theme.pageCount}mm`,
        padding: `${theme.pageMargin}mm`
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16 z-0" style={{ backgroundColor: `${theme.primaryColor}11` }} />
      
      <header className="relative z-10 mb-12 flex justify-between items-end">
        <div>
          <h1 
            contentEditable={theme.editableMode} 
            suppressContentEditableWarning 
            className="text-5xl font-black uppercase tracking-tighter outline-none mb-2" 
            style={{ color: theme.primaryColor }}
          >
            {personalInfo.name || 'YOUR NAME'}
          </h1>
          <div className="flex flex-col gap-1 text-gray-500 font-medium" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
            <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none flex items-center gap-2 tracking-tight"><Mail size={12} /> {personalInfo.email}</span>
            <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none flex items-center gap-2"><Phone size={12} /> {personalInfo.phone}</span>
            <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none flex items-center gap-2"><MapPin size={12} /> {presentAddressLine}</span>
          </div>
        </div>
        {personalInfo.photo && (
          <div className="w-28 h-28 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-xl ring-4 ring-offset-4 ring-gray-100" style={{ ringColor: `${theme.primaryColor}22` }}>
            <img src={personalInfo.photo} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        )}
      </header>

      <div className="grid grid-cols-12 gap-10 relative z-10">
        <div className="col-span-8 space-y-10">
          {selectedSections.map((sectionId) => {
            if (sectionId === 'careerObjective' && careerObjective) {
              return (
                <section key={sectionId} className="break-inside-avoid">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Brief</h2>
                  <p contentEditable={theme.editableMode} suppressContentEditableWarning className="text-gray-700 leading-relaxed outline-none" style={{ fontSize: `${theme.fontSize}pt` }}>{careerObjective}</p>
                </section>
              );
            }
            if (sectionId === 'workExperience' && workExperience.length > 0) {
              return (
                <section key={sectionId} className="break-inside-avoid">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Experience</h2>
                  <div className="space-y-8">
                    {workExperience.map((work) => (
                      <div key={work.id} className="relative pl-6 border-l-2" style={{ borderColor: `${theme.primaryColor}22` }}>
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2" style={{ borderColor: theme.primaryColor }} />
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold text-gray-900 outline-none" style={{ fontSize: `${theme.fontSize + 1}pt` }}>{work.position}</h3>
                          <span contentEditable={theme.editableMode} suppressContentEditableWarning className="text-xs font-bold text-gray-400 outline-none">{work.duration}</span>
                        </div>
                        <p contentEditable={theme.editableMode} suppressContentEditableWarning className="text-gray-500 font-medium mb-2 outline-none" style={{ fontSize: `${theme.fontSize}pt` }}>{work.companyName}</p>
                        <p contentEditable={theme.editableMode} suppressContentEditableWarning className="text-gray-600 outline-none whitespace-pre-wrap" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{work.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            if (sectionId === 'education' && education.length > 0) {
              return (
                <section key={sectionId} className="break-inside-avoid">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Education</h2>
                  <div className="space-y-6">
                    {education.map((edu) => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold text-gray-900 outline-none" style={{ fontSize: `${theme.fontSize}pt` }}>{edu.examName}</h3>
                          <span contentEditable={theme.editableMode} suppressContentEditableWarning className="text-xs font-bold text-gray-400 outline-none">{edu.passingYear}</span>
                        </div>
                        <p className="text-gray-500 font-medium" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                          <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{edu.instituteName}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            return null;
          })}
        </div>

        <div className="col-span-4 space-y-10">
          {selectedSections.map((sectionId) => {
            if (sectionId === 'computerSkills' && computerSkills.length > 0) {
              return (
                <section key={sectionId} className="break-inside-avoid">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Expertise</h2>
                  <div className="flex flex-wrap gap-2">
                    {computerSkills.flatMap(s => s.skills).map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-600 uppercase tracking-wider">{skill}</span>
                    ))}
                  </div>
                </section>
              );
            }
            if (sectionId === 'personalInfo') {
              return (
                <section key={sectionId} className="break-inside-avoid">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Details</h2>
                  <div className="space-y-3" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-300">Father</p>
                      <p className="font-medium text-gray-700">{personalInfo.fathersName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-300">Mother</p>
                      <p className="font-medium text-gray-700">{personalInfo.mothersName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-300">Birth</p>
                      <p className="font-medium text-gray-700">{formatDate(personalInfo.dob)}</p>
                    </div>
                  </div>
                </section>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
});

// 3. Executive Elite
export const ExecutiveEliteTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ data }, ref) => {
  const { theme, personalInfo, careerObjective, education, computerSkills, trainings, workExperience, languageProficiency, selfAssessment, hobbies, declaration, customSection, selectedSections, references } = data;
  
  const addressLine = formatAddress(personalInfo.presentVillage, personalInfo.presentPostOffice, personalInfo.presentUpazila, personalInfo.presentDistrict);

  return (
    <div 
      ref={ref} 
      className={cn("bg-white w-[210mm] mx-auto shadow-lg print:shadow-none font-serif relative cv-paper flex", theme.fontStyle)} 
      style={{ 
        minHeight: `${297 * theme.pageCount}mm`
      }}
    >
      <div className="w-1/3 bg-slate-900 text-white p-8 flex flex-col pt-12" style={{ backgroundColor: theme.primaryColor }}>
        {personalInfo.photo && (
          <div className="w-full aspect-square bg-white/10 rounded-full mb-10 overflow-hidden border-4 border-white/20 p-2">
            <img src={personalInfo.photo} className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
          </div>
        )}
        
        <div className="space-y-8 flex-1">
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-white/50 mb-4 border-l-4 border-white/30 pl-3">Contact</h2>
            <div className="space-y-4 text-xs font-medium">
              <div className="flex items-start gap-3">
                <Mail size={14} className="shrink-0" />
                <span className="break-all">{personalInfo.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={14} className="shrink-0" />
                <span>{personalInfo.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={14} className="shrink-0" />
                <span>{addressLine}</span>
              </div>
            </div>
          </section>

          {selectedSections.map((sectionId) => {
            if (sectionId === 'computerSkills' && computerSkills.length > 0) {
              return (
                <section key={sectionId}>
                  <h2 className="text-xs font-black uppercase tracking-widest text-white/50 mb-4 border-l-4 border-white/30 pl-3">Skills</h2>
                  <div className="space-y-2">
                    {computerSkills.flatMap(s => s.skills).map((skill, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold uppercase">{skill}</span>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-white/60 w-4/5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            return null;
          })}
        </div>
      </div>

      <div className="flex-1 p-10 pt-12 bg-white text-slate-800">
        <header className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tight mb-1 outline-none" style={{ color: theme.primaryColor }}>{personalInfo.name}</h1>
          <p className="text-lg font-bold text-slate-400 capitalize">Executive Professional</p>
        </header>

        <div className="space-y-10">
          {selectedSections.map((sectionId) => {
            if (sectionId === 'careerObjective' && careerObjective) {
              return (
                <section key={sectionId}>
                  <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                    <span className="w-6 h-1 bg-slate-200 rounded-full" />
                    Profile
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-justify outline-none" style={{ fontSize: `${theme.fontSize}pt` }}>{careerObjective}</p>
                </section>
              );
            }
            if (sectionId === 'workExperience' && workExperience.length > 0) {
              return (
                <section key={sectionId}>
                  <h2 className="text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                    <span className="w-6 h-1 bg-slate-200 rounded-full" />
                    Experience
                  </h2>
                  <div className="space-y-8">
                    {workExperience.map((work) => (
                      <div key={work.id}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-black text-slate-900 outline-none" style={{ fontSize: `${theme.fontSize + 1}pt` }}>{work.position}</h3>
                            <p className="text-slate-500 font-black text-xs uppercase outline-none" style={{ color: theme.primaryColor }}>{work.companyName}</p>
                          </div>
                          <span className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-400 uppercase outline-none">{work.duration}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed outline-none" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{work.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
});

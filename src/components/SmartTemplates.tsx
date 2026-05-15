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

export const SmartClassicTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ data }, ref) => {
  const { theme, personalInfo, careerObjective, education, computerSkills, trainings, workExperience, languageProficiency, selfAssessment, hobbies, declaration, customSection, selectedSections, references } = data;

  const formatAddress = (village: string, po: string, upazila: string, district: string) => {
    const parts = [];
    if (village) parts.push(village);
    if (po) parts.push(po);
    if (upazila) parts.push(upazila);
    if (district) parts.push(district);
    return parts.join(', ');
  };

  const presentAddressLine = formatAddress(personalInfo.presentVillage, personalInfo.presentPostOffice, personalInfo.presentUpazila, personalInfo.presentDistrict);
  const permanentAddressLine = formatAddress(personalInfo.permanentVillage, personalInfo.permanentPostOffice, personalInfo.permanentUpazila, personalInfo.permanentDistrict);

  return (
    <div 
      ref={ref}
      className={cn(
        "bg-white w-[210mm] mx-auto shadow-lg print:shadow-none print:m-0 flex flex-col relative cv-paper",
        theme.fontStyle
      )}
      style={{ 
        minHeight: `${297 * theme.pageCount}mm`,
        padding: `${theme.pageMargin}mm`
      }}
    >
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: theme.primaryColor }} />

      {/* Header */}
      <header className={cn(
        "flex justify-between items-start mb-8 pt-6 p-6 -mx-6 shadow-sm shrink-0",
        theme.headerStyle === 'black' ? "bg-black text-white" : (theme.headerStyle === 'primary' ? "bg-indigo-600 text-white" : "")
      )}
      style={{ 
        backgroundColor: theme.headerStyle === 'black' ? '#000000' : (theme.headerStyle === 'primary' ? theme.primaryColor : 'transparent'),
        color: (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? (theme.primaryColor === '#ffd700' && theme.headerStyle === 'primary' ? '#000000' : '#ffffff') : 'inherit'
      }}>
        <div className="flex-1">
          <h1 
            contentEditable={theme.editableMode}
            suppressContentEditableWarning
            className="text-3xl font-black uppercase tracking-tighter mb-1 outline-none focus:ring-1 focus:ring-indigo-300" 
            style={{ color: (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? 'inherit' : theme.primaryColor }}
          >
            {personalInfo.name || 'Your Name'}
          </h1>
          <div className={cn("flex flex-wrap gap-4", (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? "text-white/80" : "text-gray-600")} style={{ fontSize: `${theme.fontSize - 1}pt` }}>
            {personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone size={12} style={{ color: (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? 'inherit' : theme.primaryColor }} />
                <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail size={12} style={{ color: (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? 'inherit' : theme.primaryColor }} />
                <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none tracking-tight">{personalInfo.email}</span>
              </div>
            )}
            {presentAddressLine && (
              <div className="flex items-center gap-1">
                <MapPin size={12} style={{ color: (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? 'inherit' : theme.primaryColor }} />
                <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{presentAddressLine}</span>
              </div>
            )}
          </div>
        </div>
        {personalInfo.photo && (
          <div className="w-24 h-32 border-2 rounded-lg overflow-hidden shrink-0 ml-6 bg-white shadow-md relative group" style={{ borderColor: theme.primaryColor }}>
            <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        )}
      </header>

      <div className="space-y-6 flex-1 overflow-y-auto thin-scrollbar" style={{ lineHeight: theme.lineSpacing === -50 ? 0.7 : theme.lineSpacing }}>
        {selectedSections.map((sectionId) => {
          if (sectionId === 'careerObjective' && careerObjective) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b-2 mb-2 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
                  Career Objective
                </h2>
                <p 
                  contentEditable={theme.editableMode}
                  suppressContentEditableWarning
                  className="text-justify leading-relaxed outline-none focus:ring-1 focus:ring-indigo-300" 
                  style={{ fontSize: `${theme.fontSize}pt` }}
                >
                  {careerObjective}
                </p>
              </section>
            );
          }

          if (sectionId === 'education' && education.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
                  Educational Qualification
                </h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="grid grid-cols-[1fr_auto] gap-2">
                      <div>
                        <h3 
                          contentEditable={theme.editableMode}
                          suppressContentEditableWarning
                          className="font-bold outline-none" 
                          style={{ fontSize: `${theme.fontSize}pt` }}
                        >
                          {edu.examName}
                        </h3>
                        <p className="text-gray-600" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                          <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{edu.instituteName}</span>
                        </p>
                        <p className="text-gray-500 italic" style={{ fontSize: `${theme.fontSize - 2}pt` }}>
                          <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{edu.board} Board</span> | <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{edu.subject}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span 
                          contentEditable={theme.editableMode}
                          suppressContentEditableWarning
                          className="font-bold outline-none" 
                          style={{ color: theme.primaryColor, fontSize: `${theme.fontSize}pt` }}
                        >
                          {edu.gpa}
                        </span>
                        <p 
                          contentEditable={theme.editableMode}
                          suppressContentEditableWarning
                          className="text-gray-500 outline-none" 
                          style={{ fontSize: `${theme.fontSize - 2}pt` }}
                        >
                          {edu.passingYear}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'workExperience' && workExperience.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {workExperience.map((work) => (
                    <div key={work.id}>
                      <div className="flex justify-between items-center mb-1">
                        <h3 contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold outline-none" style={{ fontSize: `${theme.fontSize}pt` }}>{work.position}</h3>
                        <span contentEditable={theme.editableMode} suppressContentEditableWarning className="text-gray-500 font-medium outline-none" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{work.duration}</span>
                      </div>
                      <p contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold text-gray-700 outline-none" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{work.companyName}</p>
                      <p contentEditable={theme.editableMode} suppressContentEditableWarning className="text-gray-600 mt-1 whitespace-pre-wrap outline-none" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{work.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'trainings' && trainings && trainings.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
                  Professional Trainings
                </h2>
                <div className="space-y-4">
                  {trainings.map((training) => (
                    <div key={training.id}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold uppercase outline-none" style={{ fontSize: `${theme.fontSize}pt` }}>{training.subject}</h3>
                        <span contentEditable={theme.editableMode} suppressContentEditableWarning className="text-gray-500 font-medium outline-none" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{training.duration}</span>
                      </div>
                      <p contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold text-gray-700 italic outline-none" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{training.instituteName}</p>
                      {training.description && <p contentEditable={theme.editableMode} suppressContentEditableWarning className="text-gray-600 mt-1 whitespace-pre-wrap outline-none" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{training.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'computerSkills' && computerSkills.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
                  Computer Skills
                </h2>
                <div className="space-y-2">
                  {computerSkills.map((skill) => (
                    <div key={skill.id}>
                      {skill.hasTraining && (
                        <p style={{ fontSize: `${theme.fontSize - 1}pt` }} className="mb-1 text-gray-700 font-medium outline-none">
                          Completed a <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{skill.duration}</span> training from <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{skill.instituteName}</span>.
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {skill.skills.map((s, sIdx) => (
                          <span key={`${skill.id}-skill-${sIdx}`} contentEditable={theme.editableMode} suppressContentEditableWarning className="px-3 py-1 bg-gray-100 rounded-full font-medium text-indigo-700 outline-none" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'languageProficiency' && languageProficiency.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
                  Language Proficiency
                </h2>
                <div className="flex flex-wrap gap-4">
                  {languageProficiency.map((lang, idx) => (
                    <div key={`lang-${idx}-${lang}`} className="flex items-center gap-2" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                      <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{lang}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'selfAssessment' && selfAssessment.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
                  Self Assessment
                </h2>
                <ul className="list-disc list-inside space-y-1" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                  {selfAssessment.map((item, idx) => (
                    <li key={`self-${idx}-${item}`} contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{item}</li>
                  ))}
                </ul>
              </section>
            );
          }

          if (sectionId === 'hobbies' && hobbies.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
                  Hobbies & Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {hobbies.map((hobby, idx) => (
                    <span key={`hobby-${idx}-${hobby}`} contentEditable={theme.editableMode} suppressContentEditableWarning className="px-3 py-1 border rounded-lg outline-none" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                      {hobby}
                    </span>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'personalInfo') {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
                  Personal Details
                </h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-bold text-gray-600">Father's Name</span>
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.fathersName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-bold text-gray-600">Mother's Name</span>
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.mothersName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-bold text-gray-600">Date of Birth</span>
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{formatDate(personalInfo.dob)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-bold text-gray-600">Gender</span>
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.gender}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-bold text-gray-600">Nationality</span>
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.nationality}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-bold text-gray-600">Religion</span>
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.religion}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-bold text-gray-600">Marital Status</span>
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.maritalStatus}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-bold text-gray-600">NID No</span>
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.nid}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-bold text-gray-600">Birth Reg No</span>
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.birthRegNo}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-bold text-gray-600">Blood Group</span>
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-bold text-gray-600">Height</span>
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.heightFeet || personalInfo.heightInches ? `${personalInfo.heightFeet || '0'}' ${personalInfo.heightInches || '0'}"` : ''}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="font-bold text-gray-600">Weight</span>
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.weight ? `${personalInfo.weight} Kg` : ''}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1 col-span-2">
                    <span className="font-bold text-gray-600">Permanent Address</span>
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{permanentAddressLine}</span>
                  </div>
                </div>
              </section>
            );
          }

          if (sectionId === 'references' && references && references.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
                  References
                </h2>
                <div className="grid grid-cols-2 gap-8">
                  {references.map((ref) => (
                    <div key={ref.id} style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                      <p contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold outline-none">{ref.name}</p>
                      <p contentEditable={theme.editableMode} suppressContentEditableWarning className="text-gray-600 outline-none">{ref.position}</p>
                      <p contentEditable={theme.editableMode} suppressContentEditableWarning className="text-gray-600 outline-none">{ref.organization}</p>
                      <p contentEditable={theme.editableMode} suppressContentEditableWarning className="text-gray-600 outline-none">{ref.phone}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'custom' && customSection && customSection.fields.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
                  {customSection.title}
                </h2>
                <div className="space-y-2" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                  {customSection.fields.map((field) => (
                    <div key={field.id} className="flex justify-between border-b border-gray-50 pb-1">
                      <span className="font-bold text-gray-600">{field.label}</span>
                      <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{field.value}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'declaration' && declaration) {
            return (
              <section key={sectionId} className="mt-8 break-inside-avoid">
                <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
                  Declaration
                </h2>
                <p contentEditable={theme.editableMode} suppressContentEditableWarning className="text-justify italic text-gray-600 outline-none whitespace-pre-wrap" style={{ fontSize: `${theme.fontSize - 0.5}pt` }}>
                  "{declaration}"
                </p>
                <div className="mt-12 flex flex-col items-end">
                  {personalInfo.signature && (
                    <img src={personalInfo.signature} alt="Signature" className="h-10 object-contain mb-2" />
                  )}
                  <div className="w-48 border-t border-gray-900 pt-1 text-center">
                    <p contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold outline-none" style={{ fontSize: `${theme.fontSize}pt` }}>{personalInfo.name}</p>
                  </div>
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>

      {/* Watermark/Footer */}
      <footer className="mt-auto pt-8 text-center">
        <p className="text-[9pt] font-bold italic transition-colors hover:text-emerald-600" style={{ color: theme.primaryColor + '60' }}>
          Professionally Crafted by Maksud Computer Digital Hub
        </p>
      </footer>
    </div>
  );
});

export const SmartModernTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ data }, ref) => {
  const { theme, personalInfo, careerObjective, education, computerSkills, trainings, workExperience, languageProficiency, selfAssessment, hobbies, declaration, customSection, selectedSections, references } = data;

  const formatAddress = (village: string, po: string, upazila: string, district: string) => {
    const parts = [];
    if (village) parts.push(village);
    if (po) parts.push(po);
    if (upazila) parts.push(upazila);
    if (district) parts.push(district);
    return parts.join(', ');
  };

  const presentAddressLine = formatAddress(personalInfo.presentVillage, personalInfo.presentPostOffice, personalInfo.presentUpazila, personalInfo.presentDistrict);
  const permanentAddressLine = formatAddress(personalInfo.permanentVillage, personalInfo.permanentPostOffice, personalInfo.permanentUpazila, personalInfo.permanentDistrict);

  return (
    <div 
      ref={ref}
      className={cn(
        "bg-white w-[210mm] mx-auto shadow-lg print:shadow-none print:m-0 flex relative cv-paper",
        theme.fontStyle
      )}
      style={{ 
        minHeight: `${297 * theme.pageCount}mm`,
        padding: `${theme.pageMargin}mm`
      }}
    >
      {/* Sidebar */}
      <aside className="w-[75mm] flex-shrink-0 p-8 text-white flex flex-col shadow-2xl z-10" 
      style={{ 
        backgroundColor: theme.headerStyle === 'black' ? '#000000' : (theme.headerStyle === 'primary' ? theme.primaryColor : theme.primaryColor),
        color: (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? (theme.primaryColor === '#ffd700' && theme.headerStyle === 'primary' ? '#000000' : '#ffffff') : '#ffffff'
      }}>
        {personalInfo.photo && (
          <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden mx-auto mb-8 shadow-xl bg-white">
            <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        )}

        <div className="space-y-8">
          <section>
            <h3 className="text-sm font-black uppercase tracking-widest mb-4 border-b border-white/20 pb-2">Contact</h3>
            <div className="space-y-3" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
              {personalInfo.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={14} className="opacity-70" />
                  <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.email && (
                <div className="flex items-center gap-3">
                  <Mail size={14} className="opacity-70" />
                  <span contentEditable={theme.editableMode} suppressContentEditableWarning className="break-all outline-none">{personalInfo.email}</span>
                </div>
              )}
              {presentAddressLine && (
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="opacity-70 mt-1 shrink-0" />
                  <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{presentAddressLine}</span>
                </div>
              )}
            </div>
          </section>

          {selectedSections.includes('computerSkills') && computerSkills.length > 0 && (
            <section>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 border-b border-white/20 pb-2">Skills</h3>
              <div className="space-y-4">
                {computerSkills.map((skill) => (
                  <div key={skill.id}>
                    {skill.hasTraining && (
                      <p className="text-[10px] opacity-60 mb-2">
                        <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{skill.duration}</span> training at <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{skill.instituteName}</span>
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {skill.skills.map((s, sIdx) => (
                        <span key={`${skill.id}-skill-${sIdx}`} contentEditable={theme.editableMode} suppressContentEditableWarning className="px-2 py-1 bg-white/10 rounded text-xs font-medium outline-none">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {selectedSections.includes('languageProficiency') && languageProficiency.length > 0 && (
            <section>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 border-b border-white/20 pb-2">Languages</h3>
              <div className="space-y-2" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                {languageProficiency.map((lang, idx) => (
                  <div key={`lang-${idx}-${lang}`} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-white" />
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{lang}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {selectedSections.includes('hobbies') && hobbies.length > 0 && (
            <section>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 border-b border-white/20 pb-2">Hobbies</h3>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((hobby, idx) => (
                  <span key={`hobby-${idx}-${hobby}`} contentEditable={theme.editableMode} suppressContentEditableWarning className="px-2 py-1 bg-white/10 rounded text-xs font-medium outline-none">
                    {hobby}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="mt-auto pt-8 text-center">
          <p className="text-[9pt] font-bold italic transition-colors" style={{ color: '#ffffff' + '80' }}>
            Professionally Crafted by Maksud Computer Digital Hub
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 flex flex-col pt-0 h-full overflow-y-auto thin-scrollbar" style={{ lineHeight: theme.lineSpacing === -50 ? 0.7 : theme.lineSpacing }}>
        <header className="mb-10 pt-10">
          <h1 
            contentEditable={theme.editableMode}
            suppressContentEditableWarning
            className="text-4xl font-black uppercase tracking-tight mb-2 outline-none focus:ring-1 focus:ring-indigo-300" 
            style={{ color: theme.primaryColor }}
          >
            {personalInfo.name || 'Your Name'}
          </h1>
          <div className="h-1 w-20 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
        </header>

        <div className="space-y-10 flex-1">
          {selectedSections.map((sectionId) => {
            if (sectionId === 'careerObjective' && careerObjective) {
              return (
                <section key={sectionId} className="break-inside-avoid">
                  <h2 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-3">
                    <FileText size={20} style={{ color: theme.primaryColor }} />
                    <span>About Me</span>
                  </h2>
                  <p 
                    contentEditable={theme.editableMode}
                    suppressContentEditableWarning
                    className="text-gray-600 leading-relaxed text-justify outline-none" 
                    style={{ fontSize: `${theme.fontSize}pt` }}
                  >
                    {careerObjective}
                  </p>
                </section>
              );
            }

            if (sectionId === 'workExperience' && workExperience.length > 0) {
              return (
                <section key={sectionId} className="break-inside-avoid">
                  <h2 className="text-lg font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                    <Briefcase size={20} style={{ color: theme.primaryColor }} />
                    <span>Experience</span>
                  </h2>
                  <div className="space-y-8">
                    {workExperience.map((work) => (
                      <div key={work.id} className="relative pl-6 border-l-2 border-gray-100">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2" style={{ borderColor: theme.primaryColor }} />
                        <div className="flex justify-between items-start mb-1">
                          <h3 contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold uppercase outline-none" style={{ fontSize: `${theme.fontSize}pt` }}>{work.position}</h3>
                          <span contentEditable={theme.editableMode} suppressContentEditableWarning className="text-xs font-bold text-gray-400 outline-none">{work.duration}</span>
                        </div>
                        <p contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold text-indigo-600 mb-2 outline-none" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{work.companyName}</p>
                        <p contentEditable={theme.editableMode} suppressContentEditableWarning className="text-gray-600 outline-none" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{work.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            if (sectionId === 'trainings' && trainings && trainings.length > 0) {
              return (
                <section key={sectionId} className="break-inside-avoid">
                  <h2 className="text-lg font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                    <Award size={20} style={{ color: theme.primaryColor }} />
                    <span>Professional Trainings</span>
                  </h2>
                  <div className="space-y-8">
                    {trainings.map((training) => (
                      <div key={training.id} className="relative pl-6 border-l-2 border-gray-100">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2" style={{ borderColor: theme.primaryColor }} />
                        <div className="flex justify-between items-start mb-1">
                          <h3 contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold uppercase outline-none" style={{ fontSize: `${theme.fontSize}pt` }}>{training.subject}</h3>
                          <span contentEditable={theme.editableMode} suppressContentEditableWarning className="text-xs font-bold text-gray-400 outline-none">{training.duration}</span>
                        </div>
                        <p contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold text-indigo-600 mb-2 outline-none" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{training.instituteName}</p>
                        {training.description && <p contentEditable={theme.editableMode} suppressContentEditableWarning className="text-gray-600 outline-none" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{training.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            if (sectionId === 'education' && education.length > 0) {
              return (
                <section key={sectionId} className="break-inside-avoid">
                  <h2 className="text-lg font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                    <BookOpen size={20} style={{ color: theme.primaryColor }} />
                    <span>Education</span>
                  </h2>
                  <div className="space-y-6">
                    {education.map((edu, idx) => (
                      <div key={edu.id} className="flex gap-4">
                        <div className="font-black text-gray-200 text-2xl leading-none">0{idx + 1}</div>
                        <div>
                          <h3 contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold uppercase outline-none" style={{ fontSize: `${theme.fontSize}pt` }}>{edu.examName}</h3>
                          <p className="text-gray-600 font-medium" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                            <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{edu.instituteName}</span>
                          </p>
                          <p className="text-gray-400 italic" style={{ fontSize: `${theme.fontSize - 2}pt` }}>
                            <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{edu.board} Board</span> | <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{edu.subject}</span>
                          </p>
                          <div className="flex gap-4 mt-1 text-gray-400 font-bold" style={{ fontSize: `${theme.fontSize - 2}pt` }}>
                            <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{edu.passingYear}</span>
                            <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">GPA: {edu.gpa} ({edu.gpaType})</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            if (sectionId === 'selfAssessment' && selfAssessment.length > 0) {
              return (
                <section key={sectionId} className="break-inside-avoid">
                  <h2 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-3">
                    <CheckSquare size={20} style={{ color: theme.primaryColor }} />
                    <span>Self Assessment</span>
                  </h2>
                  <ul className="list-disc list-inside space-y-1 text-gray-600" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                    {selfAssessment.map((item, idx) => (
                      <li key={`self-${idx}-${item}`} contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{item}</li>
                    ))}
                  </ul>
                </section>
              );
            }

            if (sectionId === 'personalInfo') {
              return (
                <section key={sectionId} className="break-inside-avoid">
                  <h2 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-3">
                    <User size={20} style={{ color: theme.primaryColor }} />
                    <span>Personal Details</span>
                  </h2>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
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
                  <h2 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-3">
                    <Award size={20} style={{ color: theme.primaryColor }} />
                    <span>References</span>
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    {references.map((ref) => (
                      <div key={ref.id} className="text-sm text-gray-600" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                        <p contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold text-gray-900 outline-none">{ref.name}</p>
                        <p contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{ref.position}</p>
                        <p contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{ref.organization}</p>
                        <p contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{ref.phone}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            if (sectionId === 'custom' && customSection && customSection.fields.length > 0) {
              return (
                <section key={sectionId} className="break-inside-avoid">
                  <h2 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-3">
                    <Info size={20} style={{ color: theme.primaryColor }} />
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{customSection.title}</span>
                  </h2>
                  <div className="space-y-2 text-sm text-gray-600" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                    {customSection.fields.map((field) => (
                      <p key={field.id}>
                        <strong contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{field.label}:</strong> <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{field.value}</span>
                      </p>
                    ))}
                  </div>
                </section>
              );
            }

            if (sectionId === 'declaration' && declaration) {
              return (
                <section key={sectionId} className="mt-auto break-inside-avoid">
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <h2 className="text-sm font-black uppercase tracking-widest mb-3 text-gray-400">Declaration</h2>
                    <p contentEditable={theme.editableMode} suppressContentEditableWarning className="text-gray-600 italic outline-none" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                      {declaration}
                    </p>
                  </div>
                  <div className="mt-10 flex flex-col items-end">
                    {personalInfo.signature && (
                      <img src={personalInfo.signature} alt="Signature" className="h-10 object-contain mb-2" />
                    )}
                    <div className="w-48 border-t-2 border-gray-900 pt-2 text-center">
                      <p contentEditable={theme.editableMode} suppressContentEditableWarning className="font-black uppercase tracking-tighter outline-none" style={{ fontSize: `${theme.fontSize}pt` }}>{personalInfo.name}</p>
                    </div>
                  </div>
                </section>
              );
            }

            return null;
          })}
        </div>
      </main>
    </div>
  );
});

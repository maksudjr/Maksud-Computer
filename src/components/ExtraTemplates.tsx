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

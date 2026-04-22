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
  const { theme, personalInfo, careerObjective, education, computerSkills, workExperience, languageProficiency, selfAssessment, hobbies, declaration, customSection, selectedSections, references } = data;
  
  const presentAddressLine = formatAddress(personalInfo.presentVillage, personalInfo.presentPostOffice, personalInfo.presentUpazila, personalInfo.presentDistrict);
  const permanentAddressLine = formatAddress(personalInfo.permanentVillage, personalInfo.permanentPostOffice, personalInfo.permanentUpazila, personalInfo.permanentDistrict);

  return (
    <div 
      ref={ref} 
      className={cn("bg-white w-[210mm] p-[15mm] mx-auto shadow-lg print:shadow-none font-serif relative cv-paper", theme.fontStyle)} 
      style={{ minHeight: `${297 * theme.pageCount}mm` }}
    >
      <header className={cn(
        "border-b-4 border-double pb-6 mb-8 text-center -mx-6 p-6 transition-all",
        theme.headerStyle === 'black' ? "bg-black text-white" : (theme.headerStyle === 'primary' ? "bg-indigo-600 text-white" : "")
      )}
      style={{ 
        borderColor: theme.primaryColor,
        backgroundColor: theme.headerStyle === 'black' ? '#000000' : (theme.headerStyle === 'primary' ? theme.primaryColor : 'transparent'),
        color: (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? (theme.primaryColor === '#ffd700' && theme.headerStyle === 'primary' ? '#000000' : '#ffffff') : 'inherit'
      }}>
        <h1 className="text-4xl mb-2 font-serif uppercase tracking-widest" style={{ color: (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? 'inherit' : theme.primaryColor }}>
          {personalInfo.name || 'YOUR NAME'}
        </h1>
        <p className={cn("text-sm italic", (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? "text-white/80" : "text-gray-600")}>
          {presentAddressLine} {personalInfo.phone && ` | ${personalInfo.phone}`} {personalInfo.email && ` | ${personalInfo.email}`}
        </p>
      </header>
      
      <div className="space-y-8" style={{ lineHeight: theme.lineSpacing }}>
        {selectedSections.includes('careerObjective') && careerObjective && (
          <section>
            <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Career Objective</h2>
            <p className="text-justify leading-relaxed" style={{ fontSize: `${theme.fontSize}pt` }}>{careerObjective}</p>
          </section>
        )}

        {selectedSections.includes('education') && education.length > 0 && (
          <section>
            <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Academic Qualification</h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between font-bold" style={{ fontSize: `${theme.fontSize}pt` }}>
                    <span>{edu.examName}</span>
                    <span>{edu.passingYear}</span>
                  </div>
                  <p className="italic text-gray-700" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{edu.instituteName} | {edu.board} Board</p>
                  <p style={{ fontSize: `${theme.fontSize - 1}pt` }}>Group: {edu.subject} | Result: {edu.gpa} ({edu.gpaType})</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {selectedSections.includes('workExperience') && workExperience.length > 0 && (
          <section>
            <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Professional Experience</h2>
            {workExperience.map((work) => (
              <div key={work.id} className="mb-4">
                <div className="flex justify-between font-bold" style={{ fontSize: `${theme.fontSize}pt` }}>
                  <span>{work.position}</span>
                  <span>{work.duration}</span>
                </div>
                <p className="italic text-gray-700" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{work.companyName}</p>
                <p style={{ fontSize: `${theme.fontSize - 1}pt` }} className="mt-1">{work.description}</p>
              </div>
            ))}
          </section>
        )}

        {selectedSections.includes('computerSkills') && computerSkills.length > 0 && (
          <section>
            <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Computer Skills</h2>
            <div className="space-y-2">
              {computerSkills.map((skill) => (
                <div key={skill.id} style={{ fontSize: `${theme.fontSize}pt` }}>
                  {skill.hasTraining && (
                    <p className="italic text-gray-600 mb-1" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                      Completed a {skill.duration} computer training program from {skill.instituteName}.
                    </p>
                  )}
                  <p>Proficient in {skill.skills.join(', ')}.</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {selectedSections.includes('languageProficiency') && languageProficiency.length > 0 && (
          <section>
            <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Language Proficiency</h2>
            <p style={{ fontSize: `${theme.fontSize}pt` }}>{languageProficiency.join(', ')}</p>
          </section>
        )}

        {selectedSections.includes('selfAssessment') && selfAssessment.length > 0 && (
          <section>
            <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Self Assessment</h2>
            <ul className="list-disc list-inside space-y-1" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
              {selfAssessment.map((item, i) => <li key={`self-${i}-${item}`}>{item}</li>)}
            </ul>
          </section>
        )}

        {selectedSections.includes('hobbies') && hobbies.length > 0 && (
          <section>
            <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Hobbies & Interests</h2>
            <p style={{ fontSize: `${theme.fontSize}pt` }}>{hobbies.join(', ')}</p>
          </section>
        )}

        {selectedSections.includes('personalInfo') && (
          <section>
            <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Personal Details</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
              <p><strong>Father's Name:</strong> {personalInfo.fathersName}</p>
              <p><strong>Mother's Name:</strong> {personalInfo.mothersName}</p>
              <p><strong>Date of Birth:</strong> {formatDate(personalInfo.dob)}</p>
              <p><strong>Gender:</strong> {personalInfo.gender}</p>
              <p><strong>Nationality:</strong> {personalInfo.nationality}</p>
              <p><strong>Religion:</strong> {personalInfo.religion}</p>
              <p><strong>Marital Status:</strong> {personalInfo.maritalStatus}</p>
              <p><strong>NID No:</strong> {personalInfo.nid}</p>
              <p><strong>Birth Reg No:</strong> {personalInfo.birthRegNo}</p>
              <p><strong>Blood Group:</strong> {personalInfo.bloodGroup}</p>
              <p><strong>Height:</strong> {personalInfo.heightFeet || personalInfo.heightInches ? `${personalInfo.heightFeet || '0'}' ${personalInfo.heightInches || '0'}"` : ''}</p>
              <p><strong>Weight:</strong> {personalInfo.weight ? `${personalInfo.weight} Kg` : ''}</p>
              <p className="col-span-2"><strong>Permanent Address:</strong> {permanentAddressLine}</p>
            </div>
          </section>
        )}

        {selectedSections.includes('references') && references && references.length > 0 && (
          <section>
            <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>References</h2>
            <div className="grid grid-cols-2 gap-8">
              {references.map((ref) => (
                <div key={ref.id} style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                  <p className="font-bold">{ref.name}</p>
                  <p>{ref.position} | {ref.organization}</p>
                  <p>Phone: {ref.phone}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {selectedSections.includes('custom') && customSection && customSection.fields.length > 0 && (
          <section>
            <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>{customSection.title}</h2>
            <div className="space-y-2" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
              {customSection.fields.map((field) => (
                <p key={field.id}><strong>{field.label}:</strong> {field.value}</p>
              ))}
            </div>
          </section>
        )}

        {selectedSections.includes('declaration') && declaration && (
          <section className="mt-8">
            <h2 className="text-xl italic border-b mb-3" style={{ color: theme.primaryColor, borderColor: theme.showBorder ? `${theme.primaryColor}44` : 'transparent' }}>Declaration</h2>
            <p className="italic text-gray-600" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{declaration}</p>
            <div className="mt-12 flex flex-col items-end">
              {personalInfo.signature && <img src={personalInfo.signature} className="h-10 mb-2" />}
              <div className="w-48 border-t border-gray-900 pt-1 text-center font-bold" style={{ fontSize: `${theme.fontSize}pt` }}>
                {personalInfo.name}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
});

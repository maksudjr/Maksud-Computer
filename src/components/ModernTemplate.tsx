import React from 'react';
import { CVData } from '../types';
import { cn } from '../lib/utils';
import { Phone, Mail, MapPin, User, Briefcase, GraduationCap, Info, Check, Award } from 'lucide-react';

interface ModernTemplateProps {
  data: CVData;
}

export const ModernTemplate = React.memo(React.forwardRef<HTMLDivElement, ModernTemplateProps>(({ data }, ref) => {
  const { theme, personalInfo, careerObjective, education, computerSkills, trainings, workExperience, languageProficiency, selfAssessment, hobbies, declaration, customSection, selectedSections } = data;

  const formatAddress = (village: string, po: string, upazila: string, district: string) => {
    const parts = [];
    if (village) parts.push(`Village: ${village}`);
    if (po) parts.push(`Post Office: ${po}`);
    if (upazila) parts.push(`Upazila: ${upazila}`);
    if (district) parts.push(`District: ${district}`);
    return parts.join(', ');
  };

  const presentAddressLine = formatAddress(personalInfo.presentVillage, personalInfo.presentPostOffice, personalInfo.presentUpazila, personalInfo.presentDistrict);
  const permanentAddressLine = formatAddress(personalInfo.permanentVillage, personalInfo.permanentPostOffice, personalInfo.permanentUpazila, personalInfo.permanentDistrict);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const displayLineSpacing = theme.lineSpacing === -50 ? 0.7 : theme.lineSpacing;
  
  return (
    <div 
      ref={ref}
      className={cn(
        "bg-white w-[210mm] mx-auto shadow-lg print:shadow-none print:m-0 flex flex-col relative overflow-hidden cv-paper",
        theme.fontStyle
      )}
      style={{ 
        minHeight: `${297 * theme.pageCount}mm`,
        padding: `${theme.pageMargin}mm`
      }}
      id="cv-preview-content"
    >
      {/* Header */}
      <div className="h-24 flex items-center px-12 shrink-0" style={{ 
        backgroundColor: theme.headerStyle === 'black' ? '#000000' : (theme.headerStyle === 'primary' ? theme.primaryColor : '#1e293b') 
      }}>
        <h1 
          contentEditable={theme.editableMode}
          suppressContentEditableWarning
          className="font-bold uppercase tracking-wider outline-none focus:ring-1 focus:ring-indigo-300" 
          style={{ 
            fontSize: `${theme.fontSize + 11}pt`,
            color: theme.headerStyle === 'primary' && theme.primaryColor === '#ffd700' ? '#000000' : '#ffffff'
          }}
        >
          {personalInfo.name || 'YOUR NAME'}
        </h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[280px] bg-[#e2e8f0] p-8 flex flex-col gap-8 overflow-y-auto thin-scrollbar shrink-0">
          {/* Photo */}
          <div className="flex justify-center">
            <div className="w-40 h-40 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-md">
              {personalInfo.photo ? (
                <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User size={64} />
                </div>
              )}
            </div>
          </div>

          {/* Contact */}
          <div style={{ lineHeight: theme.lineSpacing === -50 ? 0.7 : theme.lineSpacing }}>
            <h3 className="font-bold uppercase mb-4 pb-1 tracking-wide" style={{ color: '#1e293b', fontSize: `${theme.fontSize + 1}pt`, borderBottom: theme.showBorder ? '2px solid #94a3b8' : 'none' }}>Contact</h3>
            <div className="space-y-3" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
              {personalInfo.phone && (
                <div className="flex items-start gap-2">
                  <Phone size={14} className="mt-1 flex-shrink-0" />
                  <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none focus:ring-1 focus:ring-indigo-300">{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.email && (
                <div className="flex items-start gap-2">
                  <Mail size={14} className="mt-1 flex-shrink-0" />
                  <span contentEditable={theme.editableMode} suppressContentEditableWarning className="break-all outline-none focus:ring-1 focus:ring-indigo-300">{personalInfo.email}</span>
                </div>
              )}
              {presentAddressLine && (
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="mt-1 flex-shrink-0" />
                  <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none focus:ring-1 focus:ring-indigo-300">{presentAddressLine}</span>
                </div>
              )}
            </div>
          </div>

          {/* Computer Skills in Sidebar */}
          {selectedSections.includes('computerSkills') && computerSkills.length > 0 && (
            <div style={{ lineHeight: theme.lineSpacing === -50 ? 0.7 : theme.lineSpacing }}>
              <h3 className="font-bold uppercase mb-4 pb-1 tracking-wide" style={{ color: '#1e293b', fontSize: `${theme.fontSize + 1}pt`, borderBottom: theme.showBorder ? '2px solid #94a3b8' : 'none' }}>Computer Skills</h3>
              <div className="space-y-4">
                {computerSkills.map((skill) => (
                  <div key={skill.id} style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                    {skill.hasTraining && (
                      <p contentEditable={theme.editableMode} suppressContentEditableWarning className="mb-2 text-gray-700 outline-none focus:ring-1 focus:ring-indigo-300">
                        Completed a {skill.duration} training from {skill.instituteName}.
                      </p>
                    )}
                    <ul className="list-disc list-inside space-y-1">
                      {skill.skills.map((s, sIdx) => (
                        <li key={`${skill.id}-skill-${sIdx}`} contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none focus:ring-1 focus:ring-indigo-300">{s}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages in Sidebar */}
          {selectedSections.includes('languageProficiency') && languageProficiency.length > 0 && (
            <div>
              <h3 className="font-bold uppercase border-b-2 border-gray-400 mb-4 pb-1 tracking-wide" style={{ fontSize: `${theme.fontSize + 1}pt` }}>Languages</h3>
              <ul className="list-disc list-inside space-y-1" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                {languageProficiency.map((lang, idx) => (
                  <li key={`lang-${idx}-${lang}`} contentEditable={theme.editableMode} suppressContentEditableWarning className="leading-tight outline-none focus:ring-1 focus:ring-indigo-300">{lang}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="flex-1 p-10 bg-white overflow-y-auto thin-scrollbar">
          <div className="flex flex-col">
            {selectedSections.map((sectionId) => {
              if (sectionId === 'careerObjective' && careerObjective) {
                return (
                  <div key={sectionId} className="mb-8 relative pl-8 break-inside-avoid">
                    {theme.showBorder && <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ backgroundColor: `${theme.primaryColor}33` }} />}
                    <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center" style={{ borderColor: theme.primaryColor }}>
                      <User size={12} style={{ color: theme.primaryColor }} />
                    </div>
                    <h3 className="font-bold uppercase mb-3 tracking-wide" style={{ color: theme.primaryColor, fontSize: `${theme.fontSize + 3}pt` }}>Profile</h3>
                    <p 
                      contentEditable={theme.editableMode} 
                      suppressContentEditableWarning 
                      className="text-justify text-gray-700 whitespace-pre-wrap outline-none focus:ring-1 focus:ring-indigo-300" 
                      style={{ fontSize: `${theme.fontSize}pt`, lineHeight: theme.lineSpacing === -50 ? 0.7 : theme.lineSpacing }}
                    >
                      {careerObjective}
                    </p>
                  </div>
                );
              }

              if (sectionId === 'workExperience' && workExperience.length > 0) {
                return (
                  <div key={sectionId} className="mb-8 relative pl-8 break-inside-avoid">
                    {theme.showBorder && <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ backgroundColor: `${theme.primaryColor}33` }} />}
                    <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center" style={{ borderColor: theme.primaryColor }}>
                      <Briefcase size={12} style={{ color: theme.primaryColor }} />
                    </div>
                    <h3 className="font-bold uppercase mb-4 tracking-wide" style={{ color: theme.primaryColor, fontSize: `${theme.fontSize + 3}pt` }}>Work Experience</h3>
                    <div className="space-y-6">
                      {workExperience.map((work) => (
                        <div key={work.id}>
                          <div className="flex justify-between items-start mb-1">
                            <h4 contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold uppercase outline-none focus:ring-1 focus:ring-indigo-300" style={{ fontSize: `${theme.fontSize}pt` }}>{work.companyName || 'Company Name'}</h4>
                            <span contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold text-gray-500 uppercase outline-none focus:ring-1 focus:ring-indigo-300" style={{ fontSize: `${theme.fontSize - 2}pt` }}>{work.duration}</span>
                          </div>
                          <p contentEditable={theme.editableMode} suppressContentEditableWarning className="font-medium text-gray-600 mb-2 italic outline-none focus:ring-1 focus:ring-indigo-300" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{work.position}</p>
                          <div contentEditable={theme.editableMode} suppressContentEditableWarning className="text-gray-700 leading-relaxed whitespace-pre-wrap outline-none focus:ring-1 focus:ring-indigo-300" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                            {work.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (sectionId === 'education' && education.length > 0) {
                return (
                  <div key={sectionId} className="mb-8 relative pl-8 break-inside-avoid">
                    {theme.showBorder && <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ backgroundColor: `${theme.primaryColor}33` }} />}
                    <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center" style={{ borderColor: theme.primaryColor }}>
                      <GraduationCap size={12} style={{ color: theme.primaryColor }} />
                    </div>
                    <h3 className="font-bold uppercase mb-4 tracking-wide" style={{ color: theme.primaryColor, fontSize: `${theme.fontSize + 3}pt` }}>Education</h3>
                    <div className="space-y-6">
                      {education.map((edu) => (
                        <div key={edu.id}>
                          <div className="flex justify-between items-start mb-1">
                            <h4 contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold uppercase outline-none focus:ring-1 focus:ring-indigo-300" style={{ fontSize: `${theme.fontSize}pt` }}>{edu.instituteName}</h4>
                            <span contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold text-gray-500 uppercase outline-none focus:ring-1 focus:ring-indigo-300" style={{ fontSize: `${theme.fontSize - 2}pt` }}>{edu.passingYear}</span>
                          </div>
                          <p contentEditable={theme.editableMode} suppressContentEditableWarning className="font-medium text-gray-600 mb-1 outline-none focus:ring-1 focus:ring-indigo-300" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{edu.examName}</p>
                          <p className="text-gray-700" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                            Board: <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{edu.board}</span>, GPA: <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{edu.gpa}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (sectionId === 'trainings' && trainings && trainings.length > 0) {
                return (
                  <div key={sectionId} className="mb-8 relative pl-8 break-inside-avoid">
                    {theme.showBorder && <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ backgroundColor: `${theme.primaryColor}33` }} />}
                    <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center" style={{ borderColor: theme.primaryColor }}>
                      <Award size={12} style={{ color: theme.primaryColor }} />
                    </div>
                    <h3 className="font-bold uppercase mb-4 tracking-wide" style={{ color: theme.primaryColor, fontSize: `${theme.fontSize + 3}pt` }}>Professional Trainings</h3>
                    <div className="space-y-6">
                      {trainings.map((training) => (
                        <div key={training.id}>
                          <div className="flex justify-between items-start mb-1">
                            <h4 contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold uppercase outline-none focus:ring-1 focus:ring-indigo-300" style={{ fontSize: `${theme.fontSize}pt` }}>{training.subject}</h4>
                            <span contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold text-gray-500 uppercase outline-none focus:ring-1 focus:ring-indigo-300" style={{ fontSize: `${theme.fontSize - 2}pt` }}>{training.duration}</span>
                          </div>
                          <p contentEditable={theme.editableMode} suppressContentEditableWarning className="font-medium text-gray-600 mb-1 italic outline-none focus:ring-1 focus:ring-indigo-300" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{training.instituteName}</p>
                          {training.description && (
                            <div contentEditable={theme.editableMode} suppressContentEditableWarning className="text-gray-700 leading-relaxed whitespace-pre-wrap outline-none focus:ring-1 focus:ring-indigo-300" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                              {training.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (sectionId === 'selfAssessment' && selfAssessment.length > 0) {
                return (
                  <div key={sectionId} className="mb-8 relative pl-8 break-inside-avoid">
                    {theme.showBorder && <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ backgroundColor: `${theme.primaryColor}33` }} />}
                    <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center" style={{ borderColor: theme.primaryColor }}>
                      <Info size={12} style={{ color: theme.primaryColor }} />
                    </div>
                    <h3 className="font-bold uppercase mb-4 tracking-wide" style={{ color: theme.primaryColor, fontSize: `${theme.fontSize + 3}pt` }}>Self Assessment</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700" style={{ fontSize: `${theme.fontSize - 0.5}pt` }}>
                      {selfAssessment.map((item, idx) => (
                        <li key={`self-${idx}-${item}`} contentEditable={theme.editableMode} suppressContentEditableWarning className="leading-tight outline-none focus:ring-1 focus:ring-indigo-300">{item}</li>
                      ))}
                    </ul>
                  </div>
                );
              }

              if (sectionId === 'personalInfo') {
                return (
                  <div key={sectionId} className="mb-8 relative pl-8 break-inside-avoid">
                    {theme.showBorder && <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ backgroundColor: `${theme.primaryColor}33` }} />}
                    <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center" style={{ borderColor: theme.primaryColor }}>
                      <Info size={12} style={{ color: theme.primaryColor }} />
                    </div>
                    <h3 className="font-bold uppercase mb-4 tracking-wide" style={{ color: theme.primaryColor, fontSize: `${theme.fontSize + 3}pt` }}>Personal Details</h3>
                    <div className="space-y-2" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                      {[
                        { label: "Father's Name", value: personalInfo.fathersName },
                        { label: "Mother's Name", value: personalInfo.mothersName },
                        { label: "Permanent Address", value: permanentAddressLine },
                        { label: "Date of Birth", value: formatDate(personalInfo.dob) },
                        { label: "Gender", value: personalInfo.gender },
                        { label: "Marital Status", value: personalInfo.maritalStatus },
                        { label: "Nationality", value: personalInfo.nationality },
                        { label: "Religion", value: personalInfo.religion },
                        { label: "NID No", value: personalInfo.nid },
                        { label: "Sign", value: personalInfo.name }
                      ].map((item, i) => (
                        <div key={i} className="grid grid-cols-[140px_10px_1fr] border-b border-gray-100 pb-1">
                          <span className="font-medium text-gray-600">{item.label}</span>
                          <span>:</span>
                          <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none focus:ring-1 focus:ring-indigo-300">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (sectionId === 'references' && data.references && data.references.length > 0) {
                return (
                  <div key={sectionId} className="mb-8 relative pl-8 break-inside-avoid">
                    {theme.showBorder && <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ backgroundColor: `${theme.primaryColor}33` }} />}
                    <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center" style={{ borderColor: theme.primaryColor }}>
                      <Award size={12} style={{ color: theme.primaryColor }} />
                    </div>
                    <h3 className="font-bold uppercase mb-4 tracking-wide" style={{ color: theme.primaryColor, fontSize: `${theme.fontSize + 3}pt` }}>References</h3>
                    <div className="grid grid-cols-2 gap-6">
                      {data.references.map((ref) => (
                        <div key={ref.id} className="text-gray-700" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                          <p contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold text-gray-900 outline-none focus:ring-1 focus:ring-indigo-300">{ref.name}</p>
                          <p contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none focus:ring-1 focus:ring-indigo-300">{ref.position}</p>
                          <p contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none focus:ring-1 focus:ring-indigo-300">{ref.organization}</p>
                          <p>Phone: <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none focus:ring-1 focus:ring-indigo-300">{ref.phone}</span></p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (sectionId === 'custom' && customSection.fields.length > 0) {
                return (
                  <div key={sectionId} className="mb-8 relative pl-8 break-inside-avoid">
                    {theme.showBorder && <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ backgroundColor: `${theme.primaryColor}33` }} />}
                    <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center" style={{ borderColor: theme.primaryColor }}>
                      <Info size={12} style={{ color: theme.primaryColor }} />
                    </div>
                    <h3 contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold uppercase mb-4 tracking-wide outline-none focus:ring-1 focus:ring-indigo-300" style={{ color: theme.primaryColor, fontSize: `${theme.fontSize + 3}pt` }}>{customSection.title}</h3>
                    <div className="space-y-2" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                      {customSection.fields.map((field) => (
                        <div key={field.id} className="grid grid-cols-[140px_10px_1fr] border-b border-gray-100 pb-1">
                          <span className="font-medium text-gray-600">{field.label}</span>
                          <span>:</span>
                          <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none">{field.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return null;
            })}

            {/* Declaration and Signature always at the end */}
            <div className="mt-auto">
              {selectedSections.includes('declaration') && declaration && (
                <div className="mb-8 relative pl-8 break-inside-avoid">
                  {theme.showBorder && <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ backgroundColor: `${theme.primaryColor}33` }} />}
                  <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center" style={{ borderColor: theme.primaryColor }}>
                    <Check size={12} style={{ color: theme.primaryColor }} />
                  </div>
                  <h3 className="font-bold uppercase mb-3 tracking-wide" style={{ color: theme.primaryColor, fontSize: `${theme.fontSize + 3}pt` }}>Declaration</h3>
                  <p contentEditable={theme.editableMode} suppressContentEditableWarning className="leading-relaxed text-justify text-gray-700 whitespace-pre-wrap outline-none focus:ring-1 focus:ring-indigo-300" style={{ fontSize: `${theme.fontSize - 0.5}pt` }}>
                    {declaration}
                  </p>
                </div>
              )}

              <div className="pt-10 flex flex-col items-end">
                <div className="w-48 flex flex-col items-center">
                  {personalInfo.signature ? (
                    <div className="mb-1">
                      <img 
                        src={personalInfo.signature} 
                        alt="Signature" 
                        className="h-8 object-contain" 
                        style={{ maxWidth: '150px' }}
                      />
                    </div>
                  ) : (
                    <div className="h-8" />
                  )}
                  <div className="w-full border-t border-dotted border-black pt-1 text-center">
                    <p className="font-medium outline-none focus:ring-1 focus:ring-indigo-300" contentEditable={theme.editableMode} suppressContentEditableWarning style={{ fontSize: `${theme.fontSize - 1}pt` }}>Applicant Signature and Date</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Watermark/Footer */}
            <div className="pt-10 text-center print:hidden">
              <p className="text-[9pt] font-bold italic transition-colors hover:text-indigo-600" style={{ color: theme.primaryColor + '60' }}>
                Professionally Crafted by Maksud Computer Digital Hub
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}));

ModernTemplate.displayName = 'ModernTemplate';

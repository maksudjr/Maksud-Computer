import React from 'react';
import { CVData } from '../types';
import { cn } from '../lib/utils';
import { Phone, Mail, MapPin, User, Briefcase, GraduationCap, Info, Check } from 'lucide-react';

interface ModernTemplateProps {
  data: CVData;
}

export const ModernTemplate = React.forwardRef<HTMLDivElement, ModernTemplateProps>(({ data }, ref) => {
  const { theme, personalInfo, careerObjective, education, computerSkills, workExperience, languageProficiency, selfAssessment, hobbies, declaration, customSection, selectedSections } = data;

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

  return (
    <div 
      ref={ref}
      className={cn(
        "bg-white w-[210mm] mx-auto shadow-lg print:shadow-none print:m-0 flex flex-col relative overflow-hidden",
        theme.fontStyle
      )}
      style={{ 
        minHeight: `${297 * theme.pageCount}mm`
      }}
      id="cv-preview-content"
    >
      {/* Header */}
      <div className="h-24 flex items-center px-12" style={{ backgroundColor: '#1e293b' }}>
        <h1 className="text-white text-[22pt] font-bold uppercase tracking-wider">
          {personalInfo.name || 'YOUR NAME'}
        </h1>
      </div>

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-[280px] bg-[#e2e8f0] p-8 flex flex-col gap-8">
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
          <div>
            <h3 className="text-[12pt] font-bold uppercase border-b-2 border-gray-400 mb-4 pb-1 tracking-wide">Contact</h3>
            <div className="space-y-3 text-[10pt]">
              {personalInfo.phone && (
                <div className="flex items-start gap-2">
                  <Phone size={14} className="mt-1 flex-shrink-0" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.email && (
                <div className="flex items-start gap-2">
                  <Mail size={14} className="mt-1 flex-shrink-0" />
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}
              {presentAddressLine && (
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="mt-1 flex-shrink-0" />
                  <span>{presentAddressLine}</span>
                </div>
              )}
            </div>
          </div>

          {/* Computer Skills */}
          {selectedSections.includes('computerSkills') && computerSkills.length > 0 && (
            <div>
              <h3 className="text-[12pt] font-bold uppercase border-b-2 border-gray-400 mb-4 pb-1 tracking-wide">Computer Skills</h3>
              <div className="space-y-4">
                {computerSkills.map((skill, idx) => (
                  <div key={idx} className="text-[10pt]">
                    <ul className="list-disc list-inside space-y-1">
                      {skill.skills.map((s, sIdx) => (
                        <li key={sIdx} className="leading-tight">{s}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {selectedSections.includes('languageProficiency') && languageProficiency.length > 0 && (
            <div>
              <h3 className="text-[12pt] font-bold uppercase border-b-2 border-gray-400 mb-4 pb-1 tracking-wide">Languages</h3>
              <ul className="list-disc list-inside space-y-1 text-[10pt]">
                {languageProficiency.map((lang, idx) => (
                  <li key={idx} className="leading-tight">{lang}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Hobbies */}
          {selectedSections.includes('hobbies') && hobbies.length > 0 && (
            <div>
              <h3 className="text-[12pt] font-bold uppercase border-b-2 border-gray-400 mb-4 pb-1 tracking-wide">Hobbies</h3>
              <ul className="list-disc list-inside space-y-1 text-[10pt]">
                {hobbies.map((hobby, idx) => (
                  <li key={idx} className="leading-tight">{hobby}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="flex-1 p-10 bg-white">
          {/* Profile / Career Objective */}
          {selectedSections.includes('careerObjective') && (
            <div className="mb-8 relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ backgroundColor: `${theme.primaryColor}33` }} />
              <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center" style={{ borderColor: theme.primaryColor }}>
                <User size={12} style={{ color: theme.primaryColor }} />
              </div>
              <h3 className="text-[14pt] font-bold uppercase mb-3 tracking-wide" style={{ color: theme.primaryColor }}>Profile</h3>
              <p className="text-[10.5pt] leading-relaxed text-justify text-gray-700">
                {careerObjective}
              </p>
            </div>
          )}

          {/* Self Assessment */}
          {selectedSections.includes('selfAssessment') && selfAssessment.length > 0 && (
            <div className="mb-8 relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ backgroundColor: `${theme.primaryColor}33` }} />
              <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center" style={{ borderColor: theme.primaryColor }}>
                <Info size={12} style={{ color: theme.primaryColor }} />
              </div>
              <h3 className="text-[14pt] font-bold uppercase mb-4 tracking-wide" style={{ color: theme.primaryColor }}>Self Assessment</h3>
              <ul className="list-disc list-inside space-y-1 text-[10pt] text-gray-700">
                {selfAssessment.map((item, idx) => (
                  <li key={idx} className="leading-tight">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Work Experience */}
          {selectedSections.includes('workExperience') && workExperience.length > 0 && (
            <div className="mb-8 relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ backgroundColor: `${theme.primaryColor}33` }} />
              <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center" style={{ borderColor: theme.primaryColor }}>
                <Briefcase size={12} style={{ color: theme.primaryColor }} />
              </div>
              <h3 className="text-[14pt] font-bold uppercase mb-4 tracking-wide" style={{ color: theme.primaryColor }}>Work Experience</h3>
              <div className="space-y-6">
                {workExperience.map((work, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-[11pt] uppercase">{work.companyName}</h4>
                      <span className="text-[9pt] font-bold text-gray-500 uppercase">{work.duration}</span>
                    </div>
                    <p className="text-[10pt] font-medium text-gray-600 mb-2 italic">{work.position}</p>
                    <div className="text-[10pt] text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {work.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {selectedSections.includes('education') && education.length > 0 && (
            <div className="mb-8 relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ backgroundColor: `${theme.primaryColor}33` }} />
              <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center" style={{ borderColor: theme.primaryColor }}>
                <GraduationCap size={12} style={{ color: theme.primaryColor }} />
              </div>
              <h3 className="text-[14pt] font-bold uppercase mb-4 tracking-wide" style={{ color: theme.primaryColor }}>Education</h3>
              <div className="space-y-6">
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-[11pt] uppercase">{edu.instituteName}</h4>
                      <span className="text-[9pt] font-bold text-gray-500 uppercase">{edu.passingYear}</span>
                    </div>
                    <p className="text-[10pt] font-medium text-gray-600 mb-1">{edu.examName}</p>
                    <p className="text-[10pt] text-gray-700">
                      Group: {edu.subject}, GPA: {edu.gpa} / {edu.gpaType.replace('Out Of ', '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal Information */}
          {selectedSections.includes('personalInfo') && (
            <div className="mb-8 relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ backgroundColor: `${theme.primaryColor}33` }} />
              <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center" style={{ borderColor: theme.primaryColor }}>
                <Info size={12} style={{ color: theme.primaryColor }} />
              </div>
              <h3 className="text-[14pt] font-bold uppercase mb-4 tracking-wide" style={{ color: theme.primaryColor }}>Personal Informations</h3>
              <div className="space-y-2 text-[10pt]">
                <div className="grid grid-cols-[140px_10px_1fr] border-b border-gray-100 pb-1">
                  <span className="font-medium text-gray-600">Father's Name</span>
                  <span>:</span>
                  <span>{personalInfo.fathersName}</span>
                </div>
                <div className="grid grid-cols-[140px_10px_1fr] border-b border-gray-100 pb-1">
                  <span className="font-medium text-gray-600">Mother's Name</span>
                  <span>:</span>
                  <span>{personalInfo.mothersName}</span>
                </div>
                <div className="grid grid-cols-[140px_10px_1fr] border-b border-gray-100 pb-1">
                  <span className="font-medium text-gray-600">Permanent Address</span>
                  <span>:</span>
                  <span>{permanentAddressLine}</span>
                </div>
                <div className="grid grid-cols-[140px_10px_1fr] border-b border-gray-100 pb-1">
                  <span className="font-medium text-gray-600">Date of Birth</span>
                  <span>:</span>
                  <span>{formatDate(personalInfo.dob)}</span>
                </div>
                <div className="grid grid-cols-[140px_10px_1fr] border-b border-gray-100 pb-1">
                  <span className="font-medium text-gray-600">Gender</span>
                  <span>:</span>
                  <span>{personalInfo.gender}</span>
                </div>
                <div className="grid grid-cols-[140px_10px_1fr] border-b border-gray-100 pb-1">
                  <span className="font-medium text-gray-600">Marital Status</span>
                  <span>:</span>
                  <span>{personalInfo.maritalStatus}</span>
                </div>
                <div className="grid grid-cols-[140px_10px_1fr] border-b border-gray-100 pb-1">
                  <span className="font-medium text-gray-600">Nationality</span>
                  <span>:</span>
                  <span>{personalInfo.nationality}</span>
                </div>
                <div className="grid grid-cols-[140px_10px_1fr] border-b border-gray-100 pb-1">
                  <span className="font-medium text-gray-600">NID No</span>
                  <span>:</span>
                  <span>{personalInfo.nid}</span>
                </div>
                <div className="grid grid-cols-[140px_10px_1fr] border-b border-gray-100 pb-1">
                  <span className="font-medium text-gray-600">Religion</span>
                  <span>:</span>
                  <span>{personalInfo.religion}</span>
                </div>
              </div>
            </div>
          )}

          {/* Custom Section */}
          {selectedSections.includes('custom') && customSection.fields.length > 0 && (
            <div className="mb-8 relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ backgroundColor: `${theme.primaryColor}33` }} />
              <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center" style={{ borderColor: theme.primaryColor }}>
                <Info size={12} style={{ color: theme.primaryColor }} />
              </div>
              <h3 className="text-[14pt] font-bold uppercase mb-4 tracking-wide" style={{ color: theme.primaryColor }}>{customSection.title}</h3>
              <div className="space-y-2 text-[10pt]">
                {customSection.fields.map((field) => (
                  <div key={field.id} className="grid grid-cols-[140px_10px_1fr] border-b border-gray-100 pb-1">
                    <span className="font-medium text-gray-600">{field.label}</span>
                    <span>:</span>
                    <span>{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Declaration */}
          {selectedSections.includes('declaration') && declaration && (
            <div className="mb-8 relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-[1px]" style={{ backgroundColor: `${theme.primaryColor}33` }} />
              <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center" style={{ borderColor: theme.primaryColor }}>
                <Check size={12} style={{ color: theme.primaryColor }} />
              </div>
              <h3 className="text-[14pt] font-bold uppercase mb-3 tracking-wide" style={{ color: theme.primaryColor }}>Certification</h3>
              <p className="text-[10.5pt] leading-relaxed text-justify text-gray-700">
                {declaration}
              </p>
            </div>
          )}

          {/* Signature */}
          <div className="mt-12 flex flex-col items-end">
            <div className="w-48 border-t border-dotted border-black pt-1 text-center">
              <p className="text-[10pt] font-medium">Applicant Signature and Date</p>
            </div>
          </div>

          {/* Watermark */}
          <div className="mt-auto pt-8 flex justify-center">
            <p className="text-[8pt] text-gray-300 italic font-medium">
              This Cv Was Build from Maksud Computer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

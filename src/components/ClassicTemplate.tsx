import React from 'react';
import { CVData } from '../types';
import { cn } from '../lib/utils';

interface ClassicTemplateProps {
  data: CVData;
}

interface SectionHeaderProps {
  title: string;
  primaryColor: string;
}

const SectionHeader = ({ title, primaryColor }: SectionHeaderProps) => (
  <div className="mt-3 mb-1">
    <div style={{ backgroundColor: primaryColor }} className="h-[1.5px] w-full mb-0.5" />
    <h2 style={{ color: primaryColor }} className="text-[13pt] font-bold uppercase tracking-tight">
      {title}:
    </h2>
  </div>
);

interface BulletItemProps {
  children: React.ReactNode;
  primaryColor: string;
  key?: React.Key;
}

const BulletItem = ({ children, primaryColor }: BulletItemProps) => (
  <div className="flex items-start gap-1.5 mb-0.5">
    <span style={{ color: primaryColor }} className="text-[9pt] mt-1">❖</span>
    <div className="text-[10.5pt] leading-tight">{children}</div>
  </div>
);

interface InfoRowProps {
  label: string;
  value: string;
  key?: React.Key;
}

const InfoRow = ({ label, value }: InfoRowProps) => {
  if (!value) return null;
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const displayValue = label === "Date of Birth" ? formatDate(value) : value;

  return (
    <div className="grid grid-cols-[160px_10px_1fr] text-[10.5pt] leading-tight mb-0.5">
      <div className="font-bold">{label}</div>
      <div>:</div>
      <div>{displayValue}</div>
    </div>
  );
};

export const ClassicTemplate = React.forwardRef<HTMLDivElement, ClassicTemplateProps>(({ data }, ref) => {
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

  return (
    <div 
      ref={ref}
      className={cn(
        "bg-white w-[210mm] p-[15mm] mx-auto shadow-lg print:shadow-none print:m-0 flex flex-col relative",
        theme.fontStyle
      )}
      style={{ 
        minHeight: `${297 * theme.pageCount}mm`
      }}
      id="cv-preview-content"
    >
      {/* Page Break Indicators (Preview Only) */}
      {theme.pageCount > 1 && (
        <div className="absolute inset-0 pointer-events-none print:hidden">
          {Array.from({ length: theme.pageCount - 1 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-full border-b border-dashed border-gray-200"
              style={{ top: `${297 * (i + 1)}mm`, left: 0 }}
            />
          ))}
        </div>
      )}
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h1 style={{ color: theme.primaryColor }} className="text-[18pt] font-bold leading-tight uppercase">
            CURRICULUM VITAE
          </h1>
          <h1 style={{ color: theme.primaryColor }} className="text-[18pt] font-bold leading-tight uppercase">
            OF {personalInfo.name || 'YOUR NAME'}
          </h1>
          
          <div className="mt-2 text-[11pt] leading-tight">
            <p className="font-bold">Present Address:</p>
            <p className="whitespace-pre-wrap">{presentAddressLine}</p>
            {personalInfo.phone && <p>Cell: {personalInfo.phone}</p>}
            {personalInfo.email && <p>E-mail: <span className="italic">{personalInfo.email}</span></p>}
          </div>
        </div>
        {personalInfo.photo && (
          <div className="w-[35mm] h-[45mm] border border-gray-300 ml-4 overflow-hidden shrink-0">
            <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        )}
      </div>

      {/* Career Objective */}
      {selectedSections.includes('careerObjective') && careerObjective && (
        <section>
          <SectionHeader title="Career Objective" primaryColor={theme.primaryColor} />
          <p className="text-[10.5pt] leading-snug text-justify">
            {careerObjective}
          </p>
        </section>
      )}

      {/* Academic Qualification */}
      {selectedSections.includes('education') && education.length > 0 && (
        <section>
          <SectionHeader title="Academic Qualification" primaryColor={theme.primaryColor} />
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <BulletItem primaryColor={theme.primaryColor}>
                <span className="font-bold">{edu.examName}</span>
              </BulletItem>
              <div className="ml-6">
                <InfoRow label="Board" value={edu.board} />
                <InfoRow label="Subject" value={edu.subject} />
                <InfoRow label="Institute" value={edu.instituteName} />
                <InfoRow label="Result" value={edu.gpa ? `${edu.gpa} (${edu.gpaType})` : ''} />
                <InfoRow label="Passing Year" value={edu.passingYear} />
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Computer Skills */}
      {selectedSections.includes('computerSkills') && computerSkills.length > 0 && (
        <section>
          <SectionHeader title="Computer Skills" primaryColor={theme.primaryColor} />
          {computerSkills.map((skill) => (
            <div key={skill.id} className="mb-2">
              <BulletItem primaryColor={theme.primaryColor}>
                <div className="flex flex-col">
                  {skill.hasTraining && (
                    <span>Completed a {skill.duration} computer training program from {skill.instituteName}.</span>
                  )}
                  {skill.skills.length > 0 && (
                    <span>Proficient in {skill.skills.join(', ')}, etc,</span>
                  )}
                </div>
              </BulletItem>
            </div>
          ))}
        </section>
      )}

      {/* Job Experience */}
      {selectedSections.includes('workExperience') && workExperience.length > 0 && (
        <section>
          <SectionHeader title="Job Experience" primaryColor={theme.primaryColor} />
          {workExperience.map((work) => (
            <BulletItem key={work.id} primaryColor={theme.primaryColor}>
              Worked as a <span className="font-bold">{work.position}</span> at <span className="font-bold">{work.companyName}</span> for {work.duration}
              {work.description && <p className="mt-1 text-[10pt] italic">{work.description}</p>}
            </BulletItem>
          ))}
        </section>
      )}

      {/* Language Proficiency */}
      {selectedSections.includes('languageProficiency') && languageProficiency.length > 0 && (
        <section>
          <SectionHeader title="Language Proficiency" primaryColor={theme.primaryColor} />
          {languageProficiency.map((lang, idx) => (
            <BulletItem key={idx} primaryColor={theme.primaryColor}>{lang}</BulletItem>
          ))}
        </section>
      )}

      {/* Self Assessment */}
      {selectedSections.includes('selfAssessment') && selfAssessment.length > 0 && (
        <section>
          <SectionHeader title="Self-Assessment" primaryColor={theme.primaryColor} />
          {selfAssessment.map((item, idx) => (
            <BulletItem key={idx} primaryColor={theme.primaryColor}>{item}</BulletItem>
          ))}
        </section>
      )}

      {/* Hobby and Interest */}
      {selectedSections.includes('hobbies') && hobbies.length > 0 && (
        <section>
          <SectionHeader title="Hobby and Interest" primaryColor={theme.primaryColor} />
          {hobbies.map((hobby, idx) => (
            <BulletItem key={idx} primaryColor={theme.primaryColor}>{hobby}</BulletItem>
          ))}
        </section>
      )}

      {/* Personal Information */}
      {selectedSections.includes('personalInfo') && (
        <section className="break-before-auto">
          <SectionHeader title="Personal Information" primaryColor={theme.primaryColor} />
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <InfoRow label="Name" value={personalInfo.name} />
              <InfoRow label="Father’s Name" value={personalInfo.fathersName} />
              <InfoRow label="Mother’s Name" value={personalInfo.mothersName} />
              <InfoRow label="Date of Birth" value={personalInfo.dob} />
              <InfoRow label="Nationality" value={personalInfo.nationality} />
              <InfoRow label="Religion" value={personalInfo.religion} />
              <InfoRow label="Marital Status" value={personalInfo.maritalStatus} />
              <InfoRow label="Sex" value={personalInfo.gender} />
              <InfoRow label="NID" value={personalInfo.nid} />
              <InfoRow label="Birth Registration No" value={personalInfo.birthRegNo} />
              <InfoRow label="Blood Group" value={personalInfo.bloodGroup} />
              <InfoRow label="Height" value={personalInfo.heightFeet || personalInfo.heightInches ? `${personalInfo.heightFeet || '0'}' ${personalInfo.heightInches || '0'}"` : ''} />
              <InfoRow label="Weight" value={personalInfo.weight ? `${personalInfo.weight} Kg` : ''} />
              <InfoRow label="Permanent Address" value={permanentAddressLine} />
              <InfoRow label="Present Address" value={presentAddressLine} />
            </div>
          </div>
        </section>
      )}

      {/* Custom Section */}
      {selectedSections.includes('custom') && customSection.fields.length > 0 && (
        <section>
          <SectionHeader title={customSection.title} primaryColor={theme.primaryColor} />
          {customSection.fields.map((field) => (
            <InfoRow key={field.id} label={field.label} value={field.value} />
          ))}
        </section>
      )}

      {/* Certification / Declaration */}
      {selectedSections.includes('declaration') && declaration && (
        <section className="mt-4">
          <SectionHeader title="Certification" primaryColor={theme.primaryColor} />
          <p className="text-[10.5pt] leading-snug text-justify">
            {declaration}
          </p>
          
          <div className="mt-8 flex flex-col items-start">
            <p className="text-[10.5pt] font-bold">Signature</p>
            <p className="text-[10.5pt]">({personalInfo.name || 'Your Name'})</p>
          </div>
        </section>
      )}

      {/* Watermark */}
      <div className="mt-auto pt-4 flex justify-center">
        <p className="text-[8pt] text-gray-300 italic font-medium">
          This Cv Was Build from Maksud Computer
        </p>
      </div>
    </div>
  );
});

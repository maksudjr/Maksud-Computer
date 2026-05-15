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

const SectionHeader = ({ title, primaryColor, fontSize, showBorder }: SectionHeaderProps & { fontSize: number; showBorder: boolean }) => (
  <div className="mt-3 mb-1">
    {showBorder && <div style={{ backgroundColor: primaryColor }} className="h-[1.5px] w-full mb-0.5" />}
    <h2 style={{ color: primaryColor, fontSize: `${fontSize + 2}pt` }} className="font-bold uppercase tracking-tight">
      {title}:
    </h2>
  </div>
);

interface BulletItemProps {
  children: React.ReactNode;
  primaryColor: string;
  fontSize: number;
  displayLineSpacing: number;
  key?: string | number;
}

const BulletItem = ({ children, primaryColor, fontSize, displayLineSpacing }: BulletItemProps) => (
  <div className="flex items-start gap-1.5 mb-0.5" style={{ lineHeight: displayLineSpacing }}>
    <span style={{ color: primaryColor, fontSize: `${fontSize - 2}pt` }} className="mt-1">❖</span>
    <div style={{ fontSize: `${fontSize}pt` }}>{children}</div>
  </div>
);

interface InfoRowProps {
  label: string;
  value: string;
  fontSize: number;
  displayLineSpacing: number;
  key?: string | number;
}

const InfoRow = ({ label, value, fontSize, displayLineSpacing }: InfoRowProps) => {
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
    <div style={{ fontSize: `${fontSize}pt`, lineHeight: displayLineSpacing }} className="grid grid-cols-[160px_10px_1fr] mb-0.5">
      <div className="font-bold">{label}</div>
      <div>:</div>
      <div>{displayValue}</div>
    </div>
  );
};

export const ClassicTemplate = React.memo(React.forwardRef<HTMLDivElement, ClassicTemplateProps>(({ data }, ref) => {
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

  const displayLineSpacing = theme.lineSpacing === -50 ? 0.7 : theme.lineSpacing;
  
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
      id="cv-preview-content"
    >
      {/* Page Break Indicators (Preview Only) */}
      {theme.pageCount > 1 && (
        <div className="absolute inset-0 pointer-events-none print:hidden" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
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
      <div className={cn(
        "flex justify-between items-start mb-4 p-4 -mx-4",
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
            style={{ color: (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? 'inherit' : theme.primaryColor, fontSize: `${theme.fontSize + 7}pt` }} 
            className="font-bold leading-tight uppercase outline-none focus:ring-1 focus:ring-indigo-300"
          >
            CURRICULUM VITAE
          </h1>
          <h1 
            contentEditable={theme.editableMode}
            suppressContentEditableWarning
            style={{ color: (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? 'inherit' : theme.primaryColor, fontSize: `${theme.fontSize + 7}pt` }} 
            className="font-bold leading-tight uppercase outline-none focus:ring-1 focus:ring-indigo-300"
          >
            OF {personalInfo.name || 'YOUR NAME'}
          </h1>
          
          <div style={{ fontSize: `${theme.fontSize}pt`, lineHeight: theme.lineSpacing }} className="mt-2 text-justify">
            <p className="font-bold">Present Address:</p>
            <p 
              contentEditable={theme.editableMode}
              suppressContentEditableWarning
              className="whitespace-pre-wrap outline-none focus:ring-1 focus:ring-indigo-300"
            >
              {presentAddressLine}
            </p>
            {personalInfo.phone && <p>Cell: <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none focus:ring-1 focus:ring-indigo-300">{personalInfo.phone}</span></p>}
            {personalInfo.email && <p>E-mail: <span contentEditable={theme.editableMode} suppressContentEditableWarning className="italic outline-none focus:ring-1 focus:ring-indigo-300">{personalInfo.email}</span></p>}
          </div>
        </div>
        {personalInfo.photo && (
          <div className="w-[35mm] h-[45mm] border border-gray-300 ml-4 overflow-hidden shrink-0 bg-white">
            <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        )}
      </div>

      <div className="flex flex-col">
        {selectedSections.map((sectionId) => {
          if (sectionId === 'personalInfo') {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <SectionHeader title="Personal Information" primaryColor={theme.primaryColor} fontSize={theme.fontSize} showBorder={theme.showBorder} />
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <InfoRow label="Name" value={personalInfo.name} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                    <InfoRow label="Father’s Name" value={personalInfo.fathersName} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                    <InfoRow label="Mother’s Name" value={personalInfo.mothersName} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                    <InfoRow label="Date of Birth" value={personalInfo.dob} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                    <InfoRow label="Nationality" value={personalInfo.nationality} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                    <InfoRow label="Religion" value={personalInfo.religion} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                    <InfoRow label="Marital Status" value={personalInfo.maritalStatus} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                    <InfoRow label="Sex" value={personalInfo.gender} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                    <InfoRow label="NID" value={personalInfo.nid} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                    <InfoRow label="Birth Registration No" value={personalInfo.birthRegNo} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                    <InfoRow label="Blood Group" value={personalInfo.bloodGroup} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                    <InfoRow label="Height" value={personalInfo.heightFeet || personalInfo.heightInches ? `${personalInfo.heightFeet || '0'}' ${personalInfo.heightInches || '0'}"` : ''} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                    <InfoRow label="Weight" value={personalInfo.weight ? `${personalInfo.weight} Kg` : ''} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                    <InfoRow label="Permanent Address" value={permanentAddressLine} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                    <InfoRow label="Present Address" value={presentAddressLine} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                  </div>
                </div>
              </section>
            );
          }

          if (sectionId === 'careerObjective' && careerObjective) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <SectionHeader title="Career Objective" primaryColor={theme.primaryColor} fontSize={theme.fontSize} showBorder={theme.showBorder} />
                <p 
                  contentEditable={theme.editableMode}
                  suppressContentEditableWarning
                  style={{ fontSize: `${theme.fontSize}pt`, lineHeight: theme.lineSpacing }} 
                  className="text-justify whitespace-pre-wrap outline-none focus:ring-1 focus:ring-indigo-300"
                >
                  {careerObjective}
                </p>
              </section>
            );
          }

          if (sectionId === 'education' && education.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <SectionHeader title="Academic Qualification" primaryColor={theme.primaryColor} fontSize={theme.fontSize} showBorder={theme.showBorder} />
                {education.map((edu) => (
                  <div key={edu.id} className="mb-3">
                    <BulletItem primaryColor={theme.primaryColor} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing}>
                      <span contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold outline-none focus:ring-1 focus:ring-indigo-300">{edu.examName}</span>
                    </BulletItem>
                    <div className="ml-6">
                      <InfoRow label="Board" value={edu.board} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                      <InfoRow label="Subject" value={edu.subject} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                      <InfoRow label="Institute" value={edu.instituteName} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                      <InfoRow label="Result" value={edu.gpa ? `${edu.gpa} (${edu.gpaType})` : ''} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                      <InfoRow label="Passing Year" value={edu.passingYear} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                    </div>
                  </div>
                ))}
              </section>
            );
          }

          if (sectionId === 'computerSkills' && computerSkills.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <SectionHeader title="Computer Skills" primaryColor={theme.primaryColor} fontSize={theme.fontSize} showBorder={theme.showBorder} />
                {computerSkills.map((skill) => (
                  <div key={skill.id} className="mb-2">
                    <BulletItem primaryColor={theme.primaryColor} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing}>
                      <div className="flex flex-col">
                        {skill.hasTraining && (
                          <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none focus:ring-1 focus:ring-indigo-300">
                            Completed a {skill.duration} computer training program from {skill.instituteName}.
                          </span>
                        )}
                        {skill.skills.length > 0 && (
                          <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none focus:ring-1 focus:ring-indigo-300">
                            Proficient in {skill.skills.join(', ')}, etc,
                          </span>
                        )}
                      </div>
                    </BulletItem>
                  </div>
                ))}
              </section>
            );
          }

          if (sectionId === 'trainings' && trainings && trainings.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <SectionHeader title="Professional Trainings" primaryColor={theme.primaryColor} fontSize={theme.fontSize} showBorder={theme.showBorder} />
                {trainings.map((training) => (
                  <div key={training.id} className="mb-3">
                    <BulletItem primaryColor={theme.primaryColor} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing}>
                      <span contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold outline-none focus:ring-1 focus:ring-indigo-300">{training.subject}</span>
                    </BulletItem>
                    <div className="ml-6">
                      <InfoRow label="Institute" value={training.instituteName} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                      <InfoRow label="Duration" value={training.duration} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                      {training.description && (
                        <p 
                          contentEditable={theme.editableMode}
                          suppressContentEditableWarning
                          style={{ fontSize: `${theme.fontSize}pt`, lineHeight: theme.lineSpacing }} 
                          className="outline-none focus:ring-1 focus:ring-indigo-300"
                        >
                          {training.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </section>
            );
          }

          if (sectionId === 'workExperience' && workExperience.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <SectionHeader title="Job Experience" primaryColor={theme.primaryColor} fontSize={theme.fontSize} showBorder={theme.showBorder} />
                {workExperience.map((work) => (
                  <BulletItem key={work.id} primaryColor={theme.primaryColor} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing}>
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none focus:ring-1 focus:ring-indigo-300">
                      Worked as a <span className="font-bold">{work.position}</span> at <span className="font-bold">{work.companyName}</span> for {work.duration}
                    </span>
                    {work.description && (
                      <p 
                        contentEditable={theme.editableMode}
                        suppressContentEditableWarning
                        style={{ fontSize: `${theme.fontSize - 1}pt`, lineHeight: theme.lineSpacing }} 
                        className="mt-1 italic outline-none focus:ring-1 focus:ring-indigo-300"
                      >
                        {work.description}
                      </p>
                    )}
                  </BulletItem>
                ))}
              </section>
            );
          }

          if (sectionId === 'languageProficiency' && languageProficiency.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <SectionHeader title="Language Proficiency" primaryColor={theme.primaryColor} fontSize={theme.fontSize} showBorder={theme.showBorder} />
                {languageProficiency.map((lang, idx) => (
                  <BulletItem key={`lang-${idx}-${lang}`} primaryColor={theme.primaryColor} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing}>
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none focus:ring-1 focus:ring-indigo-300">{lang}</span>
                  </BulletItem>
                ))}
              </section>
            );
          }

          if (sectionId === 'selfAssessment' && selfAssessment.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <SectionHeader title="Self-Assessment" primaryColor={theme.primaryColor} fontSize={theme.fontSize} showBorder={theme.showBorder} />
                {selfAssessment.map((item, idx) => (
                  <BulletItem key={`self-${idx}-${item}`} primaryColor={theme.primaryColor} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing}>
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none focus:ring-1 focus:ring-indigo-300">{item}</span>
                  </BulletItem>
                ))}
              </section>
            );
          }

          if (sectionId === 'hobbies' && hobbies.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <SectionHeader title="Hobby and Interest" primaryColor={theme.primaryColor} fontSize={theme.fontSize} showBorder={theme.showBorder} />
                {hobbies.map((hobby, idx) => (
                  <BulletItem key={`hobby-${idx}-${hobby}`} primaryColor={theme.primaryColor} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing}>
                    <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none focus:ring-1 focus:ring-indigo-300">{hobby}</span>
                  </BulletItem>
                ))}
              </section>
            );
          }

          if (sectionId === 'custom' && customSection.fields.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <SectionHeader title={customSection.title} primaryColor={theme.primaryColor} fontSize={theme.fontSize} showBorder={theme.showBorder} />
                {customSection.fields.map((field) => (
                  <InfoRow key={field.id} label={field.label} value={field.value} fontSize={theme.fontSize} displayLineSpacing={displayLineSpacing} />
                ))}
              </section>
            );
          }

          if (sectionId === 'references' && data.references && data.references.length > 0) {
            return (
              <section key={sectionId} className="break-inside-avoid">
                <SectionHeader title="References" primaryColor={theme.primaryColor} fontSize={theme.fontSize} showBorder={theme.showBorder} />
                <div className="grid grid-cols-2 gap-4">
                  {data.references.map((ref) => (
                    <div key={ref.id} style={{ fontSize: `${theme.fontSize}pt`, lineHeight: theme.lineSpacing }}>
                      <p contentEditable={theme.editableMode} suppressContentEditableWarning className="font-bold outline-none focus:ring-1 focus:ring-indigo-300">{ref.name}</p>
                      <p contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none focus:ring-1 focus:ring-indigo-300">{ref.position}</p>
                      <p contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none focus:ring-1 focus:ring-indigo-300">{ref.organization}</p>
                      <p>Phone: <span contentEditable={theme.editableMode} suppressContentEditableWarning className="outline-none focus:ring-1 focus:ring-indigo-300">{ref.phone}</span></p>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionId === 'declaration' && declaration) {
            return (
              <section key={sectionId} className="mt-4 break-inside-avoid">
                <SectionHeader title="Declaration" primaryColor={theme.primaryColor} fontSize={theme.fontSize} showBorder={theme.showBorder} />
                <p 
                  contentEditable={theme.editableMode}
                  suppressContentEditableWarning
                  style={{ fontSize: `${theme.fontSize}pt`, lineHeight: theme.lineSpacing }} 
                  className="text-justify whitespace-pre-wrap outline-none focus:ring-1 focus:ring-indigo-300"
                >
                  {declaration}
                </p>
                
                <div className="mt-12 flex flex-col items-start">
                  {personalInfo.signature ? (
                    <div className="mb-1">
                      <img 
                        src={personalInfo.signature} 
                        alt="Signature" 
                        className="h-8 object-contain" 
                        style={{ maxWidth: '120px' }}
                      />
                    </div>
                  ) : (
                    <div className="h-8" /> // Gap if no signature
                  )}
                  <div style={{ backgroundColor: theme.primaryColor }} className="h-[1px] w-32 mb-1" />
                  <p style={{ fontSize: `${theme.fontSize}pt`, lineHeight: theme.lineSpacing }} className="font-bold">Signature</p>
                  <p 
                    contentEditable={theme.editableMode}
                    suppressContentEditableWarning
                    style={{ fontSize: `${theme.fontSize}pt`, lineHeight: theme.lineSpacing }}
                    className="outline-none focus:ring-1 focus:ring-indigo-300"
                  >
                    ({personalInfo.name || 'Your Name'})
                  </p>
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>

      {/* Watermark/Footer */}
      <div className="mt-auto pt-10 text-center">
        <p className="text-[9pt] font-bold italic transition-colors hover:text-emerald-600" style={{ color: theme.primaryColor + '60' }}>
          Professionally Crafted by Maksud Computer Digital Hub
        </p>
      </div>
    </div>
  );
}));

ClassicTemplate.displayName = 'ClassicTemplate';

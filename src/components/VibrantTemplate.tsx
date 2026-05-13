import React from 'react';
import { CVData } from '../types';
import { cn } from '../lib/utils';

interface VibrantTemplateProps {
  data: CVData;
}

const SectionHeader = ({ title, primaryColor }: { title: string; primaryColor: string }) => (
  <div className="mb-4">
    <div 
      className="px-4 py-1.5 rounded-lg font-bold uppercase tracking-widest text-white shadow-md transition-all hover:translate-x-1"
      style={{ 
        background: `linear-gradient(45deg, ${primaryColor}, ${adjustColor(primaryColor, -20)})`,
        boxShadow: `0 4px 14px 0 ${primaryColor}40`
      }}
    >
      {title}
    </div>
  </div>
);

// Helper function to darken/lighten color
function adjustColor(color: string, amount: number) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).slice(-2));
}

const InfoRow = ({ label, value, fontSize, color }: { label: string; value: string; fontSize: number; color: string }) => {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[160px_15px_1fr] mb-2" style={{ fontSize: `${fontSize}pt` }}>
      <div className="font-bold whitespace-nowrap" style={{ color: adjustColor(color, -40) }}>{label}</div>
      <div className="font-bold">:</div>
      <div className="text-gray-800">{value}</div>
    </div>
  );
};

export const VibrantTemplate = React.memo(React.forwardRef<HTMLDivElement, VibrantTemplateProps>(({ data }, ref) => {
  const { theme, personalInfo, careerObjective, education, computerSkills, skills, workExperience, languageProficiency, selfAssessment, hobbies, declaration, references, selectedSections, customSection } = data;
  const primaryColor = theme.primaryColor || '#006747'; // Default to a nice green if not provided
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const getAddress = (v: string, p: string, u: string, d: string) => {
    const parts = [];
    if (v) parts.push(`Village: ${v}`);
    if (p) parts.push(`P.O: ${p}`);
    if (u) parts.push(`P.S/Upazila: ${u}`);
    if (d) parts.push(`Dist: ${d}`);
    return parts.join(', ');
  };

  return (
    <div 
      ref={ref}
      className={cn(
        "bg-white w-[210mm] p-[18mm] mx-auto shadow-2xl print:shadow-none print:m-0 flex flex-col relative overflow-hidden",
        theme.fontStyle
      )}
      style={{ minHeight: '297mm' }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${primaryColor}, transparent)` }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 opacity-5 pointer-events-none" style={{ background: `radial-gradient(circle at bottom left, ${primaryColor}, transparent)` }} />

      {/* Header section based on screenshot */}
      <div className="flex justify-between items-start mb-8 gap-8">
        <div className="flex-1 text-left">
          <h1 className="text-4xl font-black uppercase tracking-[0.2em] mb-2" style={{ color: primaryColor }}>
            RESUME
          </h1>
          <div className="w-16 h-1 mb-2 rounded-full" style={{ backgroundColor: '#f42a41' }} />
          <h2 className="text-xl font-bold text-gray-500 uppercase tracking-widest mb-4 italic">OF</h2>
          <h3 className="text-2xl font-black uppercase tracking-tight mb-3" style={{ color: adjustColor(primaryColor, -20) }}>
            {personalInfo.name || 'YOUR FULL NAME'}
          </h3>
          
          <div className="flex flex-col gap-y-1 text-sm font-medium text-gray-600">
            {personalInfo.phone && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold" style={{ color: primaryColor }}>Mobile:</span>
                <span className="text-gray-900">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold" style={{ color: primaryColor }}>Email:</span>
                <span className="text-gray-900 italic font-semibold">{personalInfo.email}</span>
              </div>
            )}
          </div>
        </div>

        {personalInfo.photo && (
          <div className="relative group">
            <div 
              className="absolute -inset-1 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-all duration-300"
              style={{ background: `linear-gradient(45deg, ${primaryColor}, #f42a41)` }}
            />
            <div className="relative w-32 h-36 rounded-xl border-4 border-white shadow-xl overflow-hidden bg-gray-100">
              <img 
                src={personalInfo.photo} 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Career Objective */}
        {selectedSections.includes('careerObjective') && careerObjective && (
          <section>
            <SectionHeader title="Career Objective" primaryColor={primaryColor} />
            <div className="p-4 rounded-xl border-l-4 bg-gray-50/50 italic text-justify leading-relaxed text-gray-700 shadow-sm" style={{ borderLeftColor: primaryColor }}>
              {careerObjective}
            </div>
          </section>
        )}

        {/* Academic Qualification */}
        {selectedSections.includes('education') && education.length > 0 && (
          <section>
            <SectionHeader title="Academic Qualifications" primaryColor={primaryColor} />
            <div className="space-y-6">
              {education.map((edu, idx) => (
                <div key={edu.id} className="relative pl-6">
                  <div className="absolute left-0 top-2 w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                  <div className="absolute left-0.5 top-4 w-1 h-full opacity-20" style={{ backgroundColor: primaryColor }} />
                  <h4 className="font-bold text-lg mb-2 underline decoration-2 underline-offset-4" style={{ color: adjustColor(primaryColor, -10), textDecorationColor: '#f42a41' }}>
                    {edu.examName}
                  </h4>
                  <div className="ml-2">
                    <InfoRow label="Institute" value={edu.instituteName} fontSize={theme.fontSize} color={primaryColor} />
                    <InfoRow label="Board/University" value={edu.board} fontSize={theme.fontSize} color={primaryColor} />
                    <InfoRow label="Group/Major" value={edu.subject} fontSize={theme.fontSize} color={primaryColor} />
                    <InfoRow label="Passing Year" value={edu.passingYear} fontSize={theme.fontSize} color={primaryColor} />
                    <InfoRow label="Result" value={edu.gpa ? `${edu.gpaType === 'GPA' ? 'GPA' : 'Class'} ${edu.gpa} ${edu.gpaType === 'GPA' ? '(Out of 5.00)' : ''}` : ''} fontSize={theme.fontSize} color={primaryColor} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Language Competency */}
        {selectedSections.includes('languageProficiency') && languageProficiency.length > 0 && (
          <section>
            <SectionHeader title="Language Competency" primaryColor={primaryColor} />
            <ul className="grid grid-cols-2 gap-4 ml-4">
              {languageProficiency.map((lang, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: '#f42a41' }} />
                  <span className="font-semibold text-gray-800">{lang}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Experience */}
        {selectedSections.includes('workExperience') && workExperience.length > 0 && (
          <section>
            <SectionHeader title="Experience" primaryColor={primaryColor} />
            <div className="space-y-4">
              {workExperience.map((exp, idx) => (
                <div key={exp.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg" style={{ color: primaryColor }}>{idx + 1}. {exp.companyName}</h4>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-black shadow-sm" style={{ color: '#f42a41' }}>{exp.duration}</span>
                  </div>
                  <div className="ml-4">
                    <InfoRow label="Designation" value={exp.position} fontSize={theme.fontSize} color={primaryColor} />
                    {exp.description && (
                      <div className="mt-2 text-sm text-gray-600 leading-relaxed pl-2 border-l-2" style={{ borderLeftColor: primaryColor + '40' }}>
                        {exp.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Personal Attributes / Self Assessment */}
        {selectedSections.includes('selfAssessment') && selfAssessment.length > 0 && (
          <section>
            <SectionHeader title="Personal Attributes" primaryColor={primaryColor} />
            <div className="grid grid-cols-2 gap-3 ml-4">
              {selfAssessment.map((attr, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-xl" style={{ color: primaryColor }}>➤</span>
                  <span className="font-bold text-gray-800">{attr}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hobbies */}
        {selectedSections.includes('hobbies') && hobbies.length > 0 && (
          <section>
            <SectionHeader title="Hobbies & Interests" primaryColor={primaryColor} />
            <div className="flex flex-wrap gap-2 ml-4">
              {hobbies.map((hobby, idx) => (
                <span 
                  key={idx} 
                  className="px-4 py-1.5 rounded-full text-sm font-bold shadow-sm"
                  style={{ backgroundColor: primaryColor + '15', color: primaryColor, border: `1px solid ${primaryColor}30` }}
                >
                  {hobby}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Custom Section */}
        {selectedSections.includes('custom') && customSection.title && customSection.fields.length > 0 && (
          <section>
            <SectionHeader title={customSection.title} primaryColor={primaryColor} />
            <div className="space-y-2 ml-4">
              {customSection.fields.map((field) => (
                <InfoRow 
                  key={field.id} 
                  label={field.label} 
                  value={field.value} 
                  fontSize={theme.fontSize} 
                  color={primaryColor} 
                />
              ))}
            </div>
          </section>
        )}

        {/* Other Skills / Computer Skills */}
        {(selectedSections.includes('skills') || (selectedSections.includes('computerSkills') && computerSkills.length > 0)) && (
          <section>
            <SectionHeader title="Technical & Other Skills" primaryColor={primaryColor} />
            <div className="grid grid-cols-1 gap-4 ml-4">
              {computerSkills.length > 0 && computerSkills.map((skill, idx) => (
                <div key={`comp-${idx}`} className="flex items-start gap-3">
                  <span className="text-xl mt-[-2px]" style={{ color: '#f42a41' }}>➢</span>
                  <div>
                    {skill.hasTraining && <span className="font-bold text-gray-900 leading-none">Completed {skill.duration} training from {skill.instituteName}: </span>}
                    <span className="italic text-gray-700">{skill.skills.join(', ')}</span>
                  </div>
                </div>
              ))}
              {selectedSections.includes('skills') && skills && skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <div key={`skill-${idx}`} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 border-l-2" style={{ borderLeftColor: primaryColor }}>
                      <span style={{ color: '#f42a41' }}>✓</span> {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Personal Information */}
        {selectedSections.includes('personalInfo') && (
          <section className="break-inside-avoid">
            <SectionHeader title="Personal Information" primaryColor={primaryColor} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 ml-4">
              <InfoRow label="Father's Name" value={personalInfo.fathersName} fontSize={theme.fontSize} color={primaryColor} />
              <InfoRow label="Mother's Name" value={personalInfo.mothersName} fontSize={theme.fontSize} color={primaryColor} />
              <InfoRow label="Date of Birth" value={formatDate(personalInfo.dob)} fontSize={theme.fontSize} color={primaryColor} />
              <InfoRow label="Blood Group" value={personalInfo.bloodGroup} fontSize={theme.fontSize} color={primaryColor} />
              <InfoRow label="Nationality" value={personalInfo.nationality} fontSize={theme.fontSize} color={primaryColor} />
              <InfoRow label="National ID No" value={personalInfo.nid} fontSize={theme.fontSize} color={primaryColor} />
              <InfoRow label="Birth Reg. No" value={personalInfo.birthRegNo} fontSize={theme.fontSize} color={primaryColor} />
              <InfoRow label="Religion" value={personalInfo.religion} fontSize={theme.fontSize} color={primaryColor} />
              <InfoRow label="Marital Status" value={personalInfo.maritalStatus} fontSize={theme.fontSize} color={primaryColor} />
              <InfoRow label="Gender" value={personalInfo.gender} fontSize={theme.fontSize} color={primaryColor} />
              <InfoRow label="Height" value={personalInfo.heightFeet ? `${personalInfo.heightFeet}' ${personalInfo.heightInches || 0}"` : ''} fontSize={theme.fontSize} color={primaryColor} />
              <InfoRow label="Weight" value={personalInfo.weight ? `${personalInfo.weight} KG` : ''} fontSize={theme.fontSize} color={primaryColor} />
              
              <div className="col-span-full mt-2">
                <InfoRow label="Present Address" value={getAddress(personalInfo.presentVillage, personalInfo.presentPostOffice, personalInfo.presentUpazila, personalInfo.presentDistrict)} fontSize={theme.fontSize} color={primaryColor} />
              </div>
              <div className="col-span-full">
                <InfoRow label="Permanent Address" value={getAddress(personalInfo.permanentVillage, personalInfo.permanentPostOffice, personalInfo.permanentUpazila, personalInfo.permanentDistrict)} fontSize={theme.fontSize} color={primaryColor} />
              </div>
            </div>
          </section>
        )}

        {/* References */}
        {selectedSections.includes('references') && references.length > 0 && (
          <section className="break-inside-avoid">
            <SectionHeader title="Reference" primaryColor={primaryColor} />
            <div className="grid grid-cols-2 gap-8 ml-4">
              {references.map((ref, idx) => (
                <div key={ref.id} className="relative p-4 rounded-xl bg-gray-50/50 border-t-4" style={{ marginTop: idx % 2 !== 0 ? '0' : '0', borderTopColor: primaryColor }}>
                  <div className="font-black text-gray-900 mb-2 uppercase" style={{ color: primaryColor }}>({idx + 1}) {ref.name}</div>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><span className="font-bold">Designation:</span> {ref.position}</p>
                    <p><span className="font-bold">Organization:</span> {ref.organization}</p>
                    <p><span className="font-bold">Mobile:</span> {ref.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Declaration */}
        {selectedSections.includes('declaration') && declaration && (
          <section className="break-inside-avoid">
            <SectionHeader title="Declaration" primaryColor={primaryColor} />
            <div className="p-4 rounded-xl bg-gray-50/30 text-justify text-sm italic leading-relaxed text-gray-700 border border-dashed border-gray-200">
              {declaration}
            </div>
            
            <div className="mt-12 flex flex-col items-end mr-8">
              <div className="text-center w-48">
                {personalInfo.signature ? (
                  <img src={personalInfo.signature} alt="Signature" className="h-10 mx-auto object-contain mb-2" />
                ) : (
                  <div className="h-10 mb-2" />
                )}
                <div className="h-px w-full mb-2" style={{ backgroundColor: primaryColor }} />
                <p className="font-black text-sm uppercase" style={{ color: primaryColor }}>Signature</p>
                <p className="font-bold text-xs" style={{ color: '#f42a41' }}>{personalInfo.name}</p>
                <p className="text-[10px] text-gray-400 mt-1">Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Watermark/Footer */}
      <div className="mt-auto pt-10 text-center">
        <p className="text-[9pt] font-bold italic transition-colors hover:text-emerald-600" style={{ color: primaryColor + '60' }}>
          Professionally Crafted by Maksud Computer Digital Hub
        </p>
      </div>
    </div>
  );
}));

VibrantTemplate.displayName = 'VibrantTemplate';

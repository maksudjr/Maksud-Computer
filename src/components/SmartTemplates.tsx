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
  const { theme, personalInfo, careerObjective, education, computerSkills, workExperience, languageProficiency, selfAssessment, hobbies, declaration, customSection, selectedSections, references } = data;

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
        "bg-white w-[210mm] p-[15mm] mx-auto shadow-lg print:shadow-none print:m-0 flex flex-col relative cv-paper",
        theme.fontStyle
      )}
      style={{ minHeight: `${297 * theme.pageCount}mm` }}
    >
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: theme.primaryColor }} />

      {/* Header */}
      <header className={cn(
        "flex justify-between items-start mb-8 pt-6 p-6 -mx-6 shadow-sm",
        theme.headerStyle === 'black' ? "bg-black text-white" : (theme.headerStyle === 'primary' ? "bg-indigo-600 text-white" : "")
      )}
      style={{ 
        backgroundColor: theme.headerStyle === 'black' ? '#000000' : (theme.headerStyle === 'primary' ? theme.primaryColor : 'transparent'),
        color: (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? (theme.primaryColor === '#ffd700' && theme.headerStyle === 'primary' ? '#000000' : '#ffffff') : 'inherit'
      }}>
        <div className="flex-1">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-1" style={{ color: (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? 'inherit' : theme.primaryColor }}>
            {personalInfo.name || 'Your Name'}
          </h1>
          <div className={cn("flex flex-wrap gap-4", (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? "text-white/80" : "text-gray-600")} style={{ fontSize: `${theme.fontSize - 1}pt` }}>
            {personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone size={12} style={{ color: (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? 'inherit' : theme.primaryColor }} />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail size={12} style={{ color: (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? 'inherit' : theme.primaryColor }} />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {presentAddressLine && (
              <div className="flex items-center gap-1">
                <MapPin size={12} style={{ color: (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? 'inherit' : theme.primaryColor }} />
                <span>{presentAddressLine}</span>
              </div>
            )}
          </div>
        </div>
        {personalInfo.photo && (
          <div className="w-24 h-32 border-2 rounded-lg overflow-hidden shrink-0 ml-6 bg-white" style={{ borderColor: theme.primaryColor }}>
            <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        )}
      </header>

      <div className="space-y-6">
        {/* Career Objective */}
        {selectedSections.includes('careerObjective') && careerObjective && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 mb-2 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
              Career Objective
            </h2>
            <p className="text-justify leading-relaxed" style={{ fontSize: `${theme.fontSize}pt` }}>
              {careerObjective}
            </p>
          </section>
        )}

        {/* Education */}
        {selectedSections.includes('education') && education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
              Educational Qualification
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="grid grid-cols-[1fr_auto] gap-2">
                  <div>
                    <h3 className="font-bold" style={{ fontSize: `${theme.fontSize}pt` }}>{edu.examName}</h3>
                    <p className="text-gray-600" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{edu.instituteName}</p>
                    <p className="text-gray-500 italic" style={{ fontSize: `${theme.fontSize - 2}pt` }}>{edu.board} Board | {edu.subject}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold" style={{ color: theme.primaryColor, fontSize: `${theme.fontSize}pt` }}>{edu.gpa}</span>
                    <p className="text-gray-500" style={{ fontSize: `${theme.fontSize - 2}pt` }}>{edu.passingYear}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {selectedSections.includes('workExperience') && workExperience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
              Work Experience
            </h2>
            <div className="space-y-4">
              {workExperience.map((work) => (
                <div key={work.id}>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold" style={{ fontSize: `${theme.fontSize}pt` }}>{work.position}</h3>
                    <span className="text-gray-500 font-medium" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{work.duration}</span>
                  </div>
                  <p className="font-bold text-gray-700" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{work.companyName}</p>
                  <p className="text-gray-600 mt-1" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{work.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Computer Skills */}
        {selectedSections.includes('computerSkills') && computerSkills.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
              Computer Skills
            </h2>
            <div className="space-y-2">
              {computerSkills.map((skill) => (
                <div key={skill.id}>
                  {skill.hasTraining && (
                    <p className="mb-1 text-gray-700 font-medium" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                      Completed a {skill.duration} computer training program from {skill.instituteName}.
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {skill.skills.map((s, sIdx) => (
                      <span key={`${skill.id}-skill-${sIdx}`} className="px-3 py-1 bg-gray-100 rounded-full font-medium" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Language Proficiency */}
        {selectedSections.includes('languageProficiency') && languageProficiency.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
              Language Proficiency
            </h2>
            <div className="flex flex-wrap gap-4">
              {languageProficiency.map((lang, idx) => (
                <div key={`lang-${idx}-${lang}`} className="flex items-center gap-2" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                  <span>{lang}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Self Assessment */}
        {selectedSections.includes('selfAssessment') && selfAssessment.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
              Self Assessment
            </h2>
            <ul className="list-disc list-inside space-y-1" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
              {selfAssessment.map((item, idx) => (
                <li key={`self-${idx}-${item}`}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Hobbies */}
        {selectedSections.includes('hobbies') && hobbies.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
              Hobbies & Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby, idx) => (
                <span key={`hobby-${idx}-${hobby}`} className="px-3 py-1 border rounded-lg" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                  {hobby}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Personal Info */}
        {selectedSections.includes('personalInfo') && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
              Personal Details
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Father's Name</span>
                <span>{personalInfo.fathersName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Mother's Name</span>
                <span>{personalInfo.mothersName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Date of Birth</span>
                <span>{formatDate(personalInfo.dob)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Gender</span>
                <span>{personalInfo.gender}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Nationality</span>
                <span>{personalInfo.nationality}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Religion</span>
                <span>{personalInfo.religion}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Marital Status</span>
                <span>{personalInfo.maritalStatus}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">NID No</span>
                <span>{personalInfo.nid}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Birth Reg No</span>
                <span>{personalInfo.birthRegNo}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Blood Group</span>
                <span>{personalInfo.bloodGroup}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Height</span>
                <span>{personalInfo.heightFeet || personalInfo.heightInches ? `${personalInfo.heightFeet || '0'}' ${personalInfo.heightInches || '0'}"` : ''}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Weight</span>
                <span>{personalInfo.weight ? `${personalInfo.weight} Kg` : ''}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1 col-span-2">
                <span className="font-bold text-gray-600">Permanent Address</span>
                <span>{permanentAddressLine}</span>
              </div>
            </div>
          </section>
        )}

        {/* References */}
        {selectedSections.includes('references') && references && references.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
              References
            </h2>
            <div className="grid grid-cols-2 gap-8">
              {references.map((ref) => (
                <div key={ref.id} style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                  <p className="font-bold">{ref.name}</p>
                  <p className="text-gray-600">{ref.position}</p>
                  <p className="text-gray-600">{ref.organization}</p>
                  <p className="text-gray-600">{ref.phone}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Section */}
        {selectedSections.includes('custom') && customSection && customSection.fields.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
              {customSection.title}
            </h2>
            <div className="space-y-2" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
              {customSection.fields.map((field) => (
                <div key={field.id} className="flex justify-between border-b border-gray-50 pb-1">
                  <span className="font-bold text-gray-600">{field.label}</span>
                  <span>{field.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Declaration */}
        {selectedSections.includes('declaration') && declaration && (
          <section className="mt-8">
            <h2 className="text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ color: theme.primaryColor, borderColor: `${theme.primaryColor}33` }}>
              Declaration
            </h2>
            <p className="text-justify italic text-gray-600" style={{ fontSize: `${theme.fontSize - 0.5}pt` }}>
              "{declaration}"
            </p>
            <div className="mt-12 flex flex-col items-end">
              {personalInfo.signature && (
                <img src={personalInfo.signature} alt="Signature" className="h-10 object-contain mb-2" />
              )}
              <div className="w-48 border-t border-gray-900 pt-1 text-center">
                <p className="font-bold" style={{ fontSize: `${theme.fontSize}pt` }}>{personalInfo.name}</p>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-8 text-center border-t border-gray-100">
        <p className="text-gray-300 italic font-medium" style={{ fontSize: `${theme.fontSize - 3}pt` }}>
          This CV was built from Maksud Computer
        </p>
      </footer>
    </div>
  );
});

export const SmartModernTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(({ data }, ref) => {
  const { theme, personalInfo, careerObjective, education, computerSkills, workExperience, languageProficiency, selfAssessment, hobbies, declaration, customSection, selectedSections, references } = data;

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
      style={{ minHeight: `${297 * theme.pageCount}mm` }}
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
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.email && (
                <div className="flex items-center gap-3">
                  <Mail size={14} className="opacity-70" />
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}
              {presentAddressLine && (
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="opacity-70 mt-1 shrink-0" />
                  <span>{presentAddressLine}</span>
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
                        {skill.duration} training at {skill.instituteName}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {skill.skills.map((s, sIdx) => (
                        <span key={`${skill.id}-skill-${sIdx}`} className="px-2 py-1 bg-white/10 rounded text-xs font-medium">
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
                    <span>{lang}</span>
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
                  <span key={`hobby-${idx}-${hobby}`} className="px-2 py-1 bg-white/10 rounded text-xs font-medium">
                    {hobby}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="mt-auto pt-8 text-center opacity-40">
          <p style={{ fontSize: `${theme.fontSize - 4}pt` }}>Maksud Computer CV Builder</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 flex flex-col">
        <header className="mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tight mb-2" style={{ color: theme.primaryColor }}>
            {personalInfo.name || 'Your Name'}
          </h1>
          <div className="h-1 w-20 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
        </header>

        <div className="space-y-10">
          {selectedSections.includes('careerObjective') && careerObjective && (
            <section>
              <h2 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-3">
                <FileText size={20} style={{ color: theme.primaryColor }} />
                <span>About Me</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-justify" style={{ fontSize: `${theme.fontSize}pt` }}>
                {careerObjective}
              </p>
            </section>
          )}

          {selectedSections.includes('workExperience') && workExperience.length > 0 && (
            <section>
              <h2 className="text-lg font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                <Briefcase size={20} style={{ color: theme.primaryColor }} />
                <span>Experience</span>
              </h2>
              <div className="space-y-8">
                {workExperience.map((work) => (
                  <div key={work.id} className="relative pl-6 border-l-2 border-gray-100">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2" style={{ borderColor: theme.primaryColor }} />
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold uppercase" style={{ fontSize: `${theme.fontSize}pt` }}>{work.position}</h3>
                      <span className="text-xs font-bold text-gray-400">{work.duration}</span>
                    </div>
                    <p className="font-bold text-indigo-600 mb-2" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{work.companyName}</p>
                    <p className="text-gray-600" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{work.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {selectedSections.includes('education') && education.length > 0 && (
            <section>
              <h2 className="text-lg font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                <BookOpen size={20} style={{ color: theme.primaryColor }} />
                <span>Education</span>
              </h2>
              <div className="space-y-6">
                {education.map((edu, idx) => (
                  <div key={edu.id} className="flex gap-4">
                    <div className="font-black text-gray-200 text-2xl leading-none">0{idx + 1}</div>
                    <div>
                      <h3 className="font-bold uppercase" style={{ fontSize: `${theme.fontSize}pt` }}>{edu.examName}</h3>
                      <p className="text-gray-600 font-medium" style={{ fontSize: `${theme.fontSize - 1}pt` }}>{edu.instituteName}</p>
                      <p className="text-gray-400 italic" style={{ fontSize: `${theme.fontSize - 2}pt` }}>{edu.board} Board | {edu.subject}</p>
                      <div className="flex gap-4 mt-1 text-gray-400 font-bold" style={{ fontSize: `${theme.fontSize - 2}pt` }}>
                        <span>{edu.passingYear}</span>
                        <span>GPA: {edu.gpa} ({edu.gpaType})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {selectedSections.includes('selfAssessment') && selfAssessment.length > 0 && (
            <section>
              <h2 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-3">
                <CheckSquare size={20} style={{ color: theme.primaryColor }} />
                <span>Self Assessment</span>
              </h2>
              <ul className="list-disc list-inside space-y-1 text-gray-600" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                {selfAssessment.map((item, idx) => (
                  <li key={`self-${idx}-${item}`}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {selectedSections.includes('personalInfo') && (
            <section>
              <h2 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-3">
                <User size={20} style={{ color: theme.primaryColor }} />
                <span>Personal Details</span>
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
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
              <h2 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-3">
                <Award size={20} style={{ color: theme.primaryColor }} />
                <span>References</span>
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {references.map((ref) => (
                  <div key={ref.id} className="text-sm text-gray-600" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                    <p className="font-bold text-gray-900">{ref.name}</p>
                    <p>{ref.position}</p>
                    <p>{ref.organization}</p>
                    <p>{ref.phone}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {selectedSections.includes('custom') && customSection && customSection.fields.length > 0 && (
            <section>
              <h2 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-3">
                <Info size={20} style={{ color: theme.primaryColor }} />
                <span>{customSection.title}</span>
              </h2>
              <div className="space-y-2 text-sm text-gray-600" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                {customSection.fields.map((field) => (
                  <p key={field.id}><strong>{field.label}:</strong> {field.value}</p>
                ))}
              </div>
            </section>
          )}

          {selectedSections.includes('declaration') && declaration && (
            <section className="mt-auto">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h2 className="text-sm font-black uppercase tracking-widest mb-3 text-gray-400">Declaration</h2>
                <p className="text-gray-600 italic" style={{ fontSize: `${theme.fontSize - 1}pt` }}>
                  {declaration}
                </p>
              </div>
              <div className="mt-10 flex flex-col items-end">
                {personalInfo.signature && (
                  <img src={personalInfo.signature} alt="Signature" className="h-10 object-contain mb-2" />
                )}
                <div className="w-48 border-t-2 border-gray-900 pt-2 text-center">
                  <p className="font-black uppercase tracking-tighter" style={{ fontSize: `${theme.fontSize}pt` }}>{personalInfo.name}</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
});

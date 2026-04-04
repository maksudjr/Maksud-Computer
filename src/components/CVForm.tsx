import React, { useState } from 'react';
import { CVData, SectionId, Education, WorkExperience, CustomField, ComputerSkill } from '../types';
import { Plus, Trash2, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';

interface CVFormProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

const CustomSelect = ({ 
  label, 
  value, 
  options, 
  onChange 
}: { 
  label: string; 
  value: string; 
  options: string[]; 
  onChange: (val: string) => void 
}) => {
  const [isCustom, setIsCustom] = useState(!options.includes(value) && value !== '');

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2">
        <select
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={isCustom ? 'custom' : value}
          onChange={(e) => {
            if (e.target.value === 'custom') {
              setIsCustom(true);
            } else {
              setIsCustom(false);
              onChange(e.target.value);
            }
          }}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
          <option value="custom">Custom...</option>
        </select>
        {isCustom && (
          <input
            type="text"
            placeholder={`Enter custom ${label.toLowerCase()}`}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    </div>
  );
};

const MultiSelect = ({ 
  label, 
  selectedValues, 
  options, 
  onChange 
}: { 
  label: string; 
  selectedValues: string[]; 
  options: string[]; 
  onChange: (vals: string[]) => void 
}) => {
  const [customValue, setCustomValue] = useState('');

  const toggleOption = (opt: string) => {
    if (selectedValues.includes(opt)) {
      onChange(selectedValues.filter(v => v !== opt));
    } else {
      onChange([...selectedValues, opt]);
    }
  };

  const addCustomSkill = () => {
    if (customValue.trim() && !selectedValues.includes(customValue.trim())) {
      onChange([...selectedValues, customValue.trim()]);
      setCustomValue('');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-2 mb-3">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggleOption(opt)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              selectedValues.includes(opt)
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Add Skills</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type skill and press Enter..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomSkill();
              }
            }}
          />
          <button
            type="button"
            onClick={addCustomSkill}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      {selectedValues.length > 0 && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-medium text-blue-700">Selected Skills:</p>
            <button 
              type="button"
              onClick={() => onChange([])}
              className="text-[10px] text-red-500 hover:underline font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedValues.map((val) => (
              <span 
                key={val} 
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-blue-200 text-blue-700 rounded text-xs"
              >
                {val}
                <button 
                  type="button"
                  onClick={() => toggleOption(val)}
                  className="hover:text-red-500"
                >
                  <Trash2 size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const CVForm: React.FC<CVFormProps> = ({ data, onChange }) => {
  const updatePersonalInfo = (field: keyof typeof data.personalInfo, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      examName: '',
      passingYear: '',
      board: '',
      gpa: '',
      instituteName: '',
      subject: ''
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange({
      ...data,
      education: data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter(edu => edu.id !== id) });
  };

  const addWork = () => {
    const newWork: WorkExperience = {
      id: crypto.randomUUID(),
      companyName: '',
      position: '',
      duration: '',
      description: ''
    };
    onChange({ ...data, workExperience: [...data.workExperience, newWork] });
  };

  const updateWork = (id: string, field: keyof WorkExperience, value: string) => {
    onChange({
      ...data,
      workExperience: data.workExperience.map(work => work.id === id ? { ...work, [field]: value } : work)
    });
  };

  const removeWork = (id: string) => {
    onChange({ ...data, workExperience: data.workExperience.filter(work => work.id !== id) });
  };

  const addListItem = (field: 'skills' | 'hobbies' | 'languageProficiency' | 'selfAssessment') => {
    onChange({ ...data, [field]: [...data[field], ''] });
  };

  const updateListItem = (field: 'skills' | 'hobbies' | 'languageProficiency' | 'selfAssessment', index: number, value: string) => {
    const newList = [...data[field]];
    newList[index] = value;
    onChange({ ...data, [field]: newList });
  };

  const removeListItem = (field: 'skills' | 'hobbies' | 'languageProficiency' | 'selfAssessment', index: number) => {
    onChange({ ...data, [field]: data[field].filter((_, i) => i !== index) });
  };

  const addComputerSkill = () => {
    const newSkill: ComputerSkill = {
      id: crypto.randomUUID(),
      hasTraining: true,
      instituteName: '',
      duration: '',
      skills: []
    };
    onChange({ ...data, computerSkills: [...data.computerSkills, newSkill] });
  };

  const updateComputerSkill = (id: string, field: keyof ComputerSkill, value: string | boolean | string[]) => {
    onChange({
      ...data,
      computerSkills: data.computerSkills.map(skill => skill.id === id ? { ...skill, [field]: value } : skill)
    });
  };

  const removeComputerSkill = (id: string) => {
    onChange({ ...data, computerSkills: data.computerSkills.filter(skill => skill.id !== id) });
  };

  const addCustomField = () => {
    const newField: CustomField = { id: crypto.randomUUID(), label: '', value: '' };
    onChange({
      ...data,
      customSection: { ...data.customSection, fields: [...data.customSection.fields, newField] }
    });
  };

  const updateCustomField = (id: string, field: 'label' | 'value', value: string) => {
    onChange({
      ...data,
      customSection: {
        ...data.customSection,
        fields: data.customSection.fields.map(f => f.id === id ? { ...f, [field]: value } : f)
      }
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Personal Info */}
      {data.selectedSections.includes('personalInfo') && (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-600 rounded-full" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input 
                type="text" 
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={data.personalInfo.name}
                onChange={(e) => updatePersonalInfo('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
              <div className="flex items-center gap-4">
                {data.personalInfo.photo && (
                  <img src={data.personalInfo.photo} alt="Preview" className="w-12 h-12 rounded-md object-cover border" />
                )}
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
                  <Upload size={16} />
                  Upload
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Father's Name</label>
              <input 
                type="text" 
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={data.personalInfo.fathersName}
                onChange={(e) => updatePersonalInfo('fathersName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
              <input 
                type="text" 
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={data.personalInfo.mothersName}
                onChange={(e) => updatePersonalInfo('mothersName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input 
                type="date" 
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={data.personalInfo.dob}
                onChange={(e) => updatePersonalInfo('dob', e.target.value)}
              />
            </div>
            <CustomSelect 
              label="Nationality" 
              value={data.personalInfo.nationality} 
              options={['Bangladeshi (By Birth)', 'Bangladeshi']} 
              onChange={(val) => updatePersonalInfo('nationality', val)}
            />
            <CustomSelect 
              label="Religion" 
              value={data.personalInfo.religion} 
              options={['Islam', 'Hinduism', 'Christianity', 'Buddhism']} 
              onChange={(val) => updatePersonalInfo('religion', val)}
            />
            <CustomSelect 
              label="Marital Status" 
              value={data.personalInfo.maritalStatus} 
              options={['Unmarried', 'Married', 'Divorced']} 
              onChange={(val) => updatePersonalInfo('maritalStatus', val)}
            />
            <CustomSelect 
              label="Gender" 
              value={data.personalInfo.gender} 
              options={['Male', 'Female', 'Other']} 
              onChange={(val) => updatePersonalInfo('gender', val)}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input 
                type="tel" 
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={data.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={data.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Present Address</label>
              <textarea 
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={data.personalInfo.presentAddress}
                onChange={(e) => updatePersonalInfo('presentAddress', e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Permanent Address</label>
              <textarea 
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={data.personalInfo.permanentAddress}
                onChange={(e) => updatePersonalInfo('permanentAddress', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">NID</label>
              <input 
                type="text" 
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={data.personalInfo.nid}
                onChange={(e) => updatePersonalInfo('nid', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Birth Registration No</label>
              <input 
                type="text" 
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={data.personalInfo.birthRegNo}
                onChange={(e) => updatePersonalInfo('birthRegNo', e.target.value)}
              />
            </div>
            <CustomSelect 
              label="Blood Group" 
              value={data.personalInfo.bloodGroup} 
              options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} 
              onChange={(val) => updatePersonalInfo('bloodGroup', val)}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Height</label>
              <input 
                type="text" 
                placeholder={"e.g. 5' 8\""}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={data.personalInfo.height}
                onChange={(e) => updatePersonalInfo('height', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Weight</label>
              <input 
                type="text" 
                placeholder="e.g. 70 Kg"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={data.personalInfo.weight}
                onChange={(e) => updatePersonalInfo('weight', e.target.value)}
              />
            </div>
          </div>
        </section>
      )}

      {/* Career Objective */}
      {data.selectedSections.includes('careerObjective') && (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-600 rounded-full" />
            Career Objective
          </h3>
          <textarea 
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
            value={data.careerObjective}
            onChange={(e) => onChange({ ...data, careerObjective: e.target.value })}
          />
        </section>
      )}

      {/* Education */}
      {data.selectedSections.includes('education') && (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full" />
              Academic Qualification
            </h3>
            <button 
              onClick={addEducation}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              <Plus size={16} /> Add
            </button>
          </div>
          <div className="space-y-6">
            {data.education.map((edu, idx) => (
              <div key={edu.id} className="p-4 border rounded-lg relative group">
                <button 
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomSelect 
                    label="Exam Name" 
                    value={edu.examName} 
                    options={['Secondary School Certificate (S.S.C)', 'Higher Secondary Certificate (H.S.C)', 'Dakhil', 'Alim', 'Diploma in Engineering', 'B.Sc (Honours)', 'B.A (Honours)', 'B.S.S (Honours)', 'B.B.A (Honours)', 'M.Sc', 'M.A', 'M.S.S', 'M.B.A', 'Fazil', 'Kamil']} 
                    onChange={(val) => updateEducation(edu.id, 'examName', val)}
                  />
                  <CustomSelect 
                    label="Passing Year" 
                    value={edu.passingYear} 
                    options={Array.from({ length: 2028 - 2005 + 1 }, (_, i) => (2028 - i).toString())} 
                    onChange={(val) => updateEducation(edu.id, 'passingYear', val)}
                  />
                  <CustomSelect 
                    label="Board" 
                    value={edu.board} 
                    options={['Dhaka', 'Rajshahi', 'Comilla', 'Jessore', 'Chittagong', 'Barisal', 'Sylhet', 'Dinajpur', 'Mymensingh', 'Madrasah', 'Technical', 'National University']} 
                    onChange={(val) => updateEducation(edu.id, 'board', val)}
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">GPA / Result</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 4.05 (Out of 5.00)"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={edu.gpa}
                      onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    />
                  </div>
                  <CustomSelect 
                    label="Institute Name" 
                    value={edu.instituteName} 
                    options={[
                      'Narundi School And College', 
                      'Nurundi Higher Secondary Schoool', 
                      'Narundi Foyazia Sinor Alim Madrasah', 
                      'Narundi Syeda Naziba Akhter Girls High School'
                    ]} 
                    onChange={(val) => updateEducation(edu.id, 'instituteName', val)}
                  />
                  <CustomSelect 
                    label="Subject / Group" 
                    value={edu.subject} 
                    options={[
                      'Science', 
                      'Humanities', 
                      'Business Studies', 
                      'General Electrical Works', 
                      'General Electronics', 
                      'Poultry Rearing And Farming', 
                      'Dress Making', 
                      'Building Maintenence'
                    ]} 
                    onChange={(val) => updateEducation(edu.id, 'subject', val)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Lists */}
      {(['skills', 'hobbies', 'selfAssessment'] as const).map((field) => (
        data.selectedSections.includes(field as SectionId) && (
          <section key={field} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold capitalize flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-600 rounded-full" />
                {field.replace(/([A-Z])/g, ' $1')}
              </h3>
              <button 
                onClick={() => addListItem(field)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {data[field].map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={item}
                    onChange={(e) => updateListItem(field, idx, e.target.value)}
                  />
                  <button 
                    onClick={() => removeListItem(field, idx)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-md"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )
      ))}

      {/* Computer Skills */}
      {data.selectedSections.includes('computerSkills') && (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full" />
              Computer Skills
            </h3>
            <button 
              onClick={addComputerSkill}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              <Plus size={16} /> Add
            </button>
          </div>
          <div className="space-y-6">
            {data.computerSkills.map((skill) => (
              <div key={skill.id} className="p-4 border rounded-lg relative group">
                <button 
                  onClick={() => removeComputerSkill(skill.id)}
                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
                <div className="flex items-center gap-2 mb-4">
                  <input 
                    type="checkbox" 
                    id={`hasTraining-${skill.id}`}
                    checked={skill.hasTraining}
                    onChange={(e) => updateComputerSkill(skill.id, 'hasTraining', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor={`hasTraining-${skill.id}`} className="text-sm font-medium text-gray-700">
                    Include Computer Training Details
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skill.hasTraining && (
                    <>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Training Institute Name</label>
                        <input 
                          type="text" 
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={skill.instituteName}
                          onChange={(e) => updateComputerSkill(skill.id, 'instituteName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Duration</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 6 Months"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={skill.duration}
                          onChange={(e) => updateComputerSkill(skill.id, 'duration', e.target.value)}
                        />
                      </div>
                    </>
                  )}
                  <div className="space-y-2 md:col-span-2">
                    <MultiSelect 
                      label="Skills List" 
                      selectedValues={skill.skills} 
                      options={[
                        'MS Office', 
                        'Adobe Photoshop', 
                        'Internet Browsing', 
                        'Basic Computer Applications',
                        'Computer Basic', 
                        'Hardware & Networking', 
                        'Web Development', 
                        'Graphic Design'
                      ]} 
                      onChange={(vals) => updateComputerSkill(skill.id, 'skills', vals)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Language Proficiency */}
      {data.selectedSections.includes('languageProficiency') && (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full" />
              Language Proficiency
            </h3>
            <button 
              onClick={() => addListItem('languageProficiency')}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              <Plus size={16} /> Add
            </button>
          </div>
          <div className="space-y-3">
            {data.languageProficiency.map((lang, idx) => (
              <div key={idx} className="flex gap-2">
                <div className="flex-1">
                  <CustomSelect 
                    label="" 
                    value={lang} 
                    options={[
                      'Bengali (Native)', 'Bengali (Fluent)', 'Bengali (Intermediate)', 'Bengali (Basic)',
                      'English (Native)', 'English (Fluent)', 'English (Intermediate)', 'English (Basic)',
                      'Arabic (Native)', 'Arabic (Fluent)', 'Arabic (Intermediate)', 'Arabic (Basic)',
                      'Hindi (Native)', 'Hindi (Fluent)', 'Hindi (Intermediate)', 'Hindi (Basic)'
                    ]} 
                    onChange={(val) => updateListItem('languageProficiency', idx, val)}
                  />
                </div>
                <button 
                  onClick={() => removeListItem('languageProficiency', idx)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-md self-end mb-0.5"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {data.selectedSections.includes('workExperience') && (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full" />
              Work Experience
            </h3>
            <button 
              onClick={addWork}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              <Plus size={16} /> Add
            </button>
          </div>
          <div className="space-y-6">
            {data.workExperience.map((work) => (
              <div key={work.id} className="p-4 border rounded-lg relative group">
                <button 
                  onClick={() => removeWork(work.id)}
                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input 
                      type="text" 
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={work.companyName}
                      onChange={(e) => updateWork(work.id, 'companyName', e.target.value)}
                    />
                  </div>
                  <CustomSelect 
                    label="Position" 
                    value={work.position} 
                    options={['Sales Executive', 'Marketing Manager', 'Software Engineer', 'Accountant', 'Teacher', 'Graphic Designer', 'Customer Service Representative', 'Data Entry Operator', 'Manager', 'Supervisor', 'Team Lead']} 
                    onChange={(val) => updateWork(work.id, 'position', val)}
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                    <input 
                      type="text" 
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={work.duration}
                      onChange={(e) => updateWork(work.id, 'duration', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      value={work.description}
                      onChange={(e) => updateWork(work.id, 'description', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom Section */}
      {data.selectedSections.includes('custom') && (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1 mr-4">
              <input 
                type="text" 
                className="text-lg font-bold w-full border-b border-gray-200 focus:border-blue-500 outline-none"
                value={data.customSection.title}
                onChange={(e) => onChange({ ...data, customSection: { ...data.customSection, title: e.target.value } })}
              />
            </div>
            <button 
              onClick={addCustomField}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              <Plus size={16} /> Add Field
            </button>
          </div>
          <div className="space-y-4">
            {data.customSection.fields.map((field) => (
              <div key={field.id} className="flex gap-4 items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-gray-500">Label</label>
                  <input 
                    type="text" 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={field.label}
                    onChange={(e) => updateCustomField(field.id, 'label', e.target.value)}
                  />
                </div>
                <div className="flex-[2] space-y-1">
                  <label className="text-xs text-gray-500">Value</label>
                  <input 
                    type="text" 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={field.value}
                    onChange={(e) => updateCustomField(field.id, 'value', e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => onChange({
                    ...data,
                    customSection: { ...data.customSection, fields: data.customSection.fields.filter(f => f.id !== field.id) }
                  })}
                  className="text-red-500 p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Declaration */}
      {data.selectedSections.includes('declaration') && (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-600 rounded-full" />
            Certification / Declaration
          </h3>
          <textarea 
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={data.declaration}
            onChange={(e) => onChange({ ...data, declaration: e.target.value })}
          />
        </section>
      )}
    </div>
  );
};

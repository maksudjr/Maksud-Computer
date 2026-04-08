import React, { useState } from 'react';
import { CVData, SectionId, Education, WorkExperience, CustomField, ComputerSkill } from '../types';
import { Plus, Trash2, Upload, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { PhotoEditor } from './PhotoEditor';

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
  onChange,
  placeholder = "Type and press Enter...",
  selectedLabel = "Selected Items:"
}: { 
  label: string; 
  selectedValues: string[]; 
  options: string[]; 
  onChange: (vals: string[]) => void;
  placeholder?: string;
  selectedLabel?: string;
}) => {
  const [customValue, setCustomValue] = useState('');

  const toggleOption = (opt: string) => {
    if (selectedValues.includes(opt)) {
      onChange(selectedValues.filter(v => v !== opt));
    } else {
      onChange([...selectedValues, opt]);
    }
  };

  const addCustomItem = () => {
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
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Add {label}</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={placeholder}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomItem();
              }
            }}
          />
          <button
            type="button"
            onClick={addCustomItem}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
      </div>

      {selectedValues.length > 0 && (
        <div className="mt-2 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-medium text-indigo-700">{selectedLabel}</p>
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
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-indigo-200 text-indigo-700 rounded text-xs"
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

const DISTRICT_UPAZILA_MAP: Record<string, string[]> = {
  'Jamalpur': ['Jamalpur Sadar', 'Bakshiganj', 'Dewanganj', 'Islampur', 'Madarganj', 'Melandaha', 'Sarishabari'],
  'Sherpur': ['Sherpur Sadar', 'Jhenaigati', 'Nakla', 'Nalitabari', 'Sreebardi'],
  'Mymensingh': ['Mymensingh Sadar', 'Bhaluka', 'Dhobaura', 'Fulbaria', 'Gaffargaon', 'Gauripur', 'Haluaghat', 'Ishwarganj', 'Muktagacha', 'Nandail', 'Phulpur', 'Trishal'],
  'Tangail': ['Tangail Sadar', 'Basail', 'Bhuapur', 'Delduar', 'Ghatail', 'Gopalpur', 'Kalihati', 'Madhupur', 'Mirzapur', 'Nagarpur', 'Sakhipur'],
  'Dhaka': ['Dhaka Sadar', 'Dhamrai', 'Dohar', 'Keraniganj', 'Nawabganj', 'Savar'],
  'Gazipur': ['Gazipur Sadar', 'Kaliakair', 'Kaliganj', 'Kapasia', 'Sreepur'],
  'Narayanganj': ['Narayanganj Sadar', 'Araihazar', 'Bandar', 'Rupganj', 'Sonargaon'],
};

export const CVForm: React.FC<CVFormProps> = ({ data, onChange }) => {
  const [editingPhoto, setEditingPhoto] = useState<string | null>(null);
  const [editingSignature, setEditingSignature] = useState<string | null>(null);

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
        const result = reader.result as string;
        updatePersonalInfo('photo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        updatePersonalInfo('signature', result);
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
      gpaType: 'Out Of 5.00',
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
            <span className="w-2 h-6 bg-indigo-600 rounded-full" />
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
                  <div className="relative group">
                    <img 
                      src={data.personalInfo.photo} 
                      alt="Preview" 
                      className="w-12 h-16 rounded-md object-cover border" 
                      style={{ aspectRatio: '1.5/2' }}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition-colors">
                      <Upload size={16} />
                      Upload
                      <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </label>
                    {data.personalInfo.photo && (
                      <button 
                        type="button"
                        onClick={() => setEditingPhoto(data.personalInfo.photo)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-md text-sm hover:bg-indigo-100 transition-colors"
                      >
                        <Edit2 size={16} />
                        Edit Photo
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 italic">Recommended size: 1.5 x 2 inches</p>
                </div>
              </div>
            </div>

            {editingPhoto && (
              <PhotoEditor 
                image={editingPhoto}
                onSave={(edited) => {
                  updatePersonalInfo('photo', edited);
                  setEditingPhoto(null);
                }}
                onCancel={() => setEditingPhoto(null)}
                aspect={1.5 / 2}
              />
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Signature</label>
              <div className="flex items-center gap-4">
                {data.personalInfo.signature && (
                  <div className="relative group">
                    <img 
                      src={data.personalInfo.signature} 
                      alt="Signature" 
                      className="w-24 h-8 rounded-md object-contain border bg-gray-50" 
                      style={{ aspectRatio: '300/80' }}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition-colors">
                      <Upload size={16} />
                      Upload
                      <input type="file" className="hidden" accept="image/*" onChange={handleSignatureUpload} />
                    </label>
                    {data.personalInfo.signature && (
                      <button 
                        type="button"
                        onClick={() => setEditingSignature(data.personalInfo.signature)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-md text-sm hover:bg-indigo-100 transition-colors"
                      >
                        <Edit2 size={16} />
                        Edit Signature
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 italic">Recommended size: 300 x 80 pixels</p>
                </div>
              </div>
            </div>

            {editingSignature && (
              <PhotoEditor 
                image={editingSignature}
                onSave={(edited) => {
                  updatePersonalInfo('signature', edited);
                  setEditingSignature(null);
                }}
                onCancel={() => setEditingSignature(null)}
                aspect={300 / 80}
              />
            )}
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            {/* Present Address */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-sm font-bold text-gray-700 border-b pb-1">Present Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Village</label>
                  <input 
                    type="text" 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={data.personalInfo.presentVillage}
                    onChange={(e) => updatePersonalInfo('presentVillage', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Post Office</label>
                  <input 
                    type="text" 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={data.personalInfo.presentPostOffice}
                    onChange={(e) => updatePersonalInfo('presentPostOffice', e.target.value)}
                  />
                </div>
                <CustomSelect 
                  label="District" 
                  value={data.personalInfo.presentDistrict} 
                  options={Object.keys(DISTRICT_UPAZILA_MAP)} 
                  onChange={(val) => updatePersonalInfo('presentDistrict', val)}
                />
                <CustomSelect 
                  label="Upazila" 
                  value={data.personalInfo.presentUpazila} 
                  options={DISTRICT_UPAZILA_MAP[data.personalInfo.presentDistrict] || []} 
                  onChange={(val) => updatePersonalInfo('presentUpazila', val)}
                />
              </div>
            </div>

            {/* Permanent Address */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex justify-between items-center border-b pb-1">
                <h4 className="text-sm font-bold text-gray-700">Permanent Address</h4>
                <label className="flex items-center gap-2 text-xs font-medium text-indigo-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChange({
                          ...data,
                          personalInfo: {
                            ...data.personalInfo,
                            permanentVillage: data.personalInfo.presentVillage,
                            permanentPostOffice: data.personalInfo.presentPostOffice,
                            permanentUpazila: data.personalInfo.presentUpazila,
                            permanentDistrict: data.personalInfo.presentDistrict,
                          }
                        });
                      }
                    }}
                  />
                  Same as Present
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Village</label>
                  <input 
                    type="text" 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={data.personalInfo.permanentVillage}
                    onChange={(e) => updatePersonalInfo('permanentVillage', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Post Office</label>
                  <input 
                    type="text" 
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={data.personalInfo.permanentPostOffice}
                    onChange={(e) => updatePersonalInfo('permanentPostOffice', e.target.value)}
                  />
                </div>
                <CustomSelect 
                  label="District" 
                  value={data.personalInfo.permanentDistrict} 
                  options={Object.keys(DISTRICT_UPAZILA_MAP)} 
                  onChange={(val) => updatePersonalInfo('permanentDistrict', val)}
                />
                <CustomSelect 
                  label="Upazila" 
                  value={data.personalInfo.permanentUpazila} 
                  options={DISTRICT_UPAZILA_MAP[data.personalInfo.permanentDistrict] || []} 
                  onChange={(val) => updatePersonalInfo('permanentUpazila', val)}
                />
              </div>
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
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-1">
                  <input 
                    type="number" 
                    placeholder="Feet"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={data.personalInfo.heightFeet}
                    onChange={(e) => updatePersonalInfo('heightFeet', e.target.value)}
                  />
                  <span className="text-xs text-gray-500">ft</span>
                </div>
                <div className="flex-1 flex items-center gap-1">
                  <input 
                    type="number" 
                    placeholder="Inches"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={data.personalInfo.heightInches}
                    onChange={(e) => updatePersonalInfo('heightInches', e.target.value)}
                  />
                  <span className="text-xs text-gray-500">in</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Weight (Kg)</label>
              <div className="flex items-center gap-1">
                <input 
                  type="number" 
                  placeholder="e.g. 70"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={data.personalInfo.weight}
                  onChange={(e) => updatePersonalInfo('weight', e.target.value)}
                />
                <span className="text-xs text-gray-500">kg</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Career Objective */}
      {data.selectedSections.includes('careerObjective') && (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-600 rounded-full" />
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
              <span className="w-2 h-6 bg-indigo-600 rounded-full" />
            Academic Qualification
          </h3>
          <button 
            onClick={addEducation}
            className="flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
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
                    options={['Secondary School Certificate (S.S.C)', 'Secondary School Certificate (S.S.C Vocational)', 'Higher Secondary Certificate (H.S.C)', 'Higher Secondary Certificate (H.S.C BM)', 'Dakhil', 'Alim', 'Diploma in Engineering', 'B.Sc (Honours)', 'B.A (Honours)', 'B.S.S (Honours)', 'B.B.A (Honours)', 'M.Sc', 'M.A', 'M.S.S', 'M.B.A', 'Fazil', 'Kamil']} 
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
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">GPA / Result</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 4.05"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                      />
                    </div>
                    <CustomSelect 
                      label="Scale" 
                      value={edu.gpaType} 
                      options={['Out Of 5.00', 'Out Of 4.00']} 
                      onChange={(val) => updateEducation(edu.id, 'gpaType', val)}
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

      {/* Skills & Self Assessment */}
      {(['skills', 'selfAssessment'] as const).map((field) => (
        data.selectedSections.includes(field as SectionId) && (
          <section key={field} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold capitalize flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-600 rounded-full" />
              {field.replace(/([A-Z])/g, ' $1')}
            </h3>
              <button 
                onClick={() => addListItem(field)}
                className="flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
              >
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {data[field].map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

      {/* Hobbies Section */}
      {data.selectedSections.includes('hobbies') && (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-600 rounded-full" />
            Hobby and Interest
          </h3>
          <MultiSelect 
            label="Hobbies" 
            selectedValues={data.hobbies} 
            options={[
              'Gardening', 
              'Reading books', 
              'Writing', 
              'Gaming', 
              'Traveling', 
              'Photography', 
              'Cooking', 
              'Music', 
              'Sports', 
              'Painting',
              'Internet Browsing',
              'Watching Movies'
            ]} 
            onChange={(vals) => onChange({ ...data, hobbies: vals })}
            placeholder="Type hobby and press Enter..."
            selectedLabel="Selected Hobbies:"
          />
        </section>
      )}

      {/* Computer Skills */}
      {data.selectedSections.includes('computerSkills') && (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-600 rounded-full" />
              Computer Skills
            </h3>
            <button 
              onClick={addComputerSkill}
              className="flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
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
                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
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
              <span className="w-2 h-6 bg-indigo-600 rounded-full" />
              Language Proficiency
            </h3>
            <button 
              onClick={() => addListItem('languageProficiency')}
              className="flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
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
              <span className="w-2 h-6 bg-indigo-600 rounded-full" />
              Work Experience
            </h3>
            <button 
              onClick={addWork}
              className="flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
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
                className="text-lg font-bold w-full border-b border-gray-200 focus:border-indigo-500 outline-none"
                value={data.customSection.title}
                onChange={(e) => onChange({ ...data, customSection: { ...data.customSection, title: e.target.value } })}
              />
            </div>
            <button 
              onClick={addCustomField}
              className="flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
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
            <span className="w-2 h-6 bg-indigo-600 rounded-full" />
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

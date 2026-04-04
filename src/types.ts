export type SectionId = 
  | 'careerObjective' 
  | 'personalInfo' 
  | 'education' 
  | 'skills' 
  | 'workExperience' 
  | 'hobbies' 
  | 'declaration' 
  | 'references' 
  | 'custom'
  | 'computerSkills'
  | 'languageProficiency'
  | 'selfAssessment';

export interface Education {
  id: string;
  examName: string;
  passingYear: string;
  board: string;
  gpa: string;
  instituteName: string;
  subject: string;
}

export interface WorkExperience {
  id: string;
  companyName: string;
  position: string;
  duration: string;
  description: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface ComputerSkill {
  id: string;
  hasTraining: boolean;
  instituteName: string;
  duration: string;
  skills: string[];
}

export interface CVData {
  theme: {
    primaryColor: string;
    fontStyle: string;
    darkMode: boolean;
    pageCount: number;
  };
  selectedSections: SectionId[];
  personalInfo: {
    name: string;
    fathersName: string;
    mothersName: string;
    dob: string;
    nationality: string;
    religion: string;
    maritalStatus: string;
    gender: string;
    phone: string;
    email: string;
    presentAddress: string;
    permanentAddress: string;
    photo: string;
    nid: string;
    birthRegNo: string;
    bloodGroup: string;
    height: string;
    weight: string;
  };
  careerObjective: string;
  education: Education[];
  skills: string[];
  computerSkills: ComputerSkill[];
  workExperience: WorkExperience[];
  hobbies: string[];
  languageProficiency: string[];
  selfAssessment: string[];
  declaration: string;
  references: string;
  customSection: {
    title: string;
    fields: CustomField[];
  };
}

export const DEFAULT_CV_DATA: CVData = {
  theme: {
    primaryColor: '#2563eb', // Default blue
    fontStyle: 'font-sans',
    darkMode: false,
    pageCount: 1,
  },
  selectedSections: [
    'careerObjective',
    'personalInfo',
    'education',
    'computerSkills',
    'workExperience',
    'languageProficiency',
    'selfAssessment',
    'hobbies',
    'declaration'
  ],
  personalInfo: {
    name: '',
    fathersName: '',
    mothersName: '',
    dob: '',
    nationality: 'Bangladeshi (By Birth)',
    religion: 'Islam',
    maritalStatus: 'Unmarried',
    gender: 'Male',
    phone: '',
    email: '',
    presentAddress: '',
    permanentAddress: '',
    photo: '',
    nid: '',
    birthRegNo: '',
    bloodGroup: '',
    height: '',
    weight: '',
  },
  careerObjective: 'To build up myself as a challenging and responsible person to utilize my educational and other experiences, to show my creativity and integrity, at the same time to full the desire to work in a competitive, dynamic and disciplined job environment to enrich professional skills, competency and level of expertise knowledge.',
  education: [],
  skills: [],
  computerSkills: [
    { id: '1', hasTraining: true, instituteName: 'Maksud Computer Institute', duration: '6 Months', skills: ['MS Office', 'Photoshop', 'Internet Browsing', 'Basic Computer Applications'] }
  ],
  workExperience: [],
  hobbies: [],
  languageProficiency: [],
  selfAssessment: [],
  declaration: 'I the undersigned, hereby declare that I will the responsible for any wrong Information Provided here and any misstatement described herein may lead to my Disqualification for dismissal, if employed.',
  references: '',
  customSection: {
    title: 'Custom Section',
    fields: [],
  },
};

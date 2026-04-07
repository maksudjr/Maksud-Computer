import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  BorderStyle, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType,
  VerticalAlign,
  ImageRun
} from 'docx';
import { saveAs } from 'file-saver';
import { CVData } from '../types';

export const generateDocx = async (data: CVData) => {
  const { personalInfo, careerObjective, education, computerSkills, workExperience, languageProficiency, selfAssessment, hobbies, declaration, customSection, selectedSections, theme } = data;

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

  const sections = [];

  // Helper for Section Header
  const createSectionHeader = (title: string) => {
    return [
      new Paragraph({
        border: {
          bottom: {
            color: theme.primaryColor.replace('#', ''),
            size: 12,
            style: BorderStyle.SINGLE,
          },
        },
        children: [
          new TextRun({
            text: `${title.toUpperCase()}:`,
            color: theme.primaryColor.replace('#', ''),
            bold: true,
            size: 26, // 13pt
          }),
        ],
        spacing: { before: 400, after: 200 },
      }),
    ];
  };

  // Header
  const headerParagraphs = [
    new Paragraph({
      children: [
        new TextRun({
          text: "CURRICULUM VITAE",
          color: theme.primaryColor.replace('#', ''),
          bold: true,
          size: 36, // 18pt
        }),
      ],
      alignment: AlignmentType.LEFT,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `OF ${personalInfo.name.toUpperCase() || 'YOUR NAME'}`,
          color: theme.primaryColor.replace('#', ''),
          bold: true,
          size: 36, // 18pt
        }),
      ],
      alignment: AlignmentType.LEFT,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Present Address:",
          bold: true,
          size: 22, // 11pt
        }),
      ],
      spacing: { before: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: presentAddressLine,
          size: 22,
        }),
      ],
    }),
  ];

  if (personalInfo.phone) {
    headerParagraphs.push(new Paragraph({
      children: [new TextRun({ text: `Cell: ${personalInfo.phone}`, size: 22 })],
    }));
  }

  if (personalInfo.email) {
    headerParagraphs.push(new Paragraph({
      children: [
        new TextRun({ text: "E-mail: ", size: 22 }),
        new TextRun({ text: personalInfo.email, size: 22, italics: true }),
      ],
    }));
  }

  // Career Objective
  if (selectedSections.includes('careerObjective') && careerObjective) {
    sections.push(...createSectionHeader("Career Objective"));
    sections.push(new Paragraph({
      children: [new TextRun({ text: careerObjective, size: 21 })],
      alignment: AlignmentType.JUSTIFIED,
    }));
  }

  // Academic Qualification
  if (selectedSections.includes('education') && education.length > 0) {
    sections.push(...createSectionHeader("Academic Qualification"));
    education.forEach(edu => {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: "❖ ", color: theme.primaryColor.replace('#', ''), size: 18 }),
          new TextRun({ text: edu.examName, bold: true, size: 21 }),
        ],
        spacing: { before: 200 },
      }));
      
      const addInfoRow = (label: string, value: string) => {
        if (!value) return;
        sections.push(new Paragraph({
          indent: { left: 720 },
          children: [
            new TextRun({ text: label, bold: true, size: 21 }),
            new TextRun({ text: ` : ${value}`, size: 21 }),
          ],
        }));
      };

      addInfoRow("Board", edu.board);
      addInfoRow("Subject", edu.subject);
      addInfoRow("Institute", edu.instituteName);
      addInfoRow("Result", edu.gpa ? `${edu.gpa} (${edu.gpaType})` : '');
      addInfoRow("Passing Year", edu.passingYear);
    });
  }

  // Computer Skills
  if (selectedSections.includes('computerSkills') && computerSkills.length > 0) {
    sections.push(...createSectionHeader("Computer Skills"));
    computerSkills.forEach(skill => {
      if (skill.hasTraining) {
        sections.push(new Paragraph({
          children: [
            new TextRun({ text: "❖ ", color: theme.primaryColor.replace('#', ''), size: 18 }),
            new TextRun({ text: `Completed a ${skill.duration} computer training program from ${skill.instituteName}.`, size: 21 }),
          ],
        }));
      }
      if (skill.skills.length > 0) {
        sections.push(new Paragraph({
          children: [
            new TextRun({ text: "❖ ", color: theme.primaryColor.replace('#', ''), size: 18 }),
            new TextRun({ text: `Proficient in ${skill.skills.join(', ')}, etc,`, size: 21 }),
          ],
        }));
      }
    });
  }

  // Job Experience
  if (selectedSections.includes('workExperience') && workExperience.length > 0) {
    sections.push(...createSectionHeader("Job Experience"));
    workExperience.forEach(work => {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: "❖ ", color: theme.primaryColor.replace('#', ''), size: 18 }),
          new TextRun({ text: "Worked as a ", size: 21 }),
          new TextRun({ text: work.position, bold: true, size: 21 }),
          new TextRun({ text: " at ", size: 21 }),
          new TextRun({ text: work.companyName, bold: true, size: 21 }),
          new TextRun({ text: ` for ${work.duration}`, size: 21 }),
        ],
      }));
      if (work.description) {
        sections.push(new Paragraph({
          indent: { left: 720 },
          children: [new TextRun({ text: work.description, italics: true, size: 20 })],
        }));
      }
    });
  }

  // Language Proficiency
  if (selectedSections.includes('languageProficiency') && languageProficiency.length > 0) {
    sections.push(...createSectionHeader("Language Proficiency"));
    languageProficiency.forEach(lang => {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: "❖ ", color: theme.primaryColor.replace('#', ''), size: 18 }),
          new TextRun({ text: lang, size: 21 }),
        ],
      }));
    });
  }

  // Self Assessment
  if (selectedSections.includes('selfAssessment') && selfAssessment.length > 0) {
    sections.push(...createSectionHeader("Self-Assessment"));
    selfAssessment.forEach(item => {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: "❖ ", color: theme.primaryColor.replace('#', ''), size: 18 }),
          new TextRun({ text: item, size: 21 }),
        ],
      }));
    });
  }

  // Hobbies
  if (selectedSections.includes('hobbies') && hobbies.length > 0) {
    sections.push(...createSectionHeader("Hobby and Interest"));
    hobbies.forEach(hobby => {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: "❖ ", color: theme.primaryColor.replace('#', ''), size: 18 }),
          new TextRun({ text: hobby, size: 21 }),
        ],
      }));
    });
  }

  // Personal Information
  if (selectedSections.includes('personalInfo')) {
    sections.push(...createSectionHeader("Personal Information"));
    
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return dateStr;
    };

    const personalFields = [
      { label: "Name", value: personalInfo.name },
      { label: "Father’s Name", value: personalInfo.fathersName },
      { label: "Mother’s Name", value: personalInfo.mothersName },
      { label: "Date of Birth", value: formatDate(personalInfo.dob) },
      { label: "Nationality", value: personalInfo.nationality },
      { label: "Religion", value: personalInfo.religion },
      { label: "Marital Status", value: personalInfo.maritalStatus },
      { label: "Sex", value: personalInfo.gender },
      { label: "NID", value: personalInfo.nid },
      { label: "Birth Registration No", value: personalInfo.birthRegNo },
      { label: "Blood Group", value: personalInfo.bloodGroup },
      { label: "Height", value: personalInfo.heightFeet || personalInfo.heightInches ? `${personalInfo.heightFeet || '0'}' ${personalInfo.heightInches || '0'}"` : '' },
      { label: "Weight", value: personalInfo.weight ? `${personalInfo.weight} Kg` : '' },
      { label: "Permanent Address", value: permanentAddressLine },
      { label: "Present Address", value: presentAddressLine },
    ].filter(f => f.value);

    const tableRows = personalFields.map(field => new TableRow({
      children: [
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          children: [new Paragraph({ children: [new TextRun({ text: field.label, bold: true, size: 21 })] })],
        }),
        new TableCell({
          width: { size: 5, type: WidthType.PERCENTAGE },
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          children: [new Paragraph({ children: [new TextRun({ text: ":", size: 21 })] })],
        }),
        new TableCell({
          width: { size: 65, type: WidthType.PERCENTAGE },
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          children: [new Paragraph({ children: [new TextRun({ text: field.value, size: 21 })] })],
        }),
      ],
    }));

    sections.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
      rows: tableRows,
    }));
  }

  // Declaration
  if (selectedSections.includes('declaration') && declaration) {
    sections.push(...createSectionHeader("Certification"));
    sections.push(new Paragraph({
      children: [new TextRun({ text: declaration, size: 21 })],
      alignment: AlignmentType.JUSTIFIED,
    }));
    sections.push(new Paragraph({
      children: [new TextRun({ text: "Signature", bold: true, size: 21 })],
      spacing: { before: 800 },
    }));
    sections.push(new Paragraph({
      children: [new TextRun({ text: `(${personalInfo.name || 'Your Name'})`, size: 21 })],
    }));
  }

  // Watermark
  sections.push(new Paragraph({
    children: [
      new TextRun({ 
        text: "This Cv Was Build from Maksud Computer", 
        size: 16, 
        italics: true, 
        color: "999999" 
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 1000 },
  }));

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          ...headerParagraphs,
          ...sections,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${personalInfo.name || 'CV'}_Curriculum_Vitae.docx`);
};

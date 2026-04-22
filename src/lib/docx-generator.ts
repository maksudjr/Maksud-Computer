import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType, 
  BorderStyle, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType,
} from 'docx';
import { saveAs } from 'file-saver';
import { CVData } from '../types';

export const generateDocx = async (data: CVData) => {
  const { personalInfo, careerObjective, education, computerSkills, workExperience, languageProficiency, selfAssessment, hobbies, declaration, customSection, selectedSections, theme } = data;

  const spacingTwips = Math.round(theme.lineSpacing * 240); // 1.5 -> 360 twips

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

  const createSectionHeader = (title: string) => {
    return [
      new Paragraph({
        border: theme.showBorder ? {
          bottom: {
            color: theme.primaryColor.replace('#', ''),
            size: 12,
            style: BorderStyle.SINGLE,
          },
        } : undefined,
        children: [
          new TextRun({
            text: `${title.toUpperCase()}:`,
            color: theme.primaryColor.replace('#', ''),
            bold: true,
            size: (theme.fontSize + 2) * 2,
          }),
        ],
        spacing: { before: 300, after: 150 },
      }),
    ];
  };

  const createBulletParagraph = (text: string, bold = false) => {
    return new Paragraph({
      children: [
        new TextRun({ text: "❖ ", color: theme.primaryColor.replace('#', ''), size: (theme.fontSize - 3) * 2 }),
        new TextRun({ text: text, bold, size: theme.fontSize * 2 }),
      ],
      spacing: { line: spacingTwips, before: 100 },
    });
  };

  const createInfoRow = (label: string, value: string) => {
    if (!value) return null;
    return new Paragraph({
      indent: { left: 400 },
      children: [
        new TextRun({ text: label, bold: true, size: theme.fontSize * 2 }),
        new TextRun({ text: ` : ${value}`, size: theme.fontSize * 2 }),
      ],
      spacing: { line: spacingTwips },
    });
  };

  const isSidebarTemplate = theme.templateId === 'modern' || theme.templateId === 'smart-modern';

  const mainContent = [];

  // Career Objective
  if (selectedSections.includes('careerObjective') && careerObjective) {
    mainContent.push(...createSectionHeader("Career Objective"));
    mainContent.push(new Paragraph({
      children: [new TextRun({ text: careerObjective, size: theme.fontSize * 2 })],
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: spacingTwips },
    }));
  }

  // Education
  if (selectedSections.includes('education') && education.length > 0) {
    mainContent.push(...createSectionHeader("Academic Qualification"));
    education.forEach(edu => {
      mainContent.push(createBulletParagraph(edu.examName, true));
      [
        createInfoRow("Board", edu.board),
        createInfoRow("Subject", edu.subject),
        createInfoRow("Institute", edu.instituteName),
        createInfoRow("Result", edu.gpa ? `${edu.gpa} (${edu.gpaType})` : ''),
        createInfoRow("Passing Year", edu.passingYear),
      ].forEach(p => p && mainContent.push(p));
    });
  }

  // Computer Skills
  if (selectedSections.includes('computerSkills') && computerSkills.length > 0) {
    mainContent.push(...createSectionHeader("Computer Skills"));
    computerSkills.forEach(skill => {
      if (skill.hasTraining) {
        mainContent.push(createBulletParagraph(`Completed a ${skill.duration} computer training program from ${skill.instituteName}.`));
      }
      if (skill.skills.length > 0) {
        mainContent.push(createBulletParagraph(`Proficient in ${skill.skills.join(', ')}, etc.`));
      }
    });
  }

  // Experience
  if (selectedSections.includes('workExperience') && workExperience.length > 0) {
    mainContent.push(...createSectionHeader("Experience"));
    workExperience.forEach(work => {
      mainContent.push(createBulletParagraph(`${work.position} at ${work.companyName} (${work.duration})`, true));
      if (work.description) {
        mainContent.push(new Paragraph({
          indent: { left: 400 },
          children: [new TextRun({ text: work.description, italics: true, size: (theme.fontSize - 1) * 2 })],
          spacing: { line: spacingTwips },
        }));
      }
    });
  }

  // Languages
  if (selectedSections.includes('languageProficiency') && languageProficiency.length > 0) {
    mainContent.push(...createSectionHeader("Languages"));
    languageProficiency.forEach(lang => mainContent.push(createBulletParagraph(lang)));
  }

  // Hobbies
  if (selectedSections.includes('hobbies') && hobbies.length > 0) {
    mainContent.push(...createSectionHeader("Hobbies"));
    hobbies.forEach(hobby => mainContent.push(createBulletParagraph(hobby)));
  }

  // Personal Info Details
  const personalFields = [
    { label: "Name", value: personalInfo.name },
    { label: "Father’s Name", value: personalInfo.fathersName },
    { label: "Mother’s Name", value: personalInfo.mothersName },
    { label: "Date of Birth", value: personalInfo.dob },
    { label: "Phone", value: personalInfo.phone },
    { label: "Email", value: personalInfo.email },
    { label: "Religion", value: personalInfo.religion },
    { label: "Gender", value: personalInfo.gender },
    { label: "NID/Birth Reg", value: personalInfo.nid || personalInfo.birthRegNo },
    { label: "Permanent Address", value: permanentAddressLine },
  ].filter(f => f.value);

  const personalTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { 
      top: { style: BorderStyle.NONE }, 
      bottom: { style: BorderStyle.NONE }, 
      left: { style: BorderStyle.NONE }, 
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE }
    },
    rows: personalFields.map(field => new TableRow({
      children: [
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: field.label, bold: true, size: (theme.fontSize - 1) * 2 })], spacing: { line: spacingTwips } })],
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: `: ${field.value}`, size: (theme.fontSize - 1) * 2 })], spacing: { line: spacingTwips } })],
        }),
      ],
    })),
  });

  if (!isSidebarTemplate) {
    mainContent.push(...createSectionHeader("Personal Details"));
    mainContent.push(personalTable);
  }

  // Declaration
  if (selectedSections.includes('declaration') && declaration) {
    mainContent.push(...createSectionHeader("Declaration"));
    mainContent.push(new Paragraph({
      children: [new TextRun({ text: declaration, size: theme.fontSize * 2 })],
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: spacingTwips },
    }));
    mainContent.push(new Paragraph({
      children: [new TextRun({ text: "Signature", bold: true, underline: {}, size: theme.fontSize * 2 })],
      spacing: { before: 800 },
    }));
    mainContent.push(new Paragraph({
      children: [new TextRun({ text: `(${personalInfo.name || 'Your Name'})`, size: (theme.fontSize - 1) * 2 })],
    }));
  }

  // FINAL DOCUMENT STRUCTURE
  let docSections = [];

  if (isSidebarTemplate) {
    // Two column layout
    const leftColumn = [];
    const sidebarBg = theme.headerStyle === 'black' ? '000000' : theme.primaryColor.replace('#', '');
    const sidebarTextColor = (theme.headerStyle === 'black' || theme.headerStyle === 'primary') ? (theme.primaryColor === '#ffd700' && theme.headerStyle === 'primary' ? '000000' : 'FFFFFF') : 'FFFFFF';

    leftColumn.push(new Paragraph({
      children: [new TextRun({ text: "CONTACT", bold: true, color: sidebarTextColor, size: 24 })],
      spacing: { before: 200, after: 100 },
    }));
    leftColumn.push(new Paragraph({ children: [new TextRun({ text: personalInfo.phone, color: sidebarTextColor, size: 18 })] }));
    leftColumn.push(new Paragraph({ children: [new TextRun({ text: personalInfo.email, color: sidebarTextColor, size: 18 })] }));
    leftColumn.push(new Paragraph({ children: [new TextRun({ text: presentAddressLine, color: sidebarTextColor, size: 18 })] }));

    leftColumn.push(new Paragraph({
      children: [new TextRun({ text: "PERSONAL", bold: true, color: sidebarTextColor, size: 24 })],
      spacing: { before: 400, after: 100 },
    }));
    personalFields.forEach(f => {
      leftColumn.push(new Paragraph({ children: [new TextRun({ text: `${f.label}:`, bold: true, color: sidebarTextColor, size: 16 })] }));
      leftColumn.push(new Paragraph({ children: [new TextRun({ text: f.value, color: sidebarTextColor, size: 16 })] }));
    });

    const sidebarContentTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: BorderStyle.NONE as any,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: sidebarBg },
              children: leftColumn,
              margins: { left: 200, right: 200, top: 200, bottom: 200 },
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: personalInfo.name.toUpperCase() || "YOUR NAME", bold: true, color: theme.primaryColor.replace('#', ''), size: 40 })],
                  spacing: { after: 400 },
                }),
                ...mainContent,
              ],
              margins: { left: 400, right: 200, top: 200 },
            }),
          ],
        }),
      ],
    });
    docSections = [sidebarContentTable];
  } else {
    // Classic Header
    const headerBg = theme.headerStyle === 'black' ? '000000' : (theme.headerStyle === 'primary' ? theme.primaryColor.replace('#', '') : null);
    const headerTextColor = headerBg ? (theme.primaryColor === '#ffd700' && theme.headerStyle === 'primary' ? '000000' : 'FFFFFF') : theme.primaryColor.replace('#', '');

    const isElegant = theme.templateId === 'classic-elegant';
    const isSmartClassic = theme.templateId === 'smart-classic';

    const classicHeaderContent = [
      new Paragraph({
        children: [new TextRun({ text: "CURRICULUM VITAE", color: headerTextColor, bold: true, size: 36 })],
        alignment: isElegant ? AlignmentType.CENTER : AlignmentType.LEFT,
        border: isElegant ? { bottom: { color: theme.primaryColor.replace('#', ''), size: 24, style: BorderStyle.DOUBLE } } : undefined
      }),
      new Paragraph({
        children: [new TextRun({ text: `OF ${personalInfo.name.toUpperCase() || 'YOUR NAME'}`, color: headerTextColor, bold: true, size: 36 })],
        alignment: isElegant ? AlignmentType.CENTER : AlignmentType.LEFT,
      }),
      new Paragraph({
        children: [new TextRun({ text: presentAddressLine, size: 22, color: headerBg ? 'FFFFFF' : '000000' })],
        alignment: isElegant ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { before: 200 },
      }),
    ];

    if (isSmartClassic) {
      docSections.push(new Paragraph({
        shading: { fill: theme.primaryColor.replace('#', '') },
        children: [new TextRun({ text: " ", size: 10 })]
      }));
    }

    if (headerBg) {
      docSections.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: BorderStyle.NONE as any,
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: headerBg },
                  margins: { left: 200, right: 200, top: 200, bottom: 200 },
                  children: classicHeaderContent,
                })
              ]
            })
          ]
        })
      );
    } else {
      docSections.push(...classicHeaderContent);
    }
    docSections.push(...mainContent);
  }

  // Watermark
  docSections.push(new Paragraph({
    children: [new TextRun({ text: "Generated by Maksud Computer CV Builder", size: 14, italics: true, color: "999999" })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 1000 },
  }));

  const doc = new Document({
    sections: [{ children: docSections }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${personalInfo.name || 'CV'}_Curriculum_Vitae.docx`);
};

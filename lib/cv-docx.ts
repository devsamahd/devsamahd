import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import type { Cv, CvEntry } from "./cv";
export async function cvDocx(cv: Cv): Promise<Buffer> {
  const paragraph = (text: string, bold = false) =>
    new Paragraph({
      children: [new TextRun({ text, bold })],
      spacing: { after: 90 },
      widowControl: true,
    });
  const heading = (text: string) =>
    new Paragraph({
      text,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 220, after: 110 },
      keepNext: true,
    });
  const children: Paragraph[] = [
    new Paragraph({
      text: cv.name,
      heading: HeadingLevel.TITLE,
      spacing: { after: 100 },
      keepNext: true,
    }),
    new Paragraph({
      children: [new TextRun({ text: cv.title, bold: true, size: 24 })],
      keepNext: true,
      spacing: { after: 110 },
    }),
    paragraph([cv.location, cv.email, cv.phone].filter(Boolean).join(" | ")),
    ...cv.links.map((link) => paragraph(link)),
  ];
  if (cv.summary.trim())
    children.push(heading("Professional Summary"), paragraph(cv.summary));
  if (cv.skills.length)
    children.push(heading("Technical Skills"), paragraph(cv.skills.join(", ")));
  const section = (title: string, entries: CvEntry[]) => {
    if (!entries.length) return;
    children.push(heading(title));
    for (const entry of entries) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: entry.title, bold: true })],
          spacing: { before: 110, after: 60 },
          keepNext: true,
        }),
      );
      if (entry.organization)
        children.push(
          new Paragraph({
            text: entry.organization,
            keepNext: true,
            spacing: { after: 60 },
          }),
        );
      if (entry.dates)
        children.push(
          new Paragraph({
            text: entry.dates,
            keepNext: true,
            spacing: { after: 60 },
          }),
        );
      if (entry.link)
        children.push(
          new Paragraph({
            text: entry.link,
            keepNext: true,
            spacing: { after: 60 },
          }),
        );
      for (const bullet of entry.bullets)
        children.push(
          new Paragraph({
            text: bullet,
            bullet: { level: 0 },
            spacing: { after: 75 },
            widowControl: true,
          }),
        );
    }
  };
  section("Professional Experience", cv.experience);
  section("Selected Projects", cv.projects);
  section("Education", cv.education);
  return Packer.toBuffer(
    new Document({
      creator: cv.name,
      title: `${cv.name} CV`,
      description: "Curriculum vitae",
      styles: {
        default: {
          document: {
            run: { font: "Arial", size: 21, color: "000000" },
            paragraph: { spacing: { line: 265 } },
          },
          title: {
            run: { font: "Arial", size: 38, bold: true, color: "000000" },
          },
          heading1: {
            run: { font: "Arial", size: 23, bold: true, color: "000000" },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              size: { width: 11906, height: 16838 },
              margin: { top: 900, bottom: 900, left: 1000, right: 1000 },
            },
          },
          children,
        },
      ],
    }),
  );
}

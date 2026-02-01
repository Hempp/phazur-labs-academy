// Certificate PDF Generation Service
// Generates professional certificates using basic PDF structure

export interface CertificateData {
  recipientName: string
  courseName: string
  completionDate: string
  certificateId: string
  instructorName: string
  courseHours: number
  skills?: string[]
  grade?: string | null
  verificationUrl?: string
}

// Simple PDF generator without external font dependencies
export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  const {
    recipientName,
    courseName,
    completionDate,
    certificateId,
    instructorName,
    courseHours,
    skills = [],
    grade,
    verificationUrl = `https://coursetraining.com/verify/${certificateId}`,
  } = data

  // Build skills text
  const skillsText = skills.slice(0, 6).join(' | ')

  // PDF dimensions (612 x 792 is US Letter in points, we use landscape)
  const width = 792
  const height = 612

  // Create a simple PDF manually (basic PDF 1.4 format)
  const objects: string[] = []
  let objectCount = 0

  const addObject = (content: string): number => {
    objectCount++
    objects.push(`${objectCount} 0 obj\n${content}\nendobj`)
    return objectCount
  }

  // Object 1: Catalog
  addObject('<< /Type /Catalog /Pages 2 0 R >>')

  // Object 2: Pages
  addObject(`<< /Type /Pages /Kids [3 0 R] /Count 1 >>`)

  // Object 3: Page
  addObject(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>`
  )

  // Build content stream
  const lines: string[] = []

  // Helper to add text
  const addText = (text: string, x: number, y: number, fontSize: number, fontKey: string = 'F1') => {
    const escapedText = text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
    lines.push(`BT /${fontKey} ${fontSize} Tf ${x} ${y} Td (${escapedText}) Tj ET`)
  }

  // Helper to add centered text
  const addCenteredText = (text: string, y: number, fontSize: number, fontKey: string = 'F1') => {
    const approxWidth = text.length * fontSize * 0.5
    const x = (width - approxWidth) / 2
    addText(text, x, y, fontSize, fontKey)
  }

  // Helper to draw rectangle
  const drawRect = (x: number, y: number, w: number, h: number, lineWidth: number = 1, stroke: boolean = true, fill: boolean = false) => {
    lines.push(`q ${lineWidth} w ${x} ${y} ${w} ${h} re ${stroke ? 'S' : ''} ${fill ? 'f' : ''} Q`)
  }

  // Draw outer border
  lines.push('0.118 0.227 0.373 RG') // Dark blue color
  drawRect(20, 20, width - 40, height - 40, 3)

  // Draw gold inner border
  lines.push('0.788 0.635 0.153 RG') // Gold color
  drawRect(30, 30, width - 60, height - 60, 1)

  // Reset to black for text
  lines.push('0 0 0 rg')

  // Title section
  addCenteredText('COURSE TRAINING', height - 80, 18, 'F2')

  // Set dark blue color for title
  lines.push('0.118 0.227 0.373 rg')
  addCenteredText('CERTIFICATE', height - 120, 36, 'F2')

  // Gold for subtitle
  lines.push('0.788 0.635 0.153 rg')
  addCenteredText('OF COMPLETION', height - 150, 14, 'F1')

  // Reset to gray for body text
  lines.push('0.4 0.4 0.4 rg')
  addCenteredText('This is to certify that', height - 200, 12, 'F1')

  // Recipient name in dark blue
  lines.push('0.118 0.227 0.373 rg')
  addCenteredText(recipientName, height - 240, 28, 'F2')

  // Gold line under name
  lines.push('0.788 0.635 0.153 RG')
  lines.push(`q 2 w ${width/2 - 150} ${height - 255} m ${width/2 + 150} ${height - 255} l S Q`)

  // Course completion text
  lines.push('0.4 0.4 0.4 rg')
  addCenteredText('has successfully completed the course', height - 285, 12, 'F1')

  // Course name in blue
  lines.push('0.176 0.353 0.557 rg')
  addCenteredText(courseName, height - 320, 18, 'F2')

  // Course details
  lines.push('0.4 0.4 0.4 rg')
  const detailsText = `${courseHours} Hours  |  ${completionDate}${grade ? `  |  Grade: ${grade}` : ''}`
  addCenteredText(detailsText, height - 355, 10, 'F1')

  // Skills if present
  if (skillsText) {
    addCenteredText('Skills: ' + skillsText, height - 380, 9, 'F1')
  }

  // Footer section - signatures
  lines.push('0.4 0.4 0.4 rg')

  // Left signature
  addText(instructorName, 120, 100, 12, 'F1')
  lines.push(`q 0.5 w 80 85 m 230 85 l S Q`)
  addText('Course Instructor', 110, 70, 10, 'F1')

  // Right signature
  addText('Academy Director', 540, 100, 12, 'F1')
  lines.push(`q 0.5 w 520 85 m 670 85 l S Q`)
  addText('Course Training', 530, 70, 10, 'F1')

  // Certificate ID at bottom
  lines.push('0.6 0.6 0.6 rg')
  addCenteredText(`Certificate ID: ${certificateId}`, 45, 9, 'F1')
  addCenteredText(verificationUrl, 30, 8, 'F1')

  // Combine content stream
  const contentStream = lines.join('\n')

  // Object 4: Content stream
  addObject(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`)

  // Object 5: Helvetica font (standard PDF font, no embedding needed)
  addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')

  // Object 6: Helvetica-Bold font
  addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>')

  // Build final PDF
  const header = '%PDF-1.4\n'
  const body = objects.join('\n\n') + '\n\n'

  // Cross-reference table
  let xref = 'xref\n'
  xref += `0 ${objectCount + 1}\n`
  xref += '0000000000 65535 f \n'

  let offset = header.length
  for (let i = 0; i < objectCount; i++) {
    const objOffset = header.length + objects.slice(0, i).join('\n\n').length + (i > 0 ? 2 : 0)
    xref += objOffset.toString().padStart(10, '0') + ' 00000 n \n'
  }

  // Trailer
  const xrefOffset = header.length + body.length
  const trailer = `trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  const pdf = header + body + xref + trailer

  return Buffer.from(pdf, 'utf-8')
}

// Utility function to generate certificate filename
export function getCertificateFilename(recipientName: string, courseName: string): string {
  const sanitize = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 30)

  return `certificate-${sanitize(recipientName)}-${sanitize(courseName)}.pdf`
}

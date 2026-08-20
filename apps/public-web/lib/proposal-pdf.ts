import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

interface ProposalPdfInput {
  proposalNumber: string;
  clientName: string;
  recipientName: string;
  issueDate: string;
  validUntil: string;
  version: number;
  commercial: {
    basePriceIdr: number;
    discountPercent: number;
    taxPercent: number;
    downPaymentPercent: number;
    totalIdr: number;
  };
  discoverySummary: string;
  discoveryChecksum?: string;
}

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const words = text.replace(/[^\x20-\x7E]/g, " ").split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= width) line = next;
    else { if (line) lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines;
}

function drawLines(page: PDFPage, lines: string[], font: PDFFont, size: number, x: number, y: number, color = rgb(0.12, 0.16, 0.2)) {
  lines.forEach((line, index) => page.drawText(line, { x, y: y - index * (size + 5), size, font, color }));
  return y - lines.length * (size + 5);
}

export async function buildProposalPdf(input: ProposalPdfInput) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${input.proposalNumber} - ${input.clientName}`);
  pdf.setAuthor("QIRA - PT Rays Solusi Informasi");
  pdf.setSubject("Penawaran QIRA");
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const page = pdf.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const margin = 54;
  page.drawRectangle({ x: 0, y: height - 150, width, height: 150, color: rgb(0.04, 0.15, 0.18) });
  page.drawText("QIRA.", { x: margin, y: height - 68, size: 30, font: bold, color: rgb(0.4, 0.9, 0.72) });
  page.drawText("RINGKASAN PENAWARAN", { x: margin, y: height - 108, size: 12, font: bold, color: rgb(1, 1, 1) });
  page.drawText(input.proposalNumber, { x: margin, y: height - 130, size: 9, font: regular, color: rgb(0.82, 0.9, 0.9) });

  let y = height - 195;
  page.drawText(input.clientName, { x: margin, y, size: 23, font: bold, color: rgb(0.06, 0.17, 0.2) });
  y -= 28;
  page.drawText(`Untuk: ${input.recipientName}`, { x: margin, y, size: 11, font: regular });
  y -= 20;
  page.drawText(`Tanggal: ${input.issueDate}  |  Berlaku sampai: ${input.validUntil}  |  Pembaruan: ${input.version}`, { x: margin, y, size: 9, font: regular, color: rgb(0.35, 0.4, 0.43) });

  y -= 48;
  page.drawText("Ringkasan kebutuhan", { x: margin, y, size: 14, font: bold, color: rgb(0.04, 0.45, 0.34) });
  y = drawLines(page, wrap(input.discoverySummary, regular, 10, width - margin * 2), regular, 10, margin, y - 22);

  y -= 28;
  page.drawText("Rincian biaya", { x: margin, y, size: 14, font: bold, color: rgb(0.04, 0.45, 0.34) });
  const rows = [
    ["Harga awal", rupiah.format(input.commercial.basePriceIdr)],
    ["Potongan", `${input.commercial.discountPercent}%`],
    ["Pajak", `${input.commercial.taxPercent}%`],
    ["Total", rupiah.format(input.commercial.totalIdr)],
    ["Pembayaran awal", `${input.commercial.downPaymentPercent}%`],
  ];
  y -= 24;
  rows.forEach(([label, value], index) => {
    const rowY = y - index * 25;
    page.drawText(label, { x: margin, y: rowY, size: 10, font: regular });
    page.drawText(value, { x: 330, y: rowY, size: 10, font: index === 3 ? bold : regular });
    page.drawLine({ start: { x: margin, y: rowY - 8 }, end: { x: width - margin, y: rowY - 8 }, thickness: 0.5, color: rgb(0.85, 0.87, 0.88) });
  });

  page.drawText("Dokumen ini merupakan ringkasan penawaran QIRA. Hubungi QIRA jika ada bagian yang ingin disesuaikan.", { x: margin, y: 75, size: 8, font: regular, color: rgb(0.35, 0.4, 0.43) });
  page.drawText("QIRA - PT Rays Solusi Informasi", { x: margin, y: 35, size: 8, font: bold, color: rgb(0.04, 0.45, 0.34) });
  return pdf.save();
}

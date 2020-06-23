import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function pdfFn(buf: Buffer[], text: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(Buffer.concat(buf));
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  pages.forEach(page => {
    const { width, height } = page.getSize();

    page.drawText(text, {
      x: width - 30,
      y: height - 20,
      size: 13,
      font,
      color: rgb(0, 0, 0)
    });
  });
  return await pdfDoc.save();
}

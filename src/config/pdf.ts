import HummusRecipe from 'hummus-recipe';

export function addDocNumber({
  buffer,
  docNumber
}: {
  buffer: Buffer;
  docNumber: string;
}): Promise<Buffer> {
  return new Promise(resolve => {
    const pdfDoc = new HummusRecipe(buffer);
    for (let i = 1; i <= pdfDoc.metadata.pages; i += 1) {
      pdfDoc.editPage(i).text(docNumber, pdfDoc.metadata[i].width - 20, 20, {
        size: 10,
        color: '#000000',
        align: 'right center'
      });

      pdfDoc.endPage();
    }
    pdfDoc.endPDF(output => {
      resolve(output);
    });
  });
}

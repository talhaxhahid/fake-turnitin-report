// Helper function to convert Word document to PDF using HTML rendering
export async function convertWordToPdf(file: File): Promise<Uint8Array> {
    const mammoth = await import('mammoth');
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');

    // Read the Word file
    const arrayBuffer = await file.arrayBuffer();

    // Extract text from Word document
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Split text into lines
    const lines = text.split('\n');
    const pageWidth = 595;
    const pageHeight = 842;
    const margin = 50;
    const maxWidth = pageWidth - 2 * margin;
    const lineHeight = 14;
    const fontSize = 11;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    for (const line of lines) {
        // Word wrap
        const words = line.split(' ');
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const width = font.widthOfTextAtSize(testLine, fontSize);

            if (width > maxWidth && currentLine) {
                // Draw current line
                page.drawText(currentLine, {
                    x: margin,
                    y,
                    size: fontSize,
                    font,
                    color: rgb(0, 0, 0),
                });
                y -= lineHeight;
                currentLine = word;

                // Start new page if needed
                if (y < margin) {
                    page = pdfDoc.addPage([pageWidth, pageHeight]);
                    y = pageHeight - margin;
                }
            } else {
                currentLine = testLine;
            }
        }

        // Draw remaining text
        if (currentLine) {
            page.drawText(currentLine, {
                x: margin,
                y,
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
            });
            y -= lineHeight;
        }

        // Start new page if needed
        if (y < margin) {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
        }
    }

    // Return PDF as Uint8Array
    return await pdfDoc.save();
}

// Helper function to merge PDFs (Turnitin report at the beginning, then the document)
export async function mergePdfs(turnitinPdfBytes: Uint8Array, documentPdfBytes: Uint8Array): Promise<Uint8Array> {
    const { PDFDocument } = await import('pdf-lib');

    const mergedPdf = await PDFDocument.create();

    // Load both PDFs
    const turnitinPdf = await PDFDocument.load(turnitinPdfBytes);
    const documentPdf = await PDFDocument.load(documentPdfBytes);

    // Copy pages from Turnitin report first
    const turnitinPages = await mergedPdf.copyPages(turnitinPdf, turnitinPdf.getPageIndices());
    turnitinPages.forEach((page) => mergedPdf.addPage(page));

    // Then copy pages from the document
    const documentPages = await mergedPdf.copyPages(documentPdf, documentPdf.getPageIndices());
    documentPages.forEach((page) => mergedPdf.addPage(page));

    // Return merged PDF as Uint8Array
    return await mergedPdf.save();
}

// Helper function to download a file
export function downloadFile(data: Uint8Array, filename: string) {
    const blob = new Blob([data as any], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Export PDF highlighting function
export { highlightPdfText } from './pdfHighlighter';

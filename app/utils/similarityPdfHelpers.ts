// Similarity Report - Generate Turnitin submission ID
export function generateSubmissionId(): string {
    const randomPart = Math.floor(Math.random() * 9000000000 + 1000000000);
    return `trn:oid:::1:${randomPart}`;
}

// Similarity Report - Helper function to convert Word document to PDF using HTML rendering
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

// Similarity Report - Helper function to extract text from Word document
export async function extractTextFromWord(file: File): Promise<string> {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}

// Similarity Report - Helper function to merge PDFs (Turnitin report at the beginning, then the document)
export async function mergePdfs(turnitinPdfBytes: Uint8Array, documentPdfBytes: Uint8Array): Promise<Uint8Array> {
    const { PDFDocument } = await import('pdf-lib');

    const mergedPdf = await PDFDocument.create();

    // Load both PDFs
    const turnitinPdf = await PDFDocument.load(turnitinPdfBytes);
    const documentPdf = await PDFDocument.load(documentPdfBytes);

    const turnitinPageCount = turnitinPdf.getPageCount();
    const documentPageCount = documentPdf.getPageCount();

    console.log(`[Similarity] MergePdfs Debug: Turnitin Template Pages: ${turnitinPageCount}, Document Pages: ${documentPageCount}`);

    // 1. Copy the first 2 intro pages (Cover + Report details) from Turnitin PDF
    const introPageCount = 2;

    const introIndices = [];
    for (let i = 0; i < Math.min(introPageCount, turnitinPageCount); i++) {
        introIndices.push(i);
    }

    if (introIndices.length > 0) {
        const introPages = await mergedPdf.copyPages(turnitinPdf, introIndices);
        introPages.forEach(page => mergedPdf.addPage(page));
    }

    // 2. Get the blank template pages from Turnitin PDF (index 2 onwards)
    const templateIndices = [];
    for (let i = introPageCount; i < turnitinPageCount; i++) {
        templateIndices.push(i);
    }

    // Copy these template pages to the merged PDF (we keep them as PDFPage objects to add them later)
    let templatePages: any[] = [];
    if (templateIndices.length > 0) {
        templatePages = await mergedPdf.copyPages(turnitinPdf, templateIndices);
    }

    // 3. Embed the document pages so they can be drawn/scaled onto the template pages
    // Explicitly get all page indices to ensure we embed everything
    const docIndices = documentPdf.getPageIndices();
    const embeddedDocPages = await mergedPdf.embedPdf(documentPdf, docIndices);

    console.log(`[Similarity] MergePdfs Debug: Embedded ${embeddedDocPages.length} pages from document`);

    // 4. Combine: For each document page, add a template page and draw the document page on it
    for (let i = 0; i < embeddedDocPages.length; i++) {
        let page;

        // Use a corresponding template page if available
        if (i < templatePages.length) {
            page = templatePages[i];
            mergedPdf.addPage(page);
        } else {
            // If we run out of template pages (docPages mismatch?), duplicate the last template page
            // We have to copy it again from the source turnitinPdf.
            if (templateIndices.length > 0) {
                const lastTemplateIndex = templateIndices[templateIndices.length - 1];
                const [freshPage] = await mergedPdf.copyPages(turnitinPdf, [lastTemplateIndex]);
                page = freshPage;
                mergedPdf.addPage(page);
            } else {
                // Fallback if no template pages exist (shouldn't happen given logic)
                page = mergedPdf.addPage();
            }
        }

        const size = page.getSize();
        const pageWidth = size.width;
        const pageHeight = size.height;

        const embeddedPage = embeddedDocPages[i];
        const { width: docWidth, height: docHeight } = embeddedPage;

        console.log(`[Similarity] Template page size: ${pageWidth} x ${pageHeight}`);
        console.log(`[Similarity] Document page ${i + 1} original size: ${docWidth} x ${docHeight}`);

        // Define margins for header and footer areas
        const headerMargin = 50; // Space reserved for header
        const footerMargin = 40; // Space reserved for footer
        const horizontalMargin = 30; // Side margins

        // Calculate available space within the template
        const availableWidth = pageWidth - (horizontalMargin * 2);
        const availableHeight = pageHeight - headerMargin - footerMargin;

        console.log(`[Similarity] Available space: ${availableWidth} x ${availableHeight}`);

        // Calculate scale factors for width and height
        const widthScale = docWidth <= availableWidth ? 1 : availableWidth / docWidth;
        const heightScale = docHeight <= availableHeight ? 1 : availableHeight / docHeight;

        // Use the smaller scale to maintain aspect ratio, but only if scaling is needed
        let scale = 1;
        if (docWidth > availableWidth || docHeight > availableHeight) {
            scale = Math.min(widthScale, heightScale);
        }

        console.log(`[Similarity] Calculated scale: ${scale} (widthScale: ${widthScale}, heightScale: ${heightScale})`);

        const scaledWidth = docWidth * scale;
        const scaledHeight = docHeight * scale;

        console.log(`[Similarity] Scaled size: ${scaledWidth} x ${scaledHeight}`);

        // Center horizontally and position with footer margin at bottom
        const x = (pageWidth - scaledWidth) / 2;
        const y = footerMargin + (availableHeight - scaledHeight) / 2; // Vertically center in available space

        console.log(`[Similarity] Position: x=${x}, y=${y}`);

        page.drawPage(embeddedPage, {
            x,
            y,
            xScale: scale,
            yScale: scale,
        });
    }

    // Return merged PDF as Uint8Array
    return await mergedPdf.save();
}

// Similarity Report - Helper function to add headers and footers to document pages
export async function addHeadersAndFooters(
    pdfBytes: Uint8Array,
    submissionId: string,
    startPageNumber: number = 3
): Promise<Uint8Array> {
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 7;

    // Load Turnitin logo (you would need to embed this as base64 or load from file)
    // For now, we'll just use text

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const pageNumber = startPageNumber + i;
        const totalPages = pages.length + startPageNumber - 1;

        // Add header
        const headerY = height - 25;
        page.drawText(`Page ${pageNumber} of ${totalPages} - Document Content`, {
            x: 50,
            y: headerY,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Submission ID   ${submissionId}`, {
            x: width - 200,
            y: headerY,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
        });

        // Add footer
        const footerY = 20;
        page.drawText(`Page ${pageNumber} of ${totalPages} - Document Content`, {
            x: 50,
            y: footerY,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Submission ID   ${submissionId}`, {
            x: width - 200,
            y: footerY,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
        });
    }

    return await pdfDoc.save();
}

// Similarity Report - Helper function to download a file
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

// Similarity Report - Helper function to get the number of pages in a PDF
export async function getPdfPageCount(pdfBytes: Uint8Array): Promise<number> {
    const { PDFDocument } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.load(pdfBytes);
    return pdfDoc.getPageCount();
}

// Export PDF highlighting function for similarity report
export { highlightPdfText } from './similarityPdfHighlighter';

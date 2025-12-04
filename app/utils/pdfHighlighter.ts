import { PDFDocument, rgb } from 'pdf-lib';

interface TextItem {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    pageIndex: number;
}

/**
 * Extract text content with position data from PDF
 */
async function extractTextContent(pdfBytes: Uint8Array): Promise<TextItem[]> {
    // Dynamic import for pdf.js
    const PDFJS = await import('pdfjs-dist');

    // Use local worker file copied to public folder
    if (typeof window !== 'undefined') {
        PDFJS.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    }

    const loadingTask = PDFJS.getDocument({ data: pdfBytes });
    const pdf = await loadingTask.promise;
    const textItems: TextItem[] = [];

    for (let pageIndex = 0; pageIndex < pdf.numPages; pageIndex++) {
        const page = await pdf.getPage(pageIndex + 1);
        const textContent = await page.getTextContent();

        for (const item of textContent.items as any[]) {
            if (!item.transform || !item.str || item.str.trim() === '') continue;

            // Transform matrix: [scaleX, skewX, skewY, scaleY, translateX, translateY]
            const [scaleX, , , scaleY, x, y] = item.transform;
            
            // Calculate width from the item width property or estimate from text length
            const width = item.width || (item.str.length * Math.abs(scaleX) * 0.6);
            // Height is typically the absolute value of scaleY (font size)
            const height = Math.abs(scaleY) || 12;

            if (width > 0 && height > 0) {
                textItems.push({
                    text: item.str,
                    x,
                    y,
                    width,
                    height,
                    pageIndex
                });
            }
        }
    }

    console.log(`Extracted ${textItems.length} text items from PDF`);
    return textItems;
}

/**
 * Calculate total word count from text items
 */
function calculateWordCount(textItems: TextItem[]): number {
    const allText = textItems.map(item => item.text).join(' ');
    const words = allText.split(/\s+/).filter(Boolean);
    return words.length;
}

/**
 * Select random chunks of text to highlight based on percentage
 */
function selectRandomChunks(textItems: TextItem[], percentage: number): TextItem[] {
    if (percentage <= 0 || textItems.length === 0) return [];

    const totalWords = calculateWordCount(textItems);
    const wordsToHighlight = Math.floor((totalWords * percentage) / 100);

    // Group consecutive text items into chunks (groups of 3-10 items)
    const chunks: TextItem[][] = [];
    let currentChunk: TextItem[] = [];

    for (let i = 0; i < textItems.length; i++) {
        currentChunk.push(textItems[i]);

        // Create chunk every 3-10 items randomly
        const chunkSize = Math.floor(Math.random() * 8) + 3;
        if (currentChunk.length >= chunkSize || i === textItems.length - 1) {
            chunks.push([...currentChunk]);
            currentChunk = [];
        }
    }

    // Calculate how many chunks we need to highlight
    const avgWordsPerChunk = totalWords / chunks.length;
    const chunksToHighlight = Math.ceil(wordsToHighlight / avgWordsPerChunk);

    // Randomly select chunks
    const selectedChunks: TextItem[] = [];
    const shuffledIndices = Array.from({ length: chunks.length }, (_, i) => i)
        .sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(chunksToHighlight, chunks.length); i++) {
        const chunk = chunks[shuffledIndices[i]];
        selectedChunks.push(...chunk);
    }

    return selectedChunks;
}

/**
 * Add cyan highlights to PDF at specified text positions
 */
async function addHighlightsToPdf(pdfBytes: Uint8Array, highlightItems: TextItem[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    console.log(`Adding ${highlightItems.length} highlights to PDF`);

    for (const item of highlightItems) {
        if (item.pageIndex >= pages.length) continue;

        const page = pages[item.pageIndex];

        // PDF.js y-coordinate is already in PDF coordinate system (bottom-left origin)
        // Just use the coordinates directly
        page.drawRectangle({
            x: item.x,
            y: item.y - 2, // Slight adjustment for better positioning
            width: item.width,
            height: item.height + 4, // Add padding
            color: rgb(0, 1, 1), // Cyan
            opacity: 0.3,
            borderOpacity: 0
        });
    }

    return await pdfDoc.save();
}

/**
 * Main function: Highlight random text in PDF based on percentage
 */
export async function highlightPdfText(pdfBytes: Uint8Array, percentage: number): Promise<Uint8Array> {
    console.log(`Highlighting PDF with ${percentage}% AI detection`);
    
    if (percentage <= 0) {
        console.log('Percentage is 0 or less, returning original PDF');
        return pdfBytes;
    }

    // Make a copy of original bytes to return if highlighting fails
    const originalBytes = new Uint8Array(pdfBytes);

    try {
        // First check if pdf-lib can load this PDF
        const { PDFDocument } = await import('pdf-lib');
        try {
            await PDFDocument.load(pdfBytes);
        } catch (loadError) {
            console.warn('PDF format not compatible with highlighting, returning original:', loadError);
            return originalBytes;
        }

        // Extract text with positions
        const textItems = await extractTextContent(pdfBytes);
        console.log(`Found ${textItems.length} text items`);

        if (textItems.length === 0) {
            console.log('No text items found in PDF');
            return originalBytes;
        }

        // Select random chunks to highlight
        const itemsToHighlight = selectRandomChunks(textItems, percentage);
        console.log(`Selected ${itemsToHighlight.length} items to highlight`);

        // Apply highlights
        const highlightedPdf = await addHighlightsToPdf(originalBytes, itemsToHighlight);

        return highlightedPdf;
    } catch (error) {
        console.error('Error highlighting PDF:', error);
        // Return original PDF if highlighting fails
        return originalBytes;
    }
}

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

    // Configure worker
    if (typeof window !== 'undefined') {
        PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;
    }

    const loadingTask = PDFJS.getDocument({ data: pdfBytes });
    const pdf = await loadingTask.promise;
    const textItems: TextItem[] = [];

    for (let pageIndex = 0; pageIndex < pdf.numPages; pageIndex++) {
        const page = await pdf.getPage(pageIndex + 1);
        const textContent = await page.getTextContent();

        for (const item of textContent.items as any[]) {
            if (!item.transform || !item.str) continue;

            const [, , , , x, y] = item.transform;
            textItems.push({
                text: item.str,
                x,
                y,
                width: item.width,
                height: item.height,
                pageIndex
            });
        }
    }

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
 * Add yellow highlights to PDF at specified text positions
 */
async function addHighlightsToPdf(pdfBytes: Uint8Array, highlightItems: TextItem[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    for (const item of highlightItems) {
        if (item.pageIndex >= pages.length) continue;

        const page = pages[item.pageIndex];
        const { height: pageHeight } = page.getSize();

        // Convert coordinates (PDF.js uses different coordinate system than pdf-lib)
        const y = pageHeight - item.y - item.height;

        // Draw yellow rectangle behind text
        page.drawRectangle({
            x: item.x,
            y,
            width: item.width,
            height: item.height,
            color: rgb(1, 1, 0), // Yellow
            opacity: 0.4,
            borderOpacity: 0
        });
    }

    return await pdfDoc.save();
}

/**
 * Main function: Highlight random text in PDF based on percentage
 */
export async function highlightPdfText(pdfBytes: Uint8Array, percentage: number): Promise<Uint8Array> {
    if (percentage <= 0) return pdfBytes;

    try {
        // Extract text with positions
        const textItems = await extractTextContent(pdfBytes);

        // Select random chunks to highlight
        const itemsToHighlight = selectRandomChunks(textItems, percentage);

        // Apply highlights
        const highlightedPdf = await addHighlightsToPdf(pdfBytes, itemsToHighlight);

        return highlightedPdf;
    } catch (error) {
        console.error('Error highlighting PDF:', error);
        // Return original PDF if highlighting fails
        return pdfBytes;
    }
}

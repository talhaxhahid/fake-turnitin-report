import { PDFDocument, rgb, BlendMode } from 'pdf-lib';

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

    // Set worker source to CDN URL matching pdfjs-dist version to avoid host MIME type issues
    if (typeof window !== 'undefined') {
        const version = PDFJS.version || '5.4.449';
        PDFJS.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
    }

    // Clone the data to prevent buffer detachment/neutering by PDF.js worker transfer
    const data = new Uint8Array(pdfBytes);
    const loadingTask = PDFJS.getDocument({ data });
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
 * Count words in a text string
 */
function countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Select random chunks of text to highlight based on percentage
 * - Each chunk must contain at least 25 consecutive words
 * - Works with text items directly, grouping consecutive items until word count >= 25
 */
function selectRandomChunks(textItems: TextItem[], percentage: number): TextItem[] {
    if (percentage <= 0 || textItems.length === 0) return [];

    const MIN_WORDS_PER_CHUNK = 25;

    // Count total words in document
    let totalWords = 0;
    for (const item of textItems) {
        totalWords += countWords(item.text);
    }

    console.log(`Total words in document: ${totalWords}`);

    if (totalWords < MIN_WORDS_PER_CHUNK) {
        console.log(`Document has fewer than ${MIN_WORDS_PER_CHUNK} words, cannot create highlights`);
        return [];
    }

    const wordsToHighlight = Math.floor((totalWords * percentage) / 100);
    console.log(`Target words to highlight: ${wordsToHighlight}`);

    if (wordsToHighlight < MIN_WORDS_PER_CHUNK) {
        console.log(`Not enough words to highlight (need at least ${MIN_WORDS_PER_CHUNK})`);
        return [];
    }

    // Create chunks by grouping consecutive text items until we have at least MIN_WORDS_PER_CHUNK words
    const chunks: { items: TextItem[]; wordCount: number }[] = [];
    let currentChunk: TextItem[] = [];
    let currentWordCount = 0;
    // Random target between 25 and 50 words per chunk
    let targetChunkSize = Math.floor(Math.random() * 26) + MIN_WORDS_PER_CHUNK;

    for (let i = 0; i < textItems.length; i++) {
        const item = textItems[i];
        const itemWordCount = countWords(item.text);
        
        currentChunk.push(item);
        currentWordCount += itemWordCount;

        // Create a chunk when we've reached the target size
        if (currentWordCount >= targetChunkSize) {
            chunks.push({
                items: [...currentChunk],
                wordCount: currentWordCount
            });
            console.log(`Created chunk with ${currentWordCount} words (${currentChunk.length} text items)`);
            
            // Reset for next chunk
            currentChunk = [];
            currentWordCount = 0;
            // New random target for next chunk
            targetChunkSize = Math.floor(Math.random() * 26) + MIN_WORDS_PER_CHUNK;
        }
    }

    // Handle remaining items - only add if they have at least MIN_WORDS_PER_CHUNK words
    if (currentWordCount >= MIN_WORDS_PER_CHUNK) {
        chunks.push({
            items: [...currentChunk],
            wordCount: currentWordCount
        });
        console.log(`Created final chunk with ${currentWordCount} words (${currentChunk.length} text items)`);
    } else if (currentWordCount > 0) {
        console.log(`Discarded final partial chunk with only ${currentWordCount} words (less than ${MIN_WORDS_PER_CHUNK})`);
    }

    console.log(`Created ${chunks.length} valid chunks (each with ${MIN_WORDS_PER_CHUNK}+ words)`);

    if (chunks.length === 0) {
        return [];
    }

    // Calculate how many chunks we need to reach the target word count
    const avgWordsPerChunk = chunks.reduce((sum, c) => sum + c.wordCount, 0) / chunks.length;
    const chunksNeeded = Math.ceil(wordsToHighlight / avgWordsPerChunk);

    console.log(`Need approximately ${chunksNeeded} chunks to highlight ${wordsToHighlight} words`);

    // Randomly select chunks (shuffle and pick first N)
    const shuffledChunks = [...chunks].sort(() => Math.random() - 0.5);
    const selectedChunks = shuffledChunks.slice(0, Math.min(chunksNeeded, chunks.length));

    // Calculate actual words being highlighted
    const actualWordsHighlighted = selectedChunks.reduce((sum, c) => sum + c.wordCount, 0);
    console.log(`Selected ${selectedChunks.length} chunks, highlighting ${actualWordsHighlighted} words total`);

    // Flatten selected chunks into text items
    const highlightItems: TextItem[] = [];
    for (const chunk of selectedChunks) {
        highlightItems.push(...chunk.items);
    }

    console.log(`Total highlight text items: ${highlightItems.length}`);

    return highlightItems;
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
        const r = 0 / 255;
        const g = 175 / 255;
        const b = 215 / 255;

        // PDF.js y-coordinate is already in PDF coordinate system (bottom-left origin)
        // Just use the coordinates directly
        // Using 'Multiply' blend mode makes the highlight appear behind the text
        page.drawRectangle({
            x: item.x,
            y: item.y - 4, // Slight adjustment for better positioning
            width: item.width,
            height: item.height + 2, // Add padding
            color: rgb(r, g, b), // Cyan
            opacity: 0.4, // Slightly higher opacity since Multiply darkens less
            borderOpacity: 0,
            blendMode: BlendMode.Multiply // This makes the highlight blend with text instead of covering it
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

/**
 * Extract raw text string from PDF
 */
export async function extractTextFromPdf(pdfBytes: Uint8Array): Promise<string> {
    const textItems = await extractTextContent(pdfBytes);
    return textItems.map(item => item.text).join(' ');
}

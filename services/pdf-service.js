import { chromaService } from './chroma-service.js';

class PDFService {
    constructor() {
        chromaService.initialize().catch(error => {
            console.error('Failed to initialize ChromaService:', error);
        });
    }

    async processPDF(file) {
        try {
            console.log('Processing PDF:', file.name);
            
            // The actual PDF processing happens in the browser
            // Here we just handle the text that's sent from the browser
            const text = file.text; // This will be sent from the browser
            console.log('Received text from browser, length:', text.length);

            // Split text into chunks and store in ChromaDB
            const chunks = this.splitIntoChunks(text, 1000);
            console.log('Created chunks:', chunks.length);

            await chromaService.addToMemory(chunks);
            console.log('Chunks added to memory');

            return {
                success: true,
                message: `PDF processed successfully. Extracted ${chunks.length} chunks.`,
                text: text.substring(0, 500) + '...' // Preview of the text
            };
        } catch (error) {
            console.error("Error processing PDF:", error);
            return {
                success: false,
                message: "Error processing PDF: " + error.message
            };
        }
    }

    splitIntoChunks(text, chunkSize) {
        const words = text.split(' ');
        const chunks = [];
        let currentChunk = [];

        for (const word of words) {
            currentChunk.push(word);
            if (currentChunk.join(' ').length >= chunkSize) {
                chunks.push(currentChunk.join(' '));
                currentChunk = [];
            }
        }

        if (currentChunk.length > 0) {
            chunks.push(currentChunk.join(' '));
        }

        return chunks;
    }
}

export const pdfService = new PDFService();
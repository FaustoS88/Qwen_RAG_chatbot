class ChromaService {
    constructor() {
        this.client = null;
        this.collection = null;
        this.embeddings = [];
    }

    async initialize() {
        try {
            // Since we're in a browser environment, we'll use in-memory storage
            // Instead of trying to connect to a ChromaDB server
            console.log('Initializing ChromaDB in browser mode...');
            
            // Initialize empty collection for storing embeddings
            this.collection = {
                documents: [],
                embeddings: [],
                metadatas: [],
                ids: []
            };

            console.log('ChromaDB initialized in browser mode successfully');
            return true;
        } catch (error) {
            console.error('Error initializing ChromaDB:', error);
            throw error;
        }
    }

    async addToMemory(chunks) {
        try {
            console.log('Chunks received:', chunks); 
            if (!Array.isArray(chunks)) {
                console.error('Chunks is not an array:', chunks);
                throw new Error('Chunks is not an array');
            }
            const timestamp = Date.now();
            const newIds = chunks.map((_, i) => `chunk_${timestamp}_${i}`);
            
            // Store the chunks directly
            this.collection.documents.push(...chunks);
            this.collection.ids.push(...newIds);
            this.collection.metadatas.push(...chunks.map(() => ({})));
            
            console.log(`Added ${chunks.length} chunks to memory`);
            return true;
        } catch (error) {
            console.error('Error adding to memory:', error);
            throw error;
        }
    }

    async search(query, numResults = 5) {
        return this.queryMemory(query, numResults);
    }

    async queryMemory(query, numResults = 5) {
        try {
            // Simple text-based search since we can't do proper vector similarity in browser
            const results = this.collection.documents
                .map((doc, index) => ({
                    document: doc,
                    score: this._textSimilarity(query, doc),
                    id: this.collection.ids[index]
                }))
                .sort((a, b) => b.score - a.score)
                .slice(0, numResults)
                .map(result => result.document);

            return results;
        } catch (error) {
            console.error('Error querying memory:', error);
            return [];
        }
    }

    // Simple text similarity function
    _textSimilarity(query, document) {
        const queryTerms = query.toLowerCase().split(' ');
        const docTerms = document.toLowerCase().split(' ');
        let matches = 0;
        
        for (const term of queryTerms) {
            if (docTerms.includes(term)) {
                matches++;
            }
        }
        
        return matches / queryTerms.length;
    }

    // Helper to clear memory if needed
    clearMemory() {
        this.collection = {
            documents: [],
            embeddings: [],
            metadatas: [],
            ids: []
        };
        console.log('Memory cleared');
    }
}

export const chromaService = new ChromaService();

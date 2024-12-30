import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import fileUpload from 'express-fileupload';
import { dirname } from 'path';

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use(fileUpload());

// Serve index.html for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// PDF processing and RAG
import { pdfService } from './services/pdf-service.js';
import { chromaService } from './services/chroma-service.js';

app.post('/upload', async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            throw new Error('No file uploaded');
        }

        const file = req.files.file;
        file.text = req.body.text; // Add the extracted text from the browser

        const result = await pdfService.processPDF(file);
        res.json(result);
    } catch (error) {
        console.error('Error handling PDF upload:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const apiKey = process.env.GLHF_API_KEY;

  if (!apiKey) {
    return res.status(400).json({ error: 'GLHF API key is required' });
  }

  try {
    // Search for relevant context in uploaded documents
    const relevantChunks = await chromaService.search(message);
    const context = relevantChunks.join('\n\n');

    // Prepare prompt with context
    const systemPrompt = context 
      ? `Use the following context to help answer the question:\n\n${context}\n\nQuestion:`
      : 'Answer the following question:';

    const requestBody = {
      model: 'hf:Qwen/Qwen2.5-Coder-32B-Instruct',
      prompt: `${systemPrompt}\nUser: ${message}\nAssistant:`,
      max_tokens: 1024,
    };

    console.log('Request Body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://glhf.chat/api/openai/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    const responseBody = await response.text();
    console.log('Raw API Response:', responseBody);

    if (responseBody) {
      const data = JSON.parse(responseBody);
      console.log('Parsed API Response:', data);

      if (data.choices && data.choices.length > 0 && data.choices[0].text) {
        const responseText = data.choices[0].text.trim();
        res.json({ 
          response: responseText,
          context: relevantChunks
        });
      } else {
        throw new Error('Invalid response format from API');
      }
    } else {
      throw new Error('Empty response from API');
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

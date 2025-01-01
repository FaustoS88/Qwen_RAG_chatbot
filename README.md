# AI Chatbot with Qwen 2.5 Experiment

This project implements a web-based chatbot interface using the Qwen 2.5 language model through the GLHF API. The application includes features for text interaction and PDF document processing.

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm (Node Package Manager)
- GLHF API Key (https://glhf.chat/)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/FaustoS88/Qwen_RAG_chatbot
cd ai_chatbotQwen2.5experiment
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your GLHF API key:
```
GLHF_API_KEY=your_api_key_here
```

## Project Structure

- `server.js` - Main Express server implementation
- `app.js` - Application logic
- `script.js` - Client-side JavaScript
- `index.html` - Main web interface
- `styles.css` - CSS styling
- `services/`
  - `chat-service.js` - Chat functionality implementation
  - `chroma-service.js` - Chroma vector database integration
  - `pdf-service.js` - PDF processing functionality

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3002
```

## Features

- Real-time chat interface
- Integration with Qwen 2.5 Coder model
- PDF document processing capabilities
- Modern and responsive UI
- Error handling and logging

## API Endpoints

- `GET /` - Serves the main application interface
- `POST /api/chat` - Handles chat interactions with the AI model
- Additional endpoints for PDF and document processing

## Environment Variables

- `GLHF_API_KEY` - Your GLHF API key (required)
- `PORT` - Server port (default: 3002)

## Dependencies

- express: ^4.21.2
- cors: ^2.8.5
- dotenv: ^16.4.7
- express-fileupload: ^1.5.1
- node-fetch: ^3.3.2
- pdfjs-dist: ^4.9.155

## Development

The application uses Express.js for the backend server and vanilla JavaScript for the frontend. The chat functionality is implemented using the GLHF API with the Qwen 2.5 Coder model.

## Error Handling

The application includes comprehensive error handling for:
- Missing API keys
- Failed API requests
- Invalid file uploads
- Server connection issues

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

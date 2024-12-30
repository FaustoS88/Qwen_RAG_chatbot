document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeBtn = document.getElementById('close-btn');
    const apiKeyInput = document.getElementById('api-key');
    const saveSettingsBtn = document.getElementById('save-settings');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const fileInput = document.getElementById('file-input');
    const clipboardIcon = document.querySelector('.clipboard-icon');
    
    let uploadInProgress = false;

    // Toggle settings modal
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = settingsModal.style.display === 'block' ? 'none' : 'block';
    });

    closeBtn.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    saveSettingsBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value;
        localStorage.setItem('GLHF_API_KEY', apiKey);
        settingsModal.style.display = 'none';
        alert('API Key saved!');
    });

    // Load API key from local storage
    const savedApiKey = localStorage.getItem('GLHF_API_KEY');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }

    // Send chat message
    sendBtn.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            addMessage('user', message);
            userInput.value = '';
            sendMessageToServer(message);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    // Handle file upload
    async function handleFileUpload(file) {
        try {
            if (file.type !== 'application/pdf') {
                throw new Error('Please upload a PDF file');
            }

            // Read the PDF file in the browser
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';

            // Extract text from each page
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + ' ';
            }

            // Create a new FormData object
            const formData = new FormData();
            formData.append('file', new Blob([fullText], { type: 'text/plain' }), file.name);
            formData.append('text', fullText);

            // Send the extracted text to the server
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                addMessage('assistant', `PDF processed successfully. ${result.message}`);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error processing PDF:', error);
            addMessage('assistant', `Error processing PDF: ${error.message}`);
        } finally {
            uploadInProgress = false;
            clipboardIcon.style.opacity = '1';
            clipboardIcon.style.pointerEvents = 'auto';
            fileInput.value = '';
        }
    }

    // Handle clipboard icon click
    clipboardIcon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!uploadInProgress) {
            fileInput.click();
        }
    });

    // Handle file selection
    fileInput.addEventListener('change', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const file = e.target.files[0];
        if (file) {
            uploadInProgress = true;
            clipboardIcon.style.opacity = '0.5';
            clipboardIcon.style.pointerEvents = 'none';
            handleFileUpload(file);
        }
    });

    // Add message to chat
    function addMessage(sender, content) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = content;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Send message to server
    async function sendMessageToServer(message) {
        const apiKey = localStorage.getItem('GLHF_API_KEY');
        if (!apiKey) {
            addMessage('bot', 'GLHF API key is required. Please set it in the settings.');
            return;
        }

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            addMessage('bot', data.response);
        } catch (error) {
            console.error('Error:', error);
            addMessage('bot', `Error: ${error.message}`);
        }
    }
});

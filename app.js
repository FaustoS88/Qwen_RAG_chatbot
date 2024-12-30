document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.getElementById('close-btn');
    const saveSettingsBtn = document.getElementById('save-settings');
    const apiKeyInput = document.getElementById('api-key');
    const debugOutput = document.getElementById('debug-output');
    const fileInput = document.getElementById('file-input');

    // Load API key from localStorage
    const apiKey = localStorage.getItem('glhf-api-key');
    if (apiKey) {
        apiKeyInput.value = apiKey;
    }

    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
    });
    closeModalBtn.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });
    saveSettingsBtn.addEventListener('click', saveSettings);
    fileInput.addEventListener('change', handleFileUpload);

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Display user message
        addMessage(message, 'user');

        // Clear input
        userInput.value = '';

        // Send message to API
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                addMessage(data.error, 'error');
            } else {
                addMessage(data.choices[0].message.content, 'bot');
            }
        })
        .catch(error => {
            console.error('Error sending message:', error);
            addMessage('Failed to send message', 'error');
        });
    }

    function addMessage(content, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.textContent = content;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function saveSettings() {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            alert('API key is required');
            return;
        }

        localStorage.setItem('glhf-api-key', apiKey);
        settingsModal.style.display = 'none';
        debugOutput.textContent += `API key saved: ${apiKey}\n`;
    }

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('pdf', file);

        fetch('/api/upload-pdf', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                addMessage(data.error, 'error');
            } else {
                addMessage('PDF processed successfully', 'bot');
                addMessage(data.textContent, 'bot');
            }
        })
        .catch(error => {
            console.error('Error uploading PDF:', error);
            addMessage('Failed to upload PDF', 'error');
        });
    }
});

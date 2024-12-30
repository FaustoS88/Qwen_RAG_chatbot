(async () => {
    const fetch = await import('node-fetch');
    const dotenv = await import('dotenv');
    dotenv.default.config();

    const API_URL = 'https://glhf.chat/api/openai/v1/completions'; // Updated endpoint
    const MODEL = 'hf:Qwen/Qwen2.5-Coder-32B-Instruct'; // Correct model

    async function makeRequest(apiKey, message) {
        try {
const requestBody = {
    inputs: message,
    parameters: {
        max_tokens: 1024, // Increased the maximum number of tokens in the response
        temperature: 0.8, // Increased the randomness to make the response more detailed
    },
};
            console.log('Request body:', JSON.stringify(requestBody, null, 2));

            const response = await fetch.default(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API request failed: ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            console.log('API Response:', JSON.stringify(data, null, 2));

            // Format code snippets properly
            let formattedResponse = data.choices[0].message.content;
            formattedResponse = formattedResponse.replace(/(```\w*\n[\s\S]*?\n```)/g, (match) => {
                // Remove leading and trailing newlines
                match = match.trim();
                // Indent the code block
                const lines = match.split('\n');
                const indentedLines = lines.map(line => '    ' + line).join('\n');
                return '```\n' + indentedLines + '\n```';
            });

            return formattedResponse;
        } catch (error) {
            console.error('Error making API request:', error);
            throw error;
        }
    }

    module.exports = {
        makeRequest,
    };

    // Test the makeRequest function
    const apiKey = process.env.GLHF_API_KEY; // Ensure you have the API key in your environment variables
    if (apiKey) {
        makeRequest(apiKey, 'hello').then(response => {
            console.log('Response:', response);
        }).catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.error('API key not found in environment variables.');
    }
})();

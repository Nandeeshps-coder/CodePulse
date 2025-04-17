// API integration with Judge0 API
class CodeExecutionAPI {
    constructor() {
        // API configuration
        this.apiUrl = 'https://judge0-ce.p.rapidapi.com';
        
        // Try to get API key from .env or use a placeholder
        // Note: For browser environments, the API key needs to be set before deployment
        // or provided through a backend proxy
        const apiKey = process.env ? process.env.RAPIDAPI_KEY : 'YOUR_RAPIDAPI_KEY';
        
        this.headers = {
            'content-type': 'application/json',
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        };
        this.defaultOptions = {
            method: 'POST',
            headers: this.headers,
            redirect: 'follow'
        };
    }

    // Submit code for execution
    async submitCode(sourceCode, languageId, stdin = '') {
        const body = JSON.stringify({
            source_code: sourceCode,
            language_id: languageId,
            stdin: stdin,
            redirect_stderr_to_stdout: true
        });

        try {
            const response = await fetch(`${this.apiUrl}/submissions?base64_encoded=false&wait=false`, {
                ...this.defaultOptions,
                body
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            return data.token;
        } catch (error) {
            console.error('Error submitting code:', error);
            throw error;
        }
    }

    // Get execution result
    async getSubmissionResult(token) {
        try {
            const response = await fetch(`${this.apiUrl}/submissions/${token}?base64_encoded=false`, {
                method: 'GET',
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} - ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting submission result:', error);
            throw error;
        }
    }

    // Poll for results until execution is complete
    async pollSubmissionResult(token, maxAttempts = 10, interval = 1000) {
        let attempts = 0;
        
        const poll = async () => {
            attempts++;
            
            try {
                const result = await this.getSubmissionResult(token);
                
                // Check if the execution is still in progress
                if (result.status && 
                    (result.status.id <= 2 || result.status.description === 'Processing') && 
                    attempts < maxAttempts) {
                    // Wait and then poll again
                    await new Promise(resolve => setTimeout(resolve, interval));
                    return await poll();
                }
                
                return result;
            } catch (error) {
                if (attempts < maxAttempts) {
                    // Wait and then poll again
                    await new Promise(resolve => setTimeout(resolve, interval));
                    return await poll();
                } else {
                    throw error;
                }
            }
        };
        
        return await poll();
    }

    // Format the output for the console
    formatOutput(result) {
        let output = '';
        const status = result.status;
        
        // Add execution status
        if (status) {
            if (status.id > 3) {  // Error statuses start at id 4
                output += `<div class="error">Status: ${status.description}</div>\n`;
            } else {
                output += `<div class="success">Status: ${status.description}</div>\n`;
            }
        }
        
        // Add stdin if available and not empty
        if (result.stdin && result.stdin.trim()) {
            output += `<div class="info">Input:</div>\n${result.stdin}\n`;
        }
        
        // Add stdout if available
        if (result.stdout) {
            output += `<div class="info">Output:</div>\n${result.stdout}\n`;
        }
        
        // Add stderr if available
        if (result.stderr) {
            output += `<div class="error">Error:</div>\n${result.stderr}\n`;
        }
        
        // Add compile output if available
        if (result.compile_output) {
            output += `<div class="warning">Compile Output:</div>\n${result.compile_output}\n`;
        }
        
        // Add message if available
        if (result.message) {
            output += `<div class="info">Message:</div>\n${result.message}\n`;
        }
        
        // Add memory usage if available
        if (result.memory !== null) {
            const memoryInMB = (result.memory / 1024).toFixed(2);
            output += `<div class="execution-time">Memory: ${memoryInMB} MB</div>\n`;
        }
        
        // Add execution time
        if (result.time !== undefined) {
            output += `<div class="execution-time">Execution Time: ${result.time}s</div>\n`;
        }
        
        return output || 'No output';
    }

    // Execute code and get results
    async executeCode(sourceCode, language, stdin = '') {
        const languageId = languageIdMap[language];
        
        if (!languageId) {
            throw new Error(`Unsupported language: ${language}`);
        }
        
        try {
            // Submit the code for execution
            const token = await this.submitCode(sourceCode, languageId, stdin);
            
            // Poll for results
            const result = await this.pollSubmissionResult(token);
            
            // Format the output
            return this.formatOutput(result);
        } catch (error) {
            return `<div class="error">Execution Error: ${error.message}</div>`;
        }
    }
} 
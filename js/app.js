// Main application entry point
document.addEventListener('DOMContentLoaded', () => {
    // Initialize global objects
    window.editor = new CodeEditor();
    window.fileManager = new FileManager();
    window.codeExecutionAPI = new CodeExecutionAPI();
    
    // Get DOM elements
    const runButton = document.getElementById('run-btn');
    const saveButton = document.getElementById('save-btn');
    const downloadButton = document.getElementById('download-btn');
    const newFileButton = document.getElementById('new-file-btn');
    const createFileButton = document.getElementById('create-file-btn');
    const cancelFileButton = document.getElementById('cancel-file-btn');
    const closeModalButton = document.getElementById('close-modal-btn');
    const clearConsoleButton = document.getElementById('clear-console-btn');
    const themeSwitch = document.getElementById('theme-switch');
    const newFileModal = document.getElementById('new-file-modal');
    const loadingOverlay = document.getElementById('loading-overlay');
    const formatButton = document.getElementById('format-btn');
    const findReplaceButton = document.getElementById('find-replace-btn');
    const outputTab = document.getElementById('output-tab');
    const inputTab = document.getElementById('input-tab');
    const outputPanel = document.getElementById('console-output-panel');
    const inputPanel = document.getElementById('console-input-panel');
    
    // Run code button
    runButton.addEventListener('click', async () => {
        executeCode();
    });
    
    // Save button
    saveButton.addEventListener('click', () => {
        fileManager.saveToStorage();
        showToast('Files saved successfully!');
    });
    
    // Download button
    downloadButton.addEventListener('click', () => {
        fileManager.downloadCurrentFile();
    });
    
    // New file button
    newFileButton.addEventListener('click', () => {
        openNewFileModal();
    });
    
    // Create new file button
    createFileButton.addEventListener('click', () => {
        createNewFile();
    });
    
    // Cancel new file button
    cancelFileButton.addEventListener('click', () => {
        closeNewFileModal();
    });
    
    // Close modal button
    closeModalButton.addEventListener('click', () => {
        closeNewFileModal();
    });
    
    // Clear console button
    clearConsoleButton.addEventListener('click', () => {
        if (outputPanel.classList.contains('active')) {
            editor.clearConsole();
        } else {
            editor.clearStdinInput();
        }
    });
    
    // Theme switch
    themeSwitch.addEventListener('change', () => {
        toggleTheme();
    });
    
    // Format button
    formatButton.addEventListener('click', () => {
        editor.formatCode();
    });
    
    // Find and replace button
    findReplaceButton.addEventListener('click', () => {
        editor.showFindReplace();
    });
    
    // Console tabs
    outputTab.addEventListener('click', () => {
        activateTab(outputTab, outputPanel);
    });
    
    inputTab.addEventListener('click', () => {
        activateTab(inputTab, inputPanel);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+S = Save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            fileManager.saveToStorage();
            showToast('Files saved successfully!');
        }
        
        // Ctrl+Enter = Run
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            executeCode();
        }
    });
    
    // Execute code function
    async function executeCode() {
        // Check if there's an active file
        if (!fileManager.activeFileId) {
            showToast('No file selected to run!', 'error');
            return;
        }
        
        const file = fileManager.getFile(fileManager.activeFileId);
        const code = editor.getValue();
        const stdin = editor.getStdinInput();
        
        if (!code.trim()) {
            showToast('No code to execute!', 'error');
            return;
        }
        
        // Show loading overlay
        loadingOverlay.classList.add('show');
        
        try {
            // Clear console first
            editor.clearConsole();
            
            // Switch to output tab
            activateTab(outputTab, outputPanel);
            
            // Execute code via API
            const output = await codeExecutionAPI.executeCode(code, file.language, stdin);
            
            // Display output
            editor.setConsoleOutput(output);
        } catch (error) {
            editor.setConsoleOutput(`<div class="error">Error: ${error.message}</div>`);
        } finally {
            // Hide loading overlay
            loadingOverlay.classList.remove('show');
        }
    }
    
    // Open new file modal
    function openNewFileModal() {
        // Reset form
        document.getElementById('file-name').value = '';
        
        // Set default language
        const languageSelect = document.getElementById('file-language');
        languageSelect.value = 'python'; // Default to Python
        
        // Show modal
        newFileModal.classList.add('show');
    }
    
    // Close new file modal
    function closeNewFileModal() {
        newFileModal.classList.remove('show');
    }
    
    // Create new file
    function createNewFile() {
        const fileName = document.getElementById('file-name').value;
        const language = document.getElementById('file-language').value;
        const template = document.getElementById('template-select').value;
        
        if (!fileName) {
            showToast('Please enter a file name!', 'error');
            return;
        }
        
        // Get template content
        const templateContent = codeTemplates[language]?.[template] || '';
        
        // Create the file
        fileManager.createFile(fileName, language, templateContent);
        
        // Close modal
        closeNewFileModal();
        
        // Show success toast
        showToast(`File "${fileName}" created successfully!`, 'success');
    }
    
    // Toggle theme
    function toggleTheme() {
        const isDarkTheme = themeSwitch.checked;
        
        if (isDarkTheme) {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            editor.setTheme('dark');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            editor.setTheme('light');
        }
        
        // Save theme preference
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    }
    
    // Activate tab in console
    function activateTab(tabElement, panelElement) {
        // Deactivate all tabs and panels
        document.querySelectorAll('.console-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.console-content').forEach(panel => panel.classList.remove('active'));
        
        // Activate the selected tab and panel
        tabElement.classList.add('active');
        panelElement.classList.add('active');
    }
    
    // Show toast notification
    function showToast(message, type = 'success') {
        // Create toast element if it doesn't exist
        let toast = document.getElementById('toast');
        
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            document.body.appendChild(toast);
            
            // Add toast styles if not in CSS
            if (!document.querySelector('style#toast-style')) {
                const style = document.createElement('style');
                style.id = 'toast-style';
                style.innerHTML = `
                    #toast {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        padding: 10px 20px;
                        border-radius: 4px;
                        color: white;
                        font-weight: bold;
                        z-index: 9999;
                        opacity: 0;
                        transition: opacity 0.3s;
                    }
                    #toast.show {
                        opacity: 1;
                    }
                    #toast.success {
                        background-color: var(--success);
                    }
                    #toast.error {
                        background-color: var(--error);
                    }
                    #toast.warning {
                        background-color: var(--warning);
                    }
                    #toast.info {
                        background-color: var(--info);
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Clear any existing timeout
        if (toast.timeoutId) {
            clearTimeout(toast.timeoutId);
        }
        
        // Set toast content and type
        toast.textContent = message;
        toast.className = type;
        toast.classList.add('show');
        
        // Auto-hide after 3 seconds
        toast.timeoutId = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Initialize editor with a default file if none exists
    if (fileManager.files.length === 0) {
        fileManager.createFile('main.py', 'python', codeTemplates.python.basic);
    }
    
    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    themeSwitch.checked = savedTheme === 'dark';
    
    // Set initial theme
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        editor.setTheme('light');
    }
    
    // Make window.showToast available globally
    window.showToast = showToast;
    
    // Modal close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === newFileModal) {
            closeNewFileModal();
        }
    });
}); 
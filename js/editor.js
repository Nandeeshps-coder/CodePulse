// Editor class for CodeMirror integration
class CodeEditor {
    constructor() {
        this.editorElement = document.getElementById('editor-wrapper');
        this.consoleOutput = document.getElementById('console-output');
        this.theme = document.body.classList.contains('dark-theme') ? 'dracula' : 'eclipse';
        
        // Initialize CodeMirror
        this.initCodeMirror();
        
        // Set up resize functionality
        this.initResizablePanel();
    }
    
    // Initialize CodeMirror editor
    initCodeMirror() {
        this.instance = CodeMirror(this.editorElement, {
            mode: 'text/x-python',
            theme: this.theme,
            lineNumbers: true,
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: false,
            autoCloseBrackets: true,
            matchBrackets: true,
            lineWrapping: true,
            // Code folding options
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            extraKeys: {
                'Ctrl-Space': 'autocomplete',
                'Ctrl-/': 'toggleComment',
                'Ctrl-F': 'findPersistent',
                'Ctrl-H': 'replace',
                'Ctrl-G': 'findNext',
                'Shift-Ctrl-G': 'findPrev',
                'Shift-Ctrl-F': 'replace',
                'Shift-Ctrl-R': 'replaceAll',
                'Tab': (cm) => {
                    if (cm.somethingSelected()) {
                        cm.indentSelection('add');
                    } else {
                        cm.replaceSelection('    ', 'end');
                    }
                }
            }
        });
        
        // Auto-resize on window resize
        window.addEventListener('resize', () => {
            this.instance.refresh();
        });
        
        // Set initial content
        this.instance.setValue('# Start coding here...');
        
        // Set up change event to save content
        this.instance.on('change', () => {
            if (fileManager.activeFileId) {
                fileManager.updateFileContent(
                    fileManager.activeFileId, 
                    this.instance.getValue()
                );
            }
        });
    }
    
    // Initialize resizable panel
    initResizablePanel() {
        const editorContainer = document.querySelector('.editor-container');
        const consolePanel = document.querySelector('.console-panel');
        const resizeHandle = document.getElementById('resize-handle');
        
        let startY, startHeight, startConsoleHeight;
        
        const startResize = (e) => {
            startY = e.clientY;
            startHeight = editorContainer.offsetHeight;
            startConsoleHeight = consolePanel.offsetHeight;
            
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
            
            // Prevent text selection during resize
            document.body.style.userSelect = 'none';
        };
        
        const resize = (e) => {
            const deltaY = e.clientY - startY;
            
            // Update heights
            const newEditorHeight = startHeight - deltaY;
            const newConsoleHeight = startConsoleHeight + deltaY;
            
            // Apply minimum heights
            const minHeight = 100;
            
            if (newEditorHeight > minHeight && newConsoleHeight > minHeight) {
                editorContainer.style.height = `${newEditorHeight}px`;
                consolePanel.style.height = `${newConsoleHeight}px`;
                
                // Refresh CodeMirror
                this.instance.refresh();
            }
        };
        
        const stopResize = () => {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
            document.body.style.userSelect = '';
        };
        
        // Add event listener to resize handle
        resizeHandle.addEventListener('mousedown', startResize);
    }
    
    // Format the code in the editor based on language
    formatCode() {
        const code = this.getValue();
        let formattedCode = code;
        
        // Get the current file's language
        const file = fileManager.getFile(fileManager.activeFileId);
        if (!file) return;
        
        const language = file.language;
        
        try {
            switch (language) {
                case 'javascript':
                    formattedCode = js_beautify(code, { 
                        indent_size: 4,
                        indent_with_tabs: false,
                        preserve_newlines: true,
                        max_preserve_newlines: 2
                    });
                    break;
                case 'html':
                    formattedCode = html_beautify(code, { 
                        indent_size: 4,
                        indent_with_tabs: false,
                        wrap_line_length: 100
                    });
                    break;
                case 'css':
                    formattedCode = css_beautify(code, { 
                        indent_size: 4,
                        indent_with_tabs: false
                    });
                    break;
                case 'python':
                    // For Python, we don't have js-beautify support, so we rely on the
                    // user having properly indented code. We could add a Python formatter
                    // library in the future.
                    showToast('Python formatting is coming soon!', 'info');
                    break;
                default:
                    showToast(`Formatting for ${language} is not supported yet.`, 'info');
                    break;
            }
            
            // Set the formatted code
            this.setValue(formattedCode);
            showToast('Code formatted successfully!', 'success');
        } catch (error) {
            console.error('Error formatting code:', error);
            showToast('Error formatting code. Please try again.', 'error');
        }
    }
    
    // Show the find/replace dialog
    showFindReplace() {
        this.instance.execCommand('findPersistent');
    }
    
    // Set the editor theme
    setTheme(theme) {
        this.theme = theme === 'dark' ? 'dracula' : 'eclipse';
        this.instance.setOption('theme', this.theme);
    }
    
    // Get the editor content
    getValue() {
        return this.instance.getValue();
    }
    
    // Set the editor content
    setValue(content) {
        this.instance.setValue(content || '');
    }
    
    // Set the editor language mode
    setMode(mode) {
        this.instance.setOption('mode', mode);
    }
    
    // Clear the console output
    clearConsole() {
        this.consoleOutput.innerHTML = '';
    }
    
    // Append text to the console
    appendToConsole(text) {
        this.consoleOutput.innerHTML += text;
        this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
    }
    
    // Set console output text
    setConsoleOutput(text) {
        this.consoleOutput.innerHTML = text;
        this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
    }
    
    // Get the STDIN input
    getStdinInput() {
        return document.getElementById('stdin-input').value;
    }
    
    // Clear the STDIN input
    clearStdinInput() {
        document.getElementById('stdin-input').value = '';
    }
    
    // Focus the editor
    focus() {
        this.instance.focus();
    }
    
    // Refresh the editor (useful after resize)
    refresh() {
        this.instance.refresh();
    }
} 
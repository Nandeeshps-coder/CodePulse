// File manager class for handling files
class FileManager {
    constructor() {
        this.files = [];
        this.activeFileId = null;
        this.fileCounter = 0;
        this.storage = localStorage;
        
        // DOM elements
        this.fileListElement = document.getElementById('file-list');
        this.tabsContainer = document.getElementById('tabs-container');
        
        // Load saved files from localStorage
        this.loadFromStorage();
    }
    
    // Generate a unique file ID
    generateFileId() {
        return `file-${Date.now()}-${this.fileCounter++}`;
    }
    
    // Create a new file
    createFile(fileName, language, content = '') {
        const fileId = this.generateFileId();
        const extension = languageConfig[language]?.extension || '.txt';
        
        // Ensure the filename has the correct extension
        if (!fileName.endsWith(extension)) {
            fileName = fileName + extension;
        }
        
        const newFile = {
            id: fileId,
            name: fileName,
            language: language,
            content: content,
            lastModified: new Date().toISOString()
        };
        
        this.files.push(newFile);
        this.renderFileItem(newFile);
        this.renderTab(newFile);
        this.setActiveFile(fileId);
        this.saveToStorage();
        
        return newFile;
    }
    
    // Update file content
    updateFileContent(fileId, content) {
        const file = this.getFile(fileId);
        if (file) {
            file.content = content;
            file.lastModified = new Date().toISOString();
            this.saveToStorage();
        }
    }
    
    // Delete a file
    deleteFile(fileId) {
        const fileIndex = this.files.findIndex(file => file.id === fileId);
        if (fileIndex !== -1) {
            this.files.splice(fileIndex, 1);
            
            // Remove file from DOM
            const fileElement = document.getElementById(`file-item-${fileId}`);
            if (fileElement) {
                fileElement.remove();
            }
            
            // Remove tab from DOM
            const tabElement = document.getElementById(`tab-${fileId}`);
            if (tabElement) {
                tabElement.remove();
            }
            
            // Set a new active file if the deleted file was active
            if (this.activeFileId === fileId) {
                if (this.files.length > 0) {
                    this.setActiveFile(this.files[0].id);
                } else {
                    this.activeFileId = null;
                    editor.setValue('');
                }
            }
            
            this.saveToStorage();
        }
    }
    
    // Get file by ID
    getFile(fileId) {
        return this.files.find(file => file.id === fileId);
    }
    
    // Set the active file
    setActiveFile(fileId) {
        // Remove active class from previous file and tab
        if (this.activeFileId) {
            const prevFileElement = document.getElementById(`file-item-${this.activeFileId}`);
            const prevTabElement = document.getElementById(`tab-${this.activeFileId}`);
            
            if (prevFileElement) {
                prevFileElement.classList.remove('active');
            }
            
            if (prevTabElement) {
                prevTabElement.classList.remove('active');
            }
        }
        
        // Set new active file
        this.activeFileId = fileId;
        const file = this.getFile(fileId);
        
        if (file) {
            // Update the file item in the sidebar
            const fileElement = document.getElementById(`file-item-${fileId}`);
            if (fileElement) {
                fileElement.classList.add('active');
            }
            
            // Update the tab
            const tabElement = document.getElementById(`tab-${fileId}`);
            if (tabElement) {
                tabElement.classList.add('active');
            }
            
            // Update the editor content and language
            editor.setValue(file.content);
            editor.setOption('mode', languageConfig[file.language].mimeType);
        }
    }
    
    // Render file item in the sidebar
    renderFileItem(file) {
        const fileIcon = fileIcons[file.language] || fileIcons.default;
        
        const fileElement = document.createElement('div');
        fileElement.id = `file-item-${file.id}`;
        fileElement.className = 'file-item';
        fileElement.innerHTML = `
            <i class="${fileIcon} file-icon"></i>
            <span>${file.name}</span>
        `;
        
        fileElement.addEventListener('click', () => {
            this.setActiveFile(file.id);
        });
        
        this.fileListElement.appendChild(fileElement);
    }
    
    // Render tab for the file
    renderTab(file) {
        const fileIcon = fileIcons[file.language] || fileIcons.default;
        
        const tabElement = document.createElement('div');
        tabElement.id = `tab-${file.id}`;
        tabElement.className = 'tab';
        tabElement.innerHTML = `
            <i class="${fileIcon} tab-icon"></i>
            <span>${file.name}</span>
            <i class="fa-solid fa-times tab-close"></i>
        `;
        
        // Add click event to activate the tab
        tabElement.addEventListener('click', (e) => {
            // If not clicking on the close button
            if (!e.target.classList.contains('tab-close')) {
                this.setActiveFile(file.id);
            }
        });
        
        // Add close button event
        const closeButton = tabElement.querySelector('.tab-close');
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteFile(file.id);
        });
        
        this.tabsContainer.appendChild(tabElement);
    }
    
    // Save files to localStorage
    saveToStorage() {
        try {
            this.storage.setItem('codeEditorFiles', JSON.stringify(this.files));
            this.storage.setItem('codeEditorActiveFile', this.activeFileId);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }
    
    // Load files from localStorage
    loadFromStorage() {
        try {
            const savedFiles = this.storage.getItem('codeEditorFiles');
            const activeFileId = this.storage.getItem('codeEditorActiveFile');
            
            if (savedFiles) {
                this.files = JSON.parse(savedFiles);
                
                // Render files and tabs
                this.fileListElement.innerHTML = '';
                this.tabsContainer.innerHTML = '';
                
                this.files.forEach(file => {
                    this.renderFileItem(file);
                    this.renderTab(file);
                });
                
                // Set active file
                if (activeFileId && this.getFile(activeFileId)) {
                    this.setActiveFile(activeFileId);
                } else if (this.files.length > 0) {
                    this.setActiveFile(this.files[0].id);
                }
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            // Clear corrupted data
            this.storage.removeItem('codeEditorFiles');
            this.storage.removeItem('codeEditorActiveFile');
        }
    }
    
    // Download the current file
    downloadCurrentFile() {
        const file = this.getFile(this.activeFileId);
        if (!file) return;
        
        const blob = new Blob([file.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    // Download all files as a zip
    downloadAllFiles() {
        if (!this.files.length) return;
        
        // Use JSZip library if available
        if (typeof JSZip !== 'undefined') {
            const zip = new JSZip();
            
            this.files.forEach(file => {
                zip.file(file.name, file.content);
            });
            
            zip.generateAsync({ type: 'blob' }).then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'code-editor-files.zip';
                a.click();
                URL.revokeObjectURL(url);
            });
        } else {
            // Fallback to downloading current file only
            this.downloadCurrentFile();
        }
    }
    
    // Change the language of the current file
    changeLanguage(language) {
        const file = this.getFile(this.activeFileId);
        if (!file) return;
        
        // Update file extension
        const oldExtension = languageConfig[file.language]?.extension || '.txt';
        const newExtension = languageConfig[language]?.extension || '.txt';
        
        let fileName = file.name;
        if (fileName.endsWith(oldExtension)) {
            fileName = fileName.substring(0, fileName.length - oldExtension.length) + newExtension;
        }
        
        // Update file
        file.language = language;
        file.name = fileName;
        file.lastModified = new Date().toISOString();
        
        // Update DOM
        const fileElement = document.getElementById(`file-item-${file.id}`);
        if (fileElement) {
            const fileIcon = fileIcons[language] || fileIcons.default;
            fileElement.querySelector('.file-icon').className = `${fileIcon} file-icon`;
            fileElement.querySelector('span').textContent = fileName;
        }
        
        const tabElement = document.getElementById(`tab-${file.id}`);
        if (tabElement) {
            const fileIcon = fileIcons[language] || fileIcons.default;
            tabElement.querySelector('.tab-icon').className = `${fileIcon} tab-icon`;
            tabElement.querySelector('span').textContent = fileName;
        }
        
        // Update editor mode
        editor.setOption('mode', languageConfig[language].mimeType);
        
        this.saveToStorage();
    }
} 
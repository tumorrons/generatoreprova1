/**
 * Universal Project Builder v2.0 - Main Application
 * Orchestrates all modules and manages application state
 */

// Import core modules
import { CodeExtractor } from './core/CodeExtractor.js';
import { FileOrganizer } from './core/FileOrganizer.js';
import { ProjectGenerator } from './core/ProjectGenerator.js';
import { UIManager } from './core/UIManager.js';

// Import specialized modules
import { AndroidBuilder } from './modules/AndroidBuilder.js';
import { WebBuilder } from './modules/WebBuilder.js';
import { ZipBuilder } from './modules/ZipBuilder.js';

// Import utilities
import { Helpers } from './utils/helpers.js';
import { Validators } from './utils/validators.js';
import { Constants } from './utils/constants.js';

/**
 * Main Application Class
 * Coordinates all modules and manages global state
 */
class UniversalProjectBuilder {
    constructor() {
        console.log('🚀 Initializing Universal Project Builder v2.0');
        
        // Initialize core modules
        this.codeExtractor = new CodeExtractor();
        this.fileOrganizer = new FileOrganizer();
        this.projectGenerator = new ProjectGenerator();
        this.uiManager = new UIManager();
        
        // Initialize specialized builders
        this.androidBuilder = new AndroidBuilder();
        this.webBuilder = new WebBuilder();
        this.zipBuilder = new ZipBuilder();
        
        // Application state
        this.state = {
            currentTab: 'extractor',
            extractedFiles: [],
            organizedFiles: [],
            projectConfig: null,
            generatedProject: null,
            workflowHistory: [],
            isProcessing: false
        };
        
        // Workflow definitions
        this.workflows = {
            codeToFiles: {
                name: 'Code to Files',
                steps: ['extract', 'organize', 'download'],
                description: 'Estrai file da codice e organizzali'
            },
            androidProject: {
                name: 'Android Project',
                steps: ['extract', 'validate_android', 'generate_android', 'package'],
                description: 'Genera progetto Android completo'
            },
            webProject: {
                name: 'Web Project', 
                steps: ['extract', 'validate_web', 'generate_web', 'package'],
                description: 'Genera progetto web completo'
            },
            customOrganization: {
                name: 'Custom Organization',
                steps: ['load_files', 'apply_config', 'validate', 'export'],
                description: 'Organizzazione personalizzata con JSON'
            }
        };
        
        this.init();
    }
    
    /**
     * Initialize application
     */
    async init() {
        console.log('⚙️ Setting up Universal Project Builder...');
        
        try {
            // Initialize UI
            await this.uiManager.initialize();
            
            // Bind global events
            this.bindEvents();
            
            // Load saved state if exists
            this.loadSavedState();
            
            // Update UI
            this.updateUI();
            
            console.log('✅ Universal Project Builder ready!');
            this.showNotification('🎉 Universal Project Builder v2.0 caricato!', 'success');
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showNotification('❌ Errore di inizializzazione', 'error');
        }
    }
    
    /**
     * Bind global event listeners
     */
    bindEvents() {
        // Tab navigation
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // Code extraction
        const extractBtn = document.getElementById('extractCodeBtn');
        if (extractBtn) {
            extractBtn.addEventListener('click', () => this.extractCode());
        }
        
        // File upload
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e.target.files));
        }
        
        // Drag and drop
        const uploadArea = document.querySelector('.upload-area');
        if (uploadArea) {
            uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
            uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        }
        
        // Configuration management
        const loadConfigBtn = document.getElementById('loadConfigBtn');
        if (loadConfigBtn) {
            loadConfigBtn.addEventListener('click', () => this.loadConfiguration());
        }
        
        // Project generation
        const generateBtn = document.getElementById('generateProjectBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateProject());
        }
        
        // Download actions
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadResult());
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
    }
    
    /**
     * Switch between tabs
     * @param {string} tabName - Tab to switch to
     */
    switchTab(tabName) {
        console.log(`🔄 Switching to tab: ${tabName}`);
        
        // Update state
        this.state.currentTab = tabName;
        
        // Update UI
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
        
        // Load tab-specific data if needed
        this.loadTabData(tabName);
        
        // Save state
        this.saveState();
    }
    
    /**
     * Load data specific to a tab
     * @param {string} tabName - Tab name
     */
    async loadTabData(tabName) {
        switch (tabName) {
            case 'config':
                this.loadAvailableTemplates();
                break;
            case 'android':
                this.loadAndroidTemplates();
                break;
            case 'web':
                this.loadWebTemplates();
                break;
        }
    }
    
    /**
     * Extract code from textarea
     */
    async extractCode() {
        console.log('🔍 Starting code extraction...');
        
        const codeInput = document.getElementById('codeInput');
        const autoDetectLanguage = document.getElementById('autoDetectLanguage')?.checked ?? true;
        const generateConfig = document.getElementById('generateConfig')?.checked ?? true;
        
        if (!codeInput || !codeInput.value.trim()) {
            this.showNotification('❌ Inserisci del codice da estrarre', 'error');
            return;
        }
        
        try {
            this.setProcessing(true, 'Estrazione file in corso...');
            
            // Extract files using CodeExtractor
            const extractedFiles = this.codeExtractor.extractFiles(codeInput.value, {
                autoDetectLanguage,
                generateConfig,
                cleanCode: true,
                validateSyntax: false
            });
            
            // Update state
            this.state.extractedFiles = extractedFiles;
            
            // Display results
            this.displayExtractedFiles(extractedFiles);
            
            // Get and display statistics
            const stats = this.codeExtractor.getStats();
            this.displayExtractionStats(stats);
            
            // Log workflow step
            this.logWorkflowStep('extract', {
                filesExtracted: extractedFiles.length,
                projectType: stats.projectType,
                mainLanguage: stats.mostCommonLanguage
            });
            
            this.showNotification(
                `✅ ${extractedFiles.length} file estratti con successo!`, 
                'success'
            );
            
            console.log('✅ Code extraction completed');
            
        } catch (error) {
            console.error('❌ Code extraction failed:', error);
            this.showNotification(`❌ Errore nell'estrazione: ${error.message}`, 'error');
        } finally {
            this.setProcessing(false);
        }
    }
    
    /**
     * Handle file upload
     * @param {FileList} files - Uploaded files
     */
    async handleFileUpload(files) {
        console.log(`📁 Processing ${files.length} uploaded files...`);
        
        try {
            this.setProcessing(true, 'Caricamento file...');
            
            const uploadedFiles = [];
            
            for (const file of files) {
                // Validate file
                if (!this.validateUploadedFile(file)) {
                    continue;
                }
                
                // Read file content
                const content = await this.readFileContent(file);
                
                // Create file object
                const fileObj = {
                    id: Helpers.generateId(),
                    fileName: file.name,
                    extension: Helpers.getFileExtension(file.name),
                    content: content,
                    size: file.size,
                    lastModified: file.lastModified,
                    uploaded: true,
                    created: new Date().toISOString()
                };
                
                uploadedFiles.push(fileObj);
            }
            
            // Load files into organizer
            this.fileOrganizer.loadFiles(uploadedFiles);
            this.state.organizedFiles = uploadedFiles;
            
            // Display uploaded files
            this.displayUploadedFiles(uploadedFiles);
            
            this.showNotification(
                `✅ ${uploadedFiles.length} file caricati con successo!`, 
                'success'
            );
            
        } catch (error) {
            console.error('❌ File upload failed:', error);
            this.showNotification(`❌ Errore nel caricamento: ${error.message}`, 'error');
        } finally {
            this.setProcessing(false);
        }
    }
    
    /**
     * Load configuration from JSON
     */
    async loadConfiguration() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                this.setProcessing(true, 'Caricamento configurazione...');
                
                const content = await this.readFileContent(file);
                const config = JSON.parse(content);
                
                // Validate configuration
                const validation = this.fileOrganizer.validateAndNormalizeConfig(config);
                
                if (!validation.isValid) {
                    throw new Error(validation.errors.join(', '));
                }
                
                // Load configuration
                this.fileOrganizer.loadConfig(config);
                this.state.projectConfig = config;
                
                // Display configuration in editor
                this.displayConfigInEditor(config);
                
                // Show warnings if any
                if (validation.warnings.length > 0) {
                    this.showNotification(
                        `⚠️ Configurazione caricata con avvisi: ${validation.warnings.join(', ')}`, 
                        'warning'
                    );
                } else {
                    this.showNotification('✅ Configurazione caricata con successo!', 'success');
                }
                
            } catch (error) {
                console.error('❌ Configuration loading failed:', error);
                this.showNotification(`❌ Errore nella configurazione: ${error.message}`, 'error');
            } finally {
                this.setProcessing(false);
            }
        };
        
        input.click();
    }
    
    /**
     * Generate project based on current workflow
     */
    async generateProject() {
        console.log('🚀 Starting project generation...');
        
        try {
            this.setProcessing(true, 'Generazione progetto...');
            
            // Determine project type and workflow
            const projectType = this.determineProjectType();
            const workflow = this.workflows[projectType + 'Project'] || this.workflows.codeToFiles;
            
            console.log(`📋 Using workflow: ${workflow.name}`);
            
            // Execute workflow steps
            for (const step of workflow.steps) {
                await this.executeWorkflowStep(step, projectType);
            }
            
            this.showNotification('✅ Progetto generato con successo!', 'success');
            
        } catch (error) {
            console.error('❌ Project generation failed:', error);
            this.showNotification(`❌ Errore nella generazione: ${error.message}`, 'error');
        } finally {
            this.setProcessing(false);
        }
    }
    
    /**
     * Execute a specific workflow step
     * @param {string} step - Step name
     * @param {string} projectType - Project type
     */
    async executeWorkflowStep(step, projectType) {
        console.log(`📋 Executing step: ${step}`);
        
        switch (step) {
            case 'extract':
                if (this.state.extractedFiles.length === 0) {
                    await this.extractCode();
                }
                break;
                
            case 'organize':
                if (this.state.projectConfig) {
                    await this.organizeFiles();
                }
                break;
                
            case 'validate_android':
                this.validateAndroidProject();
                break;
                
            case 'validate_web':
                this.validateWebProject();
                break;
                
            case 'generate_android':
                await this.generateAndroidProject();
                break;
                
            case 'generate_web':
                await this.generateWebProject();
                break;
                
            case 'package':
                await this.packageProject();
                break;
                
            case 'download':
                await this.downloadResult();
                break;
                
            default:
                console.warn(`⚠️ Unknown workflow step: ${step}`);
        }
        
        // Log step completion
        this.logWorkflowStep(step, { projectType, timestamp: new Date().toISOString() });
    }
    
    /**
     * Organize files using current configuration
     */
    async organizeFiles() {
        if (!this.state.projectConfig) {
            throw new Error('Nessuna configurazione caricata');
        }
        
        const filesToOrganize = this.state.extractedFiles.length > 0 ? 
            this.state.extractedFiles : this.state.organizedFiles;
        
        if (filesToOrganize.length === 0) {
            throw new Error('Nessun file da organizzare');
        }
        
        // Load files into organizer if not already loaded
        if (this.fileOrganizer.files.length === 0) {
            this.fileOrganizer.loadFiles(filesToOrganize);
        }
        
        // Execute organization
        const organizedFiles = await this.fileOrganizer.organizeFiles({
            dryRun: false,
            validateResults: true,
            generateReport: true
        });
        
        this.state.organizedFiles = organizedFiles;
        
        // Display results
        this.displayOrganizedFiles(organizedFiles);
        
        console.log(`✅ ${organizedFiles.length} file organizzati`);
    }
    
    /**
     * Generate Android project
     */
    async generateAndroidProject() {
        const projectConfig = this.getAndroidProjectConfig();
        
        // Use AndroidBuilder to generate project
        const androidProject = await this.androidBuilder.generateProject({
            ...projectConfig,
            files: this.state.organizedFiles.length > 0 ? 
                this.state.organizedFiles : this.state.extractedFiles
        });
        
        this.state.generatedProject = androidProject;
        
        console.log('✅ Android project generated');
    }
    
    /**
     * Generate Web project
     */
    async generateWebProject() {
        const projectConfig = this.getWebProjectConfig();
        
        // Use WebBuilder to generate project
        const webProject = await this.webBuilder.generateProject({
            ...projectConfig,
            files: this.state.organizedFiles.length > 0 ? 
                this.state.organizedFiles : this.state.extractedFiles
        });
        
        this.state.generatedProject = webProject;
        
        console.log('✅ Web project generated');
    }
    
    /**
     * Package project into ZIP
     */
    async packageProject() {
        const filesToPackage = this.state.generatedProject || 
            this.state.organizedFiles.length > 0 ? 
            this.state.organizedFiles : this.state.extractedFiles;
        
        if (filesToPackage.length === 0) {
            throw new Error('Nessun file da impacchettare');
        }
        
        // Create ZIP using ZipBuilder
        const zipBlob = await this.zipBuilder.createProjectZip(filesToPackage, {
            projectName: this.getProjectName(),
            includeConfig: true,
            compression: 'medium'
        });
        
        this.state.packagedProject = zipBlob;
        
        console.log('✅ Project packaged');
    }
    
    /**
     * Download final result
     */
    async downloadResult() {
        if (this.state.packagedProject) {
            // Download packaged ZIP
            this.downloadBlob(this.state.packagedProject, `${this.getProjectName()}.zip`);
        } else {
            // Download individual files
            const filesToDownload = this.state.organizedFiles.length > 0 ? 
                this.state.organizedFiles : this.state.extractedFiles;
            
            if (filesToDownload.length === 0) {
                this.showNotification('❌ Nessun file da scaricare', 'error');
                return;
            }
            
            // Create simple ZIP with files
            const zipBlob = await this.zipBuilder.createSimpleZip(filesToDownload);
            this.downloadBlob(zipBlob, `extracted-files-${Date.now()}.zip`);
        }
        
        this.showNotification('✅ Download avviato!', 'success');
    }
    
    /**
     * Determine project type from extracted files
     * @returns {string} Project type
     */
    determineProjectType() {
        const stats = this.codeExtractor.getStats();
        
        if (stats.projectType === 'android') {
            return 'android';
        } else if (stats.projectType === 'web') {
            return 'web';
        } else {
            return 'generic';
        }
    }
    
    /**
     * Get Android project configuration from UI
     * @returns {Object} Android config
     */
    getAndroidProjectConfig() {
        return {
            appName: document.getElementById('androidAppName')?.value || 'MyApp',
            packageName: document.getElementById('androidPackage')?.value || 'com.example.myapp',
            gradleVersion: document.getElementById('androidGradleVersion')?.value || '8.1.1',
            kotlinVersion: document.getElementById('androidKotlinVersion')?.value || '1.9.0',
            selectedActivities: this.getSelectedActivities()
        };
    }
    
    /**
     * Get Web project configuration from UI
     * @returns {Object} Web config
     */
    getWebProjectConfig() {
        return {
            projectName: document.getElementById('webProjectName')?.value || 'my-web-app',
            projectType: document.getElementById('webProjectType')?.value || 'vanilla',
            cssFramework: document.getElementById('webCssFramework')?.value || 'none',
            features: this.getSelectedWebFeatures()
        };
    }
    
    /**
     * Get selected Android activities
     * @returns {Array} Selected activities
     */
    getSelectedActivities() {
        const checkboxes = document.querySelectorAll('#android input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }
    
    /**
     * Get selected web features
     * @returns {Array} Selected features
     */
    getSelectedWebFeatures() {
        const checkboxes = document.querySelectorAll('#web input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }
    
    /**
     * Get project name
     * @returns {string} Project name
     */
    getProjectName() {
        if (this.state.projectConfig?.projectName) {
            return this.state.projectConfig.projectName;
        }
        
        const stats = this.codeExtractor.getStats();
        return `${stats.projectType || 'generic'}-project-${Date.now()}`;
    }
    
    /**
     * Validate Android project
     */
    validateAndroidProject() {
        const hasKotlinFiles = this.state.extractedFiles.some(f => f.extension === 'kt');
        const hasJavaFiles = this.state.extractedFiles.some(f => f.extension === 'java');
        
        if (!hasKotlinFiles && !hasJavaFiles) {
            throw new Error('Nessun file Kotlin o Java trovato per progetto Android');
        }
        
        console.log('✅ Android project validation passed');
    }
    
    /**
     * Validate Web project
     */
    validateWebProject() {
        const hasWebFiles = this.state.extractedFiles.some(f => 
            ['html', 'css', 'js', 'jsx', 'ts', 'tsx'].includes(f.extension)
        );
        
        if (!hasWebFiles) {
            throw new Error('Nessun file web trovato');
        }
        
        console.log('✅ Web project validation passed');
    }
    
    // UI Update Methods
    
    /**
     * Display extracted files in UI
     * @param {Array} files - Extracted files
     */
    displayExtractedFiles(files) {
        const container = document.getElementById('extractResults');
        if (!container) return;
        
        container.innerHTML = files.map(file => `
            <div class="file-card">
                <div class="file-header">
                    <span class="file-name">${file.fileName}</span>
                    <span class="file-type">${file.extension.toUpperCase()}</span>
                </div>
                <div class="file-info">
                    <span>📏 ${file.lines} righe</span>
                    <span>📊 ${Helpers.formatFileSize(file.size)}</span>
                    <span>🔤 ${file.language || 'unknown'}</span>
                </div>
                <div class="file-actions">
                    <button class="btn btn-sm" onclick="app.downloadFile('${file.id}')">
                        💾 Scarica
                    </button>
                    <button class="btn btn-sm" onclick="app.previewFile('${file.id}')">
                        👁️ Anteprima
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * Display extraction statistics
     * @param {Object} stats - Statistics object
     */
    displayExtractionStats(stats) {
        const container = document.getElementById('extractionStats');
        if (!container) return;
        
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number">${stats.totalFiles}</div>
                    <div class="stat-label">File Estratti</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${Helpers.formatFileSize(stats.totalSize)}</div>
                    <div class="stat-label">Dimensione Totale</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${stats.mostCommonLanguage}</div>
                    <div class="stat-label">Linguaggio Principale</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${stats.projectType}</div>
                    <div class="stat-label">Tipo Progetto</div>
                </div>
            </div>
        `;
    }
    
    /**
     * Display uploaded files
     * @param {Array} files - Uploaded files
     */
    displayUploadedFiles(files) {
        const container = document.getElementById('organizerFiles');
        if (!container) return;
        
        container.innerHTML = `
            <div class="files-header">
                <h3>📁 File Caricati (${files.length})</h3>
                <button class="btn btn-secondary" onclick="app.clearUploadedFiles()">
                    🗑️ Pulisci
                </button>
            </div>
            <div class="files-grid">
                ${files.map(file => `
                    <div class="file-item">
                        <div class="file-icon">${this.getFileIcon(file.extension)}</div>
                        <div class="file-details">
                            <div class="file-name">${file.fileName}</div>
                            <div class="file-meta">${Helpers.formatFileSize(file.size)}</div>
                        </div>
                        <button class="btn btn-sm" onclick="app.removeUploadedFile('${file.id}')">
                            ❌
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * Display organized files
     * @param {Array} files - Organized files
     */
    displayOrganizedFiles(files) {
        const container = document.getElementById('organizationResults');
        if (!container) return;
        
        // Group files by status
        const grouped = this.groupFilesByStatus(files);
        
        container.innerHTML = Object.entries(grouped).map(([status, statusFiles]) => `
            <div class="status-group">
                <h4>${this.getStatusLabel(status)} (${statusFiles.length})</h4>
                <div class="files-list">
                    ${statusFiles.map(file => `
                        <div class="file-item organized">
                            <span class="file-path">${file.currentPath}</span>
                            <span class="operations-count">${file.operations.length} operazioni</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
    
    /**
     * Display configuration in editor
     * @param {Object} config - Configuration object
     */
    displayConfigInEditor(config) {
        const editor = document.getElementById('configEditor');
        if (editor) {
            editor.value = JSON.stringify(config, null, 2);
        }
    }
    
    // Utility Methods
    
    /**
     * Read file content as text
     * @param {File} file - File to read
     * @returns {Promise<string>} File content
     */
    readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
            reader.readAsText(file);
        });
    }
    
    /**
     * Validate uploaded file
     * @param {File} file - File to validate
     * @returns {boolean} Is valid
     */
    validateUploadedFile(file) {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showNotification(`❌ File troppo grande: ${file.name}`, 'error');
            return false;
        }
        
        // Check file type
        const allowedExtensions = Constants.SUPPORTED_FILE_EXTENSIONS;
        const extension = Helpers.getFileExtension(file.name);
        
        if (!allowedExtensions.includes(extension)) {
            this.showNotification(`❌ Tipo file non supportato: ${file.name}`, 'error');
            return false;
        }
        
        return true;
    }
    
    /**
     * Get file icon based on extension
     * @param {string} extension - File extension
     * @returns {string} Icon emoji
     */
    getFileIcon(extension) {
        const icons = {
            'kt': '🟣', 'java': '☕', 'js': '🟨', 'jsx': '⚛️',
            'html': '🌐', 'css': '🎨', 'json': '📋', 'xml': '📄',
            'md': '📝', 'txt': '📄', 'py': '🐍', 'php': '💜'
        };
        return icons[extension] || '📄';
    }
    
    /**
     * Group files by status
     * @param {Array} files - Files to group
     * @returns {Object} Grouped files
     */
    groupFilesByStatus(files) {
        return files.reduce((groups, file) => {
            const status = file.status || 'pending';
            if (!groups[status]) groups[status] = [];
            groups[status].push(file);
            return groups;
        }, {});
    }
    
    /**
     * Get human-readable status label
     * @param {string} status - Status code
     * @returns {string} Status label
     */
    getStatusLabel(status) {
        const labels = {
            'pending': '⏳ In Attesa',
            'renamed': '📝 Rinominati',
            'moved': '📁 Spostati',
            'copied': '📄 Copiati',
            'merged': '🔗 Uniti',
            'split': '✂️ Divisi',
            'content_updated': '✏️ Contenuto Aggiornato'
        };
        return labels[status] || status;
    }
    
    /**
     * Download blob as file
     * @param {Blob} blob - Blob to download
     * @param {string} filename - Filename
     */
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    /**
     * Set processing state
     * @param {boolean} isProcessing - Processing state
     * @param {string} message - Processing message
     */
    setProcessing(isProcessing, message = '') {
        this.state.isProcessing = isProcessing;
        
        const statusInfo = document.getElementById('statusInfo');
        if (statusInfo) {
            if (isProcessing) {
                statusInfo.innerHTML = `
                    <span class="status-text">${message}</span>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                `;
            } else {
                statusInfo.innerHTML = '<span class="status-text">Pronto</span>';
            }
        }
        
        // Disable/enable main action buttons
        const buttons = document.querySelectorAll('.btn-primary, .btn-success');
        buttons.forEach(btn => {
            btn.disabled = isProcessing;
        });
    }
    
    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type
     */
    showNotification(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, type === 'error' ? 5000 : 3000);
        
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
    }
    
    /**
     * Log workflow step
     * @param {string} step - Step name
     * @param {Object} data - Step data
     */
    logWorkflowStep(step, data) {
        this.state.workflowHistory.push({
            step,
            data,
            timestamp: new Date().toISOString()
        });
        
        console.log(`📋 Workflow step logged: ${step}`, data);
    }
    
    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboardShortcuts(e) {
        // Ctrl+E: Extract code
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            this.extractCode();
        }
        
        // Ctrl+G: Generate project
        if (e.ctrlKey && e.key === 'g') {
            e.preventDefault();
            this.generateProject();
        }
        
        // Ctrl+D: Download result
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            this.downloadResult();
        }
    }
    
    /**
     * Handle drag over event
     * @param {DragEvent} e - Drag event
     */
    handleDragOver(e) {
        e.preventDefault();
        e.target.classList.add('dragover');
    }
    
    /**
     * Handle drop event
     * @param {DragEvent} e - Drop event
     */
    handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('dragover');
        this.handleFileUpload(e.dataTransfer.files);
    }
    
    /**
     * Load saved state from localStorage
     */
    loadSavedState() {
        try {
            const saved = localStorage.getItem('universalProjectBuilder');
            if (saved) {
                const state = JSON.parse(saved);
                // Restore non-function state
                this.state.currentTab = state.currentTab || 'extractor';
                this.state.workflowHistory = state.workflowHistory || [];
            }
        } catch (error) {
            console.warn('⚠️ Failed to load saved state:', error);
        }
    }
    
    /**
     * Save current state to localStorage
     */
    saveState() {
        try {
            const stateToSave = {
                currentTab: this.state.currentTab,
                workflowHistory: this.state.workflowHistory
            };
            localStorage.setItem('universalProjectBuilder', JSON.stringify(stateToSave));
        } catch (error) {
            console.warn('⚠️ Failed to save state:', error);
        }
    }
    
    /**
     * Update UI based on current state
     */
    updateUI() {
        // Update tab selection
        if (this.state.currentTab) {
            this.switchTab(this.state.currentTab);
        }
        
        // Update file counts, stats, etc.
        this.updateFileCounters();
    }
    
    /**
     * Update file counters in UI
     */
    updateFileCounters() {
        // Update extracted files counter
        const extractedCounter = document.getElementById('extractedCount');
        if (extractedCounter) {
            extractedCounter.textContent = this.state.extractedFiles.length;
        }
        
        // Update organized files counter
        const organizedCounter = document.getElementById('organizedCount');
        if (organizedCounter) {
            organizedCounter.textContent = this.state.organizedFiles.length;
        }
    }
    
    // Public API methods for UI interaction
    
    /**
     * Download individual file
     * @param {string} fileId - File ID
     */
    downloadFile(fileId) {
        const file = this.state.extractedFiles.find(f => f.id === fileId) ||
                    this.state.organizedFiles.find(f => f.id === fileId);
        
        if (file) {
            const blob = new Blob([file.content], { type: 'text/plain' });
            this.downloadBlob(blob, file.fileName);
        }
    }
    
    /**
     * Preview file content
     * @param {string} fileId - File ID
     */
    previewFile(fileId) {
        const file = this.state.extractedFiles.find(f => f.id === fileId) ||
                    this.state.organizedFiles.find(f => f.id === fileId);
        
        if (file) {
            // Open preview modal or new window
            const previewWindow = window.open('', '_blank');
            previewWindow.document.write(`
                <html>
                    <head><title>Preview: ${file.fileName}</title></head>
                    <body>
                        <h1>${file.fileName}</h1>
                        <pre style="background: #f5f5f5; padding: 20px; overflow: auto;">
                            ${Helpers.escapeHtml(file.content)}
                        </pre>
                    </body>
                </html>
            `);
        }
    }
    
    /**
     * Clear uploaded files
     */
    clearUploadedFiles() {
        this.state.organizedFiles = [];
        this.fileOrganizer.reset();
        this.displayUploadedFiles([]);
        this.showNotification('🗑️ File cancellati', 'success');
    }
    
    /**
     * Remove single uploaded file
     * @param {string} fileId - File ID to remove
     */
    removeUploadedFile(fileId) {
        this.state.organizedFiles = this.state.organizedFiles.filter(f => f.id !== fileId);
        this.fileOrganizer.loadFiles(this.state.organizedFiles);
        this.displayUploadedFiles(this.state.organizedFiles);
        this.showNotification('🗑️ File rimosso', 'success');
    }
    
    /**
     * Load available templates
     */
    async loadAvailableTemplates() {
        const templates = [
            {
                name: 'Android Project',
                type: 'android',
                description: 'Template per progetti Android con struttura standard',
                icon: '🤖'
            },
            {
                name: 'Web Project',
                type: 'web', 
                description: 'Template per progetti web HTML/CSS/JS',
                icon: '🌐'
            },
            {
                name: 'React App',
                type: 'react',
                description: 'Template per applicazioni React',
                icon: '⚛️'
            },
            {
                name: 'Node.js API',
                type: 'nodejs',
                description: 'Template per API Node.js con Express',
                icon: '🟢'
            }
        ];
        
        const container = document.getElementById('templateGrid');
        if (container) {
            container.innerHTML = templates.map(template => `
                <div class="template-card" onclick="app.loadTemplate('${template.type}')">
                    <div class="template-icon">${template.icon}</div>
                    <div class="template-name">${template.name}</div>
                    <div class="template-description">${template.description}</div>
                </div>
            `).join('');
        }
    }
    
    /**
     * Load specific template
     * @param {string} templateType - Template type
     */
    loadTemplate(templateType) {
        console.log(`📋 Loading template: ${templateType}`);
        
        const config = this.fileOrganizer.exportConfigTemplate(templateType);
        this.displayConfigInEditor(config);
        this.state.projectConfig = config;
        
        this.showNotification(`✅ Template ${templateType} caricato!`, 'success');
    }
    
    /**
     * Load Android-specific templates and UI
     */
    loadAndroidTemplates() {
        // This could load Android-specific configuration options
        console.log('📱 Loading Android templates...');
    }
    
    /**
     * Load Web-specific templates and UI  
     */
    loadWebTemplates() {
        // This could load Web-specific configuration options
        console.log('🌐 Loading Web templates...');
    }
    
    /**
     * Validate configuration JSON
     */
    validateConfiguration() {
        const editor = document.getElementById('customConfigEditor');
        if (!editor || !editor.value.trim()) {
            this.showNotification('❌ Inserisci una configurazione JSON', 'error');
            return;
        }
        
        try {
            const config = JSON.parse(editor.value);
            const validation = this.fileOrganizer.validateAndNormalizeConfig(config);
            
            if (validation.isValid) {
                this.showNotification('✅ Configurazione valida!', 'success');
                this.state.projectConfig = config;
            } else {
                this.showNotification(`❌ Configurazione non valida: ${validation.errors.join(', ')}`, 'error');
            }
            
            if (validation.warnings.length > 0) {
                this.showNotification(`⚠️ Avvisi: ${validation.warnings.join(', ')}`, 'warning');
            }
            
        } catch (error) {
            this.showNotification(`❌ JSON non valido: ${error.message}`, 'error');
        }
    }
    
    /**
     * Save custom configuration as template
     */
    saveCustomConfig() {
        const editor = document.getElementById('customConfigEditor');
        if (!editor || !editor.value.trim()) {
            this.showNotification('❌ Nessuna configurazione da salvare', 'error');
            return;
        }
        
        try {
            const config = JSON.parse(editor.value);
            const blob = new Blob([JSON.stringify(config, null, 2)], { 
                type: 'application/json' 
            });
            
            const filename = config.projectName ? 
                `${config.projectName}-config.json` : 
                'custom-config.json';
            
            this.downloadBlob(blob, filename);
            this.showNotification('✅ Configurazione salvata!', 'success');
            
        } catch (error) {
            this.showNotification(`❌ Errore nel salvataggio: ${error.message}`, 'error');
        }
    }
    
    /**
     * Export current project configuration
     */
    exportProjectConfig() {
        if (!this.state.projectConfig) {
            this.showNotification('❌ Nessuna configurazione da esportare', 'error');
            return;
        }
        
        const exportData = {
            ...this.state.projectConfig,
            metadata: {
                exported: new Date().toISOString(),
                generator: 'Universal Project Builder v2.0',
                filesCount: this.state.extractedFiles.length + this.state.organizedFiles.length,
                workflowHistory: this.state.workflowHistory
            }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        
        this.downloadBlob(blob, `${this.getProjectName()}-export.json`);
        this.showNotification('✅ Progetto esportato!', 'success');
    }
    
    /**
     * Clear all data and reset application
     */
    resetApplication() {
        if (!confirm('Sei sicuro di voler cancellare tutti i dati?')) {
            return;
        }
        
        // Reset all state
        this.state = {
            currentTab: 'extractor',
            extractedFiles: [],
            organizedFiles: [],
            projectConfig: null,
            generatedProject: null,
            workflowHistory: [],
            isProcessing: false
        };
        
        // Reset modules
        this.codeExtractor = new CodeExtractor();
        this.fileOrganizer.reset();
        
        // Clear UI
        document.getElementById('codeInput').value = '';
        document.getElementById('configEditor').value = '';
        document.getElementById('customConfigEditor').value = '';
        
        // Clear results
        const containers = ['extractResults', 'organizerFiles', 'androidResults', 'webResults'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) container.innerHTML = '';
        });
        
        // Clear localStorage
        localStorage.removeItem('universalProjectBuilder');
        
        // Switch to first tab
        this.switchTab('extractor');
        
        this.showNotification('🔄 Applicazione resettata', 'success');
        console.log('🔄 Application reset completed');
    }
    
    /**
     * Get application statistics
     * @returns {Object} App statistics
     */
    getApplicationStats() {
        return {
            session: {
                extractedFiles: this.state.extractedFiles.length,
                organizedFiles: this.state.organizedFiles.length,
                workflowSteps: this.state.workflowHistory.length,
                currentTab: this.state.currentTab,
                hasConfig: !!this.state.projectConfig
            },
            modules: {
                codeExtractor: this.codeExtractor.getStats(),
                fileOrganizer: {
                    filesLoaded: this.fileOrganizer.files.length,
                    operationsLogged: this.fileOrganizer.organizationLog.length
                }
            },
            performance: {
                memoryUsage: this.estimateMemoryUsage(),
                lastActivity: this.getLastActivityTime()
            }
        };
    }
    
    /**
     * Estimate memory usage
     * @returns {number} Estimated memory in MB
     */
    estimateMemoryUsage() {
        const allFiles = [...this.state.extractedFiles, ...this.state.organizedFiles];
        const totalContent = allFiles.reduce((total, file) => total + file.content.length, 0);
        return Math.round(totalContent / 1024 / 1024 * 2); // Rough estimate * 2 for overhead
    }
    
    /**
     * Get last activity time
     * @returns {string} Last activity timestamp
     */
    getLastActivityTime() {
        if (this.state.workflowHistory.length === 0) {
            return new Date().toISOString();
        }
        
        return this.state.workflowHistory[this.state.workflowHistory.length - 1].timestamp;
    }
    
    /**
     * Generate usage report
     * @returns {Object} Usage report
     */
    generateUsageReport() {
        const stats = this.getApplicationStats();
        
        const report = {
            summary: {
                totalFiles: stats.session.extractedFiles + stats.session.organizedFiles,
                workflowSteps: stats.session.workflowSteps,
                memoryUsage: `${stats.performance.memoryUsage} MB`,
                sessionDuration: this.calculateSessionDuration(),
                mostUsedTab: this.getMostUsedTab()
            },
            files: {
                extracted: stats.session.extractedFiles,
                organized: stats.session.organizedFiles,
                languages: stats.modules.codeExtractor.byLanguage || {},
                totalSize: Helpers.formatFileSize(stats.modules.codeExtractor.totalSize || 0)
            },
            workflow: this.state.workflowHistory,
            recommendations: this.generateUsageRecommendations(stats)
        };
        
        return report;
    }
    
    /**
     * Calculate session duration
     * @returns {string} Session duration
     */
    calculateSessionDuration() {
        if (this.state.workflowHistory.length === 0) {
            return '0 minuti';
        }
        
        const start = new Date(this.state.workflowHistory[0].timestamp);
        const end = new Date();
        const diffMs = end.getTime() - start.getTime();
        const diffMins = Math.round(diffMs / 60000);
        
        return `${diffMins} minuti`;
    }
    
    /**
     * Get most used tab
     * @returns {string} Most used tab
     */
    getMostUsedTab() {
        // This would need tab tracking, for now return current
        return this.state.currentTab;
    }
    
    /**
     * Generate usage recommendations
     * @param {Object} stats - Application statistics
     * @returns {Array} Recommendations
     */
    generateUsageRecommendations(stats) {
        const recommendations = [];
        
        if (stats.performance.memoryUsage > 50) {
            recommendations.push({
                type: 'performance',
                message: 'Alto utilizzo memoria rilevato',
                suggestion: 'Considera di processare file più piccoli o in batch separati'
            });
        }
        
        if (stats.session.extractedFiles > 20) {
            recommendations.push({
                type: 'organization',
                message: 'Molti file estratti',
                suggestion: 'Usa la funzione di organizzazione per strutturare meglio i file'
            });
        }
        
        if (!stats.session.hasConfig && stats.session.organizedFiles > 0) {
            recommendations.push({
                type: 'workflow',
                message: 'File caricati senza configurazione',
                suggestion: 'Carica un template di configurazione per migliorare l\'organizzazione'
            });
        }
        
        return recommendations;
    }
    
    /**
     * Export usage report
     */
    exportUsageReport() {
        const report = this.generateUsageReport();
        
        const markdown = `# Universal Project Builder - Report Utilizzo

## 📊 Riepilogo Sessione

- **File totali**: ${report.summary.totalFiles}
- **Passi workflow**: ${report.summary.workflowSteps}
- **Utilizzo memoria**: ${report.summary.memoryUsage}
- **Durata sessione**: ${report.summary.sessionDuration}
- **Tab più utilizzato**: ${report.summary.mostUsedTab}

## 📁 File Processati

- **Estratti**: ${report.files.extracted}
- **Organizzati**: ${report.files.organized}
- **Dimensione totale**: ${report.files.totalSize}

### Linguaggi Rilevati
${Object.entries(report.files.languages).map(([lang, count]) => `- **${lang}**: ${count} file`).join('\n')}

## 🔄 Cronologia Workflow

${report.workflow.map(step => `- **${step.step}** - ${new Date(step.timestamp).toLocaleString()}`).join('\n')}

## 💡 Raccomandazioni

${report.recommendations.map(rec => `- **${rec.type}**: ${rec.message}\n  - *Suggerimento*: ${rec.suggestion}`).join('\n\n')}

---
*Report generato il ${new Date().toLocaleString()} da Universal Project Builder v2.0*
`;
        
        const blob = new Blob([markdown], { type: 'text/markdown' });
        this.downloadBlob(blob, `usage-report-${Date.now()}.md`);
        
        this.showNotification('✅ Report utilizzo esportato!', 'success');
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check for required dependencies
    if (typeof JSZip === 'undefined') {
        console.error('❌ JSZip library not loaded');
        alert('❌ Errore: JSZip library non caricata. Ricarica la pagina.');
        return;
    }
    
    // Initialize application
    try {
        window.app = new UniversalProjectBuilder();
        console.log('✅ Universal Project Builder v2.0 initialized successfully');
        
        // Global error handler
        window.addEventListener('error', (error) => {
            console.error('💥 Global error:', error);
            if (window.app) {
                window.app.showNotification('❌ Errore applicazione', 'error');
            }
        });
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('💥 Unhandled promise rejection:', event.reason);
            if (window.app) {
                window.app.showNotification('❌ Errore asincrono', 'error');
            }
        });
        
    } catch (error) {
        console.error('❌ Failed to initialize Universal Project Builder:', error);
        alert('❌ Errore nell\'inizializzazione dell\'applicazione');
    }
});

// Export for debugging and external access
export default UniversalProjectBuilder;
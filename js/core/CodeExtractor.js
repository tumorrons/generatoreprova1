/**
 * CodeExtractor Module
 * Estrae file da codice con intestazioni numeriche
 * Miglioramento del tuo generatore esistente
 */

export class CodeExtractor {
    constructor() {
        console.log('🔍 CodeExtractor initialized');
        
        this.patterns = {
            // Pattern per intestazioni numeriche
            numbered: /^\d+\.\s*(.+?)$/gm,
            // Pattern per intestazioni con simboli
            symboled: /^[#*-]\s*(.+?)$/gm,
            // Pattern per filename con estensione
            filename: /([A-Za-z0-9_.-]+\.[a-zA-Z0-9]+)/,
            // Pattern per linguaggi
            languages: {
                kotlin: /(?:package\s+|class\s+\w+|fun\s+)/,
                java: /(?:package\s+.*?;|public\s+class\s+|import\s+)/,
                javascript: /(?:function\s+|const\s+|let\s+|var\s+|=>\s*)/,
                html: /(?:<!DOCTYPE|<html|<head|<body)/i,
                css: /(?:\.[\w-]+\s*{|@media|@import)/,
                json: /^\s*[{\[]/,
                xml: /^\s*<\?xml|<[\w-]+[\s>]/,
                sql: /(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER)\s+/i,
                python: /(?:def\s+|import\s+|from\s+.*import|class\s+)/,
                php: /<\?php|namespace\s+|class\s+\w+/,
                yaml: /^[\w-]+:\s*$|^\s*-\s+/m
            }
        };
        
        this.extractedFiles = [];
        this.stats = {
            totalFiles: 0,
            totalSize: 0,
            byLanguage: {}
        };
    }
    
    /**
     * Estrae file dal codice incollato
     * @param {string} input - Codice con intestazioni
     * @param {Object} options - Opzioni di estrazione
     * @returns {Array} Array di file estratti
     */
    extractFiles(input, options = {}) {
        console.log('🔍 Starting file extraction...');
        
        if (!input || !input.trim()) {
            throw new Error('Input vuoto o non valido');
        }
        
        const {
            autoDetectLanguage = true,
            generateConfig = true,
            cleanCode = true,
            validateSyntax = false
        } = options;
        
        this.extractedFiles = [];
        this.resetStats();
        
        // Trova tutte le intestazioni
        const headers = this.findHeaders(input);
        
        if (headers.length === 0) {
            throw new Error('Nessuna intestazione numerata trovata! Usa il formato: "1. NomeFile.ext"');
        }
        
        console.log(`📋 Found ${headers.length} headers`);
        
        // Estrai contenuto per ogni sezione
        for (let i = 0; i < headers.length; i++) {
            const currentHeader = headers[i];
            const nextHeader = headers[i + 1];
            
            const fileData = this.extractFileSection(
                input, 
                currentHeader, 
                nextHeader, 
                { autoDetectLanguage, cleanCode, validateSyntax }
            );
            
            if (fileData) {
                this.extractedFiles.push(fileData);
                this.updateStats(fileData);
            }
        }
        
        // Genera configurazione automatica se richiesto
        if (generateConfig && this.extractedFiles.length > 0) {
            const configFile = this.generateConfigFile();
            this.extractedFiles.push(configFile);
        }
        
        console.log(`✅ Extraction completed: ${this.extractedFiles.length} files`);
        return this.extractedFiles;
    }
    
    /**
     * Trova tutte le intestazioni nel testo
     * @param {string} input - Testo input
     * @returns {Array} Array di intestazioni trovate
     */
    findHeaders(input) {
        const headers = [];
        
        // Cerca intestazioni numeriche (formato principale)
        const numberedMatches = [...input.matchAll(this.patterns.numbered)];
        
        numberedMatches.forEach(match => {
            headers.push({
                type: 'numbered',
                match: match,
                title: match[1].trim(),
                index: match.index,
                fullMatch: match[0]
            });
        });
        
        // Ordina per posizione nel testo
        return headers.sort((a, b) => a.index - b.index);
    }
    
    /**
     * Estrae una sezione di file
     * @param {string} input - Testo completo
     * @param {Object} currentHeader - Intestazione corrente
     * @param {Object} nextHeader - Intestazione successiva (opzionale)
     * @param {Object} options - Opzioni
     * @returns {Object} Dati del file estratto
     */
    extractFileSection(input, currentHeader, nextHeader, options) {
        const startIndex = currentHeader.index + currentHeader.fullMatch.length;
        const endIndex = nextHeader ? nextHeader.index : input.length;
        
        let content = input.substring(startIndex, endIndex).trim();
        
        if (!content) {
            console.warn(`⚠️ Empty content for: ${currentHeader.title}`);
            return null;
        }
        
        // Pulisci il codice se richiesto
        if (options.cleanCode) {
            content = this.cleanCode(content);
        }
        
        // Estrai nome file e determina estensione
        const fileName = this.extractFileName(currentHeader.title);
        const detectedLanguage = options.autoDetectLanguage ? 
            this.detectLanguage(content) : null;
        
        const finalFileName = this.buildFileName(fileName, detectedLanguage);
        const fileExtension = this.getFileExtension(finalFileName);
        
        // Valida sintassi se richiesto
        if (options.validateSyntax) {
            const validation = this.validateSyntax(content, fileExtension);
            if (!validation.isValid) {
                console.warn(`⚠️ Syntax validation failed for ${finalFileName}:`, validation.errors);
            }
        }
        
        const fileData = {
            id: this.generateFileId(),
            originalTitle: currentHeader.title,
            fileName: finalFileName,
            extension: fileExtension,
            language: detectedLanguage,
            content: content,
            size: new Blob([content]).size,
            lines: content.split('\n').length,
            created: new Date().toISOString(),
            metadata: {
                hasPackageDeclaration: this.hasPackageDeclaration(content),
                hasImports: this.hasImports(content),
                isExecutable: this.isExecutableCode(content, fileExtension),
                complexity: this.calculateComplexity(content)
            }
        };
        
        console.log(`📄 Extracted: ${finalFileName} (${fileData.size} bytes)`);
        return fileData;
    }
    
    /**
     * Pulisce il codice rimuovendo marcatori di linguaggio
     * @param {string} content - Contenuto da pulire
     * @returns {string} Contenuto pulito
     */
    cleanCode(content) {
        // Rimuovi marcatori di linguaggio all'inizio
        const languageMarkers = /^(KOTLIN|JAVA|JAVASCRIPT|HTML|CSS|JSON|XML|YAML|SQL|PYTHON|PHP|C\+\+|C#|SWIFT|GO|RUST|TYPESCRIPT)\s*\n/i;
        content = content.replace(languageMarkers, '');
        
        // Rimuovi blocchi di codice markdown se presenti
        content = content.replace(/^```[\w]*\n/, '').replace(/\n```$/, '');
        
        // Rimuovi spazi extra all'inizio e fine
        content = content.trim();
        
        return content;
    }
    
    /**
     * Estrae nome file dal titolo
     * @param {string} title - Titolo della sezione
     * @returns {string} Nome file estratto
     */
    extractFileName(title) {
        // Cerca pattern di filename con estensione
        const filenameMatch = title.match(this.patterns.filename);
        if (filenameMatch) {
            return filenameMatch[1];
        }
        
        // Pattern specifici per linguaggi comuni
        const specificPatterns = [
            /([A-Za-z0-9_-]+\.kt)/i,
            /([A-Za-z0-9_-]+\.java)/i,
            /([A-Za-z0-9_-]+\.js)/i,
            /([A-Za-z0-9_-]+\.html)/i,
            /([A-Za-z0-9_-]+\.css)/i,
            /([A-Za-z0-9_-]+\.json)/i,
            /([A-Za-z0-9_-]+\.xml)/i,
            /([A-Za-z0-9_-]+\.sql)/i,
            /([A-Za-z0-9_-]+\.py)/i,
            /([A-Za-z0-9_-]+\.php)/i
        ];
        
        for (const pattern of specificPatterns) {
            const match = title.match(pattern);
            if (match) {
                return match[1];
            }
        }
        
        // Fallback: sanitizza il titolo
        return title
            .replace(/[^A-Za-z0-9_.-]/g, '')
            .replace(/\s+/g, '_')
            .toLowerCase() || 'file';
    }
    
    /**
     * Rileva il linguaggio dal contenuto
     * @param {string} content - Contenuto del file
     * @returns {string|null} Linguaggio rilevato
     */
    detectLanguage(content) {
        for (const [language, pattern] of Object.entries(this.patterns.languages)) {
            if (pattern.test(content)) {
                return language;
            }
        }
        
        // Controlli aggiuntivi basati su contenuto
        if (content.includes('<?xml')) return 'xml';
        if (content.includes('<!DOCTYPE') || content.includes('<html')) return 'html';
        if (content.trim().startsWith('{') || content.trim().startsWith('[')) return 'json';
        if (content.includes('function ') || content.includes('=>')) return 'javascript';
        
        return null;
    }
    
    /**
     * Costruisce il nome file finale
     * @param {string} fileName - Nome file base
     * @param {string} detectedLanguage - Linguaggio rilevato
     * @returns {string} Nome file finale
     */
    buildFileName(fileName, detectedLanguage) {
        // Se il file ha già un'estensione, usala
        if (fileName.includes('.')) {
            return fileName;
        }
        
        // Mappa linguaggi a estensioni
        const languageExtensions = {
            kotlin: 'kt',
            java: 'java',
            javascript: 'js',
            html: 'html',
            css: 'css',
            json: 'json',
            xml: 'xml',
            sql: 'sql',
            python: 'py',
            php: 'php',
            yaml: 'yml'
        };
        
        const extension = detectedLanguage ? 
            languageExtensions[detectedLanguage] || 'txt' : 'txt';
        
        return `${fileName}.${extension}`;
    }
    
    /**
     * Ottiene l'estensione del file
     * @param {string} fileName - Nome file
     * @returns {string} Estensione
     */
    getFileExtension(fileName) {
        return fileName.includes('.') ? 
            fileName.split('.').pop().toLowerCase() : 'txt';
    }
    
    /**
     * Valida la sintassi del codice
     * @param {string} content - Contenuto
     * @param {string} extension - Estensione file
     * @returns {Object} Risultato validazione
     */
    validateSyntax(content, extension) {
        const errors = [];
        
        switch (extension) {
            case 'json':
                try {
                    JSON.parse(content);
                } catch (e) {
                    errors.push(`JSON syntax error: ${e.message}`);
                }
                break;
                
            case 'kt':
                if (!content.includes('package ')) {
                    errors.push('Missing package declaration');
                }
                break;
                
            case 'java':
                if (!content.includes('package ') || !content.includes('class ')) {
                    errors.push('Missing package or class declaration');
                }
                break;
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    /**
     * Controlla se ha dichiarazione package
     * @param {string} content - Contenuto
     * @returns {boolean}
     */
    hasPackageDeclaration(content) {
        return /package\s+[a-zA-Z][a-zA-Z0-9_.]*/.test(content);
    }
    
    /**
     * Controlla se ha import
     * @param {string} content - Contenuto
     * @returns {boolean}
     */
    hasImports(content) {
        return /import\s+/.test(content) || /#include\s*</.test(content);
    }
    
    /**
     * Controlla se è codice eseguibile
     * @param {string} content - Contenuto
     * @param {string} extension - Estensione
     * @returns {boolean}
     */
    isExecutableCode(content, extension) {
        const executableExtensions = ['kt', 'java', 'js', 'py', 'php', 'cpp', 'c', 'go', 'rs'];
        if (!executableExtensions.includes(extension)) return false;
        
        // Cerca funzioni main o entry points
        return /main\s*\(/.test(content) || 
               /onCreate\s*\(/.test(content) ||
               /function\s+main/.test(content);
    }
    
    /**
     * Calcola complessità del codice
     * @param {string} content - Contenuto
     * @returns {string} Livello di complessità
     */
    calculateComplexity(content) {
        const lines = content.split('\n').filter(line => line.trim()).length;
        const functions = (content.match(/function\s+\w+|fun\s+\w+|def\s+\w+/g) || []).length;
        const classes = (content.match(/class\s+\w+/g) || []).length;
        
        const complexity = lines + (functions * 5) + (classes * 10);
        
        if (complexity < 50) return 'low';
        if (complexity < 200) return 'medium';
        if (complexity < 500) return 'high';
        return 'very_high';
    }
    
    /**
     * Genera ID univoco per il file
     * @returns {string} ID univoco
     */
    generateFileId() {
        return 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Genera file di configurazione automatico
     * @returns {Object} File di configurazione
     */
    generateConfigFile() {
        const config = {
            projectName: this.guessProjectName(),
            description: "Progetto generato automaticamente",
            version: "1.0.0",
            generator: "Universal Project Builder v2.0",
            timestamp: new Date().toISOString(),
            files: this.extractedFiles.map(file => ({
                name: file.fileName,
                language: file.language,
                size: file.size,
                complexity: file.metadata.complexity
            })),
            structure: this.generateProjectStructure(),
            recommendations: this.generateRecommendations()
        };
        
        return {
            id: this.generateFileId(),
            originalTitle: "Configurazione Progetto",
            fileName: "project-config.json",
            extension: "json",
            language: "json",
            content: JSON.stringify(config, null, 2),
            size: JSON.stringify(config, null, 2).length,
            lines: JSON.stringify(config, null, 2).split('\n').length,
            created: new Date().toISOString(),
            metadata: {
                hasPackageDeclaration: false,
                hasImports: false,
                isExecutable: false,
                complexity: 'low'
            }
        };
    }
    
    /**
     * Indovina il nome del progetto dai file
     * @returns {string} Nome progetto
     */
    guessProjectName() {
        // Cerca MainActivity o file principali
        const mainFile = this.extractedFiles.find(file => 
            file.fileName.toLowerCase().includes('main') ||
            file.fileName.toLowerCase().includes('app') ||
            file.fileName.toLowerCase().includes('index')
        );
        
        if (mainFile) {
            return mainFile.fileName.replace(/\.[^.]+$/, '').replace(/main|app|index/i, 'Project');
        }
        
        // Fallback
        return 'ExtractedProject';
    }
    
    /**
     * Genera struttura progetto suggerita
     * @returns {Object} Struttura progetto
     */
    generateProjectStructure() {
        const structure = {
            root: [],
            src: [],
            assets: [],
            config: []
        };
        
        this.extractedFiles.forEach(file => {
            switch (file.extension) {
                case 'kt':
                case 'java':
                    structure.src.push(file.fileName);
                    break;
                case 'xml':
                    if (file.fileName.includes('layout')) {
                        structure.assets.push(`res/layout/${file.fileName}`);
                    } else {
                        structure.config.push(file.fileName);
                    }
                    break;
                case 'gradle':
                case 'json':
                case 'properties':
                    structure.config.push(file.fileName);
                    break;
                case 'html':
                case 'css':
                case 'js':
                    structure.assets.push(file.fileName);
                    break;
                default:
                    structure.root.push(file.fileName);
            }
        });
        
        return structure;
    }
    
    /**
     * Genera raccomandazioni per il progetto
     * @returns {Array} Array di raccomandazioni
     */
    generateRecommendations() {
        const recommendations = [];
        
        // Controlla se mancano file importanti
        const hasMainActivity = this.extractedFiles.some(f => 
            f.fileName.toLowerCase().includes('mainactivity'));
        const hasManifest = this.extractedFiles.some(f => 
            f.fileName.toLowerCase().includes('manifest'));
        const hasGradle = this.extractedFiles.some(f => 
            f.fileName.includes('gradle'));
        
        if (!hasMainActivity && this.stats.byLanguage.kotlin) {
            recommendations.push({
                type: 'missing_file',
                severity: 'warning',
                message: 'Manca MainActivity.kt per progetto Android',
                suggestion: 'Aggiungi una MainActivity per il punto di ingresso dell\'app'
            });
        }
        
        if (!hasManifest && this.stats.byLanguage.kotlin) {
            recommendations.push({
                type: 'missing_file',
                severity: 'error',
                message: 'Manca AndroidManifest.xml',
                suggestion: 'Il manifest è obbligatorio per progetti Android'
            });
        }
        
        if (!hasGradle && this.stats.byLanguage.kotlin) {
            recommendations.push({
                type: 'missing_file',
                severity: 'warning',
                message: 'Manca build.gradle',
                suggestion: 'Aggiungi configurazione Gradle per il build'
            });
        }
        
        // Controlla complessità
        const highComplexityFiles = this.extractedFiles.filter(f => 
            f.metadata.complexity === 'high' || f.metadata.complexity === 'very_high');
        
        if (highComplexityFiles.length > 0) {
            recommendations.push({
                type: 'code_quality',
                severity: 'info',
                message: `${highComplexityFiles.length} file con alta complessità`,
                suggestion: 'Considera di suddividere file complessi in moduli più piccoli'
            });
        }
        
        return recommendations;
    }
    
    /**
     * Reset statistiche
     */
    resetStats() {
        this.stats = {
            totalFiles: 0,
            totalSize: 0,
            byLanguage: {},
            byExtension: {},
            complexity: {
                low: 0,
                medium: 0,
                high: 0,
                very_high: 0
            }
        };
    }
    
    /**
     * Aggiorna statistiche
     * @param {Object} fileData - Dati del file
     */
    updateStats(fileData) {
        this.stats.totalFiles++;
        this.stats.totalSize += fileData.size;
        
        // Per linguaggio
        if (fileData.language) {
            this.stats.byLanguage[fileData.language] = 
                (this.stats.byLanguage[fileData.language] || 0) + 1;
        }
        
        // Per estensione
        this.stats.byExtension[fileData.extension] = 
            (this.stats.byExtension[fileData.extension] || 0) + 1;
        
        // Per complessità
        this.stats.complexity[fileData.metadata.complexity]++;
    }
    
    /**
     * Ottieni statistiche complete
     * @returns {Object} Statistiche
     */
    getStats() {
        return {
            ...this.stats,
            averageSize: this.stats.totalFiles > 0 ? 
                Math.round(this.stats.totalSize / this.stats.totalFiles) : 0,
            averageLines: this.stats.totalFiles > 0 ?
                Math.round(this.extractedFiles.reduce((sum, f) => sum + f.lines, 0) / this.stats.totalFiles) : 0,
            mostCommonLanguage: this.getMostCommonLanguage(),
            projectType: this.guessProjectType()
        };
    }
    
    /**
     * Ottieni linguaggio più comune
     * @returns {string} Linguaggio più comune
     */
    getMostCommonLanguage() {
        const languages = Object.entries(this.stats.byLanguage);
        if (languages.length === 0) return 'unknown';
        
        return languages.reduce((max, current) => 
            current[1] > max[1] ? current : max)[0];
    }
    
    /**
     * Indovina tipo di progetto
     * @returns {string} Tipo progetto
     */
    guessProjectType() {
        if (this.stats.byLanguage.kotlin || this.stats.byLanguage.java) {
            return 'android';
        }
        if (this.stats.byLanguage.javascript && this.stats.byLanguage.html) {
            return 'web';
        }
        if (this.stats.byLanguage.python) {
            return 'python';
        }
        return 'generic';
    }
    
    /**
     * Esporta risultati in vari formati
     * @param {string} format - Formato di esportazione
     * @returns {Object} Dati esportati
     */
    exportResults(format = 'json') {
        const exportData = {
            metadata: {
                generator: 'Universal Project Builder v2.0',
                timestamp: new Date().toISOString(),
                totalFiles: this.stats.totalFiles,
                projectType: this.guessProjectType()
            },
            files: this.extractedFiles,
            statistics: this.getStats(),
            recommendations: this.generateRecommendations()
        };
        
        switch (format) {
            case 'json':
                return {
                    content: JSON.stringify(exportData, null, 2),
                    filename: 'extracted-project.json',
                    mimeType: 'application/json'
                };
            case 'csv':
                return this.exportToCsv();
            case 'markdown':
                return this.exportToMarkdown();
            default:
                return exportData;
        }
    }
    
    /**
     * Esporta in formato CSV
     * @returns {Object} Dati CSV
     */
    exportToCsv() {
        const headers = ['fileName', 'extension', 'language', 'size', 'lines', 'complexity'];
        const rows = this.extractedFiles.map(file => [
            file.fileName,
            file.extension,
            file.language || 'unknown',
            file.size,
            file.lines,
            file.metadata.complexity
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        
        return {
            content: csvContent,
            filename: 'extracted-files.csv',
            mimeType: 'text/csv'
        };
    }
    
    /**
     * Esporta in formato Markdown
     * @returns {Object} Dati Markdown
     */
    exportToMarkdown() {
        const stats = this.getStats();
        
        const markdown = `# Progetto Estratto

## 📊 Statistiche

- **File totali**: ${stats.totalFiles}
- **Dimensione totale**: ${this.formatFileSize(stats.totalSize)}
- **Linguaggio principale**: ${stats.mostCommonLanguage}
- **Tipo progetto**: ${stats.projectType}

## 📁 File Estratti

${this.extractedFiles.map(file => `
### ${file.fileName}

- **Linguaggio**: ${file.language || 'Sconosciuto'}
- **Dimensione**: ${this.formatFileSize(file.size)}
- **Righe**: ${file.lines}
- **Complessità**: ${file.metadata.complexity}
`).join('\n')}

## 🎯 Raccomandazioni

${this.generateRecommendations().map(rec => `
- **${rec.severity.toUpperCase()}**: ${rec.message}
  - *Suggerimento*: ${rec.suggestion}
`).join('\n')}

---
*Generato da Universal Project Builder v2.0*
`;
        
        return {
            content: markdown,
            filename: 'project-report.md',
            mimeType: 'text/markdown'
        };
    }
    
    /**
     * Formatta dimensione file
     * @param {number} bytes - Bytes
     * @returns {string} Dimensione formattata
     */
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    
    /**
     * Valida configurazione JSON
     * @param {string} configJson - JSON di configurazione
     * @returns {Object} Risultato validazione
     */
    validateConfig(configJson) {
        try {
            const config = JSON.parse(configJson);
            const errors = [];
            
            // Validazioni base
            if (!config.projectName) {
                errors.push('projectName è obbligatorio');
            }
            
            if (config.files && !Array.isArray(config.files)) {
                errors.push('files deve essere un array');
            }
            
            return {
                isValid: errors.length === 0,
                errors: errors,
                config: config
            };
        } catch (e) {
            return {
                isValid: false,
                errors: ['JSON non valido: ' + e.message],
                config: null
            };
        }
    }
}

export default CodeExtractor;
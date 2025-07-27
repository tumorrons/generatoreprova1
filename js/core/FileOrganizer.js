/**
 * FileOrganizer Module
 * Organizza file secondo configurazione JSON
 * Rinomina, sposta, duplica file secondo regole
 */

export class FileOrganizer {
    constructor() {
        console.log('📁 FileOrganizer initialized');
        
        this.supportedOperations = {
            rename: 'Rinomina file',
            move: 'Sposta in cartella',
            copy: 'Copia in più posizioni',
            changeExtension: 'Cambia estensione',
            updateContent: 'Aggiorna contenuto',
            merge: 'Unisci file',
            split: 'Dividi file'
        };
        
        this.files = [];
        this.config = null;
        this.organizationLog = [];
    }
    
    /**
     * Carica file da organizzare
     * @param {Array} files - Array di file
     */
    loadFiles(files) {
        console.log(`📂 Loading ${files.length} files...`);
        
        this.files = files.map(file => ({
            ...file,
            id: file.id || this.generateId(),
            originalPath: file.fileName,
            currentPath: file.fileName,
            operations: [],
            status: 'pending'
        }));
        
        console.log('✅ Files loaded successfully');
    }
    
    /**
     * Carica configurazione di organizzazione
     * @param {Object} config - Configurazione JSON
     */
    loadConfig(config) {
        console.log('⚙️ Loading organization config...');
        
        this.config = this.validateAndNormalizeConfig(config);
        
        if (!this.config.isValid) {
            throw new Error('Configurazione non valida: ' + this.config.errors.join(', '));
        }
        
        console.log('✅ Configuration loaded and validated');
    }
    
    /**
     * Esegue l'organizzazione dei file
     * @param {Object} options - Opzioni di organizzazione
     * @returns {Array} File organizzati
     */
    async organizeFiles(options = {}) {
        console.log('🔄 Starting file organization...');
        
        const {
            dryRun = false,
            validateResults = true,
            generateReport = true
        } = options;
        
        if (!this.config || !this.config.isValid) {
            throw new Error('Configurazione non caricata o non valida');
        }
        
        this.organizationLog = [];
        
        // Applica operazioni in ordine
        const operations = [
            'fileRenames',
            'extensionChanges', 
            'folderMappings',
            'contentUpdates',
            'copyToMultipleLocations',
            'mergeFiles',
            'splitFiles'
        ];
        
        for (const operation of operations) {
            if (this.config.data[operation]) {
                await this.applyOperation(operation, this.config.data[operation], dryRun);
            }
        }
        
        // Valida risultati se richiesto
        if (validateResults) {
            this.validateOrganizationResults();
        }
        
        // Genera report se richiesto
        if (generateReport) {
            this.generateOrganizationReport();
        }
        
        console.log('✅ File organization completed');
        return this.files;
    }
    
    /**
     * Applica una specifica operazione
     * @param {string} operationType - Tipo di operazione
     * @param {Object} operationConfig - Configurazione operazione
     * @param {boolean} dryRun - Solo simulazione
     */
    async applyOperation(operationType, operationConfig, dryRun) {
        console.log(`🔧 Applying operation: ${operationType}`);
        
        switch (operationType) {
            case 'fileRenames':
                this.applyFileRenames(operationConfig, dryRun);
                break;
            case 'extensionChanges':
                this.applyExtensionChanges(operationConfig, dryRun);
                break;
            case 'folderMappings':
                this.applyFolderMappings(operationConfig, dryRun);
                break;
            case 'contentUpdates':
                this.applyContentUpdates(operationConfig, dryRun);
                break;
            case 'copyToMultipleLocations':
                this.applyCopyToMultipleLocations(operationConfig, dryRun);
                break;
            case 'mergeFiles':
                this.applyMergeFiles(operationConfig, dryRun);
                break;
            case 'splitFiles':
                this.applySplitFiles(operationConfig, dryRun);
                break;
            default:
                console.warn(`⚠️ Unknown operation: ${operationType}`);
        }
    }
    
    /**
     * Applica rinomina file
     * @param {Object} config - Configurazione rinomina
     * @param {boolean} dryRun - Solo simulazione
     */
    applyFileRenames(config, dryRun) {
        Object.entries(config).forEach(([oldName, newName]) => {
            const file = this.findFileByName(oldName);
            
            if (file) {
                const operation = {
                    type: 'rename',
                    from: file.currentPath,
                    to: newName,
                    timestamp: new Date().toISOString()
                };
                
                if (!dryRun) {
                    file.fileName = newName;
                    file.currentPath = newName;
                    file.operations.push(operation);
                    file.status = 'renamed';
                }
                
                this.logOperation(operation, dryRun);
                console.log(`📝 ${dryRun ? '[DRY RUN] ' : ''}Renamed: ${oldName} → ${newName}`);
            } else {
                console.warn(`⚠️ File not found for rename: ${oldName}`);
            }
        });
    }
    
    /**
     * Applica cambio estensioni
     * @param {Object} config - Configurazione estensioni
     * @param {boolean} dryRun - Solo simulazione
     */
    applyExtensionChanges(config, dryRun) {
        Object.entries(config).forEach(([fileName, newExtension]) => {
            const file = this.findFileByName(fileName);
            
            if (file) {
                const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
                const newFileName = `${baseName}.${newExtension}`;
                
                const operation = {
                    type: 'changeExtension',
                    from: file.currentPath,
                    to: newFileName,
                    oldExtension: file.extension,
                    newExtension: newExtension,
                    timestamp: new Date().toISOString()
                };
                
                if (!dryRun) {
                    file.fileName = newFileName;
                    file.currentPath = newFileName;
                    file.extension = newExtension;
                    file.operations.push(operation);
                    file.status = 'extension_changed';
                }
                
                this.logOperation(operation, dryRun);
                console.log(`🔧 ${dryRun ? '[DRY RUN] ' : ''}Changed extension: ${fileName} → ${newFileName}`);
            }
        });
    }
    
    /**
     * Applica mapping cartelle
     * @param {Object} config - Configurazione cartelle
     * @param {boolean} dryRun - Solo simulazione
     */
    applyFolderMappings(config, dryRun) {
        Object.entries(config).forEach(([fileName, folderPath]) => {
            const file = this.findFileByName(fileName);
            
            if (file) {
                const newPath = this.joinPath(folderPath, file.fileName);
                
                const operation = {
                    type: 'move',
                    from: file.currentPath,
                    to: newPath,
                    folder: folderPath,
                    timestamp: new Date().toISOString()
                };
                
                if (!dryRun) {
                    file.currentPath = newPath;
                    file.folderPath = folderPath;
                    file.operations.push(operation);
                    file.status = 'moved';
                }
                
                this.logOperation(operation, dryRun);
                console.log(`📁 ${dryRun ? '[DRY RUN] ' : ''}Moved: ${fileName} → ${newPath}`);
            }
        });
    }
    
    /**
     * Applica aggiornamenti contenuto
     * @param {Object} config - Configurazione aggiornamenti
     * @param {boolean} dryRun - Solo simulazione
     */
    applyContentUpdates(config, dryRun) {
        Object.entries(config).forEach(([fileName, updates]) => {
            const file = this.findFileByName(fileName);
            
            if (file) {
                let newContent = file.content;
                
                // Applica sostituzioni
                if (updates.replacements) {
                    updates.replacements.forEach(replacement => {
                        newContent = newContent.replace(
                            new RegExp(replacement.find, 'g'),
                            replacement.replace
                        );
                    });
                }
                
                // Aggiungi import se specificati
                if (updates.addImports) {
                    const imports = updates.addImports.map(imp => `import ${imp};`).join('\n');
                    newContent = imports + '\n\n' + newContent;
                }
                
                // Aggiorna package se specificato
                if (updates.updatePackage) {
                    newContent = newContent.replace(
                        /package\s+[a-zA-Z][a-zA-Z0-9_.]*/,
                        `package ${updates.updatePackage}`
                    );
                }
                
                const operation = {
                    type: 'updateContent',
                    file: fileName,
                    changes: updates,
                    sizeBefore: file.content.length,
                    sizeAfter: newContent.length,
                    timestamp: new Date().toISOString()
                };
                
                if (!dryRun) {
                    file.content = newContent;
                    file.size = new Blob([newContent]).size;
                    file.operations.push(operation);
                    file.status = 'content_updated';
                }
                
                this.logOperation(operation, dryRun);
                console.log(`✏️ ${dryRun ? '[DRY RUN] ' : ''}Updated content: ${fileName}`);
            }
        });
    }
    
    /**
     * Applica copia in più posizioni
     * @param {Object} config - Configurazione copia
     * @param {boolean} dryRun - Solo simulazione
     */
    applyCopyToMultipleLocations(config, dryRun) {
        Object.entries(config).forEach(([fileName, locations]) => {
            const originalFile = this.findFileByName(fileName);
            
            if (originalFile) {
                locations.forEach((location, index) => {
                    const copyId = `${originalFile.id}_copy_${index}`;
                    const copyPath = this.joinPath(location.folder, location.name || fileName);
                    
                    const operation = {
                        type: 'copy',
                        originalFile: fileName,
                        copyPath: copyPath,
                        copyId: copyId,
                        timestamp: new Date().toISOString()
                    };
                    
                    if (!dryRun) {
                        const fileCopy = {
                            ...originalFile,
                            id: copyId,
                            fileName: location.name || fileName,
                            currentPath: copyPath,
                            folderPath: location.folder,
                            operations: [operation],
                            status: 'copied',
                            isCopy: true,
                            originalFileId: originalFile.id
                        };
                        
                        // Applica modifiche specifiche alla copia se presenti
                        if (location.modifications) {
                            this.applyModificationsToCopy(fileCopy, location.modifications);
                        }
                        
                        this.files.push(fileCopy);
                    }
                    
                    this.logOperation(operation, dryRun);
                    console.log(`📄 ${dryRun ? '[DRY RUN] ' : ''}Copied: ${fileName} → ${copyPath}`);
                });
            }
        });
    }
    
    /**
     * Applica modifiche a una copia
     * @param {Object} fileCopy - File copia
     * @param {Object} modifications - Modifiche da applicare
     */
    applyModificationsToCopy(fileCopy, modifications) {
        if (modifications.packageName) {
            fileCopy.content = fileCopy.content.replace(
                /package\s+[a-zA-Z][a-zA-Z0-9_.]*/,
                `package ${modifications.packageName}`
            );
        }
        
        if (modifications.className) {
            const oldClassName = fileCopy.fileName.replace(/\.[^.]+$/, '');
            fileCopy.content = fileCopy.content.replace(
                new RegExp(`class\\s+${oldClassName}`, 'g'),
                `class ${modifications.className}`
            );
        }
        
        if (modifications.imports) {
            const additionalImports = modifications.imports.map(imp => `import ${imp};`).join('\n');
            fileCopy.content = additionalImports + '\n\n' + fileCopy.content;
        }
    }
    
    /**
     * Applica unione file
     * @param {Object} config - Configurazione unione
     * @param {boolean} dryRun - Solo simulazione
     */
    applyMergeFiles(config, dryRun) {
        Object.entries(config).forEach(([mergedFileName, sourceFiles]) => {
            const sources = sourceFiles.map(fileName => this.findFileByName(fileName)).filter(Boolean);
            
            if (sources.length > 0) {
                const mergedContent = this.mergeFileContents(sources, config.mergeStrategy || 'concatenate');
                
                const operation = {
                    type: 'merge',
                    sourceFiles: sourceFiles,
                    mergedFile: mergedFileName,
                    strategy: config.mergeStrategy,
                    timestamp: new Date().toISOString()
                };
                
                if (!dryRun) {
                    const mergedFile = {
                        id: this.generateId(),
                        fileName: mergedFileName,
                        currentPath: mergedFileName,
                        extension: this.getFileExtension(mergedFileName),
                        content: mergedContent,
                        size: new Blob([mergedContent]).size,
                        lines: mergedContent.split('\n').length,
                        operations: [operation],
                        status: 'merged',
                        isMerged: true,
                        sourceFileIds: sources.map(f => f.id),
                        created: new Date().toISOString()
                    };
                    
                    this.files.push(mergedFile);
                    
                    // Marca file sorgente come usati per merge
                    sources.forEach(source => {
                        source.status = 'merged_source';
                        source.operations.push({
                            type: 'merged_into',
                            mergedFile: mergedFileName,
                            timestamp: new Date().toISOString()
                        });
                    });
                }
                
                this.logOperation(operation, dryRun);
                console.log(`🔗 ${dryRun ? '[DRY RUN] ' : ''}Merged: ${sourceFiles.join(', ')} → ${mergedFileName}`);
            }
        });
    }
    
    /**
     * Applica divisione file
     * @param {Object} config - Configurazione divisione
     * @param {boolean} dryRun - Solo simulazione
     */
    applySplitFiles(config, dryRun) {
        Object.entries(config).forEach(([sourceFileName, splitConfig]) => {
            const sourceFile = this.findFileByName(sourceFileName);
            
            if (sourceFile) {
                const splitFiles = this.splitFileContent(sourceFile, splitConfig);
                
                const operation = {
                    type: 'split',
                    sourceFile: sourceFileName,
                    splitFiles: splitFiles.map(f => f.fileName),
                    strategy: splitConfig.strategy,
                    timestamp: new Date().toISOString()
                };
                
                if (!dryRun) {
                    splitFiles.forEach(splitFile => {
                        this.files.push(splitFile);
                    });
                    
                    sourceFile.status = 'split_source';
                    sourceFile.operations.push({
                        type: 'split_into',
                        splitFiles: splitFiles.map(f => f.fileName),
                        timestamp: new Date().toISOString()
                    });
                }
                
                this.logOperation(operation, dryRun);
                console.log(`✂️ ${dryRun ? '[DRY RUN] ' : ''}Split: ${sourceFileName} → ${splitFiles.length} files`);
            }
        });
    }
    
    /**
     * Unisce contenuti di più file
     * @param {Array} sourceFiles - File sorgente
     * @param {string} strategy - Strategia di unione
     * @returns {string} Contenuto unito
     */
    mergeFileContents(sourceFiles, strategy) {
        switch (strategy) {
            case 'concatenate':
                return sourceFiles.map(f => f.content).join('\n\n');
                
            case 'package_merge':
                // Unisce file mantenendo package e import unici
                const packageDeclaration = sourceFiles[0].content.match(/package\s+[^;]+;?/)?.[0] || '';
                const allImports = new Set();
                const allContent = [];
                
                sourceFiles.forEach(file => {
                    const imports = file.content.match(/import\s+[^;]+;?/g) || [];
                    imports.forEach(imp => allImports.add(imp));
                    
                    // Rimuovi package e import dal contenuto
                    let cleanContent = file.content
                        .replace(/package\s+[^;]+;?\s*/, '')
                        .replace(/import\s+[^;]+;?\s*/g, '');
                    
                    allContent.push(cleanContent.trim());
                });
                
                return [
                    packageDeclaration,
                    '',
                    Array.from(allImports).join('\n'),
                    '',
                    allContent.join('\n\n')
                ].filter(Boolean).join('\n');
                
            case 'section_merge':
                // Unisce file con separatori di sezione
                return sourceFiles.map(f => 
                    `// === ${f.fileName} ===\n${f.content}\n// === End ${f.fileName} ===`
                ).join('\n\n');
                
            default:
                return sourceFiles.map(f => f.content).join('\n');
        }
    }
    
    /**
     * Divide contenuto di un file
     * @param {Object} sourceFile - File sorgente
     * @param {Object} splitConfig - Configurazione divisione
     * @returns {Array} Array di file divisi
     */
    splitFileContent(sourceFile, splitConfig) {
        const splitFiles = [];
        
        switch (splitConfig.strategy) {
            case 'by_class':
                // Divide per classi Kotlin/Java
                const classMatches = [...sourceFile.content.matchAll(/class\s+(\w+)[^{]*\{/g)];
                const packageDeclaration = sourceFile.content.match(/package\s+[^;]+;?/)?.[0] || '';
                const imports = sourceFile.content.match(/import\s+[^;]+;?/g) || [];
                
                classMatches.forEach(match => {
                    const className = match[1];
                    const classStart = match.index;
                    
                    // Trova la fine della classe (semplificato)
                    let braceCount = 0;
                    let classEnd = classStart;
                    for (let i = classStart; i < sourceFile.content.length; i++) {
                        if (sourceFile.content[i] === '{') braceCount++;
                        if (sourceFile.content[i] === '}') braceCount--;
                        if (braceCount === 0 && sourceFile.content[i] === '}') {
                            classEnd = i + 1;
                            break;
                        }
                    }
                    
                    const classContent = sourceFile.content.substring(classStart, classEnd);
                    const fullContent = [
                        packageDeclaration,
                        '',
                        imports.join('\n'),
                        '',
                        classContent
                    ].filter(Boolean).join('\n');
                    
                    splitFiles.push({
                        id: this.generateId(),
                        fileName: `${className}.${sourceFile.extension}`,
                        currentPath: `${className}.${sourceFile.extension}`,
                        extension: sourceFile.extension,
                        content: fullContent,
                        size: new Blob([fullContent]).size,
                        lines: fullContent.split('\n').length,
                        operations: [{
                            type: 'split_from',
                            sourceFile: sourceFile.fileName,
                            className: className,
                            timestamp: new Date().toISOString()
                        }],
                        status: 'split_result',
                        isSplit: true,
                        sourceFileId: sourceFile.id,
                        created: new Date().toISOString()
                    });
                });
                break;
                
            case 'by_function':
                // Divide per funzioni
                const functionMatches = [...sourceFile.content.matchAll(/fun\s+(\w+)[^{]*\{/g)];
                // Implementazione simile a by_class
                break;
                
            case 'by_lines':
                // Divide per numero di righe
                const linesPerFile = splitConfig.linesPerFile || 100;
                const lines = sourceFile.content.split('\n');
                
                for (let i = 0; i < lines.length; i += linesPerFile) {
                    const chunkLines = lines.slice(i, i + linesPerFile);
                    const chunkContent = chunkLines.join('\n');
                    const partNumber = Math.floor(i / linesPerFile) + 1;
                    
                    splitFiles.push({
                        id: this.generateId(),
                        fileName: `${sourceFile.fileName.replace(/\.[^.]+$/, '')}_part${partNumber}.${sourceFile.extension}`,
                        currentPath: `${sourceFile.fileName.replace(/\.[^.]+$/, '')}_part${partNumber}.${sourceFile.extension}`,
                        extension: sourceFile.extension,
                        content: chunkContent,
                        size: new Blob([chunkContent]).size,
                        lines: chunkLines.length,
                        operations: [{
                            type: 'split_from',
                            sourceFile: sourceFile.fileName,
                            partNumber: partNumber,
                            timestamp: new Date().toISOString()
                        }],
                        status: 'split_result',
                        isSplit: true,
                        sourceFileId: sourceFile.id,
                        created: new Date().toISOString()
                    });
                }
                break;
        }
        
        return splitFiles;
    }
    
    /**
     * Trova file per nome
     * @param {string} fileName - Nome file
     * @returns {Object|null} File trovato
     */
    findFileByName(fileName) {
        return this.files.find(file => 
            file.fileName === fileName || 
            file.originalPath === fileName ||
            file.currentPath === fileName
        );
    }
    
    /**
     * Unisce path e nome file
     * @param {string} folderPath - Path cartella
     * @param {string} fileName - Nome file
     * @returns {string} Path completo
     */
    joinPath(folderPath, fileName) {
        if (!folderPath) return fileName;
        return folderPath.endsWith('/') ? 
            folderPath + fileName : 
            folderPath + '/' + fileName;
    }
    
    /**
     * Ottiene estensione file
     * @param {string} fileName - Nome file
     * @returns {string} Estensione
     */
    getFileExtension(fileName) {
        return fileName.includes('.') ? 
            fileName.split('.').pop().toLowerCase() : 'txt';
    }
    
    /**
     * Genera ID univoco
     * @returns {string} ID univoco
     */
    generateId() {
        return 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Registra operazione nel log
     * @param {Object} operation - Operazione
     * @param {boolean} dryRun - Solo simulazione
     */
    logOperation(operation, dryRun) {
        this.organizationLog.push({
            ...operation,
            dryRun: dryRun,
            id: this.generateId()
        });
    }
    
    /**
     * Valida e normalizza configurazione
     * @param {Object} config - Configurazione raw
     * @returns {Object} Configurazione validata
     */
    validateAndNormalizeConfig(config) {
        const errors = [];
        const warnings = [];
        
        if (!config || typeof config !== 'object') {
            errors.push('Configurazione deve essere un oggetto JSON valido');
            return { isValid: false, errors, warnings };
        }
        
        // Valida sezioni supportate
        const supportedSections = [
            'fileRenames', 'extensionChanges', 'folderMappings', 
            'contentUpdates', 'copyToMultipleLocations', 
            'mergeFiles', 'splitFiles'
        ];
        
        const configSections = Object.keys(config);
        const unknownSections = configSections.filter(section => 
            !supportedSections.includes(section) && 
            !['projectName', 'description', 'version'].includes(section)
        );
        
        if (unknownSections.length > 0) {
            warnings.push(`Sezioni sconosciute: ${unknownSections.join(', ')}`);
        }
        
        // Valida fileRenames
        if (config.fileRenames) {
            if (typeof config.fileRenames !== 'object') {
                errors.push('fileRenames deve essere un oggetto');
            } else {
                Object.entries(config.fileRenames).forEach(([oldName, newName]) => {
                    if (!oldName || !newName) {
                        errors.push(`Nome file vuoto in fileRenames: ${oldName} → ${newName}`);
                    }
                });
            }
        }
        
        // Valida folderMappings
        if (config.folderMappings) {
            if (typeof config.folderMappings !== 'object') {
                errors.push('folderMappings deve essere un oggetto');
            } else {
                Object.entries(config.folderMappings).forEach(([fileName, folderPath]) => {
                    if (folderPath.includes('..') || folderPath.startsWith('/')) {
                        errors.push(`Path non sicuro in folderMappings: ${folderPath}`);
                    }
                });
            }
        }
        
        // Valida copyToMultipleLocations
        if (config.copyToMultipleLocations) {
            if (typeof config.copyToMultipleLocations !== 'object') {
                errors.push('copyToMultipleLocations deve essere un oggetto');
            } else {
                Object.entries(config.copyToMultipleLocations).forEach(([fileName, locations]) => {
                    if (!Array.isArray(locations)) {
                        errors.push(`Le destinazioni per ${fileName} devono essere un array`);
                    } else if (locations.length === 0) {
                        errors.push(`Almeno una destinazione richiesta per ${fileName}`);
                    }
                });
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            data: config
        };
    }
    
    /**
     * Valida risultati organizzazione
     */
    validateOrganizationResults() {
        const validation = {
            errors: [],
            warnings: [],
            stats: {
                totalFiles: this.files.length,
                renamedFiles: this.files.filter(f => f.status === 'renamed').length,
                movedFiles: this.files.filter(f => f.status === 'moved').length,
                copiedFiles: this.files.filter(f => f.isCopy).length,
                mergedFiles: this.files.filter(f => f.isMerged).length,
                splitFiles: this.files.filter(f => f.isSplit).length
            }
        };
        
        // Controlla conflitti di nomi
        const fileNames = this.files.map(f => f.currentPath);
        const duplicates = fileNames.filter((name, index) => fileNames.indexOf(name) !== index);
        
        if (duplicates.length > 0) {
            validation.errors.push(`File duplicati: ${[...new Set(duplicates)].join(', ')}`);
        }
        
        // Controlla path vuoti o non validi
        const invalidPaths = this.files.filter(f => !f.currentPath || f.currentPath.trim() === '');
        if (invalidPaths.length > 0) {
            validation.errors.push(`${invalidPaths.length} file con path non validi`);
        }
        
        // Controlla dimensioni sospette
        const emptySizeFiles = this.files.filter(f => f.size === 0);
        if (emptySizeFiles.length > 0) {
            validation.warnings.push(`${emptySizeFiles.length} file vuoti`);
        }
        
        this.validationResults = validation;
        
        if (validation.errors.length > 0) {
            console.warn('⚠️ Validation errors found:', validation.errors);
        }
        
        if (validation.warnings.length > 0) {
            console.warn('⚠️ Validation warnings:', validation.warnings);
        }
        
        console.log('📊 Organization stats:', validation.stats);
    }
    
    /**
     * Genera report di organizzazione
     * @returns {Object} Report dettagliato
     */
    generateOrganizationReport() {
        const report = {
            summary: {
                totalFiles: this.files.length,
                totalOperations: this.organizationLog.length,
                timestamp: new Date().toISOString(),
                duration: this.calculateOrganizationDuration()
            },
            operations: this.organizationLog.map(op => ({
                type: op.type,
                description: this.getOperationDescription(op),
                timestamp: op.timestamp,
                dryRun: op.dryRun
            })),
            files: this.files.map(file => ({
                fileName: file.fileName,
                currentPath: file.currentPath,
                originalPath: file.originalPath,
                status: file.status,
                operations: file.operations.length,
                size: file.size,
                isGenerated: file.isCopy || file.isMerged || file.isSplit
            })),
            validation: this.validationResults || null,
            recommendations: this.generateRecommendations()
        };
        
        this.organizationReport = report;
        console.log('📋 Organization report generated');
        
        return report;
    }
    
    /**
     * Ottiene descrizione operazione
     * @param {Object} operation - Operazione
     * @returns {string} Descrizione
     */
    getOperationDescription(operation) {
        switch (operation.type) {
            case 'rename':
                return `Rinominato: ${operation.from} → ${operation.to}`;
            case 'move':
                return `Spostato: ${operation.from} → ${operation.to}`;
            case 'copy':
                return `Copiato: ${operation.originalFile} → ${operation.copyPath}`;
            case 'changeExtension':
                return `Cambiata estensione: ${operation.oldExtension} → ${operation.newExtension}`;
            case 'updateContent':
                return `Aggiornato contenuto: ${operation.file}`;
            case 'merge':
                return `Uniti ${operation.sourceFiles.length} file in ${operation.mergedFile}`;
            case 'split':
                return `Diviso ${operation.sourceFile} in ${operation.splitFiles.length} file`;
            default:
                return `Operazione: ${operation.type}`;
        }
    }
    
    /**
     * Calcola durata organizzazione
     * @returns {number} Durata in millisecondi
     */
    calculateOrganizationDuration() {
        if (this.organizationLog.length === 0) return 0;
        
        const first = new Date(this.organizationLog[0].timestamp);
        const last = new Date(this.organizationLog[this.organizationLog.length - 1].timestamp);
        
        return last.getTime() - first.getTime();
    }
    
    /**
     * Genera raccomandazioni post-organizzazione
     * @returns {Array} Array di raccomandazioni
     */
    generateRecommendations() {
        const recommendations = [];
        
        // Controlla se ci sono molti file nella root
        const rootFiles = this.files.filter(f => !f.folderPath || f.folderPath === '');
        if (rootFiles.length > 10) {
            recommendations.push({
                type: 'organization',
                severity: 'info',
                message: `${rootFiles.length} file nella cartella root`,
                suggestion: 'Considera di organizzare i file in sottocartelle'
            });
        }
        
        // Controlla file molto grandi
        const largeFiles = this.files.filter(f => f.size > 100000); // > 100KB
        if (largeFiles.length > 0) {
            recommendations.push({
                type: 'performance',
                severity: 'warning',
                message: `${largeFiles.length} file molto grandi`,
                suggestion: 'Considera di dividere file grandi in moduli più piccoli'
            });
        }
        
        // Controlla convenzioni di naming
        const badNameFiles = this.files.filter(f => 
            f.fileName.includes(' ') || 
            f.fileName.includes('#') ||
            /[^a-zA-Z0-9._-]/.test(f.fileName)
        );
        
        if (badNameFiles.length > 0) {
            recommendations.push({
                type: 'naming',
                severity: 'info',
                message: `${badNameFiles.length} file con nomi non standard`,
                suggestion: 'Usa solo lettere, numeri, punti, underscore e trattini nei nomi file'
            });
        }
        
        return recommendations;
    }
    
    /**
     * Esporta configurazione per progetto specifico
     * @param {string} projectType - Tipo progetto (android, web, etc.)
     * @returns {Object} Configurazione esportata
     */
    exportConfigTemplate(projectType) {
        const baseTemplate = {
            projectName: "MyProject",
            description: `Template di organizzazione per progetto ${projectType}`,
            version: "1.0.0",
            projectType: projectType,
            timestamp: new Date().toISOString()
        };
        
        switch (projectType) {
            case 'android':
                return {
                    ...baseTemplate,
                    folderMappings: {
                        "MainActivity.kt": "app/src/main/java/com/example/app",
                        "User.kt": "app/src/main/java/com/example/app/data/model",
                        "UserRepository.kt": "app/src/main/java/com/example/app/data/repository",
                        "activity_main.xml": "app/src/main/res/layout",
                        "strings.xml": "app/src/main/res/values",
                        "AndroidManifest.xml": "app/src/main",
                        "build.gradle": "app"
                    },
                    contentUpdates: {
                        "MainActivity.kt": {
                            updatePackage: "com.example.app",
                            addImports: [
                                "androidx.appcompat.app.AppCompatActivity",
                                "android.os.Bundle"
                            ]
                        }
                    }
                };
                
            case 'web':
                return {
                    ...baseTemplate,
                    folderMappings: {
                        "index.html": "public",
                        "App.js": "src/components",
                        "main.css": "src/styles",
                        "api.js": "src/services",
                        "package.json": "."
                    },
                    fileRenames: {
                        "app.js": "App.js",
                        "style.css": "main.css"
                    }
                };
                
            default:
                return {
                    ...baseTemplate,
                    folderMappings: {},
                    fileRenames: {},
                    extensionChanges: {}
                };
        }
    }
    
    /**
     * Ottieni struttura finale del progetto
     * @returns {Object} Struttura ad albero
     */
    getFinalProjectStructure() {
        const structure = {};
        
        this.files.forEach(file => {
            if (file.status === 'merged_source' || file.status === 'split_source') {
                return; // Skip file sorgente di merge/split
            }
            
            const path = file.currentPath;
            const parts = path.split('/');
            
            let current = structure;
            for (let i = 0; i < parts.length - 1; i++) {
                if (!current[parts[i]]) {
                    current[parts[i]] = {};
                }
                current = current[parts[i]];
            }
            
            const fileName = parts[parts.length - 1];
            current[fileName] = {
                size: file.size,
                extension: file.extension,
                operations: file.operations.length,
                isGenerated: file.isCopy || file.isMerged || file.isSplit
            };
        });
        
        return structure;
    }
    
    /**
     * Reset organizer per nuovo uso
     */
    reset() {
        this.files = [];
        this.config = null;
        this.organizationLog = [];
        this.validationResults = null;
        this.organizationReport = null;
        
        console.log('🔄 FileOrganizer reset');
    }
}

export default FileOrganizer;
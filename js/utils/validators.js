/**
 * Validators Module
 * Input validation functions
 */

import { Constants } from './constants.js';

export const Validators = {
    /**
     * Validate package name format
     * @param {string} packageName - Package name to validate
     * @returns {boolean} Is valid
     */
    isValidPackageName(packageName) {
        return Constants.PATTERNS.PACKAGE_NAME.test(packageName) && 
               packageName.length <= Constants.MAX_PACKAGE_NAME_LENGTH;
    },
    
    /**
     * Validate file name
     * @param {string} fileName - File name to validate
     * @returns {boolean} Is valid
     */
    isValidFileName(fileName) {
        const invalidChars = /[<>:"/\\|?*]/;
        return !invalidChars.test(fileName) && 
               fileName.length > 0 && 
               fileName.length <= 255 &&
               !fileName.startsWith('.') &&
               !fileName.endsWith('.');
    },
    
    /**
     * Validate folder path
     * @param {string} path - Folder path to validate
     * @returns {boolean} Is valid
     */
    isValidFolderPath(path) {
        const pattern = /^[a-zA-Z0-9_\-\/]+$/;
        return pattern.test(path) && 
               !path.includes('..') && 
               !path.startsWith('/') &&
               !path.endsWith('/');
    },
    
    /**
     * Validate file path
     * @param {string} path - File path to validate
     * @returns {boolean} Is valid
     */
    isValidFilePath(path) {
        const pattern = /^[a-zA-Z0-9_\-\/\.]+$/;
        return pattern.test(path) && 
               !path.includes('..') && 
               !path.startsWith('/');
    },
    
    /**
     * Validate Kotlin file content
     * @param {string} content - File content
     * @returns {boolean} Is valid
     */
    isValidKotlinFile(content) {
        // Basic Kotlin syntax validation
        const hasPackage = /package\s+[a-z][a-z0-9_.]*/.test(content);
        const hasClass = /class\s+[A-Z][A-Za-z0-9_]*/.test(content);
        const hasFunction = /fun\s+[a-zA-Z][a-zA-Z0-9_]*/.test(content);
        
        // Must have package and at least a class or function
        return hasPackage && (hasClass || hasFunction);
    },
    
    /**
     * Validate Java file content
     * @param {string} content - File content
     * @returns {boolean} Is valid
     */
    isValidJavaFile(content) {
        // Basic Java syntax validation
        const hasPackage = /package\s+[a-z][a-z0-9_.]*\s*;/.test(content);
        const hasClass = /public\s+class\s+[A-Z][A-Za-z0-9_]*/.test(content);
        
        return hasPackage && hasClass;
    },
    
    /**
     * Validate JavaScript file content
     * @param {string} content - File content
     * @returns {boolean} Is valid
     */
    isValidJavaScriptFile(content) {
        // Basic JavaScript syntax validation
        try {
            // Try to parse as JS (this won't execute, just check syntax)
            new Function(content);
            return true;
        } catch (error) {
            // Check for common JS patterns even if syntax check fails
            const hasJSPatterns = /(?:function\s+|const\s+|let\s+|var\s+|class\s+|import\s+|export\s+)/.test(content);
            return hasJSPatterns;
        }
    },
    
    /**
     * Validate JSON content
     * @param {string} content - JSON content
     * @returns {boolean} Is valid
     */
    isValidJson(content) {
        try {
            JSON.parse(content);
            return true;
        } catch (error) {
            return false;
        }
    },
    
    /**
     * Validate XML content
     * @param {string} content - XML content
     * @returns {boolean} Is valid
     */
    isValidXml(content) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/xml');
            
            // Check for parser errors
            const errors = doc.getElementsByTagName('parsererror');
            return errors.length === 0;
        } catch (error) {
            return false;
        }
    },
    
    /**
     * Validate HTML content
     * @param {string} content - HTML content
     * @returns {boolean} Is valid
     */
    isValidHtml(content) {
        // Basic HTML validation
        const hasHtmlTags = /<\/?[a-zA-Z][^>]*>/g.test(content);
        const hasDoctype = /<!DOCTYPE\s+html/i.test(content);
        const hasHtmlStructure = /<html[\s>]/i.test(content) && /<\/html>/i.test(content);
        
        return hasHtmlTags && (hasDoctype || hasHtmlStructure);
    },
    
    /**
     * Validate CSS content
     * @param {string} content - CSS content
     * @returns {boolean} Is valid
     */
    isValidCss(content) {
        // Basic CSS validation
        const hasCssRules = /[^{}]+\s*{[^{}]*}/g.test(content);
        const hasValidSelectors = /[.#]?[a-zA-Z_-][a-zA-Z0-9_-]*\s*{/.test(content);
        
        return hasCssRules || hasValidSelectors;
    },
    
    /**
     * Validate app name
     * @param {string} appName - App name to validate
     * @returns {boolean} Is valid
     */
    isValidAppName(appName) {
        return appName && 
               appName.trim().length >= Constants.MIN_APP_NAME_LENGTH &&
               appName.length <= Constants.MAX_PROJECT_NAME_LENGTH &&
               /^[a-zA-Z0-9\s_-]+$/.test(appName);
    },
    
    /**
     * Validate project name
     * @param {string} projectName - Project name to validate
     * @returns {boolean} Is valid
     */
    isValidProjectName(projectName) {
        return Constants.PATTERNS.PROJECT_NAME.test(projectName) &&
               projectName.length >= 3 &&
               projectName.length <= Constants.MAX_PROJECT_NAME_LENGTH;
    },
    
    /**
     * Validate class name
     * @param {string} className - Class name to validate
     * @returns {boolean} Is valid
     */
    isValidClassName(className) {
        return Constants.PATTERNS.CLASS_NAME.test(className);
    },
    
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Is valid
     */
    isValidEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    },
    
    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @returns {boolean} Is valid
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    },
    
    /**
     * Validate Android version code
     * @param {number} code - Version code to validate
     * @returns {boolean} Is valid
     */
    isValidVersionCode(code) {
        return Number.isInteger(code) && code > 0 && code <= 2100000000;
    },
    
    /**
     * Validate version name format
     * @param {string} version - Version to validate
     * @returns {boolean} Is valid
     */
    isValidVersionName(version) {
        const pattern = /^\d+\.\d+(\.\d+)?(-[a-zA-Z0-9]+)?$/;
        return pattern.test(version);
    },
    
    /**
     * Validate configuration object
     * @param {Object} config - Configuration to validate
     * @returns {Object} Validation result
     */
    validateConfig(config) {
        const errors = [];
        const warnings = [];
        
        if (!config || typeof config !== 'object') {
            errors.push('Configurazione deve essere un oggetto JSON valido');
            return { isValid: false, errors, warnings };
        }
        
        // Validate projectName if present
        if (config.projectName && !this.isValidProjectName(config.projectName)) {
            errors.push('Nome progetto non valido');
        }
        
        // Validate fileRenames section
        if (config.fileRenames) {
            if (typeof config.fileRenames !== 'object') {
                errors.push('fileRenames deve essere un oggetto');
            } else {
                Object.entries(config.fileRenames).forEach(([oldName, newName]) => {
                    if (!this.isValidFileName(oldName)) {
                        errors.push(`Nome file sorgente non valido: ${oldName}`);
                    }
                    if (!this.isValidFileName(newName)) {
                        errors.push(`Nome file destinazione non valido: ${newName}`);
                    }
                });
            }
        }
        
        // Validate folderMappings section
        if (config.folderMappings) {
            if (typeof config.folderMappings !== 'object') {
                errors.push('folderMappings deve essere un oggetto');
            } else {
                Object.entries(config.folderMappings).forEach(([fileName, folderPath]) => {
                    if (!this.isValidFileName(fileName)) {
                        errors.push(`Nome file non valido in folderMappings: ${fileName}`);
                    }
                    if (!this.isValidFolderPath(folderPath)) {
                        errors.push(`Percorso cartella non valido: ${folderPath}`);
                    }
                    if (folderPath.includes('..') || folderPath.startsWith('/')) {
                        errors.push(`Percorso non sicuro: ${folderPath}`);
                    }
                });
            }
        }
        
        // Validate copyToMultipleLocations section
        if (config.copyToMultipleLocations) {
            if (typeof config.copyToMultipleLocations !== 'object') {
                errors.push('copyToMultipleLocations deve essere un oggetto');
            } else {
                Object.entries(config.copyToMultipleLocations).forEach(([fileName, locations]) => {
                    if (!this.isValidFileName(fileName)) {
                        errors.push(`Nome file non valido: ${fileName}`);
                    }
                    
                    if (!Array.isArray(locations)) {
                        errors.push(`Le destinazioni per ${fileName} devono essere un array`);
                    } else if (locations.length === 0) {
                        errors.push(`Almeno una destinazione richiesta per ${fileName}`);
                    } else {
                        locations.forEach((location, index) => {
                            if (typeof location !== 'string') {
                                errors.push(`Destinazione ${index + 1} per ${fileName} deve essere una stringa`);
                            } else if (!this.isValidFilePath(location)) {
                                errors.push(`Percorso destinazione non valido: ${location}`);
                            }
                        });
                    }
                });
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    },
    
    /**
     * Validate Android project configuration
     * @param {Object} config - Android project config
     * @returns {Object} Validation result
     */
    validateAndroidConfig(config) {
        const errors = [];
        const warnings = [];
        
        // Required fields
        if (!config.appName || !this.isValidAppName(config.appName)) {
            errors.push('Nome app non valido');
        }
        
        if (!config.packageName || !this.isValidPackageName(config.packageName)) {
            errors.push('Package name non valido');
        }
        
        // Optional fields validation
        if (config.gradleVersion && !this.isValidVersionName(config.gradleVersion)) {
            warnings.push('Versione Gradle potrebbe non essere valida');
        }
        
        if (config.kotlinVersion && !this.isValidVersionName(config.kotlinVersion)) {
            warnings.push('Versione Kotlin potrebbe non essere valida');
        }
        
        if (config.versionCode && !this.isValidVersionCode(config.versionCode)) {
            errors.push('Version code non valido');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    },
    
    /**
     * Validate web project configuration
     * @param {Object} config - Web project config
     * @returns {Object} Validation result
     */
    validateWebConfig(config) {
        const errors = [];
        const warnings = [];
        
        // Required fields
        if (!config.projectName || !this.isValidProjectName(config.projectName)) {
            errors.push('Nome progetto non valido');
        }
        
        // Validate project type
        const validTypes = ['vanilla', 'react', 'vue', 'angular', 'svelte'];
        if (config.projectType && !validTypes.includes(config.projectType)) {
            warnings.push(`Tipo progetto sconosciuto: ${config.projectType}`);
        }
        
        // Validate features array
        if (config.features && !Array.isArray(config.features)) {
            errors.push('Features deve essere un array');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    },
    
    /**
     * Validate file content based on extension
     * @param {string} content - File content
     * @param {string} extension - File extension
     * @returns {Object} Validation result
     */
    validateFileContent(content, extension) {
        const result = {
            isValid: true,
            errors: [],
            warnings: []
        };
        
        if (!content || content.trim().length === 0) {
            result.isValid = false;
            result.errors.push('File vuoto');
            return result;
        }
        
        switch (extension.toLowerCase()) {
            case 'kt':
                if (!this.isValidKotlinFile(content)) {
                    result.warnings.push('Sintassi Kotlin potrebbe non essere valida');
                }
                break;
                
            case 'java':
                if (!this.isValidJavaFile(content)) {
                    result.warnings.push('Sintassi Java potrebbe non essere valida');
                }
                break;
                
            case 'js':
            case 'jsx':
                if (!this.isValidJavaScriptFile(content)) {
                    result.warnings.push('Sintassi JavaScript potrebbe non essere valida');
                }
                break;
                
            case 'json':
                if (!this.isValidJson(content)) {
                    result.isValid = false;
                    result.errors.push('JSON non valido');
                }
                break;
                
            case 'xml':
                if (!this.isValidXml(content)) {
                    result.warnings.push('XML potrebbe non essere ben formato');
                }
                break;
                
            case 'html':
                if (!this.isValidHtml(content)) {
                    result.warnings.push('HTML potrebbe non essere valido');
                }
                break;
                
            case 'css':
                if (!this.isValidCss(content)) {
                    result.warnings.push('CSS potrebbe non essere valido');
                }
                break;
        }
        
        return result;
    },
    
    /**
     * Validate uploaded files array
     * @param {Array} files - Files to validate
     * @returns {Object} Validation result
     */
    validateFiles(files) {
        const errors = [];
        const warnings = [];
        
        if (!Array.isArray(files)) {
            errors.push('Files deve essere un array');
            return { isValid: false, errors, warnings };
        }
        
        if (files.length === 0) {
            errors.push('Nessun file fornito');
            return { isValid: false, errors, warnings };
        }
        
        if (files.length > Constants.MAX_FILES_COUNT) {
            errors.push(`Troppi file (max ${Constants.MAX_FILES_COUNT})`);
        }
        
        let totalSize = 0;
        const fileNames = new Set();
        
        files.forEach((file, index) => {
            // Check for required properties
            if (!file.name) {
                errors.push(`File ${index + 1}: nome mancante`);
                return;
            }
            
            if (!file.content) {
                errors.push(`File ${file.name}: contenuto mancante`);
                return;
            }
            
            // Check file name validity
            if (!this.isValidFileName(file.name)) {
                errors.push(`Nome file non valido: ${file.name}`);
            }
            
            // Check for duplicates
            if (fileNames.has(file.name.toLowerCase())) {
                errors.push(`File duplicato: ${file.name}`);
            }
            fileNames.add(file.name.toLowerCase());
            
            // Check file size
            const size = file.size || file.content.length;
            if (size > Constants.MAX_FILE_SIZE) {
                errors.push(`File troppo grande: ${file.name}`);
            }
            
            totalSize += size;
            
            // Check file extension
            const extension = file.name.split('.').pop()?.toLowerCase() || '';
            if (!Constants.SUPPORTED_FILE_EXTENSIONS.includes(extension)) {
                warnings.push(`Estensione non supportata: ${file.name}`);
            }
        });
        
        // Check total project size
        if (totalSize > Constants.MAX_PROJECT_SIZE) {
            errors.push('Dimensione totale progetto troppo grande');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            totalSize,
            fileCount: files.length
        };
    },
    
    /**
     * Validate workflow configuration
     * @param {Object} workflow - Workflow to validate
     * @returns {Object} Validation result
     */
    validateWorkflow(workflow) {
        const errors = [];
        const warnings = [];
        
        if (!workflow || typeof workflow !== 'object') {
            errors.push('Workflow deve essere un oggetto');
            return { isValid: false, errors, warnings };
        }
        
        // Required fields
        if (!workflow.name || typeof workflow.name !== 'string') {
            errors.push('Nome workflow obbligatorio');
        }
        
        if (!workflow.steps || !Array.isArray(workflow.steps)) {
            errors.push('Steps workflow obbligatori (array)');
        } else if (workflow.steps.length === 0) {
            errors.push('Workflow deve avere almeno uno step');
        }
        
        // Validate individual steps
        if (workflow.steps) {
            workflow.steps.forEach((step, index) => {
                if (typeof step !== 'string') {
                    errors.push(`Step ${index + 1} deve essere una stringa`);
                }
            });
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    },
    
    /**
     * Create validation summary
     * @param {Array} validationResults - Array of validation results
     * @returns {Object} Summary
     */
    createValidationSummary(validationResults) {
        const summary = {
            totalChecks: validationResults.length,
            passed: 0,
            failed: 0,
            warnings: 0,
            allErrors: [],
            allWarnings: []
        };
        
        validationResults.forEach(result => {
            if (result.isValid) {
                summary.passed++;
            } else {
                summary.failed++;
            }
            
            if (result.errors) {
                summary.allErrors.push(...result.errors);
            }
            
            if (result.warnings) {
                summary.allWarnings.push(...result.warnings);
                summary.warnings++;
            }
        });
        
        summary.isOverallValid = summary.failed === 0;
        summary.hasWarnings = summary.warnings > 0;
        
        return summary;
    }
};

export default Validators;
/**
 * Helpers Module
 * Common utility functions
 */

import { Constants } from './constants.js';

export const Helpers = {
    /**
     * Format file size in human readable format
     * @param {number} bytes - Size in bytes
     * @returns {string} Formatted size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    /**
     * Sanitize project name for file system
     * @param {string} name - Project name
     * @returns {string} Sanitized name
     */
    sanitizeProjectName(name) {
        return name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .substring(0, Constants.MAX_PROJECT_NAME_LENGTH);
    },
    
    /**
     * Generate unique ID
     * @returns {string} Unique ID
     */
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    /**
     * Get file extension from filename
     * @param {string} fileName - File name
     * @returns {string} File extension
     */
    getFileExtension(fileName) {
        return fileName.includes('.') ? 
            fileName.split('.').pop().toLowerCase() : '';
    },
    
    /**
     * Get file icon based on extension
     * @param {string} extension - File extension
     * @returns {string} Icon emoji
     */
    getFileIcon(extension) {
        return Constants.FILE_TYPE_ICONS[extension] || '📄';
    },
    
    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Deep clone object
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    /**
     * Capitalize first letter
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    /**
     * Convert camelCase to kebab-case
     * @param {string} str - String to convert
     * @returns {string} Kebab-case string
     */
    camelToKebab(str) {
        return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    },
    
    /**
     * Convert kebab-case to camelCase
     * @param {string} str - String to convert
     * @returns {string} CamelCase string
     */
    kebabToCamel(str) {
        return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    },
    
    /**
     * Check if string is empty or whitespace
     * @param {string} str - String to check
     * @returns {boolean} Is empty
     */
    isEmptyOrWhitespace(str) {
        return !str || !str.trim();
    },
    
    /**
     * Generate timestamp string
     * @returns {string} ISO timestamp
     */
    getTimestamp() {
        return new Date().toISOString();
    },
    
    /**
     * Format date for display
     * @param {Date|string} date - Date to format
     * @returns {string} Formatted date
     */
    formatDate(date) {
        const d = new Date(date);
        return new Intl.DateTimeFormat('it-IT', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(d);
    },
    
    /**
     * Escape HTML entities
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    /**
     * Download blob as file
     * @param {Blob} blob - Blob to download
     * @param {string} filename - File name
     */
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Success
     */
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const result = document.execCommand('copy');
                document.body.removeChild(textArea);
                return result;
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    },
    
    /**
     * Wait for specified time
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise} Promise that resolves after wait
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    /**
     * Throttle function execution
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit in ms
     * @returns {Function} Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * Get browser info
     * @returns {Object} Browser information
     */
    getBrowserInfo() {
        const ua = navigator.userAgent;
        const browsers = {
            chrome: /Chrome/i.test(ua) && !/Edge/i.test(ua),
            firefox: /Firefox/i.test(ua),
            safari: /Safari/i.test(ua) && !/Chrome/i.test(ua),
            edge: /Edge/i.test(ua)
        };
        
        return {
            ...browsers,
            userAgent: ua,
            language: navigator.language,
            platform: navigator.platform
        };
    },
    
    /**
     * Check if feature is supported
     * @param {string} feature - Feature to check
     * @returns {boolean} Is supported
     */
    isFeatureSupported(feature) {
        switch (feature) {
            case 'es6':
                try {
                    new Function("(a = 0) => a");
                    return true;
                } catch (err) {
                    return false;
                }
            case 'modules':
                return 'noModule' in HTMLScriptElement.prototype;
            case 'fileApi':
                return !!(window.File && window.FileReader && window.FileList && window.Blob);
            case 'clipboard':
                return !!navigator.clipboard;
            default:
                return false;
        }
    },
    
    /**
     * Parse query parameters from URL
     * @param {string} url - URL to parse (optional, defaults to current)
     * @returns {Object} Query parameters
     */
    parseQueryParams(url = window.location.href) {
        const params = {};
        const urlObj = new URL(url);
        for (const [key, value] of urlObj.searchParams) {
            params[key] = value;
        }
        return params;
    },
    
    /**
     * Create URL with query parameters
     * @param {string} baseUrl - Base URL
     * @param {Object} params - Parameters to add
     * @returns {string} URL with parameters
     */
    buildUrl(baseUrl, params) {
        const url = new URL(baseUrl);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
        return url.toString();
    },
    
    /**
     * Validate file against constraints
     * @param {File} file - File to validate
     * @returns {Object} Validation result
     */
    validateFile(file) {
        const errors = [];
        
        // Check size
        if (file.size > Constants.MAX_FILE_SIZE) {
            errors.push(Constants.ERROR_MESSAGES.FILE_TOO_LARGE);
        }
        
        // Check extension
        const extension = this.getFileExtension(file.name);
        if (!Constants.SUPPORTED_FILE_EXTENSIONS.includes(extension)) {
            errors.push(Constants.ERROR_MESSAGES.INVALID_FILE_TYPE);
        }
        
        // Check filename
        if (!Constants.PATTERNS.FILE_NAME.test(file.name)) {
            errors.push('Nome file contiene caratteri non validi');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },
    
    /**
     * Create progress tracker
     * @param {number} total - Total items
     * @returns {Object} Progress tracker
     */
    createProgressTracker(total) {
        let current = 0;
        
        return {
            increment() {
                current++;
                return this.getProgress();
            },
            setProgress(value) {
                current = Math.min(value, total);
                return this.getProgress();
            },
            getProgress() {
                return {
                    current,
                    total,
                    percentage: total > 0 ? Math.round((current / total) * 100) : 0,
                    isComplete: current >= total
                };
            },
            reset() {
                current = 0;
            }
        };
    },
    
    /**
     * Create event emitter
     * @returns {Object} Event emitter
     */
    createEventEmitter() {
        const events = {};
        
        return {
            on(event, callback) {
                if (!events[event]) events[event] = [];
                events[event].push(callback);
            },
            
            off(event, callback) {
                if (events[event]) {
                    events[event] = events[event].filter(cb => cb !== callback);
                }
            },
            
            emit(event, ...args) {
                if (events[event]) {
                    events[event].forEach(callback => callback(...args));
                }
            },
            
            once(event, callback) {
                const onceCallback = (...args) => {
                    callback(...args);
                    this.off(event, onceCallback);
                };
                this.on(event, onceCallback);
            }
        };
    }
};

export default Helpers;
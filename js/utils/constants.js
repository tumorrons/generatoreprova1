/**
 * Constants Module
 * Global constants and configuration values
 */

export const Constants = {
    // Application Info
    APP_NAME: 'Universal Project Builder',
    APP_VERSION: '2.0.0',
    
    // File handling
    SUPPORTED_FILE_EXTENSIONS: [
        'kt', 'java', 'js', 'jsx', 'ts', 'tsx',
        'html', 'css', 'scss', 'sass',
        'json', 'xml', 'yaml', 'yml',
        'md', 'txt', 'py', 'php', 'go', 'rs',
        'cpp', 'c', 'h', 'swift', 'gradle',
        'properties', 'sql'
    ],
    
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_FILES_COUNT: 100,
    MAX_PROJECT_SIZE: 50 * 1024 * 1024, // 50MB
    
    // Project configuration
    DEFAULT_GRADLE_VERSION: '8.1.1',
    DEFAULT_KOTLIN_VERSION: '1.9.0',
    DEFAULT_NODE_VERSION: '18.0.0',
    TARGET_SDK: 34,
    MIN_SDK: 24,
    
    // Generation settings
    DEFAULT_PACKAGE_PREFIX: 'com.example',
    PROJECT_VERSION: '2.0.0',
    GENERATOR_NAME: 'Universal Project Builder v2.0',
    
    // UI constants
    ANIMATION_DURATION: 300,
    STATUS_MESSAGE_DURATION: 5000,
    PROGRESS_UPDATE_INTERVAL: 100,
    
    // Validation
    MAX_PROJECT_NAME_LENGTH: 50,
    MAX_PACKAGE_NAME_LENGTH: 100,
    MIN_APP_NAME_LENGTH: 3,
    
    // File types mapping
    FILE_TYPE_ICONS: {
        'kt': '🟣',
        'java': '☕',
        'js': '🟨',
        'jsx': '⚛️',
        'ts': '🔷',
        'tsx': '⚛️',
        'html': '🌐',
        'css': '🎨',
        'scss': '🎨',
        'json': '📋',
        'xml': '📄',
        'md': '📝',
        'txt': '📄',
        'py': '🐍',
        'php': '💜',
        'gradle': '🔧',
        'sql': '🗃️'
    },
    
    // Language detection patterns
    LANGUAGE_PATTERNS: {
        kotlin: /(?:package\s+|class\s+\w+|fun\s+)/,
        java: /(?:package\s+.*?;|public\s+class\s+|import\s+)/,
        javascript: /(?:function\s+|const\s+|let\s+|var\s+|=>\s*)/,
        typescript: /(?:interface\s+|type\s+\w+\s*=|import.*from)/,
        html: /(?:<!DOCTYPE|<html|<head|<body)/i,
        css: /(?:\.[\w-]+\s*{|@media|@import)/,
        json: /^\s*[{\[]/,
        xml: /^\s*<\?xml|<[\w-]+[\s>]/,
        python: /(?:def\s+|import\s+|from\s+.*import|class\s+)/,
        php: /<\?php|namespace\s+|class\s+\w+/,
        sql: /(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER)\s+/i
    },
    
    // Project types
    PROJECT_TYPES: {
        ANDROID: 'android',
        WEB: 'web',
        REACT: 'react',
        VUE: 'vue',
        ANGULAR: 'angular',
        NODE: 'nodejs',
        PYTHON: 'python',
        GENERIC: 'generic'
    },
    
    // Workflow definitions
    WORKFLOWS: {
        CODE_TO_FILES: 'codeToFiles',
        ANDROID_PROJECT: 'androidProject',
        WEB_PROJECT: 'webProject',
        CUSTOM_ORGANIZATION: 'customOrganization'
    },
    
    // Storage keys
    STORAGE_KEYS: {
        APP_STATE: 'universalProjectBuilder',
        USER_PREFERENCES: 'upb_preferences',
        RECENT_CONFIGS: 'upb_recent_configs'
    },
    
    // API endpoints (if needed for future extensions)
    API_ENDPOINTS: {
        TEMPLATES: '/api/templates',
        VALIDATE: '/api/validate',
        GENERATE: '/api/generate'
    },
    
    // Error messages
    ERROR_MESSAGES: {
        FILE_TOO_LARGE: 'File troppo grande (max 10MB)',
        INVALID_FILE_TYPE: 'Tipo di file non supportato',
        NO_FILES_SELECTED: 'Nessun file selezionato',
        INVALID_CONFIG: 'Configurazione non valida',
        GENERATION_FAILED: 'Errore nella generazione del progetto',
        NETWORK_ERROR: 'Errore di connessione'
    },
    
    // Success messages
    SUCCESS_MESSAGES: {
        FILES_EXTRACTED: 'File estratti con successo',
        PROJECT_GENERATED: 'Progetto generato con successo',
        CONFIG_LOADED: 'Configurazione caricata',
        FILES_ORGANIZED: 'File organizzati correttamente'
    },
    
    // CSS Classes
    CSS_CLASSES: {
        LOADING: 'loading',
        SUCCESS: 'success',
        ERROR: 'error',
        WARNING: 'warning',
        ACTIVE: 'active',
        DISABLED: 'disabled',
        HIDDEN: 'hidden'
    },
    
    // Regex patterns
    PATTERNS: {
        PACKAGE_NAME: /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/,
        CLASS_NAME: /^[A-Z][A-Za-z0-9_]*$/,
        FILE_NAME: /^[a-zA-Z0-9_.-]+$/,
        PROJECT_NAME: /^[a-zA-Z0-9_-]+$/
    }
};

export default Constants;
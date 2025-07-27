/**
 * ZIP Builder Module
 */
export class ZipBuilder {
    constructor() {
        console.log('📦 ZipBuilder initialized');
    }
    
    async createProjectZip(files, options = {}) {
        console.log('📦 Creating project ZIP...');
        
        const zip = new JSZip();
        const projectName = options.projectName || 'project';
        const projectFolder = zip.folder(projectName);
        
        files.forEach(file => {
            projectFolder.file(file.fileName || file.name, file.content);
        });
        
        return await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });
    }
    
    async createSimpleZip(files) {
        const zip = new JSZip();
        
        files.forEach(file => {
            zip.file(file.fileName || file.name, file.content);
        });
        
        return await zip.generateAsync({ type: 'blob' });
    }
}

export default ZipBuilder;
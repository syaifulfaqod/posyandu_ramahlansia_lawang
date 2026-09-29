const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const zip = new JSZip();

const excludeDirs = ['.git', 'node_modules', '.next', '.vercel'];

function addDirectoryToZip(dirPath, zipFolder) {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
        if (excludeDirs.includes(item)) continue;
        
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            addDirectoryToZip(fullPath, zipFolder.folder(item));
        } else {
            // Exclude zip file itself and this script
            if (item.endsWith('.zip') || item === 'create_zip.js' || item.endsWith('.bak')) continue;
            zipFolder.file(item, fs.readFileSync(fullPath));
        }
    }
}

console.log('Adding files to zip...');
addDirectoryToZip(__dirname, zip);

console.log('Generating zip file (this might take a minute)...');
zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true, compression: 'DEFLATE' })
    .pipe(fs.createWriteStream('PosyanduWeb_cPanel.zip'))
    .on('finish', () => {
        console.log('PosyanduWeb_cPanel.zip created successfully!');
    });

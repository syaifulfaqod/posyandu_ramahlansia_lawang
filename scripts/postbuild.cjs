const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const { execSync } = require('child_process');

// =============================================
//   Postbuild Script — Auto ZIP untuk cPanel
//   ZIP Frontend (static) + Backend (Express)
// =============================================

const ROOT_DIR = path.resolve(__dirname, '..');
const SERVER_DIR = path.join(ROOT_DIR, 'server');

// Frontend: Vite build output (static files)
const FRONTEND_DIST = path.join(ROOT_DIR, 'dist');
const FRONTEND_ZIP = path.join(ROOT_DIR, 'PosyanduWeb_Cpanel.zip');

// Backend paths
const BACKEND_DIST = path.join(SERVER_DIR, 'dist');
const BACKEND_ZIP = path.join(ROOT_DIR, 'PosyanduAPI_Cpanel.zip');

// ---- Utility Functions ----

async function addFolderToZip(zip, folderPath, zipFolder) {
  let entries;
  try {
    entries = fs.readdirSync(folderPath, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);
    const zipPath = zipFolder ? `${zipFolder}/${entry.name}` : entry.name;
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        await addFolderToZip(zip, fullPath, zipPath);
      } else if (stat.isFile()) {
        zip.file(zipPath, fs.readFileSync(fullPath));
      }
    } catch {
      continue;
    }
  }
}

async function createZip(sourceDir, outputPath, label) {
  console.log(`  -> Membuat ${label} ZIP...`);
  const zip = new JSZip();
  await addFolderToZip(zip, sourceDir, '');
  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
  fs.writeFileSync(outputPath, content);
  const sizeMB = (content.length / 1024 / 1024).toFixed(1);
  return sizeMB;
}

// ---- Build Functions ----

async function buildFrontend() {
  console.log('');
  console.log('[Frontend] Membuat ZIP static files...');

  if (!fs.existsSync(FRONTEND_DIST)) {
    console.error('ERROR: Folder dist/ tidak ditemukan! Pastikan vite build sukses.');
    process.exit(1);
  }

  // Tambah .htaccess untuk SPA routing di cPanel
  const htaccess = `RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
`;
  fs.writeFileSync(path.join(FRONTEND_DIST, '.htaccess'), htaccess);

  const sizeMB = await createZip(FRONTEND_DIST, FRONTEND_ZIP, 'Frontend');
  console.log(`  -> DONE: PosyanduWeb_Cpanel.zip (${sizeMB} MB)`);
}

async function buildBackend() {
  console.log('');
  console.log('[Backend]  Building & ZIP API server...');

  // Compile TypeScript
  console.log('  -> Compiling TypeScript...');
  try {
    execSync('npm run build', { cwd: SERVER_DIR, stdio: 'pipe' });
  } catch (err) {
    console.error('ERROR: Backend TypeScript build gagal!');
    console.error(err.stderr?.toString() || err.message);
    process.exit(1);
  }

  if (!fs.existsSync(BACKEND_DIST)) {
    console.error('ERROR: Folder server/dist tidak ditemukan!');
    process.exit(1);
  }

  // Buat temp folder untuk backend ZIP
  const tempDir = path.join(ROOT_DIR, '.temp_backend_build');
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true });
  fs.mkdirSync(tempDir, { recursive: true });

  // Copy file yang dibutuhkan
  const filesToCopy = ['package.json', 'package-lock.json', '.env.example', '.npmrc', 'server.js', 'app.js'];
  for (const file of filesToCopy) {
    const src = path.join(SERVER_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(tempDir, file));
    }
  }

  // Copy dist folder
  copyDirSync(BACKEND_DIST, path.join(tempDir, 'dist'));

  const sizeMB = await createZip(tempDir, BACKEND_ZIP, 'Backend');
  fs.rmSync(tempDir, { recursive: true });
  console.log(`  -> DONE: PosyanduAPI_Cpanel.zip (${sizeMB} MB)`);
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ---- Main ----

async function main() {
  console.log('');
  console.log('=============================================');
  console.log('  Membuat ZIP untuk deploy ke cPanel...');
  console.log('=============================================');

  await buildFrontend();
  await buildBackend();

  console.log('');
  console.log('=============================================');
  console.log('  SUKSES! File siap di-upload ke cPanel:');
  console.log('=============================================');
  console.log('  [Frontend] PosyanduWeb_Cpanel.zip      -> ekstrak di public_html');
  console.log('  [Backend]  PosyanduAPI_Cpanel.zip      -> ekstrak di api folder');
  console.log('');
}

main().catch((err) => {
  console.error('Build gagal:', err);
  process.exit(1);
});

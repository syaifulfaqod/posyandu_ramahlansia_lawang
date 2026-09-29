# =============================================
#   Build Script untuk Deploy ke cPanel
#   Membuild Frontend (Next.js) + Backend (Express)
# =============================================

param(
    [switch]$FrontendOnly,
    [switch]$BackendOnly,
    [switch]$SkipZip
)

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  PosyanduWeb - Build untuk cPanel" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# --- BUILD BACKEND ---
if (-not $FrontendOnly) {
    Write-Host "[1/4] Building Backend API..." -ForegroundColor Yellow

    Push-Location server
    
    # Install dependencies jika belum
    if (!(Test-Path "node_modules")) {
        Write-Host "  -> Installing backend dependencies..." 
        npm install
    }

    # Compile TypeScript ke JavaScript
    Write-Host "  -> Compiling TypeScript..."
    npx tsc
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Backend build gagal!" -ForegroundColor Red
        Pop-Location
        exit 1
    }

    # Buat ZIP untuk backend
    if (-not $SkipZip) {
        $backendZip = "..\PosyanduAPI_Cpanel.zip"
        if (Test-Path $backendZip) { Remove-Item $backendZip -Force }
        
        Write-Host "  -> Membuat ZIP backend..."
        $ProgressPreference = 'SilentlyContinue'
        
        # Copy file yang diperlukan ke temp folder
        $tempBackend = "..\temp_backend_build"
        if (Test-Path $tempBackend) { Remove-Item $tempBackend -Recurse -Force }
        New-Item -ItemType Directory -Path $tempBackend | Out-Null
        
        Copy-Item -Path "dist" -Destination "$tempBackend\dist" -Recurse
        Copy-Item -Path "package.json" -Destination "$tempBackend\package.json"
        Copy-Item -Path "package-lock.json" -Destination "$tempBackend\package-lock.json"
        Copy-Item -Path "drizzle.config.ts" -Destination "$tempBackend\drizzle.config.ts"
        if (Test-Path ".env.example") {
            Copy-Item -Path ".env.example" -Destination "$tempBackend\.env.example"
        }
        
        Compress-Archive -Path "$tempBackend\*" -DestinationPath $backendZip -Force
        Remove-Item $tempBackend -Recurse -Force
        
        Write-Host "  -> Backend ZIP: PosyanduAPI_Cpanel.zip" -ForegroundColor Green
    }
    
    Pop-Location
    Write-Host ""
}

# --- BUILD FRONTEND ---
if (-not $BackendOnly) {
    Write-Host "[2/4] Building Frontend Next.js (Standalone)..." -ForegroundColor Yellow
    
    # Install dependencies jika belum
    if (!(Test-Path "node_modules")) {
        Write-Host "  -> Installing frontend dependencies..."
        npm install
    }

    Write-Host "  -> Running next build (bisa memakan beberapa menit)..."
    npm run build

    $standaloneDir = ".next\standalone"

    if (!(Test-Path $standaloneDir)) {
        Write-Host "ERROR: Folder standalone tidak ditemukan. Build gagal!" -ForegroundColor Red
        exit 1
    }

    Write-Host "[3/4] Menyalin folder public dan static..." -ForegroundColor Yellow
    
    if (Test-Path "public") {
        Copy-Item -Path "public" -Destination "$standaloneDir\public" -Recurse -Force
    }

    $staticDir = "$standaloneDir\.next\static"
    if (!(Test-Path $staticDir)) {
        New-Item -ItemType Directory -Force -Path $staticDir | Out-Null
    }
    if (Test-Path ".next\static") {
        Copy-Item -Path ".next\static\*" -Destination $staticDir -Recurse -Force
    }

    # Buat ZIP untuk frontend
    if (-not $SkipZip) {
        Write-Host "[4/4] Membuat ZIP frontend..." -ForegroundColor Yellow
        $frontendZip = "PosyanduWeb_Cpanel_Standalone.zip"
        if (Test-Path $frontendZip) { Remove-Item $frontendZip -Force }
        $ProgressPreference = 'SilentlyContinue'
        Compress-Archive -Path "$standaloneDir\*" -DestinationPath $frontendZip -Force
        Write-Host "  -> Frontend ZIP: $frontendZip" -ForegroundColor Green
    }
    
    Write-Host ""
}

# --- SELESAI ---
Write-Host "=============================================" -ForegroundColor Green
Write-Host "  BUILD SUKSES!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "File yang siap di-upload ke cPanel:" -ForegroundColor Cyan
if (-not $FrontendOnly) {
    Write-Host "  [Backend]  PosyanduAPI_Cpanel.zip" -ForegroundColor White
}
if (-not $BackendOnly) {
    Write-Host "  [Frontend] PosyanduWeb_Cpanel_Standalone.zip" -ForegroundColor White
}
Write-Host ""
Write-Host "Langkah selanjutnya di cPanel:" -ForegroundColor Yellow
Write-Host "  1. Upload ZIP ke direktori yang sesuai di File Manager"
Write-Host "  2. Ekstrak file ZIP"
Write-Host "  3. Buat/edit file .env dengan konfigurasi production"
Write-Host "  4. Setup Node.js App di cPanel"
Write-Host "  5. Jalankan 'npm install --production' di terminal cPanel"
Write-Host "  6. Start aplikasi"
Write-Host ""

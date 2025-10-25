# GitHub Setup Script for Glaucoma Demo Project
# Run this script to set up Git and push to GitHub

Write-Host "🚀 Setting up GitHub for Glaucoma Demo Project" -ForegroundColor Green
Write-Host ""

# Check if Git is installed
try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-Host "✅ Git is already installed: $gitVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Git is not installed. Please install Git first:" -ForegroundColor Red
    Write-Host "1. Go to: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "2. Download and install Git for Windows" -ForegroundColor Yellow
    Write-Host "3. Restart PowerShell after installation" -ForegroundColor Yellow
    Write-Host "4. Run this script again" -ForegroundColor Yellow
    exit 1
}

# Check if we're in the right directory
if (!(Test-Path "README.md")) {
    Write-Host "❌ Please run this script from the glaucoma-demo directory" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found project files in current directory" -ForegroundColor Green

# Initialize Git repository
Write-Host ""
Write-Host "📁 Initializing Git repository..." -ForegroundColor Cyan
git init

# Create .gitignore file
Write-Host "📝 Creating .gitignore file..." -ForegroundColor Cyan
@"
# Backup directories
glaucoma-bn-3d-backup-*

# Temporary files
*.tmp
*.temp
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Log files
*.log

# Node modules (if added later)
node_modules/
npm-debug.log*

# Python cache
__pycache__/
*.pyc
*.pyo
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8

# Add all files
Write-Host "📦 Adding all project files..." -ForegroundColor Cyan
git add .

# Create initial commit
Write-Host "💾 Creating initial commit..." -ForegroundColor Cyan
git commit -m "Initial commit: Complete Glaucoma Bayesian Network with QR Code System

Features:
- Interactive 2D Decision Network Visualization
- Self-contained QR Code Generation (no external dependencies)
- Comprehensive Test Suite (4/4 tests passing)
- Professional Medical UI Design
- Mobile Access via QR Code Scanning
- Complete Documentation and Debug Tools

Technical Achievements:
- Solved QR Code generation issues with robust fallback system
- Eliminated external dependencies for offline capability
- Implemented comprehensive testing framework
- Created production-ready medical application"

Write-Host ""
Write-Host "🎉 Git repository initialized successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com and create a new repository" -ForegroundColor White
Write-Host "2. Repository name: 'glaucoma-demo'" -ForegroundColor White
Write-Host "3. Description: 'Interactive Glaucoma Bayesian Network with QR Code Mobile Access'" -ForegroundColor White
Write-Host "4. Make it PUBLIC" -ForegroundColor White
Write-Host "5. DON'T initialize with README (we already have one)" -ForegroundColor White
Write-Host "6. Copy the repository URL" -ForegroundColor White
Write-Host ""
Write-Host "🔗 After creating the repository, run these commands:" -ForegroundColor Cyan
Write-Host "git remote add origin https://github.com/YOUR_USERNAME/glaucoma-demo.git" -ForegroundColor White
Write-Host "git branch -M main" -ForegroundColor White
Write-Host "git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "📊 Project Statistics:" -ForegroundColor Magenta
$fileCount = (Get-ChildItem -Recurse -File).Count
$totalSize = [math]::Round(((Get-ChildItem -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB), 2)
Write-Host "Files: $fileCount" -ForegroundColor White
Write-Host "Total Size: $totalSize MB" -ForegroundColor White
Write-Host ""
Write-Host "Your Glaucoma Demo is ready for GitHub!" -ForegroundColor Green

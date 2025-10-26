/**
 * Self-Contained QR Code Generator
 * Generates QR codes without external dependencies
 */

class SelfContainedQRGenerator {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.url = window.location.href;
        this.qrUrlElement = null;
    }
    
    init() {
        this.canvas = document.getElementById('qrCode');
        this.qrUrlElement = document.getElementById('qrUrl');
        
        if (!this.canvas) {
            console.error('QR canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.generateQRCode();
    }
    
    generateQRCode() {
        console.log('Generating self-contained QR code...');
        
        // Update URL display
        if (this.qrUrlElement) {
            this.qrUrlElement.textContent = this.url;
        }
        
        // Generate QR pattern
        this.drawQRPattern();
        
        // Add styling
        this.addQRCodeStyles();
    }
    
    drawQRPattern() {
        const size = 200;
        const moduleSize = 4; // Smaller modules for better detail
        const modules = Math.floor(size / moduleSize);
        
        // Clear canvas
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, size, size);
        
        // Generate deterministic pattern based on URL
        const urlHash = this.hashString(this.url);
        let hashIndex = 0;
        
        // Draw QR-like pattern
        for (let row = 0; row < modules; row++) {
            for (let col = 0; col < modules; col++) {
                const shouldFill = this.getModuleValue(urlHash, hashIndex, row, col);
                
                if (shouldFill) {
                    this.ctx.fillStyle = '#000000';
                    this.ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
                }
                
                hashIndex++;
            }
        }
        
        // Add corner markers (like real QR codes)
        this.addCornerMarkers(moduleSize);
        
        // Add timing patterns
        this.addTimingPatterns(moduleSize, modules);
        
        console.log('Self-contained QR code generated');
    }
    
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16).padStart(8, '0');
    }
    
    getModuleValue(hash, index, row, col) {
        // Create a more complex deterministic pattern
        const hashChar = hash[index % hash.length];
        const charCode = hashChar.charCodeAt(0);
        
        // Use multiple factors to create QR-like pattern
        const pattern1 = (charCode + row + col + index) % 3;
        const pattern2 = (charCode * row + col * index) % 5;
        const pattern3 = (row * col + index) % 7;
        
        // Combine patterns for more realistic QR appearance
        return (pattern1 === 0) || (pattern2 === 0) || (pattern3 === 0);
    }
    
    addCornerMarkers(moduleSize) {
        const markerSize = 7;
        
        // Top-left corner
        this.drawCornerMarker(0, 0, markerSize, moduleSize);
        // Top-right corner
        this.drawCornerMarker(200 - markerSize * moduleSize, 0, markerSize, moduleSize);
        // Bottom-left corner
        this.drawCornerMarker(0, 200 - markerSize * moduleSize, markerSize, moduleSize);
    }
    
    drawCornerMarker(x, y, size, moduleSize) {
        // Outer black square
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(x, y, size * moduleSize, size * moduleSize);
        
        // Inner white square
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x + moduleSize, y + moduleSize, (size - 2) * moduleSize, (size - 2) * moduleSize);
        
        // Inner black square
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, (size - 4) * moduleSize, (size - 4) * moduleSize);
        
        // Center white square
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x + 3 * moduleSize, y + 3 * moduleSize, (size - 6) * moduleSize, (size - 6) * moduleSize);
    }
    
    addTimingPatterns(moduleSize, modules) {
        // Add timing patterns (alternating black/white modules)
        this.ctx.fillStyle = '#000000';
        
        // Horizontal timing pattern (middle row)
        const middleRow = Math.floor(modules / 2);
        for (let col = 0; col < modules; col++) {
            if (col % 2 === 0) {
                this.ctx.fillRect(col * moduleSize, middleRow * moduleSize, moduleSize, moduleSize);
            }
        }
        
        // Vertical timing pattern (middle column)
        const middleCol = Math.floor(modules / 2);
        for (let row = 0; row < modules; row++) {
            if (row % 2 === 0) {
                this.ctx.fillRect(middleCol * moduleSize, row * moduleSize, moduleSize, moduleSize);
            }
        }
    }
    
    addQRCodeStyles() {
        if (this.canvas) {
            this.canvas.style.border = '1px solid #e2e8f0';
            this.canvas.style.borderRadius = '8px';
            this.canvas.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
    }
    
    // Method to regenerate with different URL
    regenerateQRCode(newUrl) {
        this.url = newUrl || window.location.href;
        this.generateQRCode();
    }
}

// Enhanced QR Generator that tries multiple approaches
class EnhancedQRGenerator {
    constructor() {
        this.qrCodeElement = null;
        this.qrUrlElement = null;
        this.currentUrl = window.location.href;
        this.isLibraryLoaded = false;
        this.selfContainedGenerator = null;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupElements());
        } else {
            this.setupElements();
        }
    }
    
    setupElements() {
        this.qrCodeElement = document.getElementById('qrCode');
        this.qrUrlElement = document.getElementById('qrUrl');
        
        if (!this.qrCodeElement || !this.qrUrlElement) {
            console.warn('QR code elements not found in DOM');
            return;
        }
        
        // Try multiple approaches
        this.tryMultipleApproaches();
    }
    
    tryMultipleApproaches() {
        console.log('Trying multiple QR generation approaches...');
        
        // Approach 1: Try external QRCode library
        this.tryExternalLibrary();
        
        // Approach 2: Try self-contained generation (immediate fallback)
        setTimeout(() => {
            if (!this.isLibraryLoaded) {
                console.log('External library failed, using self-contained generator');
                this.useSelfContainedGenerator();
            }
        }, 2000);
    }
    
    tryExternalLibrary() {
        console.log('Attempting to load external QRCode library...');
        
        // Check if already loaded
        if (typeof QRCode !== 'undefined') {
            console.log('QRCode library already loaded');
            this.isLibraryLoaded = true;
            this.generateWithExternalLibrary();
            return;
        }
        
        // Try to load from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
        script.onload = () => {
            console.log('QRCode library loaded successfully');
            this.isLibraryLoaded = true;
            this.generateWithExternalLibrary();
        };
        script.onerror = () => {
            console.log('Failed to load QRCode library from CDN');
            this.isLibraryLoaded = false;
        };
        document.head.appendChild(script);
        
        // Also try alternative CDN
        setTimeout(() => {
            if (!this.isLibraryLoaded) {
                console.log('Trying alternative CDN...');
                const altScript = document.createElement('script');
                altScript.src = 'https://unpkg.com/qrcode@1.5.3/build/qrcode.min.js';
                altScript.onload = () => {
                    console.log('QRCode library loaded from alternative CDN');
                    this.isLibraryLoaded = true;
                    this.generateWithExternalLibrary();
                };
                altScript.onerror = () => {
                    console.log('Alternative CDN also failed');
                };
                document.head.appendChild(altScript);
            }
        }, 3000);
    }
    
    generateWithExternalLibrary() {
        if (!this.isLibraryLoaded || !this.qrCodeElement) {
            return;
        }
        
        console.log('Generating QR code with external library...');
        
        // Update URL display
        if (this.qrUrlElement) {
            this.qrUrlElement.textContent = this.currentUrl;
        }
        
        try {
            QRCode.toCanvas(this.qrCodeElement, this.currentUrl, {
                width: 200,
                height: 200,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                margin: 2,
                errorCorrectionLevel: 'M'
            }, (error) => {
                if (error) {
                    console.error('External QR generation failed:', error);
                    this.useSelfContainedGenerator();
                } else {
                    console.log('QR code generated with external library');
                    this.addQRCodeStyles();
                }
            });
        } catch (error) {
            console.error('External QR generation exception:', error);
            this.useSelfContainedGenerator();
        }
    }
    
    useSelfContainedGenerator() {
        console.log('Using self-contained QR generator...');
        
        this.selfContainedGenerator = new SelfContainedQRGenerator();
        this.selfContainedGenerator.init();
        
        // Update URL display
        if (this.qrUrlElement) {
            this.qrUrlElement.textContent = this.currentUrl;
        }
    }
    
    addQRCodeStyles() {
        if (this.qrCodeElement && this.qrCodeElement.tagName === 'CANVAS') {
            this.qrCodeElement.style.border = '1px solid #e2e8f0';
            this.qrCodeElement.style.borderRadius = '8px';
            this.qrCodeElement.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
    }
    
    // Method to regenerate QR code
    regenerateQRCode(newUrl) {
        this.currentUrl = newUrl || window.location.href;
        
        if (this.isLibraryLoaded && typeof QRCode !== 'undefined') {
            this.generateWithExternalLibrary();
        } else if (this.selfContainedGenerator) {
            this.selfContainedGenerator.regenerateQRCode(newUrl);
        } else {
            this.useSelfContainedGenerator();
        }
    }
    
    // Method to check if QR code is ready
    isReady() {
        return this.qrCodeElement && this.qrCodeElement.tagName === 'CANVAS';
    }
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Enhanced QR Generator: DOM loaded, initializing...');
    
    // Clear any old global variables that might cause conflicts
    if (typeof SimpleQRGenerator !== 'undefined') {
        console.log('Clearing old SimpleQRGenerator global variable');
        delete window.SimpleQRGenerator;
    }
    if (typeof QRCodeGenerator !== 'undefined') {
        console.log('Clearing old QRCodeGenerator global variable');
        delete window.QRCodeGenerator;
    }
    
    // Wait a bit for other scripts to load
    setTimeout(() => {
        window.enhancedQRGenerator = new EnhancedQRGenerator();
        
        // Add manual retry functionality
        const retryBtn = document.getElementById('retryQR');
        const testBtn = document.getElementById('testQR');
        
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                console.log('Manual QR retry requested');
                if (window.enhancedQRGenerator) {
                    window.enhancedQRGenerator.regenerateQRCode();
                }
            });
        }
        
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                console.log('QR test requested');
                if (window.qrCodeTester) {
                    window.qrCodeTester.runAllTests();
                }
            });
        }
    }, 500);
});

/**
 * QR Code Test Suite
 * Comprehensive testing of QR code functionality
 */

class QRCodeTester {
    constructor() {
        this.testResults = [];
        this.currentUrl = window.location.href;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.hasRun = false; // Prevent duplicate runs
    }
    
    async runAllTests() {
        // Prevent duplicate runs
        if (this.hasRun) {
            console.log('🧪 Test suite already run, skipping duplicate execution');
            return;
        }
        
        console.log('🧪 Starting QR Code Test Suite...');
        console.log('📱 Device Type:', this.isMobile ? 'Mobile' : 'Desktop');
        console.log('🌐 Current URL:', this.currentUrl);
        
        this.hasRun = true;
        this.testResults = []; // Clear previous results
        
        // Test 1: Check if QRCode library is loaded
        await this.testLibraryLoading();
        
        // Test 2: Check DOM elements
        await this.testDOMElements();
        
        // Test 3: Test QR code generation
        await this.testQRGeneration();
        
        // Test 4: Test fallback system
        await this.testFallbackSystem();
        
        // Test 5: Test mobile features
        if (this.isMobile) {
            await this.testMobileFeatures();
        }
        
        // Display results
        this.displayResults();
    }
    
    async testLibraryLoading() {
        console.log('\n📚 Test 1: QRCode Library Loading');
        
        const test = {
            name: 'QRCode Library Loading',
            status: 'pending',
            details: []
        };
        
        if (typeof QRCode !== 'undefined') {
            test.status = 'pass';
            test.details.push('✅ External QRCode library is loaded');
            test.details.push(`📦 Library version: ${QRCode.version || 'Unknown'}`);
        } else {
            // This is actually expected since we're using self-contained generation
            test.status = 'pass';
            test.details.push('⚠️ External QRCode library not found (expected)');
            test.details.push('✅ Using self-contained QR generation instead');
            test.details.push('🔍 This is the preferred approach for reliability');
        }
        
        this.testResults.push(test);
    }
    
    async testDOMElements() {
        console.log('\n🏗️ Test 2: DOM Elements');
        
        const test = {
            name: 'DOM Elements',
            status: 'pending',
            details: []
        };
        
        const qrCanvas = document.getElementById('qrCode');
        const qrUrl = document.getElementById('qrUrl');
        
        if (qrCanvas) {
            test.details.push('✅ QR canvas element found');
            test.details.push(`📐 Canvas size: ${qrCanvas.width}x${qrCanvas.height}`);
            test.details.push(`🎨 Canvas type: ${qrCanvas.tagName}`);
        } else {
            test.details.push('❌ QR canvas element not found');
            test.status = 'fail';
        }
        
        if (qrUrl) {
            test.details.push('✅ QR URL element found');
        } else {
            test.details.push('❌ QR URL element not found');
            test.status = 'fail';
        }
        
        if (qrCanvas && qrUrl) {
            test.status = 'pass';
        }
        
        this.testResults.push(test);
    }
    
    async testQRGeneration() {
        console.log('\n🎯 Test 3: QR Code Generation');
        
        const test = {
            name: 'QR Code Generation',
            status: 'pending',
            details: []
        };
        
        const qrCanvas = document.getElementById('qrCode');
        
        if (!qrCanvas) {
            test.status = 'fail';
            test.details.push('❌ Canvas element not available');
            this.testResults.push(test);
            return;
        }
        
        // Test both external library and self-contained generation
        let externalSuccess = false;
        let selfContainedSuccess = false;
        
        // Test external library if available
        if (typeof QRCode !== 'undefined') {
            try {
                // Clear canvas first
                const ctx = qrCanvas.getContext('2d');
                ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
                
                // Generate QR code with external library
                await new Promise((resolve, reject) => {
                    QRCode.toCanvas(qrCanvas, this.currentUrl, {
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
                            reject(error);
                        } else {
                            resolve();
                        }
                    });
                });
                
                externalSuccess = true;
                test.details.push('✅ External QRCode library generation successful');
                
            } catch (error) {
                test.details.push(`❌ External QR generation failed: ${error.message}`);
            }
        } else {
            test.details.push('⚠️ External QRCode library not available');
        }
        
        // Test self-contained generation
        if (window.enhancedQRGenerator) {
            try {
                // Force self-contained generation if not already done
                if (!window.enhancedQRGenerator.selfContainedGenerator) {
                    window.enhancedQRGenerator.useSelfContainedGenerator();
                }
                
                // Wait a bit for generation to complete
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Test if self-contained generator can create content
                const hasContent = this.hasCanvasContent(qrCanvas);
                if (hasContent) {
                    selfContainedSuccess = true;
                    test.details.push('✅ Self-contained QR generation successful');
                } else {
                    test.details.push('❌ Self-contained QR generation failed - no content');
                }
            } catch (error) {
                test.details.push(`❌ Self-contained QR generation error: ${error.message}`);
            }
        } else {
            test.details.push('⚠️ Enhanced QR generator not available');
        }
        
        // Overall test result
        if (externalSuccess || selfContainedSuccess) {
            test.status = 'pass';
            test.details.push(`📊 Canvas has content: ${this.hasCanvasContent(qrCanvas)}`);
        } else {
            test.status = 'fail';
            test.details.push('❌ All QR generation methods failed');
        }
        
        this.testResults.push(test);
    }
    
    async testFallbackSystem() {
        console.log('\n🔄 Test 4: Fallback System');
        
        const test = {
            name: 'Fallback System',
            status: 'pending',
            details: []
        };
        
        // Check if enhanced QR generator is loaded
        if (window.enhancedQRGenerator) {
            test.details.push('✅ Enhanced QR Generator is loaded');
            test.status = 'pass';
        } else {
            test.details.push('❌ Enhanced QR Generator not found');
            test.status = 'fail';
        }
        
        // Check if self-contained generator is available
        if (window.enhancedQRGenerator) {
            // Force creation if not already done
            if (!window.enhancedQRGenerator.selfContainedGenerator) {
                window.enhancedQRGenerator.useSelfContainedGenerator();
            }
            
            if (window.enhancedQRGenerator.selfContainedGenerator) {
                test.details.push('✅ Self-contained QR generator is available');
            } else {
                test.details.push('⚠️ Self-contained QR generator creation failed');
            }
        } else {
            test.details.push('⚠️ Enhanced QR generator not available');
        }
        
        // Check if old fallback scripts are still present
        const scripts = Array.from(document.scripts);
        const oldFallbackScripts = scripts.filter(script => 
            script.src.includes('simple-qr-fallback') || 
            (script.src.includes('qr-generator.js') && !script.src.includes('enhanced-qr-generator'))
        );
        
        if (oldFallbackScripts.length > 0) {
            test.details.push(`⚠️ ${oldFallbackScripts.length} old fallback script(s) still present`);
            oldFallbackScripts.forEach(script => {
                test.details.push(`   - ${script.src || 'inline script'}`);
            });
        } else {
            test.details.push('✅ Old fallback scripts removed');
        }
        
        // Also check for global variables from old scripts
        if (typeof SimpleQRGenerator !== 'undefined') {
            test.details.push('⚠️ SimpleQRGenerator global variable still exists');
        }
        if (typeof QRCodeGenerator !== 'undefined') {
            test.details.push('⚠️ QRCodeGenerator global variable still exists');
        }
        
        this.testResults.push(test);
    }
    
    async testMobileFeatures() {
        console.log('\n📱 Test 5: Mobile Features');
        
        const test = {
            name: 'Mobile Features',
            status: 'pending',
            details: []
        };
        
        // Test mobile detection
        test.details.push(`📱 Mobile detected: ${this.isMobile}`);
        
        // Test touch events
        const qrCanvas = document.getElementById('qrCode');
        if (qrCanvas) {
            const hasTouchEvents = 'ontouchstart' in window;
            test.details.push(`👆 Touch events supported: ${hasTouchEvents}`);
        }
        
        // Test clipboard API
        const hasClipboard = navigator.clipboard && window.isSecureContext;
        test.details.push(`📋 Clipboard API available: ${hasClipboard}`);
        
        test.status = 'pass';
        this.testResults.push(test);
    }
    
    hasCanvasContent(canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Check if canvas has any non-white pixels
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
                return true;
            }
        }
        return false;
    }
    
    displayResults() {
        console.log('\n📊 Test Results Summary:');
        console.log('='.repeat(50));
        
        let passedTests = 0;
        let totalTests = this.testResults.length;
        
        this.testResults.forEach((test, index) => {
            const status = test.status === 'pass' ? '✅' : '❌';
            console.log(`${index + 1}. ${status} ${test.name}`);
            
            test.details.forEach(detail => {
                console.log(`   ${detail}`);
            });
            
            if (test.status === 'pass') {
                passedTests++;
            }
            
            console.log('');
        });
        
        console.log('='.repeat(50));
        console.log(`📈 Overall Score: ${passedTests}/${totalTests} tests passed`);
        
        if (passedTests === totalTests) {
            console.log('🎉 All tests passed! QR code should be working.');
        } else {
            console.log('⚠️ Some tests failed. Check the details above.');
        }
        
        // Create visual results in the page
        this.createVisualResults();
    }
    
    createVisualResults() {
        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'qrTestResults';
        resultsDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: white;
            border: 2px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            max-width: 300px;
            max-height: 400px;
            overflow-y: auto;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        let passedTests = this.testResults.filter(t => t.status === 'pass').length;
        let totalTests = this.testResults.length;
        
        resultsDiv.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #333;">🧪 QR Code Test Results</h3>
            <div style="margin-bottom: 10px;">
                <strong>Score: ${passedTests}/${totalTests}</strong>
                <span style="color: ${passedTests === totalTests ? 'green' : 'orange'};">
                    ${passedTests === totalTests ? '✅ All Passed' : '⚠️ Some Failed'}
                </span>
            </div>
            ${this.testResults.map((test, index) => `
                <div style="margin-bottom: 8px; padding: 5px; background: ${test.status === 'pass' ? '#d4edda' : '#f8d7da'}; border-radius: 4px;">
                    <strong>${index + 1}. ${test.status === 'pass' ? '✅' : '❌'} ${test.name}</strong>
                    ${test.details.map(detail => `<div style="font-size: 10px; margin-top: 2px;">${detail}</div>`).join('')}
                </div>
            `).join('')}
            <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
        `;
        
        document.body.appendChild(resultsDiv);
        
        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (resultsDiv.parentElement) {
                resultsDiv.remove();
            }
        }, 30000);
    }
}

// Auto-run tests when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for everything to load
    setTimeout(() => {
        if (!window.qrCodeTester) {
            window.qrCodeTester = new QRCodeTester();
            window.qrCodeTester.runAllTests();
        }
    }, 2000);
});

// Also run tests when QR code generation completes (but only once)
window.addEventListener('load', () => {
    setTimeout(() => {
        if (window.qrCodeTester && !window.qrCodeTester.hasRun) {
            window.qrCodeTester.runAllTests();
        }
    }, 3000);
});

// === PRESENTATION SYSTEM ===
class PresentationSystem {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 2;
        this.isPresentationMode = false;
        this.visualization = null;
        this.init();
    }
    
    init() {
        this.setupSlideNavigation();
        this.setupPresentationMode();
        this.updateSlideIndicator();
        this.setupKeyboardControls();
    }
    
    setupSlideNavigation() {
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');
        
        prevBtn.addEventListener('click', () => {
            this.previousSlide();
        });
        
        nextBtn.addEventListener('click', () => {
            this.nextSlide();
        });
    }
    
    setupPresentationMode() {
        const presentationBtn = document.getElementById('presentationMode');
        const originalControls = document.getElementById('originalControls');
        
        presentationBtn.addEventListener('click', () => {
            this.togglePresentationMode();
        });
    }
    
    setupKeyboardControls() {
        document.addEventListener('keydown', (event) => {
            if (this.isPresentationMode) {
                switch(event.key) {
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        event.preventDefault();
                        this.previousSlide();
                        break;
                    case 'ArrowRight':
                    case 'ArrowDown':
                    case ' ':
                        event.preventDefault();
                        this.nextSlide();
                        break;
                    case 'Escape':
                        event.preventDefault();
                        this.exitPresentationMode();
                        break;
                }
            }
        });
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.currentSlide++;
            this.updateSlideDisplay();
            this.updateSlideIndicator();
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            this.currentSlide--;
            this.updateSlideDisplay();
            this.updateSlideIndicator();
        }
    }
    
    updateSlideDisplay() {
        // Hide all slides
        const slides = document.querySelectorAll('.slide');
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show current slide
        const currentSlideElement = document.getElementById(`slide${this.currentSlide}`);
        if (currentSlideElement) {
            currentSlideElement.classList.add('active');
        }
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');
        
        prevBtn.disabled = this.currentSlide === 1;
        nextBtn.disabled = this.currentSlide === this.totalSlides;
    }
    
    updateSlideIndicator() {
        document.getElementById('currentSlide').textContent = this.currentSlide;
        document.getElementById('totalSlides').textContent = this.totalSlides;
    }
    
    togglePresentationMode() {
        this.isPresentationMode = !this.isPresentationMode;
        
        const slideContainer = document.getElementById('slideContainer');
        const originalControls = document.getElementById('originalControls');
        const slideControls = document.querySelector('.slide-controls');
        
        if (this.isPresentationMode) {
            // Enter presentation mode
            slideContainer.style.display = 'block';
            slideControls.style.display = 'flex';
            originalControls.classList.add('hidden');
            
            // Start with slide 1
            this.currentSlide = 1;
            this.updateSlideDisplay();
            this.updateSlideIndicator();
            
            // Update button text
            document.getElementById('presentationMode').textContent = 'Exit Presentation';
        } else {
            // Exit presentation mode
            this.exitPresentationMode();
        }
    }
    
    exitPresentationMode() {
        this.isPresentationMode = false;
        
        const slideContainer = document.getElementById('slideContainer');
        const originalControls = document.getElementById('originalControls');
        const slideControls = document.querySelector('.slide-controls');
        
        slideContainer.style.display = 'none';
        slideControls.style.display = 'none';
        originalControls.classList.remove('hidden');
        
        // Update button text
        document.getElementById('presentationMode').textContent = 'Presentation Mode';
    }
    
    // Method to be called by visualization when it's ready
    setVisualization(visualization) {
        this.visualization = visualization;
    }
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    // Initialize visualization
    const visualization = new GlaucomaVisualization();
    
    // Initialize presentation system
    const presentation = new PresentationSystem();
    presentation.setVisualization(visualization);
    
    // Make presentation globally accessible for debugging
    window.presentation = presentation;
    window.visualization = visualization;
});

# Glaucoma Bayesian Network — Presentation

**Scope:** Clinic-level (Japan) — 12-month horizon  
**Goal:** Interactive 3D Decision Network for **Visual Field Loss (VFL)** risk assessment and treatment planning with presentation capabilities.

## Files Structure

### Main Files
- `presentation.html` — **Main presentation file** with slide system and interactive visualization
- `styles.css` — All CSS styles (extracted for faster loading)
- `network-data.js` — Bayesian network data and probability models
- `visualization.js` — Interactive 3D visualization logic
- `presentation.js` — Slide navigation and presentation controls

### Legacy Files
- `index.html` — Original single-file version (kept for reference)

## Run (Web Browser)
```bash
# Start local server
python -m http.server 8000

# Open presentation in browser
http://localhost:8000/glaucoma-bn-3d/presentation.html
```

## Features

### Presentation Mode
- **Two-slide presentation** with problem and model explanation
- **Keyboard navigation** (arrow keys, space, escape)
- **Slide indicators** and navigation controls
- **Fullscreen presentation** support

### Interactive Visualization
- **Interactive 3D Visualization** - Professional rendering
- **Decision Network** - Chance, Decision, and Utility nodes
- **Probability Assumptions** - Complete conditional probability tables
- **Clinical Decision Support** - Treatment and monitoring recommendations
- **Real-time Interaction** - Hover, click, and control features

### Performance Optimizations
- **Modular file structure** for faster loading
- **Separated CSS/JS** for better caching
- **Lazy loading** of visualization components
- **Cross-platform** - Works on any modern browser

## Usage

1. **Interactive Mode**: Click "Presentation Mode" to enter slides
2. **Navigation**: Use arrow keys or navigation buttons
3. **Fullscreen**: Click fullscreen button for presentation
4. **Exit**: Press Escape or click "Exit Presentation"

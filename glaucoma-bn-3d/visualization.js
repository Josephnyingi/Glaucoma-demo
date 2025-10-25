// === STATE MANAGEMENT ===
const state = {
    showLabels: true,
    showLinks: true,
    selectedNode: null
};

// === MAIN VISUALIZATION CLASS ===
class GlaucomaVisualization {
    constructor() {
        this.container = document.getElementById('graph2d');
        this.nodeElements = new Map();
        this.linkElements = [];
        this.init();
    }
    
    init() {
        this.createNodes();
        this.createLinks();
        this.setupEventListeners();
        this.hideLoading();
    }
    
    createNodes() {
        NETWORK_DATA.nodes.forEach(nodeData => {
            const nodeElement = document.createElement('div');
            nodeElement.className = `node ${nodeData.group}`;
            nodeElement.style.left = `${nodeData.position.x}px`;
            nodeElement.style.top = `${nodeData.position.y}px`;
            
            const labelElement = document.createElement('div');
            labelElement.className = 'node-label';
            labelElement.textContent = nodeData.label;
            
            const timescaleElement = document.createElement('div');
            timescaleElement.className = 'node-timescale';
            timescaleElement.textContent = nodeData.timescale;
            
            nodeElement.appendChild(labelElement);
            nodeElement.appendChild(timescaleElement);
            
            nodeElement.addEventListener('click', () => {
                this.selectNode(nodeData);
            });
            
            nodeElement.addEventListener('mouseenter', () => {
                nodeElement.style.transform = 'scale(1.05)';
            });
            
            nodeElement.addEventListener('mouseleave', () => {
                if (state.selectedNode !== nodeData) {
                    nodeElement.style.transform = 'scale(1)';
                }
            });
            
            this.container.appendChild(nodeElement);
            this.nodeElements.set(nodeData.id, nodeElement);
        });
    }
    
    createLinks() {
        NETWORK_DATA.links.forEach(linkData => {
            const sourceNode = NETWORK_DATA.nodes.find(n => n.id === linkData.source);
            const targetNode = NETWORK_DATA.nodes.find(n => n.id === linkData.target);
            
            if (sourceNode && targetNode) {
                const linkElement = document.createElement('div');
                linkElement.className = 'link';
                
                const arrowElement = document.createElement('div');
                arrowElement.className = 'arrow';
                
                this.updateLinkPosition(linkElement, arrowElement, sourceNode, targetNode);
                
                this.container.appendChild(linkElement);
                this.container.appendChild(arrowElement);
                
                this.linkElements.push({ link: linkElement, arrow: arrowElement, data: linkData });
            }
        });
    }
    
    updateLinkPosition(linkElement, arrowElement, sourceNode, targetNode) {
        const sourceX = sourceNode.position.x + 60; // Center of node
        const sourceY = sourceNode.position.y + 40;
        const targetX = targetNode.position.x + 60;
        const targetY = targetNode.position.y + 40;
        
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        linkElement.style.left = `${sourceX}px`;
        linkElement.style.top = `${sourceY}px`;
        linkElement.style.width = `${distance}px`;
        linkElement.style.transform = `rotate(${angle}deg)`;
        
        arrowElement.style.left = `${targetX - 8}px`;
        arrowElement.style.top = `${targetY - 4}px`;
        arrowElement.style.transform = `rotate(${angle}deg)`;
    }
    
    selectNode(nodeData) {
        // Remove previous selection
        if (state.selectedNode) {
            const prevElement = this.nodeElements.get(state.selectedNode.id);
            if (prevElement) {
                prevElement.classList.remove('selected');
            }
        }
        
        // Select new node
        state.selectedNode = nodeData;
        const nodeElement = this.nodeElements.get(nodeData.id);
        if (nodeElement) {
            nodeElement.classList.add('selected');
        }
        
        this.showNodeInfo(nodeData);
    }
    
    showNodeInfo(nodeData) {
        const infoContent = document.getElementById('infoContent');
        const nodeInfo = document.getElementById('nodeInfo');
        
        let content = `<h3>${nodeData.label}</h3>`;
        content += `<p><strong>Definition:</strong> ${nodeData.definition}</p>`;
        content += `<p><strong>Timescale:</strong> ${nodeData.timescale}</p>`;
        
        if (nodeData.type === 'chance' && PROBABILITY_MODEL[nodeData.id]) {
            const model = PROBABILITY_MODEL[nodeData.id];
            content += `<div class="probabilities">`;
            content += `<h4>Probability Assumptions</h4>`;
            content += `<p>${model.description}</p>`;
            content += `<ul>`;
            Object.entries(model.probabilities).forEach(([outcome, prob]) => {
                content += `<li>${outcome}: ${(prob * 100).toFixed(1)}%</li>`;
            });
            content += `</ul></div>`;
        }
        
        if (nodeData.type === 'decision' && nodeData.options) {
            content += `<div class="decision">`;
            content += `<h4>Decision Options</h4>`;
            content += `<ul>`;
            nodeData.options.forEach(option => {
                content += `<li>${option}</li>`;
            });
            content += `</ul></div>`;
        }
        
        infoContent.innerHTML = content;
        nodeInfo.style.display = 'block';
    }
    
    hideNodeInfo() {
        document.getElementById('nodeInfo').style.display = 'none';
        state.selectedNode = null;
        
        // Remove selection styling
        this.nodeElements.forEach(element => {
            element.classList.remove('selected');
        });
    }
    
    resetLayout() {
        // Animate nodes to their original positions
        NETWORK_DATA.nodes.forEach(nodeData => {
            const nodeElement = this.nodeElements.get(nodeData.id);
            if (nodeElement) {
                nodeElement.style.transition = 'all 0.5s ease';
                nodeElement.style.left = `${nodeData.position.x}px`;
                nodeElement.style.top = `${nodeData.position.y}px`;
                nodeElement.style.transform = 'scale(1)';
            }
        });
        
        // Update links
        setTimeout(() => {
            this.linkElements.forEach(({ link, arrow, data }) => {
                const sourceNode = NETWORK_DATA.nodes.find(n => n.id === data.source);
                const targetNode = NETWORK_DATA.nodes.find(n => n.id === data.target);
                this.updateLinkPosition(link, arrow, sourceNode, targetNode);
            });
        }, 100);
    }
    
    toggleLabels() {
        state.showLabels = !state.showLabels;
        this.nodeElements.forEach(element => {
            const timescaleElement = element.querySelector('.node-timescale');
            if (timescaleElement) {
                timescaleElement.style.display = state.showLabels ? 'block' : 'none';
            }
        });
    }
    
    toggleLinks() {
        state.showLinks = !state.showLinks;
        this.linkElements.forEach(({ link, arrow }) => {
            link.style.display = state.showLinks ? 'block' : 'none';
            arrow.style.display = state.showLinks ? 'block' : 'none';
        });
    }
    
    takeScreenshot() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Draw background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw nodes
        this.nodeElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const color = getComputedStyle(element).backgroundColor;
            ctx.fillStyle = color;
            ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
        });
        
        // Download
        const link = document.createElement('a');
        link.download = 'glaucoma-bn-2d.png';
        link.href = canvas.toDataURL();
        link.click();
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    setupEventListeners() {
        // Control buttons
        document.getElementById('resetLayout').addEventListener('click', () => {
            this.resetLayout();
        });
        
        document.getElementById('toggleLabels').addEventListener('click', () => {
            this.toggleLabels();
        });
        
        document.getElementById('toggleLinks').addEventListener('click', () => {
            this.toggleLinks();
        });
        
        document.getElementById('screenshot').addEventListener('click', () => {
            this.takeScreenshot();
        });
        
        document.getElementById('fullscreen').addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        // Close info panel
        document.getElementById('closeInfo').addEventListener('click', () => {
            this.hideNodeInfo();
        });
        
        // Click outside to deselect
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.hideNodeInfo();
            }
        });
    }
    
    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }
}

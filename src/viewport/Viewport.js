import { Zoom } from './Zoom.js';

class Viewport {  
    constructor() {  
        if (Viewport.instance) {  
            return Viewport.instance;  
        }  
        this.worldWidth = 297;  
        this.worldHeight = 297;  

        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;
        const marginRatio = 0.9;
        const zoomX = (innerWidth * marginRatio) / this.worldWidth;
        const zoomY = (innerHeight * marginRatio) / this.worldHeight;
        const initialZoom = Math.min(zoomX, zoomY);
        this.maxZoom = (innerWidth / 50) / 2;  // Уменьшаем вдвое

        // dispatcher будет передан позже, пока создаём без него
        this.dispatcher = null;
        this.zoomManager = new Zoom(initialZoom, this.maxZoom, null);
        this.originalPanX = (innerWidth - this.worldWidth * this.zoomManager.zoom) / 2;  
        this.originalPanY = (innerHeight - this.worldHeight * this.zoomManager.zoom) / 2;  
        this.panX = this.originalPanX;
        this.panY = this.originalPanY;

        Viewport.instance = this;  
    }  

    static getInstance() {  
        if (!Viewport.instance) {  
            Viewport.instance = new Viewport();  
        }  
        return Viewport.instance;  
    }  

    setDispatcher(dispatcher) {
        this.dispatcher = dispatcher;
        // Пересоздаём zoomManager с диспетчером
        const currentZoom = this.zoomManager.zoom;
        this.zoomManager = new Zoom(currentZoom, this.maxZoom, dispatcher);
    }

    get zoom() { return this.zoomManager.zoom; }

    updateProjection() {  
        const innerWidth = window.innerWidth;  
        const innerHeight = window.innerHeight;  
        const marginRatio = 0.9;  

        const zoomX = (innerWidth * marginRatio) / this.worldWidth;  
        const zoomY = (innerHeight * marginRatio) / this.worldHeight;  
        const newZoom = Math.min(zoomX, zoomY);  
        this.maxZoom = (innerWidth / 50) / 2;  // Уменьшаем вдвое при ресайзе тоже  

        this.zoomManager = new Zoom(newZoom, this.maxZoom, this.dispatcher);
        this.panX = (innerWidth - this.worldWidth * this.zoomManager.zoom) / 2;  
        this.panY = (innerHeight - this.worldHeight * this.zoomManager.zoom) / 2;  
    }  

    toScreen(worldX, worldY) {  
        return {  
            x: worldX * this.zoom + this.panX,  
            y: worldY * this.zoom + this.panY,  
        };  
    }  

    toWorld(screenX, screenY) {  
        return {  
            x: (screenX - this.panX) / this.zoom,  
            y: (screenY - this.panY) / this.zoom,  
        };  
    }  

    zoomIn() {
        const target = this.zoomManager.currentZoomLevel - 1;
        if (target < 0) return;

        // Сохраняем мировую координату центра экрана
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const worldCX = (cx - this.panX) / this.zoom;
        const worldCY = (cy - this.panY) / this.zoom;

        this.zoomManager.zoomIn();

        // Восстанавливаем центр
        this.panX = cx - worldCX * this.zoom;
        this.panY = cy - worldCY * this.zoom;
    }

    zoomOut() {
        const target = this.zoomManager.currentZoomLevel + 1;
        if (target >= this.zoomManager.zoomLevels.length) return;

        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const worldCX = (cx - this.panX) / this.zoom;
        const worldCY = (cy - this.panY) / this.zoom;

        this.zoomManager.zoomOut();

        this.panX = cx - worldCX * this.zoom;
        this.panY = cy - worldCY * this.zoom;
    }

    getZoom() { return this.zoomManager.zoom; }
    getCurrentZoomLevel() { return this.zoomManager.getCurrentLevel(); }

    getPan() {  
        return { panX: this.panX, panY: this.panY };  
    }  

    pan(dx, dy) {  
        this.panX += dx;  
        this.panY += dy;  
        window.dispatchEvent(new CustomEvent('viewportChanged'));  
    }  

    reset() {  
        this.zoomManager.reset();
        this.panX = this.originalPanX;  
        this.panY = this.originalPanY;  
        window.dispatchEvent(new CustomEvent('viewportChanged'));  
        window.dispatchEvent(new CustomEvent('zoomLevelChanged', { detail: { level: this.zoomManager.getCurrentLevel() } }));  
    }  
}  

window.Viewport = Viewport;  
export { Viewport };
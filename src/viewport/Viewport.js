class Viewport {  
    constructor() {  
        if (Viewport.instance) {  
            return Viewport.instance;  
        }  
        this.worldWidth = 297;   // квадратное рабочее поле  
        this.worldHeight = 297;  
        this.updateProjection();  
        this.originalZoom = this.zoom;  
        this.originalPanX = this.panX;  
        this.originalPanY = this.panY;  
        Viewport.instance = this;  
    }  

    static getInstance() {  
        if (!Viewport.instance) {  
            Viewport.instance = new Viewport();  
        }  
        return Viewport.instance;  
    }  

    updateProjection() {  
        const innerWidth = window.innerWidth;  
        const innerHeight = window.innerHeight;  
        const marginRatio = 0.9;  

        const zoomX = (innerWidth * marginRatio) / this.worldWidth;  
        const zoomY = (innerHeight * marginRatio) / this.worldHeight;  
        this.zoom = Math.min(zoomX, zoomY);  

        this.minZoom = (innerHeight / 4) / this.worldHeight;  
        this.maxZoom = innerWidth / 50;  

        this.panX = (innerWidth - this.worldWidth * this.zoom) / 2;  
        this.panY = (innerHeight - this.worldHeight * this.zoom) / 2;  
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

    getZoom() {  
        return this.zoom;  
    }  

    getPan() {  
        return { panX: this.panX, panY: this.panY };  
    }  

    zoomAt(factor, pivotX, pivotY) {  
        const worldX = (pivotX - this.panX) / this.zoom;  
        const worldY = (pivotY - this.panY) / this.zoom;  

        let newZoom = this.zoom * factor;  
        newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));  
        if (newZoom === this.zoom) return;  

        this.zoom = newZoom;  
        this.panX = pivotX - worldX * this.zoom;  
        this.panY = pivotY - worldY * this.zoom;  
    }  

    pan(dx, dy) {  
        this.panX += dx;  
        this.panY += dy;  
    }  

    reset() {  
        this.zoom = this.originalZoom;  
        this.panX = this.originalPanX;  
        this.panY = this.originalPanY;  
    }  
}  

window.Viewport = Viewport;  
export { Viewport };  

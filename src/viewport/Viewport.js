class Viewport {  
    constructor() {  
        if (Viewport.instance) {  
            return Viewport.instance;  
        }  
        this.a4Width = 210;  
        this.a4Height = 297;  
        this.updateProjection();  
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
        const zoomX = (innerWidth * marginRatio) / this.a4Width;  
        const zoomY = (innerHeight * marginRatio) / this.a4Height;  
        this.zoom = Math.min(zoomX, zoomY);  
        this.panX = (innerWidth - this.a4Width * this.zoom) / 2;  
        this.panY = (innerHeight - this.a4Height * this.zoom) / 2;  
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
}  

// Делаем доступным глобально  
window.Viewport = Viewport;  

export { Viewport };  

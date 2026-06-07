import { Viewport } from '../viewport/Viewport.js';  

export class InputHandler {  
    constructor(updateCallback) {  
        this.viewport = Viewport.getInstance();  
        this.onUpdate = updateCallback; // callback(type, data)  
        this.dragging = false;  
        this.lastX = 0;  
        this.lastY = 0;  
        this.pinchActive = false;  
        this.lastDist = 0;  
        this.pinchZoomed = false;  
        this._toolActive = false;  
        this.initEvents();  
    }  

    initEvents() {  
        document.addEventListener('wheel', this.onWheel.bind(this), { passive: false });  
        document.addEventListener('pointerdown', this.onPointerDown.bind(this));  
        document.addEventListener('pointermove', this.onPointerMove.bind(this));  
        document.addEventListener('pointerup', this.onPointerUp.bind(this));  
        document.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });  
        document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });  
        document.addEventListener('touchend', this.onTouchEnd.bind(this));  
    }

    _isCanvasTarget(target) {
        const container = document.getElementById('canvasContainer');
        return container && container.contains(target);
    }

    // Перевод экранных пикселей в мировые миллиметры
    _toWorld(screenX, screenY) {
        return this.viewport.toWorld(screenX, screenY);
    }

    onWheel(e) {  
        e.preventDefault();  
        if (e.deltaY < 0) {  
            this.viewport.zoomIn();  
        } else {  
            this.viewport.zoomOut();  
        }  
        this.onUpdate('zoomChanged', { zoomLevel: this.viewport.getCurrentZoomLevel() });  
        this.onUpdate('panChanged', this.viewport.getPan());  
    }  

    onPointerDown(e) {  
        if (e.isPrimary) {  
            if (window.toolManager && window.toolManager.getActiveName() !== 'cursor') {
                if (this._isCanvasTarget(e.target)) {
                    // Передаём координаты в миллиметрах
                    const world = this._toWorld(e.clientX, e.clientY);
                    window.toolManager.handleGesture('pointerdown', { x: world.x, y: world.y });  
                    this._toolActive = true;
                } else {
                    this._toolActive = false;
                }
                return;
            }  

            this._toolActive = false;  
            this.dragging = true;  
            this.lastX = e.clientX;  
            this.lastY = e.clientY;  
            e.preventDefault();  
        }  
    }  

    onPointerMove(e) {  
        if (this._toolActive && window.toolManager) {  
            // Передаём координаты в миллиметрах
            const world = this._toWorld(e.clientX, e.clientY);
            window.toolManager.handleGesture('pointermove', { x: world.x, y: world.y });  
            return;  
        }  

        if (this.dragging && !this.pinchActive) {  
            const dx = e.clientX - this.lastX;  
            const dy = e.clientY - this.lastY;  
            if (dx !== 0 || dy !== 0) {  
                this.viewport.pan(dx, dy);  
                this.lastX = e.clientX;  
                this.lastY = e.clientY;  
                this.onUpdate('panChanged', this.viewport.getPan());  
            }  
        }  
    }  

    onPointerUp(e) {  
        if (this._toolActive && window.toolManager) {  
            // Передаём координаты в миллиметрах
            const world = this._toWorld(e.clientX, e.clientY);
            window.toolManager.handleGesture('pointerup', { x: world.x, y: world.y });  
            this._toolActive = false;  
            return;  
        }  

        if (e.isPrimary) {  
            this.dragging = false;  
        }  
    }  

    onTouchStart(e) {  
        if (e.touches.length === 2) {  
            e.preventDefault();  
            this.pinchActive = true;  
            this.dragging = false;  
            this.pinchZoomed = false;  
            const dx = e.touches[0].clientX - e.touches[1].clientX;  
            const dy = e.touches[0].clientY - e.touches[1].clientY;  
            this.lastDist = Math.hypot(dx, dy);  
        }  
    }  

    onTouchMove(e) {  
        if (this.pinchActive && e.touches.length === 2) {  
            e.preventDefault();  
            const dx = e.touches[0].clientX - e.touches[1].clientX;  
            const dy = e.touches[0].clientY - e.touches[1].clientY;  
            const newDist = Math.hypot(dx, dy);  

            if (!this.pinchZoomed) {  
                if (newDist > this.lastDist * 1.2) {  
                    this.viewport.zoomIn();  
                    this.pinchZoomed = true;  
                } else if (newDist < this.lastDist * 0.8) {  
                    this.viewport.zoomOut();  
                    this.pinchZoomed = true;  
                }  
            }  
            if (this.pinchZoomed) {  
                this.onUpdate('zoomChanged', { zoomLevel: this.viewport.getCurrentZoomLevel() });  
                this.onUpdate('panChanged', this.viewport.getPan());  
            }  
        }  
    }  

    onTouchEnd(e) {  
        this.pinchActive = false;  
        this.pinchZoomed = false;  
        this.lastDist = 0;  
    }  
}
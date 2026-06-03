import { Viewport } from '../viewport/Viewport.js';  

export class InputHandler {  
    constructor(updateCallback) {  
        this.viewport = Viewport.getInstance();  
        this.updateCallback = updateCallback;  
        this.dragging = false;  
        this.lastX = 0;  
        this.lastY = 0;  
        this.pinchActive = false;  
        this.lastDist = 0;  
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

    onWheel(e) {  
        e.preventDefault();  
        const factor = e.deltaY < 0 ? 1.03 : 0.97;  
        this.viewport.zoomAt(factor, e.clientX, e.clientY);  
        this.updateCallback();  
    }  

    onPointerDown(e) {  
        if (e.isPrimary) {  
            this.dragging = true;  
            this.lastX = e.clientX;  
            this.lastY = e.clientY;  
            e.preventDefault();  
        }  
    }  

    onPointerMove(e) {  
        if (this.dragging && !this.pinchActive) {  
            const dx = e.clientX - this.lastX;  
            const dy = e.clientY - this.lastY;  
            if (dx !== 0 || dy !== 0) {  
                this.viewport.pan(dx, dy);  
                this.lastX = e.clientX;  
                this.lastY = e.clientY;  
                this.updateCallback();  
            }  
        }  
    }  

    onPointerUp(e) {  
        if (e.isPrimary) {  
            this.dragging = false;  
        }  
    }  

    onTouchStart(e) {  
        if (e.touches.length === 2) {  
            e.preventDefault();  
            this.pinchActive = true;  
            this.dragging = false;  
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
            if (this.lastDist > 0) {  
                const factor = newDist / this.lastDist;  
                const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;  
                const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;  
                this.viewport.zoomAt(factor, centerX, centerY);  
                this.updateCallback();  
            }  
            this.lastDist = newDist;  
        }  
    }  

    onTouchEnd(e) {  
        this.pinchActive = false;  
        this.lastDist = 0;  
    }  
}  
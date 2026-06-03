class Viewport {  
    constructor() {  
        if (Viewport.instance) {  
            return Viewport.instance;  
        }  
        this.worldWidth = 297;  
        this.worldHeight = 297;  
        this.updateProjection();  
        this.originalZoom = this.zoom;  
        this.originalPanX = (window.innerWidth - this.worldWidth * this.zoom) / 2;  
        this.originalPanY = (window.innerHeight - this.worldHeight * this.zoom) / 2;  
        this.animating = false;  
        this._pendingLevel = undefined;  
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

        // 5 уровней zoom  
        this.zoomLevels = [  
            this.maxZoom,  
            Math.sqrt(this.maxZoom * this.zoom),  
            this.zoom,  
            Math.sqrt(this.zoom * this.minZoom),  
            this.minZoom  
        ];  
        this.currentZoomLevel = 2;  
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

    _startAnimation(targetLevel) {  
        if (targetLevel === this.currentZoomLevel) return;  

        this.animating = true;  
        const startZoom = this.zoom;  
        const endZoom = this.zoomLevels[targetLevel];  
        const startPanX = this.panX;  
        const startPanY = this.panY;  
        const duration = 200;  
        const startTime = performance.now();  
        const cx = window.innerWidth / 2;  
        const cy = window.innerHeight / 2;  

        const animate = (currentTime) => {  
            const elapsed = currentTime - startTime;  
            const progress = Math.min(elapsed / duration, 1.0);  

            this.zoom = startZoom + (endZoom - startZoom) * progress;  

            const worldCX = (cx - startPanX) / startZoom;  
            const worldCY = (cy - startPanY) / startZoom;  
            this.panX = cx - worldCX * this.zoom;  
            this.panY = cy - worldCY * this.zoom;  

            window.dispatchEvent(new CustomEvent('viewportChanged'));  

            if (progress < 1.0) {  
                requestAnimationFrame(animate);  
            } else {  
                // Финализация  
                this.zoom = endZoom;  
                const wCX = (cx - startPanX) / startZoom;  
                const wCY = (cy - startPanY) / startZoom;  
                this.panX = cx - wCX * this.zoom;  
                this.panY = cy - wCY * this.zoom;  
                this.currentZoomLevel = targetLevel;  
                this.animating = false;  

                // Оповещаем об изменении уровня зума  
                window.dispatchEvent(new CustomEvent('zoomLevelChanged', { detail: { level: this.currentZoomLevel } }));  
                window.dispatchEvent(new CustomEvent('viewportChanged'));  

                // Если за время анимации накопился запрос — запустить следующий переход  
                if (this._pendingLevel !== undefined) {  
                    const pending = this._pendingLevel;  
                    this._pendingLevel = undefined;  
                    this._startAnimation(pending);  
                }  
            }  
        };  

        requestAnimationFrame(animate);  
    }  

    zoomIn() {  
        const target = this.currentZoomLevel - 1;  
        if (target < 0) return;  
        if (this.animating) {  
            // Сохраняем наименьший запрошенный уровень (приближение)  
            this._pendingLevel = Math.min(this._pendingLevel !== undefined ? this._pendingLevel : target, target);  
            return;  
        }  
        this._startAnimation(target);  
    }  

    zoomOut() {  
        const target = this.currentZoomLevel + 1;  
        if (target >= this.zoomLevels.length) return;  
        if (this.animating) {  
            // Сохраняем наибольший запрошенный уровень (отдаление)  
            this._pendingLevel = Math.max(this._pendingLevel !== undefined ? this._pendingLevel : target, target);  
            return;  
        }  
        this._startAnimation(target);  
    }  

    pan(dx, dy) {  
        this.panX += dx;  
        this.panY += dy;  
        window.dispatchEvent(new CustomEvent('viewportChanged'));  
    }  

    reset() {  
        // Синхронный сброс без анимации  
        this.zoom = this.originalZoom;  
        this.panX = this.originalPanX;  
        this.panY = this.originalPanY;  
        this.currentZoomLevel = 2;  
        this.animating = false;  
        this._pendingLevel = undefined;  
        window.dispatchEvent(new CustomEvent('viewportChanged'));  
        window.dispatchEvent(new CustomEvent('zoomLevelChanged', { detail: { level: this.currentZoomLevel } }));  
    }  
}  

window.Viewport = Viewport;  
export { Viewport };  
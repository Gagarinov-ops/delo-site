import { Zoom } from './Zoom.js';
import { setupCameraDOM } from './CameraDOM.js';

export class CoordinatePlane {
    constructor(dispatcher, worldWidth, worldHeight, initialZoom) {
        this.dispatcher = dispatcher;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        this.originX = window.innerWidth / 2;
        this.originY = window.innerHeight / 2;

        this.centerX = 0;
        this.centerY = 0;

        this.dpr = window.devicePixelRatio || 1;

        this.zoomManager = new Zoom(
            initialZoom,
            window.innerWidth,
            window.innerHeight,
            worldWidth,
            worldHeight,
            this.originX,
            this.originY
        );
        this.zoomLevels = this.zoomManager.getLevels();
        this.currentZoomIndex = this.zoomManager.getCurrentLevel();
        this.zoom = this.zoomManager.getBaseHeight() / this.zoomLevels[this.currentZoomIndex].height;

        setupCameraDOM(dispatcher);

        // Подписка на сброс камеры
        dispatcher.on('resetCamera', () => {
            this.centerX = 0;
            this.centerY = 0;
            this.zoomManager.reset(window.innerWidth, window.innerHeight, this.worldWidth, this.worldHeight);
            this.currentZoomIndex = this.zoomManager.getCurrentLevel();
            this.zoom = this.zoomManager.getBaseHeight() / this.zoomLevels[this.currentZoomIndex].height;
            window.dispatchEvent(new CustomEvent('zoomLevelChanged', { detail: { level: this.currentZoomIndex } }));
            this._emitState();
        });

        this._emitState();
    }

    getOrigin() {
        return { x: this.originX, y: this.originY };
    }

    updateDpr(dpr) {
        this.dpr = dpr;
        this._emitState();
    }

    handleDisplayChanged(data) {
        this.originX = data.width / 2;
        this.originY = data.height / 2;
        this.dpr = data.dpr;
        this.zoomManager.rebuild(
            this.zoomManager.getBaseHeight() / this.zoomLevels[this.currentZoomIndex].height,
            data.width,
            data.height,
            this.worldWidth,
            this.worldHeight
        );
        this._emitState();
    }

    handleEvent(type, data) {
        switch (type) {
            case 'zoom':
                this._handleZoom(data.direction);
                break;
            case 'pan':
                this._handlePan(data.dx, data.dy);
                break;
            case 'toolGesture':
                this._handleToolGesture(data.gesture, data.screenX, data.screenY);
                break;
        }
    }

    _handleZoom(direction) {
        if (direction > 0 && this.currentZoomIndex > 0) {
            this.currentZoomIndex--;
            this.zoomManager.zoomIn(window.innerWidth, window.innerHeight, this.worldWidth, this.worldHeight);
        } else if (direction < 0 && this.currentZoomIndex < this.zoomLevels.length - 1) {
            this.currentZoomIndex++;
            this.zoomManager.zoomOut(window.innerWidth, window.innerHeight, this.worldWidth, this.worldHeight);
        } else {
            return;
        }
        this.zoom = this.zoomManager.getBaseHeight() / this.zoomLevels[this.currentZoomIndex].height;
        this._emitState();
    }

    _handlePan(dx, dy) {
        this.centerX -= dx / this.zoom;
        this.centerY -= dy / this.zoom;
        this._emitState();
    }

    _handleToolGesture(gesture, screenX, screenY) {
        const world = this.screenToWorld(screenX, screenY);
        this.dispatcher.emit('toolGesture', { gesture, worldX: world.x, worldY: world.y });
    }

    _onCameraReset(data) {
        this.centerX = data.centerX;
        this.centerY = data.centerY;
        this.zoomManager.reset(window.innerWidth, window.innerHeight, this.worldWidth, this.worldHeight);
        this.currentZoomIndex = this.zoomManager.getCurrentLevel();
        this.zoom = this.zoomManager.getBaseHeight() / this.zoomLevels[this.currentZoomIndex].height;
        window.dispatchEvent(new CustomEvent('zoomLevelChanged', { detail: { level: this.currentZoomIndex } }));
        this._emitState();
    }

    _emitState() {
        const halfScreenW = window.innerWidth / 2;
        const halfScreenH = window.innerHeight / 2;

        const visibleArea = {
            minX: this.centerX - halfScreenW / this.zoom,
            maxX: this.centerX + halfScreenW / this.zoom,
            minY: this.centerY - halfScreenH / this.zoom,
            maxY: this.centerY + halfScreenH / this.zoom
        };

        const offsetX = -this.centerX * this.zoom;
        const offsetY = -this.centerY * this.zoom;

        this.dispatcher.emit('planeUpdated', {
            origin: { x: this.originX, y: this.originY },
            center: { x: this.centerX, y: this.centerY },
            zoom: this.zoom,
            offsetX,
            offsetY,
            visibleArea,
            currentZoomLevel: this.currentZoomIndex,
            worldWidth: this.worldWidth,
            worldHeight: this.worldHeight,
            dpr: this.dpr
        });
    }

    worldToScreen(worldX, worldY) {
        return {
            x: this.originX + (worldX - this.centerX) * this.zoom,
            y: this.originY + (worldY - this.centerY) * this.zoom
        };
    }

    screenToWorld(screenX, screenY) {
        return {
            x: (screenX - this.originX) / this.zoom + this.centerX,
            y: (screenY - this.originY) / this.zoom + this.centerY
        };
    }
}
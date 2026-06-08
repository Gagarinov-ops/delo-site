export class Zoom {
    // Константы внутри Zoom
    static BASE_HEIGHT = 500;   // мм
    static MIN_HEIGHT = 50;     // мм

    constructor(initialZoom, screenW, screenH, worldW, worldH) {
        this.baseHeight = Zoom.BASE_HEIGHT;
        this.minHeight = Zoom.MIN_HEIGHT;
        this.maxHeight = this.baseHeight / initialZoom;

        this.panX = 0;
        this.panY = 0;
        this.currentZoomLevel = 0;
        this.levels = [];

        this._animating = false;
        this._pendingLevel = undefined;

        this._buildLevels();
        // Начальный pan — центр мира
        this._centerOnWorld(screenW, screenH, worldW, worldH);
    }

    _buildLevels() {
        const levelCount = 5;
        const ratio = Math.pow(this.maxHeight / this.minHeight, 1 / (levelCount - 1));
        this.levels = [];
        for (let i = 0; i < levelCount; i++) {
            const height = this.minHeight * Math.pow(ratio, i);
            this.levels.push({ index: i, height });
        }
        this.levels[0].height = this.minHeight;
        this.levels[levelCount - 1].height = this.maxHeight;
        this.currentZoomLevel = levelCount - 1;
    }

    _centerOnWorld(screenW, screenH, worldW, worldH) {
        const zoom = this.baseHeight / this.getCameraHeight();
        this.panX = (screenW / 2) / zoom - worldW / 2;
        this.panY = (screenH / 2) / zoom - worldH / 2;
    }

    getCurrentLevel() { return this.currentZoomLevel; }
    getCameraHeight() { return this.levels[this.currentZoomLevel].height; }
    getBaseHeight() { return this.baseHeight; }
    getPan() { return { panX: this.panX, panY: this.panY }; }

    pan(dx, dy) {
        this.panX += dx;
        this.panY += dy;
    }

    zoomIn(screenW, screenH, worldW, worldH) {
        const target = this.currentZoomLevel - 1;
        if (target < 0) return;
        this._requestLevel(target, screenW, screenH, worldW, worldH);
    }

    zoomOut(screenW, screenH, worldW, worldH) {
        const target = this.currentZoomLevel + 1;
        if (target >= this.levels.length) return;
        this._requestLevel(target, screenW, screenH, worldW, worldH);
    }

    _requestLevel(targetLevel, screenW, screenH, worldW, worldH) {
        if (this._animating) {
            this._pendingLevel = targetLevel;
            return;
        }
        this._animating = true;
        this._runAnimation(targetLevel, screenW, screenH, worldW, worldH);
    }

    _runAnimation(targetLevel, screenW, screenH, worldW, worldH) {
        // Пересчитываем pan, чтобы удержать центр экрана на той же мировой точке
        const oldZoom = this.baseHeight / this.getCameraHeight();
        const worldCX = (screenW / 2) / oldZoom - this.panX;
        const worldCY = (screenH / 2) / oldZoom - this.panY;

        this.currentZoomLevel = targetLevel;
        const newZoom = this.baseHeight / this.getCameraHeight();
        this.panX = (screenW / 2) / newZoom - worldCX;
        this.panY = (screenH / 2) / newZoom - worldCY;

        this._animating = false;

        if (this._pendingLevel !== undefined) {
            const pending = this._pendingLevel;
            this._pendingLevel = undefined;
            this._runAnimation(pending, screenW, screenH, worldW, worldH);
        }
    }

    rebuild(initialZoom, screenW, screenH, worldW, worldH) {
        this.maxHeight = this.baseHeight / initialZoom;
        this._buildLevels();
        this._centerOnWorld(screenW, screenH, worldW, worldH);
    }

    reset(screenW, screenH, worldW, worldH) {
        this.currentZoomLevel = this.levels.length - 1;
        this._animating = false;
        this._pendingLevel = undefined;
        this._centerOnWorld(screenW, screenH, worldW, worldH);
    }
}
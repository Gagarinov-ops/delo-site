export class Zoom {
    constructor(initialZoom, maxZoom, dispatcher) {
        this.initialZoom = initialZoom;
        this.maxZoom = maxZoom;
        this.minZoom = initialZoom;
        this.currentZoomLevel = 0;
        this._animating = false;
        this._pendingLevel = undefined;
        this._onFrame = null;
        this.zoom = initialZoom;
        this.zoomLevels = [initialZoom];

        if (dispatcher) {
            dispatcher.on('gridConfig', (config) => this._buildLevels(config));
        }
    }

    setOnFrame(fn) {
        this._onFrame = fn;
    }

    _buildLevels(config) {
        const levels = new Set();
        config.forEach(layer => {
            for (let i = layer.zoomMin; i <= layer.zoomMax; i++) {
                levels.add(i);
            }
        });

        const sortedLevels = [...levels].sort((a, b) => a - b);
        const levelCount = sortedLevels.length;

        if (levelCount === 1) {
            this.zoomLevels = [this.maxZoom];
            this.currentZoomLevel = 0;
            this.zoom = this.maxZoom;
            return;
        }

        // Равномерное распределение уровней зума
        this.zoomLevels = [];
        const ratio = Math.pow(this.maxZoom / this.initialZoom, 1 / (levelCount - 1));
        for (let i = 0; i < levelCount; i++) {
            this.zoomLevels.push(this.maxZoom / Math.pow(ratio, i));
        }
        this.zoomLevels[levelCount - 1] = this.initialZoom;

        this.currentZoomLevel = levelCount - 1;
        this.zoom = this.zoomLevels[this.currentZoomLevel];
    }

    zoomIn() {
        const target = this.currentZoomLevel - 1;
        if (target < 0) return;
        this._requestLevel(target);
    }

    zoomOut() {
        const target = this.currentZoomLevel + 1;
        if (target >= this.zoomLevels.length) return;
        this._requestLevel(target);
    }

    _requestLevel(targetLevel) {
        if (this._animating) {
            this._pendingLevel = targetLevel;
            return;
        }
        this._animating = true;
        this._runAnimation(targetLevel);
    }

    _runAnimation(targetLevel) {
        this.zoom = this.zoomLevels[targetLevel];
        this.currentZoomLevel = targetLevel;
        this._animating = false;

        if (this._pendingLevel !== undefined) {
            const pending = this._pendingLevel;
            this._pendingLevel = undefined;
            this._runAnimation(pending);
        }
    }

    reset() {
        this.zoom = this.initialZoom;
        this.currentZoomLevel = this.zoomLevels.length - 1;
        this._animating = false;
        this._pendingLevel = undefined;
    }

    getCurrentLevel() {
        return this.currentZoomLevel;
    }
}
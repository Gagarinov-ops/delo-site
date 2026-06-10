export class Zoom {
    static BASE_HEIGHT = 500;   // мм
    static MIN_HEIGHT = 50;     // мм

    constructor(initialZoom, screenW, screenH, worldW, worldH) {
        this.baseHeight = Zoom.BASE_HEIGHT;
        this.minHeight = Zoom.MIN_HEIGHT;
        this.maxHeight = this.baseHeight / initialZoom;
        this.currentLevel = 0;
        this.levels = [];
        this._buildLevels();
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
        this.currentLevel = levelCount - 1;
    }

    /** Возвращает все уровни — для CoordinatePlane при инициализации. */
    getLevels() {
        return this.levels;
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    getCameraHeight() {
        return this.levels[this.currentLevel].height;
    }

    getBaseHeight() {
        return this.baseHeight;
    }

    zoomIn() {
        if (this.currentLevel > 0) {
            this.currentLevel--;
        }
    }

    zoomOut() {
        if (this.currentLevel < this.levels.length - 1) {
            this.currentLevel++;
        }
    }

    rebuild(initialZoom, screenW, screenH, worldW, worldH) {
        this.maxHeight = this.baseHeight / initialZoom;
        this._buildLevels();
    }

    reset() {
        this.currentLevel = this.levels.length - 1;
    }
}
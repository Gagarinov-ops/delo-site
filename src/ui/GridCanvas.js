import { Viewport } from '../viewport/Viewport.js';

class GridCanvas {
    constructor(dispatcher) {
        this.canvas = document.getElementById('gridCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.dpr = window.devicePixelRatio || 1;
        this.zoom = 1;
        this.worldWidth = 297;
        this.worldHeight = 297;
        this.viewport = Viewport.getInstance();

        this.dispatcher = dispatcher;
        this.dispatcher.on('cameraChanged', this._onCameraChanged.bind(this));
    }

    _onCameraChanged(data) {
        this.zoom = data.zoom;
        // Размеры холста берём из Viewport
        this.worldWidth = this.viewport.worldWidth;
        this.worldHeight = this.viewport.worldHeight;

        const w = this.worldWidth * this.zoom;
        const h = this.worldHeight * this.zoom;
        this.resize(w, h);
    }

    resize(w, h) {
        this.canvas.width = w * this.dpr;
        this.canvas.height = h * this.dpr;
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        this.draw();
    }

    draw() {
        const ctx = this.ctx;
        const w = this.canvas.width / this.dpr;
        const h = this.canvas.height / this.dpr;
        const level = this.viewport.getCurrentZoomLevel();

        ctx.clearRect(0, 0, w, h);

        if (level === 0) {
            this._drawGridLines(ctx, 1, '#FFD700', w, h);
        } else if (level === 1) {
            this._drawGridLines(ctx, 1, '#CCCCCC', w, h);
            this._drawGridLines(ctx, 5, '#FFD700', w, h);
        } else {
            this._drawGridLines(ctx, 5, '#FFD700', w, h);
        }

        const gridStep = (level === 0 || level === 1) ? '1 мм' : '5 мм';
        this.dispatcher.emit('gridChanged', { step: gridStep });
    }

    _drawGridLines(ctx, stepMM, color, w, h) {
        const startX = 0;
        const startY = 0;
        const endX = this.worldWidth;
        const endY = this.worldHeight;

        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        ctx.beginPath();

        // Вертикальные линии
        for (let wx = startX; wx <= endX; wx += stepMM) {
            const sx = wx * this.zoom;
            if (sx >= 0 && sx <= w) {
                ctx.moveTo(sx, 0);
                ctx.lineTo(sx, h);
            }
        }

        // Горизонтальные линии
        for (let wy = startY; wy <= endY; wy += stepMM) {
            const sy = wy * this.zoom;
            if (sy >= 0 && sy <= h) {
                ctx.moveTo(0, sy);
                ctx.lineTo(w, sy);
            }
        }

        ctx.stroke();
    }
}

export default GridCanvas;
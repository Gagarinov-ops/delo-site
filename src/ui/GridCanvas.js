class GridCanvas {
    constructor(dispatcher) {
        this.canvas = document.getElementById('gridCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.dpr = window.devicePixelRatio || 1;
        this.dispatcher = dispatcher;
        this.planeState = null;

        this.dispatcher.on('containerPlaneReady', (planeState) => {
            this.planeState = planeState;
            this._resize();
            this.draw();
        });

        this.dispatcher.on('canvasDefined', (data) => {
            this.worldWidth = data.size.width;
            this.worldHeight = data.size.height;
        });

        this.dispatcher.on('planeUpdated', (data) => {
            this.dpr = data.dpr || this.dpr;
            this._resize();
            this.draw();
        });
    }

    _resize() {
        if (!this.planeState) return;
        const width = this.planeState.visibleArea.maxX - this.planeState.visibleArea.minX;
        const height = this.planeState.visibleArea.maxY - this.planeState.visibleArea.minY;
        this.canvas.width = width * this.dpr;
        this.canvas.height = height * this.dpr;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
    }

    draw() {
        if (!this.planeState) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = '#FFD700';

        const visibleArea = this.planeState.visibleArea;
        const stepMm = 5;
        const pixelsPerMm = w / (visibleArea.maxX - visibleArea.minX);

        // Вычисляем начальную мировую координату X, кратную шагу сетки
        const startWorldX = Math.ceil(visibleArea.minX / stepMm) * stepMm;
        const startX = (startWorldX - visibleArea.minX) * pixelsPerMm;
        const stepPx = stepMm * pixelsPerMm;

        // Вычисляем начальную мировую координату Y, кратную шагу сетки
        const startWorldY = Math.ceil(visibleArea.minY / stepMm) * stepMm;
        const startY = (startWorldY - visibleArea.minY) * pixelsPerMm;

        ctx.beginPath();
        for (let x = startX; x <= w; x += stepPx) {
            ctx.moveTo(x + 0.5, 0);
            ctx.lineTo(x + 0.5, h);
        }
        for (let y = startY; y <= h; y += stepPx) {
            ctx.moveTo(0, y + 0.5);
            ctx.lineTo(w, y + 0.5);
        }
        ctx.stroke();

        this.dispatcher.emit('gridChanged', { step: '5 мм' });
    }
}

export default GridCanvas;
class GridCanvas {
    constructor(dispatcher) {
        this.canvas = document.getElementById('gridCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.dpr = window.devicePixelRatio || 1;
        this.worldWidth = 297;
        this.worldHeight = 297;
        this.currentZoomLevel = 4;
        this.dispatcher = dispatcher;

        this.dispatcher.on('canvasDefined', (data) => {
            this.worldWidth = data.size.width;
            this.worldHeight = data.size.height;
            this._resize();
            this.draw();
        });

        this.dispatcher.on('cameraChanged', (data) => {
            if (data.isResize) {
                this.dpr = data.dpr || this.dpr;
                this.worldWidth = data.worldWidth;
                this.worldHeight = data.worldHeight;
                this._resize();
            }
            if (this.currentZoomLevel !== data.currentZoomLevel || data.isResize) {
                this.currentZoomLevel = data.currentZoomLevel;
                this.draw();
            }
        });
    }

    _resize() {
        this.canvas.width = this.worldWidth * this.dpr;
        this.canvas.height = this.worldHeight * this.dpr;
        this.canvas.style.width = this.worldWidth + 'px';
        this.canvas.style.height = this.worldHeight + 'px';
    }

    draw() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = '#FFD700';

        const stepPx = 5 * this.dpr;

        ctx.beginPath();
        for (let x = 0; x <= w; x += stepPx) {
            ctx.moveTo(x + 0.5, 0);
            ctx.lineTo(x + 0.5, h);
        }
        for (let y = 0; y <= h; y += stepPx) {
            ctx.moveTo(0, y + 0.5);
            ctx.lineTo(w, y + 0.5);
        }
        ctx.stroke();

        this.dispatcher.emit('gridChanged', { step: '5 мм' });
    }
}

export default GridCanvas;
class Overlay {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.dpr = window.devicePixelRatio || 1;
    }

    clear() {
        const w = this.canvas.width / this.dpr;
        const h = this.canvas.height / this.dpr;
        this.ctx.clearRect(0, 0, w, h);
    }

    drawLine(x1, y1, x2, y2, color = '#1E90FF', lineWidth = 3) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
}

export default Overlay;
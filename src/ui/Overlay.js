class Overlay {
    constructor(dispatcher, canvasId = 'overlayCanvas') {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.dpr = window.devicePixelRatio || 1;

        const width = 297;
        const height = 297;
        this.canvas.width = width * this.dpr;
        this.canvas.height = height * this.dpr;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    clear() {
        const w = this.canvas.width / this.dpr;
        const h = this.canvas.height / this.dpr;
        this.ctx.clearRect(0, 0, w, h);
    }

    drawLine(x1, y1, x2, y2, color = '#1E90FF', lineWidth = 3) {
        this.ctx.setLineDash([]);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    drawDashedLine(x1, y1, x2, y2, color = '#1E90FF', lineWidth = 3) {
        this.ctx.setLineDash([8, 6]);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
}

export default Overlay;
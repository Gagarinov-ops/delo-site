class MainCanvas {
    constructor(dispatcher, canvasId = 'mainCanvas') {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.dpr = window.devicePixelRatio || 1;

        // Подписываемся на размеры от контейнера
        dispatcher.on('canvasDefined', (data) => {
            const width = data.size.width;
            const height = data.size.height;
            this.canvas.width = width * this.dpr;
            this.canvas.height = height * this.dpr;
            this.canvas.style.width = width + 'px';
            this.canvas.style.height = height + 'px';
            this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        });
    }

    drawLine(x1, y1, x2, y2, color = '#1E90FF', lineWidth = 3) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    drawPoint(x, y, color = '#FF4500', radius = 5) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
}

export default MainCanvas;
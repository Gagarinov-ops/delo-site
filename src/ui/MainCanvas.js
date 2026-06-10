class MainCanvas {
    constructor(dispatcher, canvasId = 'mainCanvas') {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.dpr = window.devicePixelRatio || 1;
        this.dispatcher = dispatcher;

        const width = 297;
        const height = 297;
        // Размеры канваса в физических пикселях
        this.canvas.width = width * this.dpr;
        this.canvas.height = height * this.dpr;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        // Никакой setTransform — будем умножать координаты вручную

        // Подписка на фиксацию готовой стены
        this.dispatcher.on('mainCanvas:drawWall', this._handleDrawWall.bind(this));
    }

    // Чистые методы рисования — принимают CSS-пиксели, внутри умножают на dpr
    drawLine(x1, y1, x2, y2, color = '#000000', lineWidth = 1) {
        const ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(x1 * this.dpr, y1 * this.dpr);
        ctx.lineTo(x2 * this.dpr, y2 * this.dpr);
        ctx.stroke();
        ctx.restore();
    }

    drawPoint(x, y, color = '#000000', radius = 2.5) {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x * this.dpr, y * this.dpr, radius * this.dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Обработчик события: рисует стену и ставит флаг подтверждения
    _handleDrawWall(data) {
        if (!data || data.x1 === undefined || data.y1 === undefined ||
            data.x2 === undefined || data.y2 === undefined) return;

        this.drawLine(data.x1, data.y1, data.x2, data.y2);
        this.drawPoint(data.x1, data.y1);
        this.drawPoint(data.x2, data.y2);

        // Подтверждаем выполнение
        data._ack = true;
    }
}

export default MainCanvas;
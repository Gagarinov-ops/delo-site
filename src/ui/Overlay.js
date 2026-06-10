class Overlay {
    constructor(dispatcher, canvasId = 'overlayCanvas') {
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

        // Подписки на команды от LayerManager
        this.dispatcher.on('overlay:drawStartPoint', this._handleDrawStartPoint.bind(this));
        this.dispatcher.on('overlay:drawDashedLine', this._handleDrawDashedLine.bind(this));
        this.dispatcher.on('overlay:draftEndLine', this._handleDraftEndLine.bind(this));
        this.dispatcher.on('overlay:clear', this._handleClear.bind(this));
    }

    // Перевод CSS-пикселей в физические пиксели
    _cssToPhysical(x, y) {
        return {
            x: x * this.dpr,
            y: y * this.dpr
        };
    }

    clear() {
        // Очистка в физических пикселях
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawStartPoint(x, y) {
        const ctx = this.ctx;
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(x, y, 4 * this.dpr, 0, Math.PI * 2); // радиус в физических пикселях
        ctx.fill();
    }

    drawDashedLine(x1, y1, x2, y2) {
        const ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1; // тонкая линия в физических пикселях
        ctx.setLineDash([6 * this.dpr, 4 * this.dpr]); // штрихи с учётом dpr
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }

    // Обработчики событий с подтверждением
    _handleDrawStartPoint(data) {
        if (!data || data.x === undefined || data.y === undefined) return;
        const p = this._cssToPhysical(data.x, data.y);
        this.clear();
        this.drawStartPoint(p.x, p.y);
        data._ack = true;
    }

    _handleDrawDashedLine(data) {
        if (!data || data.x1 === undefined || data.y1 === undefined ||
            data.x2 === undefined || data.y2 === undefined) return;
        const p1 = this._cssToPhysical(data.x1, data.y1);
        const p2 = this._cssToPhysical(data.x2, data.y2);
        this.clear();
        this.drawStartPoint(p1.x, p1.y);
        this.drawDashedLine(p1.x, p1.y, p2.x, p2.y);
        data._ack = true;
    }

    _handleDraftEndLine(data) {
        // То же, что и dashed line – финальное превью
        this._handleDrawDashedLine(data);
    }

    _handleClear(data) {
        this.clear();
        if (data) data._ack = true;
    }
}

export default Overlay;
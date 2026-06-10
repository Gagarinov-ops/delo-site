export class ContainerCoordinatePlane {
    constructor(width = 297, height = 297, dispatcher = null, gridStep = 5) {
        this.width = width;
        this.height = height;
        this.gridStep = gridStep;
        this.halfWidth = width / 2;
        this.halfHeight = height / 2;
        this.dispatcher = dispatcher;

        // Размеры экрана в пикселях
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.originX = this.screenWidth / 2;
        this.originY = this.screenHeight / 2;

        // Видимая область от Viewport в миллиметрах
        this.viewportVisibleArea = null;

        // Состояние жеста
        this._startX = 0;
        this._startY = 0;

        this._handleResize = this._handleResize.bind(this);
        this._setupResizeListener();

        // Подписка на событие от Viewport
        if (this.dispatcher) {
            this.dispatcher.on('planeUpdated', this._onPlaneUpdated.bind(this));
        }
    }

    _setupResizeListener() {
        window.addEventListener('resize', this._handleResize);
        window.addEventListener('orientationchange', this._handleResize);
    }

    _handleResize() {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.originX = this.screenWidth / 2;
        this.originY = this.screenHeight / 2;
    }

    _onPlaneUpdated(data) {
        if (data && data.visibleArea) {
            this.viewportVisibleArea = data.visibleArea;
        }
    }

    getOrigin() {
        return { x: this.originX, y: this.originY };
    }

    getSize() {
        return { width: this.width, height: this.height };
    }

    getState() {
        return {
            origin: { x: 0, y: 0 },
            visibleArea: {
                minX: -this.halfWidth,
                maxX: this.halfWidth,
                minY: -this.halfHeight,
                maxY: this.halfHeight
            }
        };
    }

    screenToWorld(screenX, screenY) {
        if (!this.viewportVisibleArea) {
            // Временный fallback, пока Viewport не прислал данные
            return {
                x: screenX - this.originX,
                y: screenY - this.originY
            };
        }
        const va = this.viewportVisibleArea;
        const worldX = va.minX + (screenX / this.screenWidth) * (va.maxX - va.minX);
        const worldY = va.minY + (screenY / this.screenHeight) * (va.maxY - va.minY);
        return { x: worldX, y: worldY };
    }

    handleToolGesture(data) {
        if (!data || !this.dispatcher) return;

        const { gesture, screenX, screenY } = data;
        const world = this.screenToWorld(screenX, screenY);

        // Проверяем, попадает ли точка в пределы контейнера
        if (!this.isInside(world.x, world.y)) return;

        const toolResult = {};

        switch (gesture) {
            case 'pointerdown':
                this._startX = world.x;
                this._startY = world.y;
                toolResult.startX = world.x;
                toolResult.startY = world.y;
                break;
            case 'pointermove':
                toolResult.startX = this._startX;
                toolResult.startY = this._startY;
                toolResult.currentX = world.x;
                toolResult.currentY = world.y;
                break;
            case 'pointerup':
                toolResult.startX = this._startX;
                toolResult.startY = this._startY;
                toolResult.endX = world.x;
                toolResult.endY = world.y;
                break;
        }

        this.dispatcher.emit('toolResult', {
            gesture,
            toolResult,
            visibleArea: this.viewportVisibleArea
        });
    }

    getGrid() {
        const lines = [];
        for (let x = -this.halfWidth; x <= this.halfWidth; x += this.gridStep) {
            lines.push({ axis: 'X', position: x });
        }
        for (let y = -this.halfHeight; y <= this.halfHeight; y += this.gridStep) {
            lines.push({ axis: 'Y', position: y });
        }
        return lines;
    }

    isInside(x, y) {
        return x >= -this.halfWidth && x <= this.halfWidth &&
               y >= -this.halfHeight && y <= this.halfHeight;
    }

    destroy() {
        window.removeEventListener('resize', this._handleResize);
        window.removeEventListener('orientationchange', this._handleResize);
        if (this.dispatcher) {
            this.dispatcher.off('planeUpdated', this._onPlaneUpdated);
        }
    }
}
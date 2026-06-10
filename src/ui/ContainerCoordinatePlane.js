export class ContainerCoordinatePlane {
    constructor(width = 297, height = 297, dispatcher = null, gridStep = 5) {
        this.width = width;
        this.height = height;
        this.gridStep = gridStep;
        this.halfWidth = width / 2;
        this.halfHeight = height / 2;
        this.dispatcher = dispatcher;

        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.originX = this.screenWidth / 2;
        this.originY = this.screenHeight / 2;

        this.viewportVisibleArea = null;
        this._startX = 0;
        this._startY = 0;

        this._handleResize = this._handleResize.bind(this);
        this._setupResizeListener();

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
            if (this.dispatcher) {
                this.dispatcher.emit('containerPlaneUpdated', {
                    visibleArea: data.visibleArea
                });
            }
        }
    }

    getOrigin() { return { x: this.originX, y: this.originY }; }
    getSize() { return { width: this.width, height: this.height }; }

    getState() {
        return {
            origin: { x: 0, y: 0 },
            visibleArea: {
                minX: -this.halfWidth, maxX: this.halfWidth,
                minY: -this.halfHeight, maxY: this.halfHeight
            }
        };
    }

    screenToWorld(screenX, screenY) {
        if (!this.viewportVisibleArea) {
            return { x: screenX - this.originX, y: screenY - this.originY };
        }
        const va = this.viewportVisibleArea;
        const worldX = va.minX + (screenX / this.screenWidth) * (va.maxX - va.minX);
        const worldY = va.minY + (screenY / this.screenHeight) * (va.maxY - va.minY);
        return { x: worldX, y: worldY };
    }

    handleToolGesture(data) {
        const { gesture, screenX, screenY } = data;
        const world = this.screenToWorld(screenX, screenY);

        if (gesture === 'pointerdown') {
            if (!this.isInside(world.x, world.y)) return;
            this._startX = world.x;
            this._startY = world.y;
            this.dispatcher.emit('toolResult', {
                gesture,
                toolResult: { startX: world.x, startY: world.y },
                visibleArea: this.viewportVisibleArea
            });
            return;
        }

        if (gesture === 'pointermove') {
            // Выход за границу — отмена!
            if (!this.isInside(world.x, world.y)) {
                this.dispatcher.emit('cancelDraft');
                return;
            }
            this.dispatcher.emit('toolResult', {
                gesture,
                toolResult: {
                    startX: this._startX, startY: this._startY,
                    currentX: world.x, currentY: world.y
                },
                visibleArea: this.viewportVisibleArea
            });
            return;
        }

        if (gesture === 'pointerup') {
            // Финиш за границей — тоже отмена
            if (!this.isInside(world.x, world.y)) {
                this.dispatcher.emit('cancelDraft');
                return;
            }
            this.dispatcher.emit('toolResult', {
                gesture,
                toolResult: {
                    startX: this._startX, startY: this._startY,
                    endX: world.x, endY: world.y
                },
                visibleArea: this.viewportVisibleArea
            });
        }
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
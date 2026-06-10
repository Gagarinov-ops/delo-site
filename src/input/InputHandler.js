import { Viewport } from '../viewport/Viewport.js';

export class InputHandler {
    constructor(dispatcher) {
        this.emitter = (type, data) => dispatcher.emit(type, data);
        this.dragging = false;
        this.lastX = 0;
        this.lastY = 0;
        this.pinchActive = false;
        this.lastDist = 0;
        this.pinchZoomed = false;
        this._toolActive = false;

        this.initEvents();
    }

    _getCoordinatePlane() {
        const viewport = Viewport.getInstance();
        return viewport?.getCoordinatePlane?.() ?? null;
    }

    initEvents() {
        document.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
        document.addEventListener('pointerdown', this.onPointerDown.bind(this));
        document.addEventListener('pointermove', this.onPointerMove.bind(this));
        document.addEventListener('pointerup', this.onPointerUp.bind(this));
        document.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.onTouchEnd.bind(this));
    }

    _isToolbarTarget(target) {
        const toolbar = document.getElementById('toolbar');
        return toolbar && toolbar.contains(target);
    }

    _isCanvasTarget(target) {
        const container = document.getElementById('canvasContainer');
        return container && container.contains(target);
    }

    onWheel(e) {
        e.preventDefault();
        const cp = this._getCoordinatePlane();
        if (cp) {
            cp.handleEvent('zoom', {
                direction: e.deltaY < 0 ? 1 : -1,
                screenX: e.clientX,
                screenY: e.clientY
            });
        }
    }

    onPointerDown(e) {
        if (!e.isPrimary) return;

        if (this._isToolbarTarget(e.target)) {
            this.emitter('toolbarGesture', {
                gesture: 'pointerdown',
                x: e.clientX,
                y: e.clientY
            });
            return;
        }

        if (this._isCanvasTarget(e.target)) {
            const activeTool = window.activeToolName || 'cursor';
            if (activeTool !== 'cursor') {
                // Карандаш — напрямую в контейнер
                const containerPlane = window.containerPlane;
                if (containerPlane) {
                    containerPlane.handleToolGesture({
                        gesture: 'pointerdown',
                        screenX: e.clientX,
                        screenY: e.clientY
                    });
                }
                this._toolActive = true;
            } else {
                this._toolActive = false;
                this.dragging = true;
                this.lastX = e.clientX;
                this.lastY = e.clientY;
            }
            e.preventDefault();
        }
    }

    onPointerMove(e) {
        if (this._toolActive) {
            const containerPlane = window.containerPlane;
            if (containerPlane) {
                containerPlane.handleToolGesture({
                    gesture: 'pointermove',
                    screenX: e.clientX,
                    screenY: e.clientY
                });
            }
            return;
        }

        if (this.dragging && !this.pinchActive) {
            const dx = e.clientX - this.lastX;
            const dy = e.clientY - this.lastY;
            if (dx !== 0 || dy !== 0) {
                const cp = this._getCoordinatePlane();
                if (cp) {
                    cp.handleEvent('pan', { dx, dy });
                }
                this.lastX = e.clientX;
                this.lastY = e.clientY;
            }
        }
    }

    onPointerUp(e) {
        if (this._toolActive) {
            const containerPlane = window.containerPlane;
            if (containerPlane) {
                containerPlane.handleToolGesture({
                    gesture: 'pointerup',
                    screenX: e.clientX,
                    screenY: e.clientY
                });
            }
            this._toolActive = false;
            return;
        }

        if (this._isToolbarTarget(e.target)) {
            this.emitter('toolbarGesture', {
                gesture: 'pointerup',
                x: e.clientX,
                y: e.clientY
            });
        }

        if (e.isPrimary) {
            this.dragging = false;
        }
    }

    onTouchStart(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            this.pinchActive = true;
            this.dragging = false;
            this.pinchZoomed = false;
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            this.lastDist = Math.hypot(dx, dy);
        }
    }

    onTouchMove(e) {
        if (this.pinchActive && e.touches.length === 2) {
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const newDist = Math.hypot(dx, dy);

            if (!this.pinchZoomed) {
                const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                const cp = this._getCoordinatePlane();
                if (cp) {
                    if (newDist > this.lastDist * 1.2) {
                        cp.handleEvent('zoom', {
                            direction: 1,
                            screenX: centerX,
                            screenY: centerY
                        });
                        this.pinchZoomed = true;
                    } else if (newDist < this.lastDist * 0.8) {
                        cp.handleEvent('zoom', {
                            direction: -1,
                            screenX: centerX,
                            screenY: centerY
                        });
                        this.pinchZoomed = true;
                    }
                }
            }
        }
    }

    onTouchEnd(e) {
        this.pinchActive = false;
        this.pinchZoomed = false;
        this.lastDist = 0;
    }
}
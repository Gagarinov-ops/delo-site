import { Zoom } from './Zoom.js';
import { PanLimits } from './PanLimits.js';
import { setupResetButton } from '../ui/ResetButton.js';
import { setupDisplayDetector } from './DisplayDetector.js';
import { setupCameraDOM } from './CameraDOM.js';

class Viewport {
    constructor() {
        if (Viewport.instance) {
            return Viewport.instance;
        }
        this.worldWidth = null;
        this.worldHeight = null;
        this.dpr = window.devicePixelRatio || 1;
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;
        this.dispatcher = null;
        this.coordinateMapper = null;
        this.panLimits = null;
        this.zoomManager = null;
        Viewport.instance = this;
    }

    static getInstance() {
        if (!Viewport.instance) {
            Viewport.instance = new Viewport();
        }
        return Viewport.instance;
    }

    setDispatcher(dispatcher) {
        this.dispatcher = dispatcher;
        dispatcher.on('resetCamera', () => this.reset());
        setupResetButton(dispatcher);
        setupDisplayDetector(this);
        setupCameraDOM(dispatcher);
        dispatcher.on('canvasDefined', (data) => this._onCanvasDefined(data));
    }

    setCoordinateMapper(mapper) {
        this.coordinateMapper = mapper;
    }

    _onCanvasDefined(data) {
        this.worldWidth = data.size.width;
        this.worldHeight = data.size.height;
        const initialZoom = this._calcInitialZoom();
        this.panLimits = new PanLimits();
        this.panLimits.init(initialZoom, this.innerWidth, this.innerHeight);
        this.zoomManager = new Zoom(initialZoom, this.innerWidth, this.innerHeight, this.worldWidth, this.worldHeight);
        this._notifyCameraChanged();
    }

    _calcInitialZoom() {
        const m = 0.9;
        return Math.min(
            (this.innerWidth * m) / this.worldWidth,
            (this.innerHeight * m) / this.worldHeight
        );
    }

    getCurrentZoomLevel() { return this.zoomManager?.getCurrentLevel() ?? 4; }
    getPan() { return this.zoomManager?.getPan() ?? { panX: 0, panY: 0 }; }

    updateDpr(dpr) {
        this.dpr = dpr;
        this._notifyCameraChanged(true);
    }

    updateProjection() {
        if (!this.zoomManager) return;
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;
        const newZoom = this._calcInitialZoom();
        this.panLimits.init(newZoom, this.innerWidth, this.innerHeight);
        this.zoomManager.rebuild(newZoom, this.innerWidth, this.innerHeight, this.worldWidth, this.worldHeight);
        this._notifyCameraChanged(true);
    }

    zoomIn() {
        this.zoomManager?.zoomIn(this.innerWidth, this.innerHeight, this.worldWidth, this.worldHeight);
        this._notifyCameraChanged();
    }

    zoomOut() {
        this.zoomManager?.zoomOut(this.innerWidth, this.innerHeight, this.worldWidth, this.worldHeight);
        this._notifyCameraChanged();
    }

    pan(dx, dy) {
        this.zoomManager?.pan(dx, dy);
        this._notifyCameraChanged();
    }

    reset() {
        if (!this.zoomManager) return;
        this.zoomManager.reset(this.innerWidth, this.innerHeight, this.worldWidth, this.worldHeight);
        window.dispatchEvent(new CustomEvent('zoomLevelChanged', { detail: { level: this.zoomManager.getCurrentLevel() } }));
        this._notifyCameraChanged();
    }

    _notifyCameraChanged(isResize = false) {
        if (!this.zoomManager || (!this.dispatcher && !this.coordinateMapper)) return;
        const pan = this.zoomManager.getPan();
        const limits = this.panLimits.getLimits();
        const data = {
            currentZoomLevel: this.zoomManager.getCurrentLevel(),
            cameraHeight: this.zoomManager.getCameraHeight(),
            baseHeight: this.zoomManager.getBaseHeight(),
            panX: pan.panX,
            panY: pan.panY,
            worldWidth: limits.worldWidth,
            worldHeight: limits.worldHeight,
            minPanX: limits.minPanX,
            maxPanX: limits.maxPanX,
            minPanY: limits.minPanY,
            maxPanY: limits.maxPanY,
            dpr: this.dpr,
            isResize
        };
        this.coordinateMapper?.updateCamera(data);
        this.dispatcher?.emit('cameraChanged', data);
    }
}

window.Viewport = Viewport;
export { Viewport };
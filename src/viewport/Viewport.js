import { CoordinatePlane } from './CoordinatePlane.js';
import { setupResetButton } from '../ui/ResetButton.js';
import { setupDisplayDetector } from './DisplayDetector.js';

class Viewport {
    constructor() {
        if (Viewport.instance) {
            return Viewport.instance;
        }
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;
        this.dpr = window.devicePixelRatio || 1;
        this.dispatcher = null;
        this.coordinatePlane = null;

        this._handleResize = this._handleResize.bind(this);
        this._setupResizeListener();

        Viewport.instance = this;
    }

    static getInstance() {
        if (!Viewport.instance) {
            Viewport.instance = new Viewport();
        }
        return Viewport.instance;
    }

    _setupResizeListener() {
        window.addEventListener('resize', this._handleResize);
        window.addEventListener('orientationchange', this._handleResize);
    }

    _handleResize() {
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;
        this.dpr = window.devicePixelRatio || 1;
        this._emitDisplayInfo();
    }

    _emitDisplayInfo() {
        if (!this.dispatcher) return;
        const orientation = this.innerWidth > this.innerHeight ? 'landscape' : 'portrait';
        this.dispatcher.emit('displayChanged', {
            width: this.innerWidth,
            height: this.innerHeight,
            dpr: this.dpr,
            orientation
        });
    }

    setDispatcher(dispatcher) {
        this.dispatcher = dispatcher;
        setupResetButton(dispatcher);
        setupDisplayDetector(this);
        dispatcher.on('canvasDefined', (data) => this._onCanvasDefined(data));
        dispatcher.on('displayChanged', (data) => this.coordinatePlane?.handleDisplayChanged(data));
        this._emitDisplayInfo();
    }

    getCoordinatePlane() {
        return this.coordinatePlane;
    }

    _onCanvasDefined(data) {
        const worldWidth = data.size.width;
        const worldHeight = data.size.height;
        const initialZoom = this._calcInitialZoom(worldWidth, worldHeight);
        this.coordinatePlane = new CoordinatePlane(this.dispatcher, worldWidth, worldHeight, initialZoom);
    }

    _calcInitialZoom(worldWidth, worldHeight) {
        const m = 0.9;
        return Math.min(
            (this.innerWidth * m) / worldWidth,
            (this.innerHeight * m) / worldHeight
        );
    }

    updateDpr(dpr) {
        this.dpr = dpr;
        this.coordinatePlane?.updateDpr(dpr);
    }
}

window.Viewport = Viewport;
export { Viewport };
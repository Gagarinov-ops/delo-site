export class Camera {
    constructor(viewportElement, dispatcher) {
        this.viewportElement = viewportElement;
        this.dispatcher = dispatcher;
    }

    onPlaneUpdated(data) {
        const transform = `translate(${data.offsetX}px, ${data.offsetY}px) scale(${data.zoom})`;
        this.viewportElement.style.transform = transform;
    }
}

export function setupCameraDOM(dispatcher) {
    const viewportElement = document.getElementById('viewport');
    if (!viewportElement) return null;
    const camera = new Camera(viewportElement, dispatcher);
    dispatcher.on('planeUpdated', (data) => camera.onPlaneUpdated(data));
    return camera;
}
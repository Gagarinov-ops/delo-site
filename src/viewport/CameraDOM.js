export function setupCameraDOM(dispatcher) {
    const viewportElement = document.getElementById('viewport');
    if (!viewportElement) return;

    viewportElement.style.transformOrigin = '0 0';

    dispatcher.on('cameraChanged', (data) => {
        const zoom = data.baseHeight / data.cameraHeight;
        viewportElement.style.transform = `translate(${data.panX}px, ${data.panY}px) scale(${zoom})`;
    });
}
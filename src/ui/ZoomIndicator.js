export function setupZoomIndicator(dispatcher) {
    const indicator = document.getElementById('zoomIndicator');
    if (!indicator) return;

    let currentGridStep = '5 мм';

    dispatcher.on('gridChanged', (data) => {
        currentGridStep = data.step;
    });

    dispatcher.on('cameraChanged', (data) => {
        const level = data.currentZoomLevel;
        indicator.innerHTML = `Zoom: ${level + 1}<br>Сетка: ${currentGridStep}`;
        indicator.style.opacity = '1';

        clearTimeout(window._zoomIndicatorTimeout);
        window._zoomIndicatorTimeout = setTimeout(() => {
            indicator.style.opacity = '0';
        }, 2000);
    });
}
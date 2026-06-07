export function setupZoomIndicator(dispatcher) {
    const indicator = document.getElementById('zoomIndicator');
    if (!indicator) return;

    let currentGridStep = '5 мм';

    dispatcher.on('gridChanged', (data) => {
        currentGridStep = data.step;
    });

    dispatcher.on('zoomChanged', (data) => {
        const zoomLevel = data.zoomLevel;
        indicator.innerHTML = `Zoom: ${zoomLevel + 1}<br>Сетка: ${currentGridStep}`;
        indicator.style.opacity = '1';

        clearTimeout(window._zoomIndicatorTimeout);
        window._zoomIndicatorTimeout = setTimeout(() => {
            indicator.style.opacity = '0';
        }, 2000);
    });
}
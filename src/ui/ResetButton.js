export function setupResetButton(dispatcher) {
    const btn = document.getElementById('resetZoomButton');
    if (!btn) return;

    btn.addEventListener('click', () => {
        dispatcher.emit('resetCamera');
    });
}
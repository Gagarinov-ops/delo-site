export function setupDisplayDetector(viewport) {
    function applyDpr() {
        const dpr = window.devicePixelRatio || 1;
        if (viewport) {
            viewport.updateDpr(dpr);
        }
    }

    applyDpr();

    window.addEventListener('resize', applyDpr);
}
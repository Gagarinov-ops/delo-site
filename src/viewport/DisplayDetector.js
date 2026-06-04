export function setupDisplayDetector(dispatcher) {
    function applyDpr() {
        const dpr = window.devicePixelRatio || 1;
        // Толщина линии: 1 / dpr, но не меньше 0.5px
        const lineWidth = Math.max(0.5, 1 / dpr);
        document.documentElement.style.setProperty('--grid-line-width', lineWidth + 'px');
    }

    // Применяем при загрузке
    applyDpr();

    // При ресайзе (смена монитора) — обновляем
    window.addEventListener('resize', applyDpr);
}
export function setupResize(viewport, dispatcher, updateSize, updatePosition) {
    window.addEventListener('resize', () => {
        viewport.updateProjection();
        
        // Обновляем original-значения после пересчёта проекции
        viewport.originalPanX = viewport.getPan().panX;
        viewport.originalPanY = viewport.getPan().panY;
        
        updateSize();
        updatePosition();
        
        dispatcher.emit('containerResized', {
            width: viewport.worldWidth * viewport.getZoom(),
            height: viewport.worldHeight * viewport.getZoom(),
            panX: viewport.getPan().panX,
            panY: viewport.getPan().panY
        });
        dispatcher.emit('zoomChanged', { zoomLevel: viewport.getCurrentZoomLevel() });
    });
}
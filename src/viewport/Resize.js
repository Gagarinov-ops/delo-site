export function setupResize(viewport, dispatcher) {
    window.addEventListener('resize', () => {
        viewport.updateProjection();
        
        // Обновляем original-значения после пересчёта проекции
        viewport.originalPanX = viewport.getPan().panX;
        viewport.originalPanY = viewport.getPan().panY;
    });
}
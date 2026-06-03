export function setupGridLayers(dispatcher, viewport) {  
    const layers = {  
        fine: document.getElementById('gridLayerFine'),  
        medium: document.getElementById('gridLayerMedium')  
    };  

    function updateGrid(data) {  
        const zoomLevel = data.zoomLevel;  
        const zoom = viewport.getZoom();  

        // Обновляем CSS-переменную --step для всех слоёв  
        Object.entries(layers).forEach(([key, layer]) => {  
            if (!layer) return;  
            const step = parseFloat(layer.dataset.step);  
            layer.style.setProperty('--step', (step * zoom) + 'px');  
        });  

        // Сбросить классы  
        Object.values(layers).forEach(layer => {  
            if (layer) {  
                layer.classList.remove('grid-layer--active', 'grid-layer--transition');  
            }  
        });  

        // Переключение по уровням (0..4)  
        switch (zoomLevel) {  
            case 0: // максимальное приближение: жёлтая 1 мм  
                if (layers.fine) layers.fine.classList.add('grid-layer--active');  
                break;  
            case 1: // переход: серая 1 мм + жёлтая 5 мм  
                if (layers.fine) layers.fine.classList.add('grid-layer--transition');  
                if (layers.medium) layers.medium.classList.add('grid-layer--active');  
                break;  
            case 2: // начальный: жёлтая 5 мм  
                if (layers.medium) layers.medium.classList.add('grid-layer--active');  
                break;  
            case 3: // переход: серая 5 мм  
                if (layers.medium) layers.medium.classList.add('grid-layer--transition');  
                break;  
            case 4: // максимальное отдаление: тоже жёлтая 5 мм (нет слоя 10 мм)  
                if (layers.medium) layers.medium.classList.add('grid-layer--active');  
                break;  
            default: // fallback  
                if (layers.medium) layers.medium.classList.add('grid-layer--active');  
        }  
    }  

    dispatcher.on('zoomChanged', updateGrid);  
    updateGrid({ zoomLevel: viewport.currentZoomLevel });  
}  
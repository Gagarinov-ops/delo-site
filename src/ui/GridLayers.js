export function setupGridLayers(dispatcher, viewport) {  
    const layers = {  
        fine: document.getElementById('gridLayerFine'),  
        medium: document.getElementById('gridLayerMedium')  
    };  

    function sendGridConfig() {
        const config = [];
        Object.entries(layers).forEach(([key, layer]) => {
            if (!layer) return;
            config.push({
                id: layer.id,
                zoomMin: parseInt(layer.dataset.zoomMin) ?? 0,
                zoomMax: parseInt(layer.dataset.zoomMax) ?? 4,
                step: layer.dataset.step
            });
        });
        dispatcher.emit('gridConfig', config);
    }

    // Отправить конфиг
    sendGridConfig();

    // Сразу применить текущий уровень zoom
    updateGrid({ zoomLevel: viewport.getCurrentZoomLevel() });

    function updateGrid(data) {  
        const zoomLevel = data.zoomLevel;  
        const zoom = viewport.getZoom();  

        // Обновляем CSS-переменную --step и классы для каждого слоя
        Object.entries(layers).forEach(([key, layer]) => {  
            if (!layer) return;  

            // Обновляем CSS-переменную --step
            const step = parseFloat(layer.dataset.step);  
            layer.style.setProperty('--step', (step * zoom) + 'px');  

            // Сброс классов  
            layer.classList.remove('grid-layer--active', 'grid-layer--transition');  

            // Проверяем, должен ли слой быть видимым по диапазону zoom
            const min = parseInt(layer.dataset.zoomMin) ?? 0;  
            const max = parseInt(layer.dataset.zoomMax) ?? 4;  

            if (zoomLevel >= min && zoomLevel <= max) {  
                // Уровень 0: переходное состояние для обоих слоёв  
                if (zoomLevel === 0) {  
                    if (key === 'fine') {  
                        layer.classList.add('grid-layer--transition');  
                    } else if (key === 'medium') {  
                        layer.classList.add('grid-layer--active');  
                    }  
                } else {  
                    // Остальные уровни: активный слой  
                    layer.classList.add('grid-layer--active');  
                }  
            }  
        });  

        // Определяем активный шаг сетки из data-атрибута активного слоя
        let activeStep = '5 мм';  // значение по умолчанию
        for (const [key, layer] of Object.entries(layers)) {
            if (layer && layer.classList.contains('grid-layer--active')) {
                activeStep = layer.dataset.step + ' мм';
                break;
            }
        }
        // Для переходного состояния (уровень 0) — комбинированный шаг
        if (zoomLevel === 0) {
            const fineStep = layers.fine?.dataset.step;
            const mediumStep = layers.medium?.dataset.step;
            if (fineStep && mediumStep) {
                activeStep = fineStep + '/' + mediumStep + ' мм';
            }
        }
        dispatcher.emit('activeGridChanged', { step: activeStep });
    }  

    dispatcher.on('zoomChanged', updateGrid);  
}
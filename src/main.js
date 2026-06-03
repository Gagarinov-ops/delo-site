import { EventDispatcher } from './core/EventDispatcher.js';  
import { Viewport } from './viewport/Viewport.js';  
import { InputHandler } from './input/InputHandler.js';  
import { setupGridLayers } from './ui/GridLayers.js';  

// ---------- Логика меню (без изменений) ----------  
function closeAllMenus() {  
    document.getElementById('burgerMenu')?.classList.remove('show');  
    document.getElementById('elementsMenu')?.classList.remove('show');  
}  

function toggleMenu(menuId, event) {  
    if (event) event.stopPropagation();  
    const menu = document.getElementById(menuId);  
    const isOpen = menu.classList.contains('show');  
    closeAllMenus();  
    if (!isOpen) {  
        menu.classList.add('show');  
    }  
}  

document.addEventListener('click', (event) => {  
    const burgerBtn = document.getElementById('burgerBtn');  
    const elementsBtn = document.getElementById('elementsBtn');  
    const burgerMenu = document.getElementById('burgerMenu');  
    const elementsMenu = document.getElementById('elementsMenu');  

    const isBurgerClick = burgerBtn?.contains(event.target) || false;  
    const isElementsClick = elementsBtn?.contains(event.target) || false;  
    const isBurgerMenuClick = burgerMenu?.contains(event.target) || false;  
    const isElementsMenuClick = elementsMenu?.contains(event.target) || false;  

    if (!isBurgerClick && !isBurgerMenuClick) {  
        burgerMenu?.classList.remove('show');  
    }  
    if (!isElementsClick && !isElementsMenuClick) {  
        elementsMenu?.classList.remove('show');  
    }  
});  

document.getElementById('burgerBtn')?.addEventListener('click', (e) => {  
    toggleMenu('burgerMenu', e);  
});  

document.getElementById('elementsBtn')?.addEventListener('click', (e) => {  
    toggleMenu('elementsMenu', e);  
});  

document.querySelectorAll('.menu-item').forEach(btn => {  
    btn.addEventListener('click', () => {  
        closeAllMenus();  
        console.log(`[Заглушка] Нажато: ${btn.textContent}`);  
    });  
});  

document.getElementById('backBtn')?.addEventListener('click', () => {  
    console.log('[Заглушка] Назад');  
});  

document.querySelectorAll('.tool-btn:not(#elementsBtn)').forEach(btn => {  
    btn.addEventListener('click', () => {  
        console.log(`[Заглушка] Инструмент: ${btn.textContent}`);  
    });  
});  

// ---------- Индикатор zoom ----------  
function showZoomIndicator(zoomLevel) {  
    const indicator = document.getElementById('zoomIndicator');  
    if (!indicator) return;  
    // Определяем шаг сетки для отображения (заглушка, потом будет браться из активного слоя)  
    let gridStep = '5 мм';  
    if (zoomLevel === 0) gridStep = '1 мм';  
    else if (zoomLevel === 1) gridStep = '1/5 мм';  
    else if (zoomLevel === 2) gridStep = '5 мм';  
    else if (zoomLevel === 3) gridStep = '5/10 мм';  
    else if (zoomLevel === 4) gridStep = '10 мм';  
    indicator.innerHTML = `Zoom: ${zoomLevel + 1}<br>Сетка: ${gridStep}`;  
    indicator.style.opacity = '1';  
    clearTimeout(window._zoomIndicatorTimeout);  
    window._zoomIndicatorTimeout = setTimeout(() => {  
        indicator.style.opacity = '0';  
    }, 2000);  
}  

// ---------- Логика Viewport, контейнера и диспетчера ----------  
document.addEventListener('DOMContentLoaded', () => {  
    const dispatcher = new EventDispatcher();  
    const viewport = Viewport.getInstance();  
    const container = document.getElementById('canvasContainer');  
    const mainCanvas = document.getElementById('mainCanvas');  
    const overlayCanvas = document.getElementById('overlayCanvas');  
    const dpr = window.devicePixelRatio || 1;  

    function updateContainer() {  
        const zoom = viewport.getZoom();  
        const { panX, panY } = viewport.getPan();  
        const widthPx = viewport.worldWidth * zoom;  
        const heightPx = viewport.worldHeight * zoom;  

        container.style.width = widthPx + 'px';  
        container.style.height = heightPx + 'px';  
        container.style.transform = `translate(${panX}px, ${panY}px)`;  

        const canvasWidthPhys = widthPx * dpr;  
        const canvasHeightPhys = heightPx * dpr;  
        mainCanvas.width = canvasWidthPhys;  
        mainCanvas.height = canvasHeightPhys;  
        overlayCanvas.width = canvasWidthPhys;  
        overlayCanvas.height = canvasHeightPhys;  

        const ctxMain = mainCanvas.getContext('2d');  
        const ctxOverlay = overlayCanvas.getContext('2d');  
        if (ctxMain) ctxMain.setTransform(dpr, 0, 0, dpr, 0, 0);  
        if (ctxOverlay) ctxOverlay.setTransform(dpr, 0, 0, dpr, 0, 0);  
    }  

    // InputHandler теперь вызывает колбэк с событиями  
    const inputHandler = new InputHandler((type, data) => {  
        updateContainer();  
        dispatcher.emit(type, data);  
    });  

    // Подписка на zoomChanged для индикатора  
    dispatcher.on('zoomChanged', (data) => {  
        showZoomIndicator(data.zoomLevel);  
    });  

    // Инициализация сетки  
    setupGridLayers(dispatcher, viewport);  

    // Кнопка сброса  
    const resetBtn = document.getElementById('resetZoomButton');  
    if (resetBtn) {  
        resetBtn.addEventListener('click', () => {  
            viewport.reset();  
            updateContainer();  
            dispatcher.emit('zoomChanged', { zoomLevel: viewport.currentZoomLevel });  
            dispatcher.emit('panChanged', viewport.getPan());  
        });  
    }  

    // Ресайз окна  
    window.addEventListener('resize', () => {  
        viewport.updateProjection();  
        viewport.originalZoom = viewport.zoom;  
        viewport.originalPanX = viewport.panX;  
        viewport.originalPanY = viewport.panY;  
        updateContainer();  
        dispatcher.emit('containerResized', {  
            width: viewport.worldWidth * viewport.zoom,  
            height: viewport.worldHeight * viewport.zoom,  
            panX: viewport.panX,  
            panY: viewport.panY  
        });  
        // При ресайзе пересчитываем сетку  
        dispatcher.emit('zoomChanged', { zoomLevel: viewport.currentZoomLevel });  
    });  

    updateContainer();  
    // Начальное событие зума для индикатора и сетки  
    dispatcher.emit('zoomChanged', { zoomLevel: viewport.currentZoomLevel });  

    window.viewport = viewport;  
    console.log('EventDispatcher, слои сетки и индикатор готовы');  
});  
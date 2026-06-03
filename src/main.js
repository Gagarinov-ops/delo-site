import { Viewport } from './viewport/Viewport.js';  

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

// ---------- Логика Viewport и контейнера ----------  
document.addEventListener('DOMContentLoaded', () => {  
    // Используем getInstance, а не new  
    const viewport = Viewport.getInstance();  
    const container = document.getElementById('canvasContainer');  
    const mainCanvas = document.getElementById('mainCanvas');  
    const overlayCanvas = document.getElementById('overlayCanvas');  
    const dpr = window.devicePixelRatio || 1;  

    function updateContainer() {  
        const zoom = viewport.getZoom();  
        const { panX, panY } = viewport.getPan();  
        const widthPx = viewport.a4Width * zoom;  
        const heightPx = viewport.a4Height * zoom;  

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

    updateContainer();  

    window.addEventListener('resize', () => {  
        viewport.updateProjection();  
        updateContainer();  
    });  

    // Для отладки  
    window.viewport = viewport;  
    console.log('Шаг 1: Viewport + контейнер загружены');  
    console.log('zoom:', viewport.getZoom());  
});  
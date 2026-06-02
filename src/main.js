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
import { Viewport } from '../viewport/Viewport.js';  

class InputHandler {  
    constructor() {  
        this.viewport = Viewport.getInstance();  
        this.initEvents();  
    }  

    initEvents() {  
        document.addEventListener('wheel', this.onWheel.bind(this), { passive: false });  
    }  

    onWheel(e) {  
        e.preventDefault();  
        const factor = e.deltaY < 0 ? 1.1 : 0.9;  
        this.viewport.zoomAt(factor, e.clientX, e.clientY);  
        // Вызовем обновление внешнего мира через глобальные функции (они должны быть уже определены в main.js)  
        if (window.updateCanvasContainer) window.updateCanvasContainer();  
        if (window.updateGrid) window.updateGrid(this.viewport.zoom);  
    }  
}  

export { InputHandler };  

export class EventDispatcher {  
    constructor() {  
        this._listeners = {};  
    }  

    on(event, callback) {  
        if (!this._listeners[event]) {  
            this._listeners[event] = [];  
        }  
        this._listeners[event].push(callback);  
    }  

    off(event, callback) {  
        if (!this._listeners[event]) return;  
        this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);  
    }  

    emit(event, data) {  
        if (!this._listeners[event]) return;  
        this._listeners[event].forEach(cb => cb(data));  
    }  
}  

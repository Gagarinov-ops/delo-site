window.showToast = function(message, type = 'info') {  
  let container = document.getElementById('toast-container');  
  if (!container) {  
    container = document.createElement('div');  
    container.id = 'toast-container';  
    container.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:1000; display:flex; flex-direction:column; gap:8px;';  
    document.body.appendChild(container);  
  }  
  const toast = document.createElement('div');  
  toast.className = 'toast ' + type;  
  toast.textContent = message;  
  toast.style.cssText = `background:${type==='error'?'#e74c3c':type==='warning'?'#f39c12':'#2c3e50'}; color:white; padding:10px 16px; border-radius:6px; font-family:monospace; font-size:14px; box-shadow:0 2px 6px rgba(0,0,0,0.2); opacity:0; transition:opacity 0.2s; pointer-events:none;`;  
  container.appendChild(toast);  
  requestAnimationFrame(() => toast.style.opacity = '1');  
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 200); }, 4000);  
};  
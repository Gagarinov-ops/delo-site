export function setupToast(dispatcher) {
    const toast = document.getElementById('toast');
    let timer = null;

    function show(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove('toast-hidden');
        
        clearTimeout(timer);
        timer = setTimeout(() => {
            toast.classList.add('toast-hidden');
        }, 2000);
    }

    dispatcher.on('showToast', (data) => {
        show(data.message);
    });
}
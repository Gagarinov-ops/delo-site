// Генератор PDF, 40 строк
export class PdfBuilder {
  constructor() { console.log('[PdfBuilder] initialized'); }
  build(templateHtml, variables) {
    let html = templateHtml;
    Object.keys(variables).forEach(k => { html = html.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), variables[k]||''); });
    html = this._processIf(html, variables);
    const blob = new Blob([html], { type: 'text/html' }); const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank');
    if (!w || w.closed) { const a = document.createElement('a'); a.href = url; a.download = `${variables['НОМЕР_ДОГОВОРА']||'document'}.html`; document.body.appendChild(a); a.click(); a.remove(); }
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  _processIf(html, vars) { return html.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, k, content) => vars[k] ? content : ''); }
}
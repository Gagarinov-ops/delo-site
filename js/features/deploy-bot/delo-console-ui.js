'use strict';

(function () {
  var delo_shield = null;
  var delo_statusBar = null;
  var delo_errorList = null;
  var delo_hasErrors = false;

  function delo_injectStyles() {
    var s = document.createElement('style');
    s.textContent =
      '#delo-shield{font-family:"Courier New",monospace;background:#1a1a1a;color:#e0e0e0;padding:20px;border-top:4px solid #555;margin-top:40px}' +
      '#delo-status-bar{padding:10px 14px;font-size:16px;font-weight:bold;margin-bottom:12px}' +
      '#delo-status-bar.delo-clean{background:#0a2a0a;color:#0f0;border-left:4px solid #0f0}' +
      '#delo-status-bar.delo-dirty{background:#2a0000;color:#f55;border-left:4px solid #f55}' +
      '.delo-error-item{background:#1a0000;border-left:4px solid #f55;padding:8px 12px;margin-bottom:6px;font-size:14px;line-height:1.5;word-break:break-all;user-select:text;cursor:text}' +
      '.delo-error-blocked{color:#fa0;padding:8px 0;font-weight:bold}' +
      '#delo-cmd-line{margin-top:20px;padding-top:16px;border-top:1px dashed #555}' +
      '#delo-cmd-line label{color:#aaa;font-size:13px;display:block;margin-bottom:6px}' +
      '#delo-cmd-input{width:100%;max-width:600px;background:#0d0d0d;color:#0f0;border:1px solid #444;padding:8px 12px;font-family:"Courier New",monospace;font-size:14px;box-sizing:border-box}' +
      '#delo-cmd-btn{margin-top:8px;padding:8px 18px;background:#333;color:#ddd;border:1px solid #555;cursor:pointer;font-family:"Courier New",monospace;font-size:13px}' +
      '#delo-cmd-btn:hover{background:#444}' +
      '#delo-cmd-output{margin-top:10px;padding:8px 12px;background:#0d0d0d;color:#0f0;font-size:13px;min-height:1.2em;word-break:break-all}';
    document.head.appendChild(s);
  }

  function delo_createShield() {
    if (delo_shield) return;

    delo_shield = document.createElement('div');
    delo_shield.id = 'delo-shield';

    delo_statusBar = document.createElement('div');
    delo_statusBar.id = 'delo-status-bar';
    delo_shield.appendChild(delo_statusBar);

    delo_errorList = document.createElement('div');
    delo_errorList.id = 'delo-error-list';
    delo_shield.appendChild(delo_errorList);

    delo_createCommandLine();
    document.body.appendChild(delo_shield);

    delo_updateStatus();
  }

  function delo_updateStatus() {
    if (!delo_statusBar) return;

    if (delo_hasErrors) {
      delo_statusBar.textContent = '🔴 Обнаружены ошибки';
      delo_statusBar.className = 'delo-dirty';
    } else {
      delo_statusBar.textContent = '🟢 Всё чисто';
      delo_statusBar.className = 'delo-clean';
    }
  }

  function delo_addError(message, source, lineno, colno, blocked) {
    delo_hasErrors = true;
    delo_updateStatus();

    if (blocked) {
      var existing = delo_errorList.querySelector('.delo-error-blocked');
      if (existing) return;
      var block = document.createElement('div');
      block.className = 'delo-error-blocked';
      block.textContent = '⚠️ Слишком много ошибок. Открой DevTools.';
      delo_errorList.appendChild(block);
      return;
    }

    var item = document.createElement('div');
    item.className = 'delo-error-item';
    var location = source ? '\n📍 ' + source + ':' + lineno + ':' + colno : '';
    item.textContent = message + location;
    delo_errorList.appendChild(item);
  }

  function delo_createCommandLine() {
    var line = document.createElement('div');
    line.id = 'delo-cmd-line';

    var label = document.createElement('label');
    label.textContent = '> Команда:';
    line.appendChild(label);

    var input = document.createElement('input');
    input.id = 'delo-cmd-input';
    input.type = 'text';
    input.placeholder = 'например: 1+1';
    line.appendChild(input);

    var btn = document.createElement('button');
    btn.id = 'delo-cmd-btn';
    btn.textContent = 'Выполнить';
    line.appendChild(btn);

    var output = document.createElement('div');
    output.id = 'delo-cmd-output';
    line.appendChild(output);

    btn.addEventListener('click', delo_execute);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') delo_execute();
    });

    delo_shield.appendChild(line);
  }

  function delo_execute() {
    var input = document.getElementById('delo-cmd-input');
    var output = document.getElementById('delo-cmd-output');
    var code = input.value.trim();

    if (!code) {
      output.textContent = '(пустая команда)';
      return;
    }

    try {
      var result = new Function('return (' + code + ')')();
      output.textContent = '> ' + String(result);
      output.style.color = '#0f0';
    } catch (e) {
      output.textContent = 'Ошибка: ' + e.message;
      output.style.color = '#f55';
    }
  }

  function delo_init() {
    delo_injectStyles();
    delo_createShield();

    if (window.__delo_console_bridge) {
      window.__delo_console_bridge.subscribe(function (message, source, lineno, colno, blocked) {
        delo_addError(message, source, lineno, colno, blocked);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', delo_init);
  } else {
    delo_init();
  }
})();
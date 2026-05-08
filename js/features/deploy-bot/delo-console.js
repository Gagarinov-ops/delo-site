'use strict';

(function () {
  var DELO_MAX_DUPLICATE = 5;
  var DELO_WINDOW_MS = 1000;

  var delo_errorCounts = {};
  var delo_pendingErrors = [];

  window.__delo_console_bridge = {
    onError: null
  };

  function delo_handleError(message, source, lineno, colno) {
    var now = Date.now();
    var key = message + '@' + source + ':' + lineno;

    if (!delo_errorCounts[key]) {
      delo_errorCounts[key] = { count: 0, firstSeen: now };
    }

    var entry = delo_errorCounts[key];
    entry.count++;

    if (now - entry.firstSeen > DELO_WINDOW_MS) {
      entry.count = 1;
      entry.firstSeen = now;
    }

    var blocked = entry.count > DELO_MAX_DUPLICATE;

    if (window.__delo_console_bridge.onError) {
      window.__delo_console_bridge.onError(message, source, lineno, colno, blocked);
    } else {
      delo_pendingErrors.push({ message: message, source: source, lineno: lineno, colno: colno, blocked: blocked });
    }
  }

  window.addEventListener('error', function (event) {
    var message = event.message || 'Неизвестная ошибка';
    var source = event.filename || '';
    var lineno = event.lineno || 0;
    var colno = event.colno || 0;
    delo_handleError(message, source, lineno, colno);
  });

  window.addEventListener('error', function (event) {
    if (event.target && event.target !== window) {
      var tag = event.target.tagName || '';
      var src = event.target.src || event.target.href || '';
      delo_handleError('Ошибка загрузки ' + tag + ': ' + src, src, 0, 0);
    }
  }, true);

  window.__delo_console_bridge.subscribe = function (callback) {
    window.__delo_console_bridge.onError = callback;

    for (var i = 0; i < delo_pendingErrors.length; i++) {
      var e = delo_pendingErrors[i];
      callback(e.message, e.source, e.lineno, e.colno, e.blocked);
    }
    delo_pendingErrors = [];
  };
})();

'use strict';

let delo_isBusy = false;
let delo_queuedTask = null;

function delo_tryRun(taskFn, logFn) {
  if (delo_isBusy) {
    delo_queuedTask = taskFn;
    logFn('Обнаружена новая задача, но тележка занята. Задача поставлена в очередь.');
    return false;
  }

  delo_isBusy = true;
  delo_queuedTask = null;
  taskFn();
  return true;
}

function delo_release(logFn) {
  delo_isBusy = false;

  if (delo_queuedTask !== null) {
    const next = delo_queuedTask;
    delo_queuedTask = null;
    logFn('Тележка освободилась. Беру задачу из очереди.');
    delo_tryRun(next, logFn);
  }
}

module.exports = { delo_tryRun, delo_release };
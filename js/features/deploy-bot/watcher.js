'use strict';

const fs = require('fs');
const path = require('path');

const { delo_writeLog, delo_isSafePath, delo_getFiles, PROJECT_ROOT } = require('./delo_utils');
const { delo_tryRun, delo_release } = require('./delo_queue');

const DELO_INBOX_FILE = path.join(__dirname, 'delo_inbox', 'delo_input.txt');
const DELO_FILE_PREFIX = '>>> file:';
const DELO_GET_PREFIX = '>>> get:';

let delo_lastSize = 0;
let delo_lastMtime = 0;

function delo_processFileCommands(content) {
  const lines = content.split('\n');
  let count = 0;
  let filePath = null;
  let codeLines = [];

  for (const line of lines) {
    if (line.startsWith(DELO_FILE_PREFIX)) {
      if (filePath !== null) {
        delo_writeFile(filePath, codeLines.join('\n'));
        count++;
      }
      filePath = line.slice(DELO_FILE_PREFIX.length).trim();
      codeLines = [];
    } else if (filePath !== null) {
      codeLines.push(line);
    }
  }

  if (filePath !== null) {
    delo_writeFile(filePath, codeLines.join('\n'));
    count++;
  }

  return count;
}

function delo_writeFile(relativePath, code) {
  const fullPath = path.join(PROJECT_ROOT, relativePath.trim());

  if (!delo_isSafePath(fullPath)) {
    delo_writeLog(`ОШИБКА: путь выходит за пределы проекта — ${relativePath}`);
    return;
  }

  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    delo_writeLog(`Создана папка: ${path.relative(PROJECT_ROOT, dir)}`);
  }

  fs.writeFileSync(fullPath, code.replace(/\n$/, ''), 'utf-8');
  delo_writeLog(`Записан файл: ${relativePath.trim()}`);
}

function delo_processInbox() {
  if (!fs.existsSync(DELO_INBOX_FILE)) return;

  const content = fs.readFileSync(DELO_INBOX_FILE, 'utf-8');

  if (content.includes(DELO_FILE_PREFIX)) {
    delo_writeLog('Тележка: замечены изменения в delo_input.txt');
    const count = delo_processFileCommands(content);

    fs.writeFileSync(DELO_INBOX_FILE, '', 'utf-8');
    try {
      const stat = fs.statSync(DELO_INBOX_FILE);
      delo_lastSize = stat.size;
      delo_lastMtime = stat.mtimeMs;
    } catch (_) { /* ок */ }

    delo_writeLog(`Обработано команд: ${count}. Входной файл очищен.`);
    delo_release(delo_writeLog);
    return;
  }

  if (content.includes(DELO_GET_PREFIX)) {
    delo_writeLog('Тележка: получен запрос на чтение файлов');

    const paths = [];
    const remainingLines = [];

    for (const line of content.split('\n')) {
      if (line.startsWith(DELO_GET_PREFIX)) {
        paths.push(line.slice(DELO_GET_PREFIX.length).trim());
      } else {
        remainingLines.push(line);
      }
    }

    const response = delo_getFiles(paths);

    // Собираем итог: оставшиеся строки + ответ
    const newContent = remainingLines.join('\n').trimEnd() + '\n' + response;

    fs.writeFileSync(DELO_INBOX_FILE, newContent, 'utf-8');
    try {
      const stat = fs.statSync(DELO_INBOX_FILE);
      delo_lastSize = stat.size;
      delo_lastMtime = stat.mtimeMs;
    } catch (_) { /* ок */ }

    delo_writeLog(`Возвращено файлов: ${paths.length}. Ответ дописан в delo_input.txt.`);
    delo_release(delo_writeLog);
    return;
  }

  delo_writeLog('Команды не найдены');
}

function delo_onChange() {
  try {
    const stat = fs.statSync(DELO_INBOX_FILE);
    if (stat.size === delo_lastSize && stat.mtimeMs === delo_lastMtime) return;
    if (stat.size === 0) return;
    delo_lastSize = stat.size;
    delo_lastMtime = stat.mtimeMs;
  } catch (_) {
    return;
  }

  setTimeout(() => delo_tryRun(delo_processInbox, delo_writeLog), 50);
}

function delo_init() {
  console.log(`Тележка: запущена, слежу за ${path.relative(PROJECT_ROOT, DELO_INBOX_FILE)}`);
  delo_writeLog('Тележка: запущена');

  try {
    const stat = fs.statSync(DELO_INBOX_FILE);
    delo_lastSize = stat.size;
    delo_lastMtime = stat.mtimeMs;
  } catch (_) {
    delo_lastSize = 0;
    delo_lastMtime = 0;
  }

  fs.watch(DELO_INBOX_FILE, (eventType) => {
    if (eventType === 'change') delo_onChange();
  });
}

delo_init();
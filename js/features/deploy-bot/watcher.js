'use strict';

const fs = require('fs');
const path = require('path');

const { delo_writeLog, delo_isSafePath, PROJECT_ROOT } = require('./delo_utils');
const { delo_tryRun, delo_release } = require('./delo_queue');

const WATCH_FILES = [
  'js/features/deploy-bot/delo_inbox/delo_input.txt',
  'D:/Yandex.Disk/DeloSite_Telega/delo_input.txt'
];

const DELO_FILE_PREFIX = '>>> file:';
const DELO_GET_PREFIX = '>>> get:';

const delo_fileStates = {};

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

function delo_processInbox(inboxPath) {
  if (!fs.existsSync(inboxPath)) return;

  const content = fs.readFileSync(inboxPath, 'utf-8');
  const displayPath = path.relative(PROJECT_ROOT, inboxPath);

  if (content.includes(DELO_FILE_PREFIX)) {
    delo_writeLog(`Тележка: замечены изменения в ${displayPath}`);
    const count = delo_processFileCommands(content);

    fs.writeFileSync(inboxPath, '', 'utf-8');
    try {
      const stat = fs.statSync(inboxPath);
      if (delo_fileStates[inboxPath]) {
        delo_fileStates[inboxPath].lastSize = stat.size;
        delo_fileStates[inboxPath].lastMtime = stat.mtimeMs;
      }
    } catch (_) { /* ок */ }

    delo_writeLog(`Обработано команд: ${count}. Файл ${displayPath} очищен.`);
  } else if (content.includes(DELO_GET_PREFIX)) {
    delo_writeLog(`Тележка: получен запрос на чтение файлов из ${displayPath}`);

    const paths = [];
    const remainingLines = [];

    for (const line of content.split('\n')) {
      if (line.startsWith(DELO_GET_PREFIX)) {
        paths.push(line.slice(DELO_GET_PREFIX.length).trim());
      } else {
        remainingLines.push(line);
      }
    }

    const { delo_getFiles } = require('./delo_utils');
    const response = delo_getFiles(paths);
    const newContent = remainingLines.join('\n').trimEnd() + '\n' + response;

    fs.writeFileSync(inboxPath, newContent, 'utf-8');
    try {
      const stat = fs.statSync(inboxPath);
      if (delo_fileStates[inboxPath]) {
        delo_fileStates[inboxPath].lastSize = stat.size;
        delo_fileStates[inboxPath].lastMtime = stat.mtimeMs;
      }
    } catch (_) { /* ок */ }

    delo_writeLog(`Возвращено файлов: ${paths.length}. Ответ дописан в ${displayPath}.`);
  } else {
    delo_writeLog('Команды не найдены');
    return;
  }

  delo_release(delo_writeLog);
}

function delo_onChange(filePath) {
  const state = delo_fileStates[filePath];
  if (!state) return;

  try {
    const stat = fs.statSync(filePath);
    if (stat.size === state.lastSize && stat.mtimeMs === state.lastMtime) return;
    if (stat.size === 0) return;
    state.lastSize = stat.size;
    state.lastMtime = stat.mtimeMs;
  } catch (_) {
    return;
  }

  setTimeout(() => {
    delo_tryRun(() => delo_processInbox(filePath), delo_writeLog);
  }, 50);
}

function delo_init() {
  console.log('Тележка: запущена, слежу за:');
  delo_writeLog('Тележка: запущена');

  for (const relativePath of WATCH_FILES) {
    const fullPath = path.resolve(PROJECT_ROOT, relativePath);
    
    if (fs.existsSync(fullPath)) {
      console.log(`  ${relativePath}`);
      delo_writeLog(`Наблюдение: ${relativePath}`);
      
      try {
        const stat = fs.statSync(fullPath);
        delo_fileStates[fullPath] = {
          lastSize: stat.size,
          lastMtime: stat.mtimeMs
        };
      } catch (_) {
        delo_fileStates[fullPath] = { lastSize: 0, lastMtime: 0 };
      }

      fs.watch(fullPath, (eventType) => {
        if (eventType === 'change') delo_onChange(fullPath);
      });
    } else {
      console.log(`  ${relativePath} — файл не найден, пропускаю`);
      delo_writeLog(`Файл не найден, наблюдение не активно: ${relativePath}`);
    }
  }
}

delo_init();
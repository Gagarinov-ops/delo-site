'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');
const DELO_LOG_FILE = path.join(__dirname, 'delo_activity.log');

function delo_writeLog(message) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(DELO_LOG_FILE, line, 'utf-8');
}

function delo_isSafePath(targetPath) {
  return path.normalize(targetPath).startsWith(PROJECT_ROOT);
}

function delo_getFiles(paths) {
  const lines = [];

  for (const rawPath of paths) {
    const cleanPath = rawPath.trim();
    const fullPath = path.join(PROJECT_ROOT, cleanPath);

    lines.push(`===== FILE: ${cleanPath} =====`);

    if (!delo_isSafePath(fullPath)) {
      lines.push(`Файл не найден: ${cleanPath}`);
      lines.push('');
      continue;
    }

    if (!fs.existsSync(fullPath)) {
      lines.push(`Файл не найден: ${cleanPath}`);
      lines.push('');
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    lines.push(content);
    lines.push('');
  }

  lines.push('===== END OF PACKAGE =====');

  return lines.join('\n');
}

module.exports = { delo_writeLog, delo_isSafePath, delo_getFiles, PROJECT_ROOT };
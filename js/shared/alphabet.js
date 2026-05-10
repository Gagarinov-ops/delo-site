'use strict';

/**
 * Alphabet — утилита для получения буквенных обозначений
 * getSideName(index) → 'А', 'Б', 'В', ..., 'Я', 'АА', 'АБ'...
 */

function getSideName(index) {
  const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
  if (index < alphabet.length) {
    return alphabet[index];
  }
  const first = Math.floor(index / alphabet.length) - 1;
  const second = index % alphabet.length;
  return alphabet[first] + alphabet[second];
}
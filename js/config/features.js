// [AP-006] Включение/выключение фич
export const featuresConfig = {
  estimator: { enabled: true, description: 'Модуль сметы' },
  contracts: { enabled: true, description: 'Модуль договоров и PDF' },
  ads: { enabled: false, description: 'Рекламный модуль (v2)' },
  parsing: { enabled: false, description: 'Парсинг данных (v2)' },
};
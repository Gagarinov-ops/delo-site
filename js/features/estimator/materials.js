export const materialsDB = {
  categories: [
    { id: 'walls', name: 'Стены' }, { id: 'floor', name: 'Пол' }, { id: 'ceiling', name: 'Потолок' },
    { id: 'electrical', name: 'Электрика' }, { id: 'plumbing', name: 'Сантехника' },
  ],
  items: [
    { id: 'shtukaturka', name: 'Штукатурка стен', unit: 'м²', category: 'walls', pricePerUnit: 450 },
    { id: 'shpaklevka', name: 'Шпаклёвка стен', unit: 'м²', category: 'walls', pricePerUnit: 250 },
    { id: 'styazhka', name: 'Стяжка пола', unit: 'м²', category: 'floor', pricePerUnit: 380 },
    { id: 'nalivnoy', name: 'Наливной пол', unit: 'м²', category: 'floor', pricePerUnit: 420 },
    { id: 'pokraska', name: 'Покраска потолка', unit: 'м²', category: 'ceiling', pricePerUnit: 300 },
    { id: 'rozetki', name: 'Установка розеток', unit: 'шт', category: 'electrical', pricePerUnit: 350 },
    { id: 'truby', name: 'Разводка труб', unit: 'м.п.', category: 'plumbing', pricePerUnit: 650 },
  ],
};
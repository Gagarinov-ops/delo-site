import CanvasData from '../data/CanvasData.js';

class Registry {
    constructor() {
        // Разъёмы для подключения модулей
        this.validator = null;   // GeometryValidator
        this.calculator = null;  // Calculator
        this.analyzer = null;    // GraphAnalyzer
        this.actionLog = null;   // ActionLog
        this.canvasData = CanvasData;
    }

    execute(command) {
        // 1. Валидация
        if (this.validator) {
            const result = this.validator.validate(command);
            if (result && !result.success) {
                return result;
            }
        }

        // 2. Выполнение действия в CanvasData
        // TODO: будет добавлено по мере реализации команд

        // 3. Расчёт
        if (this.calculator) {
            this.calculator.recalculate(command);
        }

        // 4. Анализ графа
        if (this.analyzer) {
            const cycles = this.analyzer.findCycles(command);
            // TODO: создание комнат из циклов
        }

        // 5. Системные записи в ActionLog
        // TODO: будет добавлено позже

        return { success: true };
    }
}

export default Registry;
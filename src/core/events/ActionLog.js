class ActionLog {
    constructor() {
        this.entries = [];   // массив записей
        this._seq = 0;       // счётчик id записей
    }

    addCommand(type, data, targetId = null) {
        const entry = {
            id: `cmd_${++this._seq}`,
            type: type,
            targetId: targetId,
            data: data,
            isUndone: false
        };
        this.entries.push(entry);
        return entry;
    }

    getLastActive() {
        // Для UNDO: последняя запись с isUndone: false
        for (let i = this.entries.length - 1; i >= 0; i--) {
            if (!this.entries[i].isUndone) {
                return this.entries[i];
            }
        }
        return null;
    }

    markUndone(targetId) {
        const entry = this.entries.find(e => e.targetId === targetId && !e.isUndone);
        if (entry) {
            entry.isUndone = true;
        }
    }
}

export default ActionLog;
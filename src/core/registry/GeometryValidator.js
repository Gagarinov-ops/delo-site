class GeometryValidator {
    validate(command) {
        if (command.type === 'wallCreated') {
            return this.validateWall(command);
        }
        // Остальные команды пока без валидации
        return { success: true };
    }

    validateWall(command) {
        const pointStart = command.data.pointStart;
        const pointEnd = command.data.pointEnd;

        const dx = pointEnd.x - pointStart.x;
        const dy = pointEnd.y - pointStart.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length <= 0) {
            return { success: false, error: 'Длина стены не может быть равна нулю' };
        }
        if (length > 12000) {
            return { success: false, error: 'Длина не может превышать 12 метров' };
        }
        return { success: true };
    }
}

export default GeometryValidator;
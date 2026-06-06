class PencilTool {
    constructor() {
        this.name = 'pencil';
        this.state = 'IDLE';          // IDLE | DRAWING
        this.startPoint = null;       // экранные пиксели { x, y }
    }

    handleGesture(gesture, data) {
        if (gesture === 'pointerdown') {
            if (this.state !== 'IDLE') return null;
            this.state = 'DRAWING';
            this.startPoint = { x: data.x, y: data.y };
            return { action: 'started', startX: this.startPoint.x, startY: this.startPoint.y };

        } else if (gesture === 'pointermove') {
            if (this.state !== 'DRAWING') return null;
            return {
                action: 'drawing',
                startX: this.startPoint.x,
                startY: this.startPoint.y,
                currentX: data.x,
                currentY: data.y
            };

        } else if (gesture === 'pointerup') {
            if (this.state !== 'DRAWING') return null;
            const result = {
                action: 'finished',
                startX: this.startPoint.x,
                startY: this.startPoint.y,
                endX: data.x,
                endY: data.y
            };
            this.state = 'IDLE';
            this.startPoint = null;
            return result;
        }

        return null;
    }
}

export default PencilTool;
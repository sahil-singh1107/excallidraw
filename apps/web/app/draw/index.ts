import rough from "roughjs"

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    stroke: string
    fillStyle: string
    sw: number
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
    fill: string
    stroke: string
    fillStyle: string
    sw: number
} | {
    type: "line";
    initialX: number
    initialY: number
    finalX: number
    finalY: number
    stroke: string
    sw: number
} | {
    type: "pen",
    points: { x: number, y: number }[]
    stroke: string
    sw: number
} | {
    type: "polygon",
    points: [number, number][]
    fill: string
    stroke: string
    sw: number
} | {
    type: "text",
    x: number,
    y: number
    content: string
}

export class DrawShape {
    private canvas: HTMLCanvasElement
    private roughCanvas
    private existingShapes: Shape[]
    private edges: { first: number, second: number }[]
    private selectedShapeIndex: number
    private roomId: number
    private clicked: boolean
    private selectedTool: string
    private backgroundColor: string
    private strokeWidth: number
    private strokeColor: string
    private fillStyle: string
    private startX: number
    private startY: number
    private draggedShape: Shape
    private activeTooltip: HTMLDivElement | null = null;
    private path: { x: number, y: number }[]
    private points: [number, number][]

    socket: WebSocket

    constructor(canvas: HTMLCanvasElement, roomId: number, selectedTool: string, socket: WebSocket) {
        this.canvas = canvas
        this.roughCanvas = rough.canvas(canvas)
        this.existingShapes = []
        this.edges = []
        this.selectedShapeIndex = -1
        this.roomId = roomId
        this.clicked = false
        this.selectedTool = selectedTool
        this.backgroundColor = "red"
        this.strokeWidth = 2
        this.strokeColor = "red"
        this.fillStyle = "solid"
        this.socket = socket
        this.startX = 0
        this.startY = 0

        this.path = []
        this.points = [[0, 0]]
        this.initHandlers();
        this.initMouseHandler();
        console.log(socket);
    }


    isPointInRect(point: { x: number; y: number }, rect: Shape): boolean {
        if (rect.type !== "rect") return false;
        return (
            point.x >= rect.x &&
            point.x <= rect.x + rect.width &&
            point.y >= rect.y &&
            point.y <= rect.y + rect.height
        );
    }

    isPointInCircle(point: { x: number, y: number }, circle: Shape): boolean {
        if (circle.type !== "circle") return false;
        return (
            Math.sqrt((point.x - circle.centerX) * (point.x - circle.centerX) + (point.y - circle.centerY) * (point.y - circle.centerY)) <= circle.radius
        )
    }

    isPointInLine(point: { x: number, y: number }, line: Shape): boolean {
        if (line.type !== "line") return false;
        return (
            point.x >= line.initialX && point.x <= line.finalX && point.y >= line.initialY && point.y <= line.finalY
        )
    }

    isPointInPen(point: { x: number, y: number }, pen: Shape): boolean {
        if (pen.type !== "pen") return false;
        pen.points.map((p) => {
            if (p.x === point.x && p.y === point.y) return true;
        })
        return false;
    }

    isPointInPolygon(point: { x: number, y: number }, polygon: Shape): boolean {
        if (polygon.type !== "polygon") return false;
        const { points } = polygon;
        let isInside = false;
        if (!points) return false
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            let xi = points[i][0], yi = points[i][1];
            let xj = points[j][0], yj = points[j][1];
            const intersect =
                yi > point.y !== yj > point.y &&
                point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
            if (intersect) isInside = !isInside;
        }
        return isInside;
    }

    setTool(tool: string) {
        if (tool) this.selectedTool = tool
    }

    setStroke(color: string) {
        if (color) this.strokeColor = color
    }

    setBack(color: string) {
        if (color) this.backgroundColor = color
    }

    setFill(type: string) {
        if (type) this.fillStyle = type
    }

    setStrokeWidth(w: number) {
        this.strokeWidth = w
    }

    initHandlers() {
        this.socket.onmessage = (e) => {
            const message = JSON.parse(e.data);

            if (message.type === "shape") {
                const exists = this.existingShapes.some(shape => JSON.stringify(shape) === JSON.stringify(message.data));
                if (!exists) {
                    this.existingShapes.push(message.data);
                    this.clearAndRedraw();
                }
            }

            if (message.type === "update_shapes") {
                this.existingShapes = message.data
                this.clearAndRedraw();
            }
        }
    }

    showToolTip(shape: Shape) {
        if (this.activeTooltip) {
            this.removeTooltip();
        }
        const tooltip = document.createElement('div');
        this.activeTooltip = tooltip
        tooltip.className = 'absolute z-50 p-2 bg-black text-white rounded-full shadow-md flex items-center divide-x divide-gray-700';
        tooltip.style.left = `${shape.x + 30}px`;
        tooltip.style.top = `${shape.y + 30}px`;

        function createColorSection(inputColor: string, onChange: (value: string) => void) {
            const wrapper = document.createElement('div');
            wrapper.className = 'relative w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center';

            const colorPreview = document.createElement('div');
            colorPreview.className = 'absolute w-8 h-8 rounded-full';
            colorPreview.style.backgroundColor = inputColor;

            const input = document.createElement('input');
            input.type = 'color';
            input.value = inputColor;
            input.className = 'absolute inset-0 opacity-0 cursor-pointer';
            input.addEventListener('input', (e) => {
                const newColor = (e.target as HTMLInputElement).value;
                colorPreview.style.backgroundColor = newColor;
                onChange(newColor);
            });

            wrapper.appendChild(colorPreview);
            wrapper.appendChild(input);
            return wrapper;
        }

        const strokeColorSection = createColorSection(shape.stroke, (newColor) => {
            shape.stroke = newColor;
            this.clearAndRedraw();
            this.updateShapes()
        });

        const fillColorSection = createColorSection(shape.fill || '#000000', (newColor) => {
            shape.fill = newColor;
            this.clearAndRedraw();
            this.updateShapes();
        });

        const menuButton = document.createElement('button');
        menuButton.className = 'w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white';
        menuButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
        <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
`;


        tooltip.appendChild(strokeColorSection);
        tooltip.appendChild(fillColorSection);
        tooltip.appendChild(menuButton);


        document.body.appendChild(tooltip);


    }

    removeTooltip = () => {
        if (this.activeTooltip) {
            document.body.removeChild(this.activeTooltip);
            this.activeTooltip = null;
            document.removeEventListener('mousedown', this.handleClickOutside);
        }
    }

    handleClickOutside = (event: MouseEvent) => {
        if (this.activeTooltip && !this.activeTooltip.contains(event.target as Node)) {
            this.removeTooltip();
        }
    }


    clearAndRedraw() {
        const ctx = this.canvas.getContext("2d");
        ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.forEach((shape) => {
            if (!shape) return;
            if (shape.type === "rect") {
                this.roughCanvas.rectangle(shape.x, shape.y, shape.width, shape.height, { fill: shape.fill, stroke: shape.stroke, strokeWidth: shape.sw, fillStyle: shape.fillStyle });
            }
            else if (shape.type === "circle") {
                this.roughCanvas.circle(shape.centerX, shape.centerY, shape.radius * 2, { fill: shape.fill, stroke: shape.stroke, strokeWidth: shape.sw, fillStyle: shape.fillStyle });
            }
            else if (shape.type === "line") {
                this.roughCanvas.line(shape.initialX, shape.initialY, shape.finalX, shape.finalY, { stroke: shape.stroke, strokeWidth: shape.sw })
            }
            else if (shape.type === "polygon") {
                this.roughCanvas.polygon(shape.points, { fill: shape.fill, stroke: shape.stroke, strokeWidth: shape.sw })
            }
            else if (shape.type === "text") {

                ctx!.fillText(shape.content, shape.x, shape.y);
            }
            else {
                for (let i = 1; i < shape.points.length; i++) {
                    this.roughCanvas.line(shape.points[i - 1]?.x, shape.points[i - 1]?.y, shape.points[i]?.x, shape.points[i]?.y, { strokeWidth: shape.sw, stroke: shape.stroke, strokeLineDash: [1, 6, 6,] });
                }
            }

        })
    }

    mouseDownHandler = (e: MouseEvent) => {
        if (this.selectedTool === "select") {
            this.existingShapes.map((shape, i) => {
                if (!shape) return false;
                if (this.selectedShapeIndex === -1) {
                    this.selectedShapeIndex = i;
                }
                else {
                    console.log("connected")
                    this.selectedShapeIndex = -1;
                }
                if (this.isPointInRect({ x: e.clientX, y: e.clientY }, shape) || this.isPointInCircle({ x: e.clientX, y: e.clientY }, shape) || this.isPointInLine({ x: e.clientX, y: e.clientY }, shape) || this.isPointInPen({ x: e.clientX, y: e.clientY }, shape) || this.isPointInPolygon({ x: e.clientX, y: e.clientY }, shape)) {
                    this.showToolTip(shape);
                }
            })
        }
        else if (this.selectedTool === "grab") {
            console.log("grab1")
            this.clicked = true
            this.startX = e.clientX
            this.startY = e.clientY
            this.existingShapes.map((shape) => {
                if (!shape) return false;
                if (this.isPointInRect({ x: e.clientX, y: e.clientY }, shape) || this.isPointInCircle({ x: e.clientX, y: e.clientY }, shape) || this.isPointInLine({ x: e.clientX, y: e.clientY }, shape) || this.isPointInPen({ x: e.clientX, y: e.clientY }, shape) || this.isPointInPolygon({ x: e.clientX, y: e.clientY }, shape)) {
                    this.draggedShape = shape
                }
            })
        }
        else {
            this.clicked = true
            this.startX = e.clientX
            this.startY = e.clientY
            this.path.push({ x: this.startX, y: this.startY });
            this.points = [[this.startX, this.startY]];
        }
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked && this.selectedTool !== "grab") {
            this.clearAndRedraw();
            if (this.selectedTool === "rect") {
                const width = e.clientX - this.startX, height = e.clientY - this.startY

                this.roughCanvas.rectangle(this.startX, this.startY, width, height, { fill: this.backgroundColor, stroke: this.strokeColor, strokeWidth: this.strokeWidth, fillStyle: this.fillStyle });
            }
            else if (this.selectedTool === "circle") {
                //const centerX = (e.clientX - this.startX) / 2, centerY = (e.clientY - this.startY) / 2;
                const dm = Math.sqrt((e.clientX - this.startX) * (e.clientX - this.startX) + (e.clientY - this.startY) * (e.clientY - this.startY));

                this.roughCanvas.circle(this.startX, this.startY, dm, { fill: this.backgroundColor, stroke: this.strokeColor, strokeWidth: this.strokeWidth, fillStyle: this.fillStyle });
            }
            else if (this.selectedTool === "line") {
                const rect = this.canvas.getBoundingClientRect();
                const startX = this.startX - rect.left;
                const startY = this.startY - rect.top;
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;

                this.roughCanvas.line(startX, startY, currentX, currentY, { strokeWidth: this.strokeWidth, stroke: "red" });
            }
            else if (this.selectedTool === "pen") {
                const rect = this.canvas.getBoundingClientRect();
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;
                this.path.push({ x: currentX, y: currentY });
                for (let i = 1; i < this.path.length; i++) {
                    this.roughCanvas.line(this.path[i - 1]?.x, this.path[i - 1]?.y, this.path[i]?.x, this.path[i]?.y, { strokeWidth: this.strokeWidth, stroke: "red", strokeLineDash: [1, 6, 6,] });
                }
            }
            else if (this.selectedTool === "polygon") {
                const rect = this.canvas.getBoundingClientRect();
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;
                this.points.push([currentX, currentY]);
                this.roughCanvas.polygon(this.points, { fill: this.backgroundColor, stroke: this.strokeColor, strokeWidth: this.strokeWidth });
            }
            else if (this.selectedTool === "eraser") {
                const rect = this.canvas.getBoundingClientRect();
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;
                this.path.push({ x: currentX, y: currentY });
                for (let i = 1; i < this.path.length; i++) {
                    this.roughCanvas.line(this.path[i - 1]?.x, this.path[i - 1]?.y, this.path[i]?.x, this.path[i]?.y);
                }
            }
        }
        else if (this.clicked && this.selectedTool === "grab") {
            console.log("drag")
            if (this.existingShapes.length === 0 || !this.draggedShape) return;
            const rect = this.canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
            if (this.draggedShape.type === "rect") {
                let x1 = (2*currentX-this.draggedShape.width)/2, y1 = (2*currentY - this.draggedShape.height)/2;
                this.draggedShape.x = x1
                this.draggedShape.y = y1
            }
            if (this.draggedShape.type === "circle") {
                this.draggedShape.centerX = currentX
                this.draggedShape.centerY = currentY
            }   
            if (this.draggedShape.type === "line") {
                let lineLength = Math.sqrt((this.draggedShape.finalY - this.draggedShape.initialY) * (this.draggedShape.finalY - this.draggedShape.initialY) + (this.draggedShape.finalX - this.draggedShape.initialX) * (this.draggedShape.finalX - this.draggedShape.initialX))/2;
                let angle = Math.atan2(
                    this.draggedShape.finalY - this.draggedShape.initialY,
                    this.draggedShape.finalX - this.draggedShape.initialX
                );
                let x1 = currentX - lineLength*Math.cos(angle), y1 = currentY - lineLength*Math.sin(angle);
                let x2 = currentX + lineLength*Math.cos(angle), y2 = currentY + lineLength*Math.sin(angle);
                this.draggedShape.initialX = x1, this.draggedShape.initialY = y1, this.draggedShape.finalX = x2, this.draggedShape.finalY = y2;
            }
            this.clearAndRedraw()
        }
    }

    mouseUpHandler = (e: MouseEvent) => {
        if (this.clicked) {
            this.clicked = false;
            if (this.selectedTool === "rect") this.existingShapes.push({ type: "rect", x: this.startX, y: this.startY, height: e.clientY - this.startY, width: e.clientX - this.startX, fill: this.backgroundColor, stroke: this.strokeColor, fillStyle: this.fillStyle, sw: this.strokeWidth });
            else if (this.selectedTool === "circle") {
                const dm = Math.sqrt((e.clientX - this.startX) * (e.clientX - this.startX) + (e.clientY - this.startY) * (e.clientY - this.startY));
                this.existingShapes.push({ type: "circle", centerX: this.startX, centerY: this.startY, radius: dm / 2, fill: this.backgroundColor, stroke: this.strokeColor, fillStyle: this.fillStyle, sw: this.strokeWidth })
            }
            else if (this.selectedTool === "line") {
                const rect = this.canvas.getBoundingClientRect();
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;
                this.existingShapes.push({ type: "line", initialX: this.startX, initialY: this.startY, finalX: currentX, finalY: currentY, stroke: this.strokeColor, sw: this.strokeWidth })
            }
            else if (this.selectedTool === "pen") {
                const rect = this.canvas.getBoundingClientRect();
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;
                this.path.push({ x: currentX, y: currentY });
                this.existingShapes.push({ type: "pen", points: this.path, stroke: this.strokeColor, sw: this.strokeWidth });
            }
            else if (this.selectedTool === "polygon") {
                const rect = this.canvas.getBoundingClientRect();
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;
                this.points.push([currentX, currentY]);
                this.existingShapes.push({ type: "polygon", points: this.points, fill: this.backgroundColor, stroke: this.strokeColor, sw: this.strokeWidth });
            }
            else if (this.selectedTool === "eraser") {
                this.existingShapes = this.existingShapes.filter((shape) => {
                    if (!shape) return false;
                    return !this.path.some((point) => {
                        if (shape.type === "rect") {
                            return this.isPointInRect(point, shape);
                        }
                        if (shape.type === "circle") {
                            return this.isPointInCircle(point, shape)
                        }
                        if (shape.type === "line") {
                            return this.isPointInCircle(point, shape);
                        }
                        if (shape.type === "pen") {
                            return this.isPointInPen(point, shape);
                        }
                        if (shape.type === "polygon") {
                            return this.isPointInPolygon(point, shape);
                        }
                    })
                })
                this.clearAndRedraw();
                this.updateShapes();
                this.path = []
                return;
            }
            else if (this.selectedTool === "grab") {
                this.updateShapes();
                return;
            }
            this.path = [];
            this.points = [];
            this.socket.send(JSON.stringify({
                type: "shape",
                data: this.existingShapes.slice(-1)[0],
                roomId: this.roomId
            }))

        }
    }

    updateShapes() {
        this.socket.send(JSON.stringify({
            type: "update_shapes",
            roomId: this.roomId,
            data: this.existingShapes
        }))
    }

    initMouseHandler() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler)
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.addEventListener("click", this.handleClickOutside);
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }
}
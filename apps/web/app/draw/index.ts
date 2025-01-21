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
    x : number,
    y : number
    content: string
}

export class DrawShape {
    private canvas: HTMLCanvasElement
    private roughCanvas
    private existingShapes: Shape[]
    private roomId: number
    private clicked: boolean
    private selectedTool: string
    private backgroundColor: string
    private strokeWidth: number
    private strokeColor: string
    private fillStyle: string
    private startX: number
    private startY: number
    private path: { x: number, y: number }[]
    private points: [number, number][]

    socket: WebSocket

    constructor(canvas: HTMLCanvasElement, roomId: number, selectedTool: string, socket: WebSocket) {
        console.log("initilaized")
        this.canvas = canvas
        this.roughCanvas = rough.canvas(canvas)
        this.existingShapes = []
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
        return (
            point.x >= rect.x &&
            point.x <= rect.x + rect.width &&
            point.y >= rect.y &&
            point.y <= rect.y + rect.height
        );
    }

    isPointInCircle(point: { x: number, y: number }, circle: Shape): boolean {
        return (
            Math.sqrt((point.x - circle.centerX) * (point.x - circle.centerX) + (point.y - circle.centerY) * (point.y - circle.centerY)) <= circle.radius
        )
    }

    isPointInLine(point: { x: number, y: number }, line: Shape): boolean {
        return (
            point.x >= line.initialX && point.x <= line.finalX && point.y >= line.initialY && point.y <= line.finalY
        )
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
                this.existingShapes.push(message.data);
                this.clearAndRedraw();
            }
        }
    }

    showToolTip(shape: Shape) {
        const tooltip = document.createElement('div');
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
        });

        const fillColorSection = createColorSection(shape.fill || '#000000', (newColor) => {
            shape.fill = newColor;
            this.clearAndRedraw();
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


    clearAndRedraw() {
        const ctx = this.canvas.getContext("2d");
        ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        console.log(this.existingShapes);

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
            this.existingShapes.map((shape) => {
                if (!shape) return false;
                if (shape.type === "rect" && this.isPointInRect({ x: e.clientX, y: e.clientY }, shape)) {
                    this.showToolTip(shape);
                }
            })
        }
        this.clicked = true
        this.startX = e.clientX
        this.startY = e.clientY
        console.log(e);
        this.path.push({ x: this.startX, y: this.startY });
        this.points = [[this.startX, this.startY]];
    }

    mouseMoveHandler = (e: MouseEvent) => {



        if (this.clicked) {
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
            else if (this.selectedTool === "text") {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const input = document.createElement("input");
                input.type = "text";
                input.style.position = "absolute";
                input.style.left = `${e.clientX}px`;
                input.style.top = `${e.clientY}px`;
                input.style.fontSize = "16px";
                input.style.border = "none";
                input.style.background = "none";
                input.style.color = this.strokeColor;
                input.style.outline = "none";

                document.body.appendChild(input);
                input.focus();

                // Add event listener for blur to finalize text
                input.addEventListener("blur", () => {
                    if (input.value.trim()) {
                        this.existingShapes.push({
                            type: "text",
                            content: input.value.trim(),
                            x : x,
                            y : y
                        });
                        this.socket.send(
                            JSON.stringify({
                                type: "shape",
                                data: this.existingShapes.slice(-1)[0],
                                roomId: this.roomId,
                            })
                        );
                        this.clearAndRedraw();
                    }
                    document.body.removeChild(input);
                });

                // Add event listener for Enter key to blur input
                input.addEventListener("keydown", (event) => {
                    if (event.key === "Enter") {
                        input.blur();
                    }
                });
            }

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
                    })
                })
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

    initMouseHandler() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler)
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }
}
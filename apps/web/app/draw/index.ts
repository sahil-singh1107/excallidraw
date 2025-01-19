import rough from "roughjs"

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "line";
    initialX: number
    initialY: number
    finalX: number
    finalY: number
} | {
    type: "pen",
    points: { x: number, y: number }[]
}

export class DrawShape {
    private canvas: HTMLCanvasElement
    private roughCanvas
    private existingShapes: Shape[]
    private roomId: number
    private clicked: boolean
    private selectedTool: string
    private startX: number
    private startY: number

    socket: WebSocket

    constructor(canvas: HTMLCanvasElement, roomId: number, selectedTool: string, socket: WebSocket) {
        this.canvas = canvas
        this.roughCanvas = rough.canvas(canvas)
        this.existingShapes = []
        this.roomId = roomId
        this.clicked = false
        this.selectedTool = selectedTool
        this.socket = socket
        this.startX = 0
        this.startY = 0
        this.initMouseHandler();
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true
        this.startX = e.clientX
        this.startY = e.clientY
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            if (this.selectedTool === "rect") {
                const width = e.clientX - this.startX, height = e.clientY - this.startY
                const ctx = this.canvas.getContext("2d");
                ctx?.clearRect(0,0,this.canvas.width, this.canvas.height);
                this.roughCanvas.rectangle(this.startX, this.startY, width, height, { fill: "red" });
            }
        }
    }

    mouseUpHandler = (e: MouseEvent) => {
        if (this.clicked) {
            this.clicked = false;
            this.existingShapes.push({ type: "rect", x: this.startX, y: this.startY, height: e.clientY - this.startY, width: e.clientX - this.startX });
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
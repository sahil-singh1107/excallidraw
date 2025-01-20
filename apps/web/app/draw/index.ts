import rough from "roughjs"

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
    fill : string;
    stroke : string
    fillStyle : string
    sw : number
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
    fill : string
    stroke : string
    fillStyle : string
    sw : number
} | {
    type: "line";
    initialX: number
    initialY: number
    finalX: number
    finalY: number
    stroke : string
    sw : number
} | {
    type: "pen",
    points: { x: number, y: number }[]
    stroke : string
    sw : number
} | {
    type : "polygon",
    points :[number, number][]
    fill : string
    stroke : string
    sw : number
}

export class DrawShape {
    private canvas: HTMLCanvasElement
    private roughCanvas
    private existingShapes: Shape[]
    private roomId: number
    private clicked: boolean
    private selectedTool: string
    private backgroundColor : string
    private strokeWidth : number
    private strokeColor : string
    private fillStyle : string
    private startX: number
    private startY: number
    private path: { x: number, y: number }[]
    private points : [number, number][]

    socket: WebSocket

    constructor(canvas: HTMLCanvasElement, roomId: number, selectedTool: string, socket: WebSocket) {
        this.canvas = canvas
        this.roughCanvas = rough.canvas(canvas)
        this.existingShapes = []
        this.roomId = roomId
        this.clicked = false
        this.selectedTool = selectedTool
        this.backgroundColor = "white"
        this.strokeWidth = 0
        this.strokeColor = "white"
        this.fillStyle = "solid"
        this.socket = socket
        this.startX = 0
        this.startY = 0
        this.path = []
        this.points = [0,0]
        this.initHandlers();
        this.initMouseHandler();
        console.log(socket);
    }

    setTool (tool : string ){
        if (tool) this.selectedTool = tool
    }

    setStroke (color : string) {
        if (color) this.strokeColor = color
    }

    setBack(color : string) {
        if (color) this.backgroundColor  = color
    }

    setFill(type : string) {
        if (type) this.fillStyle = type
    }

    setStrokeWidth (w : number) {
        this.strokeWidth = w
    }

    initHandlers () {
        this.socket.onmessage = (e) => {
            const message = JSON.parse(e.data);
            
            if (message.type === "shape") {
                this.existingShapes.push(message.data);
                this.clearAndRedraw();
            }
        }
    }

    clearAndRedraw() {
        const ctx = this.canvas.getContext("2d");
        ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.forEach((shape) => {
            if (shape.type === "rect") {
                this.roughCanvas.rectangle(shape.x, shape.y, shape.width, shape.height, { fill: shape.fill, stroke : shape.stroke, strokeWidth : shape.sw, fillStyle : shape.fillStyle });
            }
            else if (shape.type === "circle") {
                this.roughCanvas.circle(shape.centerX, shape.centerY, shape.radius * 2, { fill: shape.fill, stroke : shape.stroke, strokeWidth : shape.sw, fillStyle : shape.fillStyle });
            }
            else if (shape.type === "line") {
                this.roughCanvas.line(shape.initialX, shape.initialY, shape.finalX, shape.finalY, { stroke: shape.stroke, strokeWidth: shape.sw })
            }
            else if (shape.type === "polygon") {
                this.roughCanvas.polygon(shape.points, {fill : shape.fill, stroke : shape.stroke, strokeWidth : shape.sw})
            }
            else {
                for (let i = 1; i < shape.points.length; i++) {
                    this.roughCanvas.line(shape.points[i - 1]?.x, shape.points[i - 1]?.y, shape.points[i]?.x, shape.points[i]?.y, { strokeWidth: shape.sw, stroke: shape.stroke, strokeLineDash: [1, 6, 6,] });
                }
            }

        })
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true
        this.startX = e.clientX
        this.startY = e.clientY
        this.path.push({ x: this.startX, y: this.startY });
        this.points.push([this.startX, this.startY]);
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            this.clearAndRedraw();
            if (this.selectedTool === "rect") {
                const width = e.clientX - this.startX, height = e.clientY - this.startY

                this.roughCanvas.rectangle(this.startX, this.startY, width, height, { fill: this.backgroundColor, stroke : this.strokeColor, strokeWidth : this.strokeWidth, fillStyle : this.fillStyle });
            }
            else if (this.selectedTool === "circle") {
                //const centerX = (e.clientX - this.startX) / 2, centerY = (e.clientY - this.startY) / 2;
                const dm = Math.sqrt((e.clientX - this.startX) * (e.clientX - this.startX) + (e.clientY - this.startY) * (e.clientY - this.startY));

                this.roughCanvas.circle(this.startX, this.startY, dm, { fill: this.backgroundColor, stroke : this.strokeColor, strokeWidth : this.strokeWidth, fillStyle : this.fillStyle });
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
                this.roughCanvas.polygon(this.points, {fill : this.backgroundColor, stroke : this.strokeColor, strokeWidth : this.strokeWidth});
            }
        }
    }

    mouseUpHandler = (e: MouseEvent) => {
        if (this.clicked) {
            this.clicked = false;
            if (this.selectedTool === "rect") this.existingShapes.push({ type: "rect", x: this.startX, y: this.startY, height: e.clientY - this.startY, width: e.clientX - this.startX, fill : this.backgroundColor, stroke : this.strokeColor, fillStyle : this.fillStyle, sw : this.strokeWidth });
            else if (this.selectedTool === "circle") {
                const dm = Math.sqrt((e.clientX - this.startX) * (e.clientX - this.startX) + (e.clientY - this.startY) * (e.clientY - this.startY));
                this.existingShapes.push({ type: "circle", centerX: this.startX, centerY: this.startY, radius: dm / 2, fill : this.backgroundColor, stroke : this.strokeColor, fillStyle : this.fillStyle, sw : this.strokeWidth })
            }
            else if (this.selectedTool === "line") {
                const rect = this.canvas.getBoundingClientRect();
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;
                this.existingShapes.push({ type: "line", initialX: this.startX, initialY: this.startY, finalX: currentX, finalY: currentY, stroke : this.strokeColor, sw : this.strokeWidth })
            }
            else if (this.selectedTool === "pen") {
                const rect = this.canvas.getBoundingClientRect();
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;
                this.path.push({ x: currentX, y: currentY });
                this.existingShapes.push({ type: "pen", points: this.path, stroke : this.strokeColor, sw : this.strokeWidth });
            }
            else if (this.selectedTool === "polygon") {
                const rect = this.canvas.getBoundingClientRect();
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;
                this.points.push([currentX, currentY]);
                this.existingShapes.push({type : "polygon", points : this.points, fill : this.backgroundColor,  stroke : this.strokeColor, sw : this.strokeWidth});
            }
            this.path = [];
            this.points = [];
            this.socket.send(JSON.stringify({
                type: "shape",
                data: this.existingShapes.slice(-1)[0],
                roomId : this.roomId
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
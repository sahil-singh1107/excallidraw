import rough from "roughjs"
import {useEncrypt} from "@/hooks/useEncrypt";

const {encrypt, decryptSymmetric} = useEncrypt();

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

type Edge = {
    x1 : number,
    y1 : number,
    x2 : number,
    y2 : number
}

export class DrawShape {
    private canvas: HTMLCanvasElement
    private roughCanvas
    private existingShapes: Shape[]
    private existingEdges : Edge[]
    public shapeSelected: Shape
    private shapeSelectedIndex : number
    private roomId: number
    private clicked: boolean
    private selectedTool: string
    private backgroundColor: string
    private strokeWidth: number
    private strokeColor: string
    private fillStyle: string
    private startX: number
    private startY: number
    private key : string
    private edgeIndex : number
    private edgeShape : number
    private draggedShape: Shape | null
    private draggedShapeIndex : number
    private connections : [{s : number, e : number}]
    private path: { x: number, y: number }[]
    private points: [number, number][]

    socket: WebSocket

    constructor(canvas: HTMLCanvasElement, roomId: number, selectedTool: string, socket: WebSocket, key : string) {
        this.connections = []
        this.edgeIndex = -1
        this.edgeShape = -1
        this.canvas = canvas
        this.shapeSelected = null
        this.shapeSelectedIndex = -1
        this.key = key
        this.roughCanvas = rough.canvas(canvas)
        this.existingShapes = []
        this.existingEdges = []
        this.roomId = roomId
        this.clicked = false
        this.selectedTool = selectedTool
        this.backgroundColor = "white"
        this.strokeWidth = 2
        this.strokeColor = "white"
        this.fillStyle = "solid"
        this.socket = socket
        this.startX = 0
        this.startY = 0
        this.path = []
        this.points = [[0, 0]]
        this.initHandlers();
        this.initMouseHandler();
        this.clearAndRedraw()
        //this.getShapes()
    }

    // getShapes () {
    //     const shapes = localStorage.getItem("shapes");
    //     if (shapes) {
    //         this.existingShapes = JSON.parse(shapes);
    //     }
    // }

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

    setBack(color: string) {
        if (this.shapeSelected && (this.shapeSelected.type === "rect" || this.shapeSelected.type === "circle")) {
            this.shapeSelected.fill = color
            this.clearAndRedraw();
            this.updateShapes();
        }
    }

    setStroke(color: string) {
        if (this.shapeSelected && (this.shapeSelected.type === "rect" || this.shapeSelected.type === "circle")) {
            this.shapeSelected.stroke = color
            this.clearAndRedraw();
            this.updateShapes();
        }
    }

    initHandlers() {
        this.socket.onmessage = (e) => {
            const message = JSON.parse(e.data);

            if (message.type === "shape") {
                const plainText = decryptSymmetric(message.data.ciphertext, message.data.iv, message.data.tag, message.data.key);
                const exists = this.existingShapes.some(shape => JSON.stringify(shape) === JSON.stringify(plainText));
                if (!exists) {
                            this.existingShapes.push(message.data);

                             this.clearAndRedraw();
                         }
            }
            if (message.type === "update_shapes") {
                const plainText = decryptSymmetric(message.data.ciphertext, message.data.iv, message.data.tag, message.data.key);
                this.existingShapes = plainText

                this.clearAndRedraw();
            }
        }
    }

    drawArrow (edge : Edge) {
        const {x1,y1,x2,y2} = edge
        const angle = Math.atan2(y2 - y1, x2 - x1);
        this.roughCanvas.line(x1,y1,x2,y2,{strokeWidth : 2, strokeLineDash : [1,6,6], stroke : "orange"})
        this.roughCanvas.line(x2,y2,x2-10*Math.cos(angle - Math.PI/6), y2-10*Math.sin(angle-Math.PI/6),{strokeWidth : 2, strokeLineDash : [1,6,6], stroke : "orange"});
        this.roughCanvas.line(x2,y2,x2-10*Math.cos(angle + Math.PI/6), y2-10*Math.sin(angle+Math.PI/6),{strokeWidth : 2, strokeLineDash : [1,6,6], stroke : "orange"});
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

            if (this.shapeSelected === shape) {
                if (shape.type === "rect") {
                    this.roughCanvas.rectangle(shape.x, shape.y, shape.width, shape.height, { stroke: "blue", strokeWidth: 1, strokeLineDash: [5, 5] });
                }
                if (shape.type === "circle") {
                    this.roughCanvas.circle(shape.centerX, shape.centerY, shape.radius * 2, { stroke: "blue", strokeWidth: 1, strokeLineDash: [5, 5] })
                }
            }
        })
        this.existingEdges.map((edge) => {
            this.drawArrow(edge);
        })
        this.connections.map((connection) => {
            if (!this.existingShapes || !this.existingShapes[connection.s] || !this.existingShapes[connection.e]) return;
            if (this.existingShapes[connection.s]?.type==="rect" && this.existingShapes[connection.e]?.type==="rect") {
                this.drawArrow({x1 : this.findCenter(this.existingShapes[connection.s])?.c1, y1 : this.findCenter(this.existingShapes[connection.s])?.c2, x2 : this.findCenter(this.existingShapes[connection.e])?.c1, y2 :  this.findCenter(this.existingShapes[connection.e])?.c2});
            }
            if (this.existingShapes[connection.s]?.type==="rect" && this.existingShapes[connection.e]?.type==="circle") {
                this.drawArrow({x1 : this.findCenter(this.existingShapes[connection.s])?.c1, y1 : this.findCenter(this.existingShapes[connection.s])?.c2, x2 :this.existingShapes[connection.e].centerX , y2 :  this.existingShapes[connection.e].centerY});
            }
            if (this.existingShapes[connection.s]?.type==="circle" && this.existingShapes[connection.e]?.type==="rect") {
                this.drawArrow({x1 : this.existingShapes[connection.s].centerX, y1 : this.existingShapes[connection.s].centerY, x2 : this.findCenter(this.existingShapes[connection.e])?.c1, y2 :  this.findCenter(this.existingShapes[connection.e])?.c2});
            }
            if (this.existingShapes[connection.s]?.type==="circle" && this.existingShapes[connection.e]?.type==="circle") {
                this.drawArrow({x1 : this.existingShapes[connection.s].centerX, y1 : this.existingShapes[connection.s].centerY, x2 : this.existingShapes[connection.e].centerX, y2 :  this.existingShapes[connection.e].centerY});
            }
        })
    }

    findCenter (shape : Shape) {
        if (shape.type!=="rect") return;
        let c1 = shape.x + shape.width/2, c2 = shape.y + shape.height/2
        return {c1,c2}
    }

    mouseDownHandler = (e: MouseEvent) => {
        console.log("from class",e.clientX, e.clientY);
        const rect = this.canvas.getBoundingClientRect();
        if (this.selectedTool === "select") {
            this.clicked = true
            this.startX = e.clientX - rect.left
            this.startY = e.clientY - rect.top
            this.existingShapes.map((shape,i) => {
                if (!shape) return false;
                if (this.isPointInRect({ x: e.clientX - rect.left, y: e.clientY - rect.top }, shape) || this.isPointInCircle({ x: e.clientX - rect.left, y: e.clientY - rect.top }, shape) || this.isPointInLine({ x: e.clientX - rect.left, y: e.clientY-rect.top }, shape) || this.isPointInPen({ x: e.clientX - rect.left, y: e.clientY-rect.top }, shape) || this.isPointInPolygon({ x: e.clientX-rect.left, y: e.clientY-rect.top }, shape)) {
                    this.shapeSelected = shape;
                    this.shapeSelectedIndex = i
                }
            })
            this.clearAndRedraw();
        }
        else if (this.selectedTool === "grab") {
            this.clicked = true
            this.startX = e.clientX - rect.left
            this.startY = e.clientY - rect.top
            this.existingShapes.map((shape,i) => {
                if (!shape) return false;
                if (this.isPointInRect({ x: e.clientX - rect.left, y: e.clientY - rect.top }, shape) || this.isPointInCircle({ x: e.clientX - rect.left, y: e.clientY - rect.top }, shape) || this.isPointInLine({ x: e.clientX - rect.left, y: e.clientY-rect.top }, shape) || this.isPointInPen({ x: e.clientX-rect.left, y: e.clientY-rect.top }, shape) || this.isPointInPolygon({ x: e.clientX, y: e.clientY }, shape)) {
                    this.draggedShape = shape
                    this.draggedShapeIndex = i
                }
            })

        }
        else if (this.selectedTool === "edge") {
            this.clicked = true
            this.startX = e.clientX - rect.left
            this.startY = e.clientY - rect.top
        }
        else {
            this.clicked = true
            this.startX = e.clientX - rect.left
            this.startY = e.clientY - rect.top
            this.path.push({ x: this.startX, y: this.startY });
            this.points = [[this.startX, this.startY]];
        }
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked && this.selectedTool !== "grab") {
            this.clearAndRedraw();
            const rect = this.canvas.getBoundingClientRect();
            if (this.selectedTool === "rect") {
                const width = e.clientX - this.startX - rect.left, height = e.clientY - this.startY - rect.top
                this.roughCanvas.rectangle(this.startX, this.startY, width, height, { fill: this.backgroundColor, stroke: this.strokeColor, strokeWidth: this.strokeWidth, fillStyle: this.fillStyle });
            }
            else if (this.selectedTool === "circle") {
                //const centerX = (e.clientX - this.startX) / 2, centerY = (e.clientY - this.startY) / 2;
                const dm = Math.sqrt((e.clientX - this.startX - rect.left) * (e.clientX - this.startX - rect.left) + (e.clientY - this.startY - rect.top) * (e.clientY - this.startY - rect.top));
                this.roughCanvas.circle(this.startX , this.startY, dm, { fill: this.backgroundColor, stroke: this.strokeColor, strokeWidth: this.strokeWidth, fillStyle: this.fillStyle });
            }
            else if (this.selectedTool === "line") {
                const rect = this.canvas.getBoundingClientRect();
                const startX = this.startX ;
                const startY = this.startY ;
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;
                this.roughCanvas.line(startX, startY, currentX, currentY, { strokeWidth: this.strokeWidth, stroke: this.strokeColor });
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
            else if(this.selectedTool==="edge") {
                const rect = this.canvas.getBoundingClientRect();

                this.drawArrow({x1 :this.startX, y1 :  this.startY, x2 :  e.clientX-rect.left, y2 : e.clientY-rect.top});
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
            if (this.existingShapes.length === 0 || !this.draggedShape) return;
            const rect = this.canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
            if (this.draggedShape.type === "rect") {
                let x1 = (2 * currentX - this.draggedShape.width) / 2, y1 = (2 * currentY - this.draggedShape.height) / 2;
                this.draggedShape.x = x1
                this.draggedShape.y = y1

            }
            if (this.draggedShape.type === "circle") {
                this.draggedShape.centerX = currentX
                this.draggedShape.centerY = currentY
            }
            if (this.draggedShape.type === "line") {
                let lineLength = Math.sqrt((this.draggedShape.finalY - this.draggedShape.initialY) * (this.draggedShape.finalY - this.draggedShape.initialY) + (this.draggedShape.finalX - this.draggedShape.initialX) * (this.draggedShape.finalX - this.draggedShape.initialX)) / 2;
                let angle = Math.atan2(
                    this.draggedShape.finalY - this.draggedShape.initialY,
                    this.draggedShape.finalX - this.draggedShape.initialX
                );
                let x1 = currentX - lineLength * Math.cos(angle), y1 = currentY - lineLength * Math.sin(angle);
                let x2 = currentX + lineLength * Math.cos(angle), y2 = currentY + lineLength * Math.sin(angle);
                this.draggedShape.initialX = x1, this.draggedShape.initialY = y1, this.draggedShape.finalX = x2, this.draggedShape.finalY = y2;
            }
            this.clearAndRedraw()
        }
        else if (this.clicked && this.selectedTool === "select" && this.shapeSelected) {
            const rect = this.canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
            if (this.shapeSelected.type === "rect") {
                const bottomRightX = this.shapeSelected.x + this.shapeSelected.width;
                const bottomRightY = this.shapeSelected.y + this.shapeSelected.height;
                const handleSize = 10;

                if (
                    Math.abs(currentX - bottomRightX) <= handleSize &&
                    Math.abs(currentY - bottomRightY) <= handleSize
                ) {
                    const newWidth = Math.max(10, currentX - this.shapeSelected.x);
                    const newHeight = Math.max(10, currentY - this.shapeSelected.y);
                    this.shapeSelected.width = newWidth;
                    this.shapeSelected.height = newHeight;
                }

                this.clearAndRedraw();
            }
        }

    }

    mouseUpHandler = (e: MouseEvent) => {
        if (this.clicked) {
            this.clicked = false;
            const rect = this.canvas.getBoundingClientRect();
            if (this.selectedTool === "rect") this.existingShapes.push({ type: "rect", x: this.startX , y: this.startY, height: e.clientY - this.startY - rect.top, width: e.clientX - this.startX - rect.left, fill: this.backgroundColor, stroke: this.strokeColor, fillStyle: this.fillStyle, sw: this.strokeWidth, });
            else if (this.selectedTool === "circle") {
                const dm = Math.sqrt((e.clientX - this.startX - rect.left) * (e.clientX - this.startX - rect.left) + (e.clientY - this.startY - rect.top) * (e.clientY - this.startY - rect.top));
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
                this.existingShapes = this.existingShapes.filter((shape,i) => {
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
            else if (this.selectedTool === "edge") {
                this.existingEdges.push({x1 : this.startX, y1 : this.startY, x2 : e.clientX - rect.left, y2 : e.clientY - rect.top});
                this.clearAndRedraw()
            }
            else if (this.selectedTool === "select" && this.shapeSelected) {
                if (this.shapeSelected.type === "rect") {
                    const rect = this.canvas.getBoundingClientRect();
                    const currentX = e.clientX - rect.left;
                    const currentY = e.clientY - rect.top;

                    const bottomRightX = this.shapeSelected.x + this.shapeSelected.width;
                    const bottomRightY = this.shapeSelected.y + this.shapeSelected.height;
                    if (
                        Math.abs(currentX - bottomRightX) <= 10 &&
                        Math.abs(currentY - bottomRightY) <= 10
                    ) {
                        const newWidth = Math.max(10, currentX - this.shapeSelected.x);
                        const newHeight = Math.max(10, currentY - this.shapeSelected.y);
                        this.shapeSelected.width = newWidth;
                        this.shapeSelected.height = newHeight;
                        this.clearAndRedraw();
                    }
                }
                let shapeIndex : number
                this.existingShapes.map((shape,i) => {
                    if (!shape) return false;
                    if (this.isPointInRect({ x: e.clientX - rect.left, y: e.clientY - rect.top }, shape) || this.isPointInCircle({ x: e.clientX - rect.left, y: e.clientY - rect.top }, shape) || this.isPointInLine({ x: e.clientX - rect.left, y: e.clientY-rect.top }, shape) || this.isPointInPen({ x: e.clientX-rect.left, y: e.clientY-rect.top }, shape) || this.isPointInPolygon({ x: e.clientX, y: e.clientY }, shape)) {
                        shapeIndex = i
                    }
                })
                this.connections.push({s : this.shapeSelectedIndex, e : shapeIndex})
                this.clearAndRedraw()
            }
            else if (this.selectedTool === "grab") {
                this.updateShapes();
                return;
            }
            this.path = [];
            this.points = [];
            const {tag, iv, ciphertext} = encrypt(JSON.stringify(this.existingShapes.slice(-1)[0]), this.key);
            this.socket.send(JSON.stringify({
                type: "shape",
                data: {
                    tag,
                    iv,
                    ciphertext,
                    key : this.key
                },
                roomId: this.roomId
            }))
        }
    }

    updateShapes() {
        const {tag, iv, ciphertext} = encrypt(JSON.stringify(this.existingShapes), this.key);

        this.socket.send(JSON.stringify({
            type: "update_shapes",
            roomId: this.roomId,
            data: {
                tag,
                iv,
                ciphertext,
                key : this.key
            }
        }))
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
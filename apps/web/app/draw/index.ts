type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "line";
    x1: number
    y1: number
    x2: number
    y2: number
} | {
    type: "circle"
    x: number
    y: number
    radius: number
} | {
    type: "text",
    x1: number
    y1: number
    text: string | null
} | {
    type: "free",
    path: { x: number, y: number }[];
};

const shapes: Shape[] = [];

export async function initDraw(canvas: HTMLCanvasElement, roomId: number, socket: WebSocket, shapeType: string) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';

    let clicked = false;


    function clearAndRedraw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        shapes.forEach((shape) => {
            if (shape.type === "rect") {
                ctx.strokeStyle = '#fff';
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }
            else if (shape.type === "line") {
                ctx.beginPath();
                ctx.moveTo(shape.x1, shape.y1);
                ctx.lineTo(shape.x2, shape.y2);
                ctx.strokeStyle = "#fff";
                ctx.stroke();
            }
            else if (shape.type === "circle") {
                ctx.beginPath();
                ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
                ctx.strokeStyle = "#fff";
                ctx.stroke();
            }
            else if (shape.type === "text") {
                ctx.fillStyle = "#fff";
                ctx.font = "80px Arial";
                ctx.fillText(shape.text || "", shape.x1, shape.y1);
            }
            else if (shape.type === "free") {
                ctx.beginPath();
                ctx.moveTo(shape.path[0].x, shape.path[0].y);
                shape.path.forEach(point => {
                    ctx.lineTo(point.x, point.y);
                });
                ctx.strokeStyle = "#fff";
                ctx.lineWidth = 2; // Line width for the pen tool
                ctx.stroke();
            }
        });
    }

    if (shapeType === "rect") {
        let startX = 0, startY = 0;
        canvas.addEventListener("mousedown", (e) => {
            clicked = true;
            startX = e.clientX * 2;
            startY = e.clientY * 2;
        });

        canvas.addEventListener("mousemove", (e) => {
            if (clicked) {
                const width = (e.clientX * 2) - startX;
                const height = (e.clientY * 2) - startY;
                clearAndRedraw();
                ctx.strokeStyle = '#fff';
                ctx.strokeRect(startX, startY, width, height);
            }
        });

        canvas.addEventListener("mouseup", (e) => {
            if (clicked) {
                clicked = false;

                const width = (e.clientX * 2) - startX;
                const height = (e.clientY * 2) - startY;

                shapes.push({ type: "rect", x: startX, y: startY, width, height });

                clearAndRedraw();
            }
        });
    }
    else if (shapeType === "line") {
        let x1: number, y1: number, x2: number, y2: number;
        canvas.addEventListener("mousedown", (e) => {
            clicked = true;
            x1 = e.clientX * 2;
            y1 = e.clientY * 2;
        });

        canvas.addEventListener("mousemove", (e) => {
            if (clicked) {
                x2 = (e.clientX * 2);
                y2 = (e.clientY * 2);
                clearAndRedraw();
                ctx.beginPath();

                ctx.moveTo(x1, y1);

                ctx.lineTo(x2, y2);
                ctx.strokeStyle = "#fff";
                ctx.stroke();
            }
        });

        canvas.addEventListener("mouseup", () => {
            if (clicked) {
                clicked = false;
                shapes.push({ type: "line", x1, y1, x2, y2 });
                clearAndRedraw();
            }
        });
    }

    else if (shapeType === "circle") {
        let x: number, y: number, radius: number

        canvas.addEventListener("mousedown", (e) => {
            clicked = true;
            x = e.clientX * 2
            y = e.clientY * 2
        })

        canvas.addEventListener("mousemove", (e) => {
            if (clicked) {
                radius = Math.sqrt((2 * e.clientY - y) * (2 * e.clientY - y) + (2 * e.clientX - x) * (2 * e.clientX - x));
                clearAndRedraw();
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2 * Math.PI);
                ctx.strokeStyle = "#fff";
                ctx.stroke();
            }
        })

        canvas.addEventListener("mouseup", () => {
            if (clicked) {
                clicked = false;
                shapes.push({ type: "circle", x, y, radius })
                clearAndRedraw();

            }
        });
    }

    else if (shapeType === "text") {
        let x1: number, y1: number;

        canvas.addEventListener("mousedown", (e) => {
            clicked = true;
            x1 = 2 * e.clientX;
            y1 = 2 * e.clientY;
        })

        canvas.addEventListener("mousemove", (e) => {
            if (clicked) {
                clearAndRedraw();
                ctx.strokeStyle = '#fff';
                ctx.strokeRect(x1, y1, 2 * e.clientX - x1, 80);
            }
        })

        canvas.addEventListener("mouseup", (e) => {
            if (clicked) {
                clicked = false;
                const text = prompt();
                shapes.push({ type: "text", x1, y1, text })
                clearAndRedraw();
            }

        })
    }

    else if (shapeType === "free") {
        let currentPath: { x: number; y: number }[] = [];

        canvas.addEventListener("mousedown", (e) => {
            clicked = true
            currentPath = [{ x: 2 * e.clientX, y: 2 * e.clientY }];
        })

        canvas.addEventListener("mousemove", (e) => {
            if (clicked) {
                clearAndRedraw();
                currentPath.push({ x: 2 * e.clientX, y: 2 * e.clientY });
                ctx.beginPath();
                ctx.moveTo(currentPath[0].x, currentPath[0].y);
                currentPath.forEach(point => {
                    ctx.lineTo(point.x, point.y);
                });
                ctx.strokeStyle = "#fff";
                ctx.lineWidth = 2; 
                ctx.stroke();
                
            }
        })

        canvas.addEventListener("mouseup", () => {
            if (clicked) {
                clicked = false;
                shapes.push({ type: "free", path: currentPath });
                currentPath = [];
                clearAndRedraw();
            }
        });

    }

}

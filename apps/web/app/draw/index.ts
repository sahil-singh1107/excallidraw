type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type : "line";
    x1 : number
    y1 : number
    x2 : number
    y2 : number
};

const shapes: Shape[] = [];

export async function initDraw(canvas: HTMLCanvasElement, roomId: number, socket: WebSocket, shapeType : string) {
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
                ctx.moveTo(shape.x1,shape.y1);
                ctx.lineTo(shape.x2,shape.y2);
                ctx.strokeStyle = "#fff";
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
        let x1 : number,y1 : number,x2 : number,y2 : number;
        canvas.addEventListener("mousedown", (e) => {
            clicked = true;
            x1 = e.clientX * 2; 
            y1 = e.clientY * 2; 
            console.log(x1,y1);
        });

        canvas.addEventListener("mousemove", (e) => {
            if (clicked) {
                x2 = (e.clientX * 2);
                y2 = (e.clientY * 2); 
                clearAndRedraw();
                ctx.beginPath();
                ctx.moveTo(x1,y1);
                ctx.lineTo(x2,y2);
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
}

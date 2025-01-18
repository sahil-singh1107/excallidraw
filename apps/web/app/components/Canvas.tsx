import React, { useEffect, useRef } from "react";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx || !canvas) {
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let startX = 0,
      startY = 0;
    let clicked = false;

    const handleMouseDown = (e: MouseEvent) => {
      clicked = true;
      startX = e.offsetX;
      startY = e.offsetY;
    };

    const handleMouseUp = () => {
      clicked = false;
    };

    const handleMouseLeave = () => {
      clicked = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (clicked) {
        const width = e.offsetX - startX;
        const height = e.offsetY - startY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeRect(startX, startY, width, height);
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="h-[100vh] w-[100vw]"></canvas>
  );
};

export default Canvas;

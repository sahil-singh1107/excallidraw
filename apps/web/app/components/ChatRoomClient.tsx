"use client"
import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { DrawShape } from "../draw";
import Sidebar from "./Sidebar";
import ColorPicker from "./ColorPicker";
import EmojiBar from "@/components/EmojiBar";

interface ChatRoomClientProps {
  id: number;
  socket: WebSocket;
  encryptionKey : string
}

const ChatRoomClient: React.FC<ChatRoomClientProps> = ({ id, socket, encryptionKey }) => {
  const [selected, setSelected] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawShape, setDrawShape] = useState<DrawShape>();
  const [backgroundColor, setBackgroundColor] = useState<string>("white");
  const [strokeColor, setStrokeColor] = useState<string>("white")
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    drawShape?.setTool(selected);
    drawShape?.setBack(backgroundColor);
    drawShape?.setStroke(strokeColor)
  }, [selected, drawShape, backgroundColor, strokeColor]);

  useEffect(() => {
    if (canvasRef.current && socket) {
      const s = new DrawShape(canvasRef.current, id, selected, socket, encryptionKey);
      setDrawShape(s);
      return () => {
        s.destroy();
      };
    }
  }, [id, socket]);

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button !== 2 || selected!=="grab") return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
      <>
        <Navbar socket={socket} >
          <ColorPicker backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor} strokeColor={strokeColor} setStrokeColor={setStrokeColor} />
        </Navbar>
        <Sidebar selected={selected} setSelected={setSelected} />
        <EmojiBar socket={socket} id={id} />
        <canvas
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            width={window.innerWidth*5}
            height={window.innerHeight*5}
            ref={canvasRef}
            className={`canvas bg-black left-1./2 top-1/2 relative ${selected === "grab" && "cursor-grab"}`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`
            }} />
      </>
  );
};

export default ChatRoomClient;
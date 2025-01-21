"use client"
import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { DrawShape } from "../draw";
import Sidebar from "./Sidebar";

interface ChatRoomClientProps {
  id: number;
  socket: WebSocket;
}

interface Position {
  x: number;
  y: number;
}

const ChatRoomClient: React.FC<ChatRoomClientProps> = ({ id, socket }) => {
  const [selected, setSelected] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawShape, setDrawShape] = useState<DrawShape>();

  useEffect(() => {
    drawShape?.setTool(selected);
  }, [selected, drawShape]);

  useEffect(() => {
    if (canvasRef.current && socket) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      const s = new DrawShape(canvasRef.current, id, selected, socket);
      setDrawShape(s);
      return () => {
        s.destroy();
      };
    }
  }, [id, socket]);

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <Navbar socket={socket} />
      <Sidebar selected={selected} setSelected={setSelected} />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
      />
    </div>
  );
};

export default ChatRoomClient
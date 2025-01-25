"use client"
import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { DrawShape } from "../draw";
import Sidebar from "./Sidebar";
import { motion } from "motion/react"

interface ChatRoomClientProps {
  id: number;
  socket: WebSocket;
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
    <div className="relative">
      <Navbar socket={socket} />
      <Sidebar selected={selected} setSelected={setSelected} />
    <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-20 no-scrollbar h-full w-full bg-black"
      />
    </div>
  );
};

export default ChatRoomClient;
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
}

const ChatRoomClient: React.FC<ChatRoomClientProps> = ({ id, socket }) => {
  const [selected, setSelected] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawShape, setDrawShape] = useState<DrawShape>();
  const [backgroundColor, setBackgroundColor] = useState<string>("white");
  const [strokeColor, setStrokeColor] = useState<string>("white")

  useEffect(() => {
    drawShape?.setTool(selected);
    drawShape?.setBack(backgroundColor);
    drawShape?.setStroke(strokeColor)
  }, [selected, drawShape, backgroundColor, strokeColor]);

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
      <Navbar socket={socket} >
        <ColorPicker backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor} strokeColor={strokeColor} setStrokeColor={setStrokeColor} />
      </Navbar>
      <Sidebar selected={selected} setSelected={setSelected} />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-20 no-scrollbar h-full w-full bg-black"
      />
      <EmojiBar/>
    </div>
  );
};

export default ChatRoomClient;

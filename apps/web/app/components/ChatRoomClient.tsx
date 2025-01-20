"use client"
import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { DrawShape } from "../draw";
import BottomBar from "./BottomBar";
import Sidebar from "./Sidebar";

interface ChatRoomClientProps {
  id: number;
  socket: WebSocket
}



const ChatRoomClient: React.FC<ChatRoomClientProps> = ({ id, socket }) => {
  const [selected, setSelected] = useState<string>("rect");
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawShape, setDrawShape] = useState<DrawShape>()
  const [strokeColor, setStrokeColor] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("")
  const [fillStyle, setFillStyle] = useState<string>("");
  const [strokeWidth, setStrokeWidth] = useState<number>(0);

  useEffect(() => {
    drawShape?.setTool(selected);
    drawShape?.setStroke(strokeColor)
    drawShape?.setBack(backgroundColor);
    drawShape?.setFill(fillStyle)
    drawShape?.setStrokeWidth(strokeWidth)
}, [selected, drawShape, strokeColor, backgroundColor, fillStyle, strokeWidth]);

  useEffect(() => {
      
      if (canvasRef.current && socket) {

        const s = new DrawShape(canvasRef.current, id, selected, socket);

        setDrawShape(s);

        return () => {
          s.destroy();
        }
      }
  }, [canvasRef]);



  return <div className="min-h-screen bg-black">
    <Navbar socket={socket} />
    <BottomBar selected = {selected} setSelected = {setSelected} />
    { selected && <Sidebar setFillStyle={setFillStyle} strokeColor = {strokeColor} setStrokeColor = {setStrokeColor} backgroundColor = {backgroundColor} setBackgroundColor = {setBackgroundColor} strokeWidth = {strokeWidth} setStrokeWidth = {setStrokeWidth} />}
    <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>

  </div>
};

export default ChatRoomClient;

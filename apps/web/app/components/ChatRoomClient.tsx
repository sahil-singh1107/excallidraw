"use client"
import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { DrawShape } from "../draw";
import BottomBar from "./BottomBar";

interface ChatRoomClientProps {
  id: number;
  socket: WebSocket
}



const ChatRoomClient: React.FC<ChatRoomClientProps> = ({ id, socket }) => {
  // const token = localStorage.getItem("token");
  // const [currentMessage, setCurrentMessage] = useState<string>("");
  
  const [selected, setSelected] = useState<string>("rect");
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawShape, setDrawShape] = useState<DrawShape>()
  // const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  // const inputRef = useRef<HTMLInputElement | null>(null);

  // useEffect(() => {
  //   if (socket) {
  //     socket.send(
  //       JSON.stringify({
  //         type: "join_room",
  //         roomId: id,
  //       })
  //     );

  //     const updateCursorPosition = throttle((e: MouseEvent) => {
  //       const newCursorPos = { x: e.clientX, y: e.clientY };
  //       setCursorPos(newCursorPos);

  //       socket?.send(
  //         JSON.stringify({
  //           type: "cursor_move",
  //           x: newCursorPos.x,
  //           y: newCursorPos.y,
  //           roomId: id,
  //         })
  //       );
  //     }, 50);

  //     // const updateChat = throttle((e: KeyboardEvent) => {
  //     //   if (e.key === "/") {
  //     //     inputRef.current?.focus();
  //     //   }
  //     //   else {
  //     //     if (inputRef.current === document.activeElement) {
  //     //       socket.send(JSON.stringify({
  //     //         type: "chat",
  //     //         roomId: id,
  //     //         message: currentMessage
  //     //       }))
  //     //     }
  //     //   }
  //     // })

  //     window.addEventListener("mousemove", updateCursorPosition);
  //     //window.addEventListener("keypress", updateChat)

  //     const handleMessage = (event: MessageEvent) => {
  //       const parsedData = JSON.parse(event.data);


  //       if (parsedData.type === "user_updates") {
  //         setMembers(parsedData.members);
  //       }
  //     };

  //     socket.onmessage = handleMessage;
  //     return () => {
  //       socket.send(
  //         JSON.stringify({
  //           type: "leave_room",
  //           roomId: id,
  //         })
  //       );
  //       socket.onmessage = null;
  //       window.removeEventListener("mousemove", updateCursorPosition);
  //     };
  //   }
  // }, [socket, loading, id]);

  // return (
  //   <div className="min-h-screen overflow-hidden">
  //     <ul className="flex space-x-12">
  //       {members.map((member, i) => (
  //         <li key={i}>
  //           <Avatar name={member.username} color={member.color} />
  //           <div
  //             id="cursor"
  //             className="absolute transition duration-300"
  //             style={{
  //               left: `${member.x}px`,
  //               top: `${member.y}px`,
  //               transform: "translate(-50%, -50%)",
  //               pointerEvents: "none",
  //             }}
  //           >
  //             <img src="/cursor.svg" alt="" style={{ color: member.color }} />
  //           </div>

  //         </li>
  //       ))}
  //     </ul>
  //     <Canvas/>
  //   </div>
  // );

  useEffect(() => {
      
      if (canvasRef.current && socket) {

        const s = new DrawShape(canvasRef.current, id, "rect", socket);

        setDrawShape(s);

        return () => {
          s.destroy();
        }
      }
  }, [canvasRef]);



  return <div className="min-h-screen bg-black">
    <Navbar socket={socket} />
    {/* <BottomBar selected = {selected} setSelected = {setSelected} /> */}
    <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>

  </div>
};

export default ChatRoomClient;

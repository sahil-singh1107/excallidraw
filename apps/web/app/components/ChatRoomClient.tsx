"use client"
import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { useSocket } from "../hooks/useSocket";
import { initDraw } from "../draw";

interface ChatRoomClientProps {
  id: number;
}

export interface Member {
  username: string;
  color: string;
  x: number;
  y: number;
  status: boolean
  message: string
}

const ChatRoomClient: React.FC<ChatRoomClientProps> = ({ id, }) => {
  // const token = localStorage.getItem("token");
  // const [currentMessage, setCurrentMessage] = useState<string>("");
  const [members, setMembers] = useState<Member[]>([]);
  const { socket, loading } = useSocket();
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

    if (socket) {
      socket.send(JSON.stringify({
        type: "join_room",
        roomId: id
      }))


      socket.addEventListener("message", (e) => {
        const parsedData = JSON.parse(e.data);
        if (parsedData.type === "user_updates") {
          setMembers(parsedData.members)
        }
      })



    }

    if (canvasRef.current) {
      initDraw(canvasRef.current, id, socket!, "text");
    }

  }, [socket, loading, id])

  const canvasRef = useRef<HTMLCanvasElement>(null)

  return <div className="min-h-screen bg-black">
    <Navbar members={members} />
    <canvas ref={canvasRef} height="100vh" width="100vw"></canvas>
  </div>
};

export default ChatRoomClient;

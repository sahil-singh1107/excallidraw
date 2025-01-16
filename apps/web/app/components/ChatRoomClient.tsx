"use client";
import React, { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import Avatar from "./Avatar";
import { PiCursorFill } from "react-icons/pi";

interface ChatRoomClientProps {
  messages: string[];
  id: number;
}

interface Member {
  username: string
  color: string
  x: number
  y: number
}

const ChatRoomClient: React.FC<ChatRoomClientProps> = ({ messages, id }) => {
  const token = localStorage.getItem("token");
  const { socket, loading } = useSocket(token || "");
  const [chats, setChats] = useState<string[]>(messages);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [members, setMembers] = useState<Member[]>([]);
  const [cursorPos, setCursorPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });



  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        })
      );

      const mouseMoveHandler = (e: MouseEvent) => {
        const newCursorPos = { x: e.x, y: e.y };
        setCursorPos(newCursorPos);
        if (members.length > 1) {
          socket?.send(JSON.stringify({
            type: "cursor_move",
            x: newCursorPos.x,
            y: newCursorPos.y,
            roomId: id,
          }));
        }

      };

      window.addEventListener("mousemove", mouseMoveHandler);

      const handleMessage = (event: MessageEvent) => {
        const parsedData = JSON.parse(event.data);

        if (parsedData.type === "chat") {
          setChats((prev) => [...prev, parsedData.message]);
        }
        if (parsedData.type === "user_updates") {
          setMembers(parsedData.members);
        }
      };

      socket.onmessage = handleMessage;
      return () => {
        socket.send(JSON.stringify({
          type: "leave_room",
          roomId: id
        }))
        socket.onmessage = null;
      };
    }
  }, [socket, loading, id]);

  console.log(members);


  const handleSendMessage = () => {
    if (currentMessage) {
      console.log("Sending message:", currentMessage);
      socket?.send(
        JSON.stringify({
          type: "chat",
          roomId: id,
          message: currentMessage,
        })
      );
      setCurrentMessage("");
    }
  };

  return (
    <div>

      <ul className="flex space-x-12">
        {
          members.map((member, i) => (
            <li key={i}>
              <Avatar name={member.username} color={member.color} />
              <div
                id="cursor"
                className="bg-red-400 h-10 w-10 absolute transition-all duration-150"
                style={{
                  left: `${member.x}px`,
                  top: `${member.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              ></div>
              <label
                htmlFor="cursor"
                className="text-black"
                style={{
                  left: `${member.x}px`,
                  top: `${member.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {member.username}
              </label>
            </li>
          ))
        }
      </ul>
      {
        chats.map((message, i) => (
          <p key={i}>{message}</p>
        ))
      }
      <input
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSendMessage} disabled={!currentMessage.trim()}>
        Send
      </button>
    </div>
  );
};

export default ChatRoomClient;

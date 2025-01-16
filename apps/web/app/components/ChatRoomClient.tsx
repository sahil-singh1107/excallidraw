"use client";
import React, { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

interface ChatRoomClientProps {
  messages: string[];
  id: number;
}

const ChatRoomClient: React.FC<ChatRoomClientProps> = ({ messages, id }) => {
  const token = localStorage.getItem("token");
  const { socket, loading } = useSocket(token || "");
  const [chats, setChats] = useState<string[]>(messages);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [members, setMembers] = useState<string[]>([]);

  useEffect(() => {
    if (socket && !loading) {
      // Join room
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        })
      );

      // Listen for messages
      const handleMessage = (event: MessageEvent) => {
        const parsedData = JSON.parse(event.data);
        console.log(parsedData.message);
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
          type : "leave_room",
          roomId : id
        }))
        socket.onmessage = null;
      };
    }
  }, [socket, loading, id]);

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
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
      {chats.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
      {
        members.map((member, i) => (
          <p key={i}>{member}</p>
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

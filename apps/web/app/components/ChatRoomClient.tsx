"use client";
import React, { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import Avatar from "./Avatar";

interface ChatRoomClientProps {
  messages: string[];
  id: number;
}

interface Member {
  username: string
  color: string
}

const ChatRoomClient: React.FC<ChatRoomClientProps> = ({ messages, id }) => {
  const token = localStorage.getItem("token");
  const { socket, loading } = useSocket(token || "");
  const [chats, setChats] = useState<string[]>(messages);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [members, setMembers] = useState<Member[]>([]);

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
          type: "leave_room",
          roomId: id
        }))
        socket.onmessage = null;
      };
    }
  }, [socket, loading, id]);

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

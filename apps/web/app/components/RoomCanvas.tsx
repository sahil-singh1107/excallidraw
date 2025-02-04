"use client";
import { useSocket } from "../hooks/useSocket";
import ChatRoomClient from "./ChatRoomClient";
import { useEffect, useState } from "react";

const RoomCanvas = ({ id }: { id: number }) => {
  const { socket, loading } = useSocket(id);
  const [encryptionKey, setEncryptionKey] = useState<string>("");

  useEffect(() => {
    const storedKey = localStorage.getItem("encryptionKey");
    if (storedKey) {
      setEncryptionKey(storedKey);
    } else {
      const newKey = window.crypto.getRandomValues(new Uint8Array(32));
      const base64Key = btoa(String.fromCharCode(...newKey));
      localStorage.setItem("encryptionKey", base64Key);
      setEncryptionKey(base64Key);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!socket) {
    return <div>Error connecting to the room.</div>;
  }

  return <ChatRoomClient id={id} socket={socket!} encryptionKey={encryptionKey} />;
};

export default RoomCanvas;

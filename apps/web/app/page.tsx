"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Rooms from './components/Rooms';

const AestheticRoomLanding = () => {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [focused, setFocused] = useState(false);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const stroedToken = localStorage.getItem('token') as string;
    if (!stroedToken) router.push('/signin');
    setToken(stroedToken);
  }, []);

  useEffect(() => {
    if (roomName && token) router.push(`/room/${roomName}?token=${encodeURIComponent(token)}`);
  }, [roomName]);

  return (
    <div>
      <Rooms token={token} setRoomName={setRoomName} />
    </div>
  );
};

export default AestheticRoomLanding;
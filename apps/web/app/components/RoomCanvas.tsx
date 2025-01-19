"use client"
import { useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import ChatRoomClient from './ChatRoomClient'

const RoomCanvas = ({ id }: { id: number }) => {
  const { socket, loading } = useSocket(id);
  return (
    <>
      <ChatRoomClient id={id} socket={socket!} />
    </>
  )
}

export default RoomCanvas

"use client"
import { useSocket } from '../hooks/useSocket';
import ChatRoomClient from './ChatRoomClient'

const RoomCanvas = ({ id }: { id: number }) => {
  console.log(id);
  const { socket, loading } = useSocket(id);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!socket) {
    return <div>Error connecting to the room.</div>;
  }

  return (
    <>
      <ChatRoomClient id={id} socket={socket!} />
    </>
  )
}

export default RoomCanvas

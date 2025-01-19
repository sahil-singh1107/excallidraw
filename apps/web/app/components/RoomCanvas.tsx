"use client"
import { useSocket } from '../hooks/useSocket';
import ChatRoomClient from './ChatRoomClient'

const RoomCanvas = ({ id }: { id: number }) => {
  const { socket, loading } = useSocket(id);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner/loading indicator
  }

  if (!socket) {
    return <div>Error connecting to the room.</div>; // Handle case where socket initialization fails
  }
  return (
    <>
      <ChatRoomClient id={id} socket={socket!} />
    </>
  )
}

export default RoomCanvas

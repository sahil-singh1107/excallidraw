"use client"

import { useRouter } from "next/navigation";
import { useState } from "react"

const Page = () => {

  const [roomId, setRoomId] = useState<string>("");

  const router = useRouter();

  return (
    <div>
      <input value={roomId} onChange={(e) => {setRoomId(e.target.value)}}  />
      <button onClick={() => {
          router.push(`/room/${roomId}`)
      }}>join</button>
    </div>
  )
}

export default Page

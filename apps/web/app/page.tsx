"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

const Page = () => {

  const router = useRouter()

  const [token, setToken] = useState<string>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin")
    }
    setToken(token!);
  }, [])

  const [roomId, setRoomId] = useState<string>("");

  return (
    <div >
      <input value={roomId} onChange={(e) => { setRoomId(e.target.value) }} />
      <button onClick={() => {
        router.push(`/room/${roomId}`)
      }}>join</button>
    </div>
  )
}

export default Page

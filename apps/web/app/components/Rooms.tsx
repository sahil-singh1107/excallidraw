"use client"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PlusIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"


const Rooms = ({ token, setRoomName }: { token: string, setRoomName: Dispatch<SetStateAction<string>> }) => {
    const [rooms, setRooms] = useState<{ slug: string }[]>([]);
    const [typing, setTyping] = useState<string>("");
    const { toast } = useToast()

    useEffect(() => {
        async function getRooms() {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/getRooms`, {
                    headers: { Authorization: token }
                });
                setRooms(res.data.rooms);
            } catch (err) {
                console.error(err);
            }
        }
        getRooms();
    }, [token]);

    const handleCreateRoom = async () => {
        if (typing.trim()) {
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/create`,
                    { name: typing },
                    { headers: { Authorization: token } }
                );
                toast({
                    title : "Room created"
                })
                setTyping("");
            } catch (err) {
                console.error(err);
            }
        }
    }

    return (
        <div className="bg-gradient-to-br from-gray-900 to-black h-screen flex flex-col p-8">
            <div className="flex items-center mb-8">
                <input
                    type="text"
                    value={typing}
                    onChange={(e) => setTyping(e.target.value)}
                    placeholder="Create New Room"
                    className="bg-gray-800 text-white px-4 py-2 rounded-l-lg flex-grow"
                />
                <button
                    onClick={handleCreateRoom}
                    className="bg-purple-600 text-white p-2 rounded-r-lg hover:bg-purple-700"
                >
                    <PlusIcon />
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {rooms.map((room, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Card
                            onClick={() => setRoomName(room.slug)}
                            className="bg-gray-800 text-white border-none cursor-pointer hover:bg-gray-700 transition-colors"
                        >
                            <CardHeader className="flex flex-col items-center justify-center space-y-2">

                                <CardTitle className="text-center">{room.slug}</CardTitle>
                            </CardHeader>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default Rooms
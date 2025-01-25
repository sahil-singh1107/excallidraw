"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react"

const Rooms = ({ token, setRoomName }: { token: string, setRoomName : Dispatch<SetStateAction<string>> }) => {

    const [rooms, setRooms] = useState([]);
    const [typing, setTyping] = useState<string>("");

    useEffect(() => {
        async function getRooms() {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/getRooms`, { headers: { Authorization: token } });
            console.log(res.data);
            setRooms(res.data.rooms);
        }
        getRooms();
    }, [token]);

    const handleSubmit = async () => {
        await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/rooms/${typing}`, { headers: { Authorization: token } });
    }

    return (
        <div className="bg-black h-screen flex">
            <div className="flex space-x-6 mt-10">
                {
                    rooms.map((room, i) => (
                        <Card key={i} className="w-28 h-28" onClick={() => {setRoomName(room.slug)}}>
                            <CardHeader>
                                <CardTitle>{room.slug}</CardTitle>
                            </CardHeader>
                        </Card>
                    ))
                }
            </div>

        </div>
    )
}

export default Rooms

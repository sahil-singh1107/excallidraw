import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"


export interface Member {
    username: string;
    color: string;
    x: number;
    y: number;
    status: boolean
    message: string
}

const Navbar = ({ socket }: { socket: WebSocket }) => {

    const [members, setMembers] = useState<Member[]>([]);


    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            const parsedData = JSON.parse(e.data);

            if (parsedData.type === "user_updates") {
                setMembers(parsedData.members);
            }
        }
        if (socket) {
            socket.addEventListener("message", handleMessage);

            return () => {
                socket.removeEventListener("message", handleMessage);
            };
        }
    }, [socket])

    return (
        <div className="fixed top-0 right-5 z-20 py-3">
            <div className="flex justify-center">
                <ul className="flex space-x-12">
                    {members.map((member, i) => (
                        <li key={i}>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <Avatar>
                                        <AvatarImage />
                                        <AvatarFallback style={{ backgroundColor: member.color }}></AvatarFallback>
                                    </Avatar>
                                </HoverCardTrigger>
                                <HoverCardContent className='text-center w-fit h-fit'>
                                    {member.username}
                                </HoverCardContent>
                            </HoverCard>


                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
import React, { useEffect, useState } from 'react';
import Avatar from './Avatar';

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
        <div className="fixed top-0 left-0 right-0 z-20 py-3">
            <div className="flex justify-center">
                <ul className="flex space-x-12">
                    {members.map((member, i) => (
                        <li key={i}>
                            <Avatar name={member.username} color={member.color} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
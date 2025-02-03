"use client";

import { useEffect, useState } from "react";

export function useSocket(roomId: number) {
    const [loading, setLoading] = useState<boolean>(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("No token found in localStorage.");
            setLoading(false);
            return;
        }

        const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

        ws.onopen = () => {
            console.log("WebSocket connected.");
            setLoading(false);
            ws.send(JSON.stringify({ type: "join_room", roomId }));
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected.");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        setSocket(ws);
        return () => {
            ws.close();
            console.log("WebSocket connection closed.");
        };
    }, [roomId]); 

    return { socket, loading };
}

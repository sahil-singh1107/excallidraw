"use client"

import { useEffect, useState } from "react";

export function useSocket() {
    const [loading, setLoading] = useState<boolean>(true);
    const [socket, setSocket] = useState<WebSocket>();


    useEffect(() => {

        const getToken = localStorage.getItem("token");
        if (!getToken) {
            return;
        }

        const ws = new WebSocket(`ws://localhost:5000?token=${getToken}`)

        ws.onopen = () => {
            console.log("connected")
            setLoading(false);
            setSocket(ws);
        }
        ws.onclose = () => {
            console.log("disconnected");
        }
    }, [])

    return {
        socket, loading
    }
}
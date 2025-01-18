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

        const ws = new WebSocket(`ws://localhost:8080?token=${getToken}`)

        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, [])

    return {
        socket, loading
    }
}
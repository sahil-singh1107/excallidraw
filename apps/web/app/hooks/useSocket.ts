import { useEffect, useState } from "react";

export function useSocket(token : string) {
    const [loading, setLoading] = useState<boolean>(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8080?token=${token}`)

        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, [])

    return {
        socket, loading
    }
}
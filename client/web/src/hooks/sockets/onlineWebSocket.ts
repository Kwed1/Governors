// useWebSocket.ts
import { useEffect, useState } from 'react'
import useStore from '../../components/store/zustand'

export const useWebSocket = (url: string) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const {getAccessToken} = useStore()
    const token = getAccessToken()
    
    useEffect(() => {
        if (!token) return
        const ws = new WebSocket(`${url}?token=${token}`);

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'getStatus' }));
        };

        ws.onmessage = (event) => {
            try {
                console.log(123);
                
                console.log(event.data);
                const data = JSON.parse(event.data);
                setMessage(event.data);
            } catch (error) {
                console.error('Error parsing message', error);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        setSocket(ws);


        return () => {
            ws.close();
        };
    }, [url, token]);

    const send = (message: object) => {
        if (socket) {
            socket.send(JSON.stringify(message));
        }
    };

    return { socket, send, message};
};

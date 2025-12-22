"use client";

import { StreamVideoClient } from "@stream-io/video-client";
import { StreamChat } from "stream-chat";
import { useState, useEffect } from "react";

export function useStreamClient({ apiKey, user, token }) {
    const [videoClient, setVideoClient] = useState(null);
    const [chatClient, setChatClient] = useState(null);

    useEffect(() => {
        if (!apiKey || !user || !token) return;

        let isMounted = true;

        const initClients = async () => {
            try {
                const tokenProvider = () => Promise.resolve(token);

                const myVideoClient = new StreamVideoClient({
                    apiKey,
                    tokenProvider,
                    user,
                });

                const myChatClient = new StreamChat(apiKey);
                await myChatClient.connectUser(user, token);

                if (isMounted) {
                    setVideoClient(myVideoClient);
                    setChatClient(myChatClient);
                }
            } catch (err) {
                console.error("Stream init error:", err);
            }
        };

        initClients();

        return () => {
            isMounted = false;
            if (chatClient) chatClient.disconnectUser();
        };
    }, [apiKey, user, token]);

    return { videoClient, chatClient };
}

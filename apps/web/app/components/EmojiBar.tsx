"use client"
import React, { useState, useEffect } from 'react';
import { Heart, ThumbsUp, Star, PartyPopper, Award } from 'lucide-react';
import {Emoji} from "@/emoji";

const AnimatedReactionsBar = ({ socket, id }: { socket: WebSocket, id : number }) => {
    
    const [reactions, setReactions] = useState([
        {  name: "ThumbsUp" , icon : ThumbsUp},
        {  name: "Heart", icon : Heart },
        {  name: "Star", icon: Star },
        {  name: "PartyPopper", icon : PartyPopper },
        {  name: "Award", icon : Award }
    ]);

    const [pressed, setPressed] = useState<string>("");
    const [emojiClass, setEmojiClass] = useState<Emoji>();

    useEffect(() => {
        emojiClass?.setEmoji(pressed);
        emojiClass?.sendEmoji();
        setPressed("");
    }, [pressed]);

    useEffect(() => {
        const e = new Emoji(id, socket, "");
        setEmojiClass(e);
        return () => {
            emojiClass?.destroy();
        }
    }, []);
    
    return (
        <>
            <div className="flex items-center space-x-4 p-4 bg-transparent rounded-lg shadow-sm z-40 sticky w-fit">
                {reactions.map(({ name, icon : Icon }, i) => (
                    <button
                        key={i}
                        className={`
                            group flex items-center space-x-1 px-3 py-2 rounded-full
                            transition-all duration-200 ease-in-out
                            transform hover:scale-110
                            bg-gray-100 text-gray-600
                            hover:bg-blue-50
                        `}
                        onClick={() => {
                            setPressed(name);
                        }}
                    >
                        <Icon
                            className={`
                                w-5 h-5
                                transition-transform duration-200
                                group-hover:scale-125
                            `}
                        />
                    </button>
                ))}
            </div>
        </>
    );
};

export default AnimatedReactionsBar;
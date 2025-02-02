"use client"
import React, { useState } from 'react';
import { Heart, ThumbsUp, Star, PartyPopper, Award } from 'lucide-react';

const AnimatedReactionsBar = ({socket} : {socket : WebSocket}) => {
    const [reactions, setReactions] = useState([
        { id: 1, icon: ThumbsUp,   },
        { id: 2, icon: Heart,   },
        { id: 3, icon: Star, },
        { id: 4, icon: PartyPopper,  },
        { id: 5, icon: Award,   }
    ]);

    const handleReaction = (id : number) => {

    };

    return (
        <div className="flex items-center space-x-4 p-4 bg-transparent rounded-lg shadow-sm z-40 relative w-fit">
            {reactions.map(({ id, icon: Icon, }) => (
                <button
                    key={id}
                    onClick={() => handleReaction(id)}
                    className={`
            group flex items-center space-x-1 px-3 py-2 rounded-full
            transition-all duration-200 ease-in-out
            transform hover:scale-110
            bg-gray-100 text-gray-600
            hover:bg-blue-50
          `}
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
    );
};

export default AnimatedReactionsBar;
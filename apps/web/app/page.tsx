"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const AestheticRoomLanding = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/signin');
  }, [router]);

  const handleJoinRoom = () => {
    if (roomId.trim()) router.push(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-extralight text-gray-800 mb-4 flex items-center justify-center"
            >
              <Sparkles className="mr-3 text-blue-500" size={32} />
              Connect
            </motion.h1>
            <p className="text-gray-500 text-sm">Enter a room to start collaboration</p>
          </div>

          <div className="space-y-6">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <input 
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Room ID"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 
                  ${focused 
                    ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'}`}
              />
            </motion.div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleJoinRoom}
              disabled={!roomId.trim()}
              className="w-full bg-blue-500 text-white py-3 rounded-xl 
                hover:bg-blue-600 transition-colors flex items-center 
                justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join Room
              <ArrowRight className="ml-2" size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AestheticRoomLanding;
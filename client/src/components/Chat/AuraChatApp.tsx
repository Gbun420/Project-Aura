import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { BusinessChat } from './BusinessChat';
import { AURA_CONFIG } from '../../config/auraConfig';

interface Message {
  id: string;
  sender: 'employer' | 'candidate' | 'system';
  content: string;
  timestamp: string;
}

export const AuraChatApp = ({ chatId, candidatePdcExpiry, onUnlock }: { chatId: string; candidatePdcExpiry: number; onUnlock: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'system', content: 'Secure Channel Established. Aura Assistant active.', timestamp: new Date().toISOString() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [socket, setSocket] = useState<typeof Socket | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io(AURA_CONFIG.ENDPOINTS.SOCKET_SERVER);
    setSocket(newSocket);

    newSocket.on('message_received', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    newSocket.on('ai_intervention', (intervention: string) => {
      // Normalized: Suggestion bar instead of message injection
      setSuggestion(intervention);
    });

    return () => { newSocket.close(); };
  }, [chatId]);

  const sendMessage = () => {
    if (!inputValue.trim() || !socket) return;
    
    const msg: Message = {
      id: Math.random().toString(),
      sender: 'employer',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    socket.emit('send_message', msg);
    setMessages(prev => [...prev, msg]);
    setInputValue('');
    setSuggestion(null); // Clear suggestion on next message
  };

  const candidate = {
    name: "Candidate " + chatId.split('-')[1] || "Selected Candidate",
    pdcDays: candidatePdcExpiry,
    status: "Verified"
  };

  return (
    <BusinessChat 
      candidate={candidate}
      messages={messages}
      inputValue={inputValue}
      setInputValue={setInputValue}
      sendMessage={sendMessage}
      suggestion={suggestion}
      onUnlock={onUnlock}
    />
  );
};

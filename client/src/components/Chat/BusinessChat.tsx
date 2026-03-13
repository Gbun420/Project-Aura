import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'employer' | 'candidate' | 'system';
  content: string;
  timestamp: string;
}

interface BusinessChatProps {
  candidate: {
    name: string;
    pdcDays: number;
    status: string;
  };
  messages: Message[];
  inputValue: string;
  setInputValue: (val: string) => void;
  sendMessage: () => void;
  suggestion: string | null;
  onUnlock: () => void;
}

export const BusinessChat = ({ 
  candidate, 
  messages, 
  inputValue, 
  setInputValue, 
  sendMessage, 
  suggestion, 
  onUnlock 
}: BusinessChatProps) => {
  return (
    <div className="flex h-[600px] bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden text-gray-800">
      {/* Main Conversation Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700">{candidate.name}</span>
            <span className="text-[10px] text-green-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Online
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Business Secure Comms</span>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex ${m.sender === 'system' ? 'justify-center' : m.sender === 'employer' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                m.sender === 'system' ? 'bg-gray-50 text-gray-400 text-[10px] italic px-4 py-1 rounded-full' :
                m.sender === 'employer' ? 'bg-blue-600 text-white ml-auto' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* The "Normalized" Success Pilot Trigger */}
        <AnimatePresence>
          {suggestion && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-3 border-t bg-blue-50 flex items-center justify-between"
            >
              <p className="text-sm text-blue-800 flex items-center gap-2">
                <span>✨</span> Ready to move forward with {candidate.name.split(' ')[0]}?
              </p>
              <button 
                onClick={onUnlock}
                className="bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Unlock Paperwork
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 border-t flex gap-2">
          <input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 p-2 border border-gray-200 rounded-md outline-none focus:ring-2 ring-blue-100 text-sm" 
            placeholder="Write a message..." 
          />
          <button 
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>

      {/* Simplified Compliance Sidebar */}
      <div className="w-64 bg-gray-50 border-l p-6 flex flex-col">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-6">Candidate Info</h4>
        <div className="space-y-6 flex-1">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-tight mb-1">Compliance Status</p>
            <p className="text-sm font-semibold text-green-600">Verified</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-tight mb-1">PDC Validity</p>
            <div className="flex items-baseline gap-1">
              <p className="text-xl font-bold text-gray-700">{candidate.pdcDays}</p>
              <p className="text-[10px] text-gray-400">Days Remaining</p>
            </div>
            <div className="mt-2 w-full bg-gray-200 h-1 rounded-full overflow-hidden">
              <div 
                className={`h-full ${candidate.pdcDays < 7 ? 'bg-orange-500' : 'bg-blue-500'}`} 
                style={{ width: `${(candidate.pdcDays / 42) * 100}%` }} 
              />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-tight mb-1">Hire-Pack</p>
            <p className="text-[11px] font-medium text-gray-600">Identità-Ready</p>
          </div>
        </div>

        <button 
          onClick={onUnlock}
          className="w-full py-3 bg-gray-900 text-white font-bold text-xs rounded-md hover:bg-black transition-colors uppercase tracking-wide"
        >
          Get All Documents
        </button>
      </div>
    </div>
  );
};

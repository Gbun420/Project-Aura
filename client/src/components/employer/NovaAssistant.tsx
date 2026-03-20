import { useState } from 'react';
import { Send, Sparkles, X } from 'lucide-react';
import { env } from '../../config/env';

type AssistantProps = {
  candidateContext: {
    candidateId: string;
    matchScore: number;
    tcnStatus: string;
    isPro: boolean;
  };
  onClose: () => void;
  onUpgrade: () => void;
};

export default function NovaAssistant({ candidateContext, onClose, onUpgrade }: AssistantProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
    { role: 'assistant', text: "Nova Assistant Online. How can I help?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${env.apiUrl}/api/ai/neural`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CONVERSATIONAL_ACTION',
          payload: {
            message: userMsg,
            context: candidateContext
          }
        })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-[#0F1114] border border-white/10 rounded-[2rem] shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom-6">
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-white" />
          <span className="text-xs font-black text-white uppercase tracking-widest">Nova Assistant</span>
        </div>
        <button onClick={onClose} aria-label="Close Assistant" className="text-white/60 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto max-h-80 space-y-4 font-manrope">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed 
              ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-300 border border-white/10'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex gap-1">
              <div className="h-1 w-1 bg-white/40 rounded-full animate-bounce" />
              <div className="h-1 w-1 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="h-1 w-1 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white/5 border-t border-white/10 space-y-3">
        {!candidateContext.isPro && (
          <button 
            onClick={onUpgrade}
            className="w-full bg-indigo-600 text-white py-2 rounded-xl text-[10px] font-black uppercase hover:opacity-90 transition-all tracking-widest"
          >
            Upgrade to Pro (€49)
          </button>
        )}
        <div className="flex gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about compliance, skills..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button 
            onClick={handleSend}
            title="Send message"
            aria-label="Send message"
            className="bg-indigo-600 p-2 rounded-xl text-white hover:opacity-90 transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

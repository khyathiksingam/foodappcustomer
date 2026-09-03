import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ChatMessage {
  id: string;
  sender: 'partner' | 'user';
  text: string;
  time: string;
}

const QUICK_CHIPS = [
  'I am at the main gate',
  'Please call when you reach',
  'Leave with building guard',
  'Ring the bell twice',
];

export const PartnerChatModal: React.FC = () => {
  const { isPartnerChatOpen, setIsPartnerChatOpen, activeOrder } = useApp();

  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'partner',
      text: "Hello! I have picked up your order and will reach your address shortly. Please keep your phone reachable.",
      time: 'Just now',
    },
  ]);

  if (!isPartnerChatOpen || !activeOrder?.deliveryPartner) return null;

  const partner = activeOrder.deliveryPartner;

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');

    // Simulated automated rider response after 1.5s
    setTimeout(() => {
      const partnerReplies = [
        'Sure, noted! I will follow your instructions.',
        'Got it, reaching in 5 minutes!',
        'Understood! Calling you once I arrive at the gate.',
      ];
      const randomReply = partnerReplies[Math.floor(Math.random() * partnerReplies.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: 'part-' + Date.now(),
          sender: 'partner',
          text: randomReply,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[520px]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={partner.photo}
                alt={partner.name}
                className="w-10 h-10 rounded-2xl object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {partner.name}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Delivery Partner • Online
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPartnerChatOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/30">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-br-none shadow-md shadow-orange-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Quick Presets */}
        <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              className="shrink-0 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950 text-slate-600 dark:text-slate-300 hover:text-orange-600 text-[11px] font-semibold transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Send Input Box */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message to rider..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend(inputMsg);
            }}
            className="flex-1 px-3.5 py-2.5 text-xs rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-transparent focus:border-orange-500 focus:outline-none"
          />
          <button
            onClick={() => handleSend(inputMsg)}
            disabled={!inputMsg.trim()}
            className="w-10 h-10 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white flex items-center justify-center shadow-md transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

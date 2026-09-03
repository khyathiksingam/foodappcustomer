import React, { useState } from 'react';
import {
  X,
  Send,
  Headphones,
  Phone,
  Mail,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { SupportMessage } from '../../types';

export const SupportModal: React.FC = () => {
  const { isSupportOpen, setIsSupportOpen, activeOrder, cancelOrder, addWalletMoney } = useApp();

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 'sp-1',
      sender: 'bot',
      text: "Namaste! Welcome to CraveWave Support. How can I assist you today? Feel free to ask about your active orders, refunds, or delivery instructions.",
      time: 'Just now',
      quickActions: [
        'Where is my order?',
        'Cancel current order',
        'Food quality compensation',
        'Change delivery address',
      ],
    },
  ]);

  if (!isSupportOpen) return null;

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: SupportMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: promptText,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    // Process automated response logic
    setTimeout(() => {
      let botResponse = '';
      let quick: string[] | undefined = undefined;

      const lower = promptText.toLowerCase();

      if (lower.includes('where') || lower.includes('status') || lower.includes('track')) {
        if (activeOrder && activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled') {
          botResponse = `Your order #${activeOrder.id} from ${activeOrder.restaurantName} is currently in state: '${activeOrder.status.replace(/_/g, ' ').toUpperCase()}'. Estimated delivery time is approximately ${activeOrder.etaMinutes} minutes. You can track live scooter movement in the app!`;
        } else {
          botResponse = "You don't have any pending orders being delivered right now. You can check your completed orders in the Orders tab.";
        }
      } else if (lower.includes('cancel')) {
        if (activeOrder && activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled') {
          cancelOrder(activeOrder.id);
          addWalletMoney(activeOrder.total);
          botResponse = `Order #${activeOrder.id} has been successfully cancelled per your request. The full amount of ₹${activeOrder.total} has been credited back to your CraveWave wallet instantly.`;
        } else {
          botResponse = "There is no in-progress order available to cancel.";
        }
      } else if (lower.includes('compensation') || lower.includes('refund') || lower.includes('quality') || lower.includes('cold')) {
        addWalletMoney(150);
        botResponse = "We are truly sorry about the inconvenience! As a token of our heartfelt apology, we have credited ₹150 directly into your CraveWave Wallet balance. We have also flagged this feedback to the restaurant's quality team.";
      } else if (lower.includes('address') || lower.includes('location')) {
        botResponse = "You can update your delivery address anytime from the top location bar before placing an order. If your rider is already on the way, you can click 'Message Partner' in Live Tracking to instruct them directly.";
      } else {
        botResponse = "Thank you for reaching out! Our executive team is available 24x7. You can also call us directly at 1800-CRAVE-WAVE or email support@cravewave.com for priority help.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          quickActions: quick,
        },
      ]);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[580px]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-orange-500/10 via-rose-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-500 text-white flex items-center justify-center shadow-md">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>CraveWave AI Help Desk</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </h3>
              <p className="text-[11px] text-slate-400">Instant answers • 24x7 Live Assistance</p>
            </div>
          </div>

          <button
            onClick={() => setIsSupportOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Direct Contact info strip */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-emerald-500" />
            <span>Toll-Free: 1800-CRAVE-WAVE</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-orange-500" />
            <span>support@cravewave.com</span>
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/30">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-br-none shadow-md shadow-orange-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>

              {m.quickActions && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {m.quickActions.map((action) => (
                    <button
                      key={action}
                      onClick={() => handleSendPrompt(action)}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950 text-slate-700 dark:text-slate-300 hover:text-orange-600 text-[11px] font-bold border border-slate-200 dark:border-slate-700 shadow-sm transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Send input */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
          <input
            type="text"
            placeholder="Type your question or issue..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendPrompt(chatInput);
            }}
            className="flex-1 px-3.5 py-2.5 text-xs rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-transparent focus:border-orange-500 focus:outline-none"
          />
          <button
            onClick={() => handleSendPrompt(chatInput)}
            disabled={!chatInput.trim()}
            className="w-10 h-10 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white flex items-center justify-center shadow transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

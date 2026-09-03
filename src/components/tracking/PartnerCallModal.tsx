import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PartnerCallModal: React.FC = () => {
  const { isPartnerCallOpen, setIsPartnerCallOpen, activeOrder } = useApp();

  const [callState, setCallState] = useState<'calling' | 'ringing' | 'connected'>('calling');
  const [callDurationSec, setCallDurationSec] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  useEffect(() => {
    if (!isPartnerCallOpen) {
      setCallState('calling');
      setCallDurationSec(0);
      return;
    }

    const ringTimeout = setTimeout(() => {
      setCallState('ringing');
    }, 1200);

    const connectTimeout = setTimeout(() => {
      setCallState('connected');
    }, 2800);

    return () => {
      clearTimeout(ringTimeout);
      clearTimeout(connectTimeout);
    };
  }, [isPartnerCallOpen]);

  useEffect(() => {
    let interval: any;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setCallDurationSec((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  if (!isPartnerCallOpen || !activeOrder?.deliveryPartner) return null;

  const partner = activeOrder.deliveryPartner;

  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 p-6 flex flex-col items-center text-center">
        
        {/* Security / Masking badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-[10px] font-bold mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Number Masked for Privacy</span>
        </div>

        {/* Partner Photo & Pulse */}
        <div className="relative mb-4">
          {callState === 'connected' && (
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
          )}
          <img
            src={partner.photo}
            alt={partner.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-slate-700 shadow-xl relative z-10"
          />
        </div>

        {/* Partner Info */}
        <h3 className="text-xl font-black">{partner.name}</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Delivery Partner • {partner.vehiclePlate}
        </p>

        {/* Status indicator */}
        <div className="my-4">
          {callState === 'calling' && (
            <span className="text-xs font-bold text-amber-400 animate-pulse">
              Dialing partner...
            </span>
          )}
          {callState === 'ringing' && (
            <span className="text-xs font-bold text-cyan-400 animate-pulse">
              Ringing...
            </span>
          )}
          {callState === 'connected' && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{formatCallTime(callDurationSec)}</span>
            </div>
          )}
        </div>

        {/* Call Controls */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-[200px] my-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-2xl flex flex-col items-center justify-center transition-all ${
              isMuted ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            <span className="text-[10px] font-bold mt-1">{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`p-4 rounded-2xl flex flex-col items-center justify-center transition-all ${
              isSpeaker ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {isSpeaker ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            <span className="text-[10px] font-bold mt-1">{isSpeaker ? 'Speaker' : 'Earpiece'}</span>
          </button>
        </div>

        {/* Hangup button */}
        <div className="mt-4">
          <button
            onClick={() => setIsPartnerCallOpen(false)}
            className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 active:scale-95 transition-all"
            title="End Call"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
          <span className="text-[11px] text-slate-400 block mt-2 font-bold">End Call</span>
        </div>

      </div>
    </div>
  );
};

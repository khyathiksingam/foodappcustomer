import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  RotateCw,
  CheckCircle2,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useApp();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('9281432397');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('4164');
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSmsBanner, setShowSmsBanner] = useState(false);

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Audio ding helper
  const playSmsTone = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // Audio not permitted without interaction
    }
  };

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');

    // Generate simulated 4-digit OTP
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setTimer(30);
    setStep('otp');

    // Trigger SMS Push Banner
    setShowSmsBanner(true);
    playSmsTone();

    // Browser Notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('💬 CraveWave Verification', {
          body: `Your OTP is ${newOtp} for mobile verification.`,
          icon: '/favicon.svg',
        });
      } catch {}
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto move to next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleAutoFillOtp = () => {
    const digits = generatedOtp.split('');
    setOtp(digits);
    setShowSmsBanner(false);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 4) {
      setError('Please enter the complete 4-digit OTP.');
      return;
    }

    setError('');
    setIsVerifying(true);

    setTimeout(() => {
      login(
        '+91 ' + phoneNumber.replace(/\D/g, '').slice(-10),
        name || 'Khyathi K Singam',
        email || 'khyathi@example.com'
      );
      setIsVerifying(false);
      setShowSmsBanner(false);
    }, 600);
  };

  return (
    <>
      {/* Top Simulated SMS Push Notification */}
      {showSmsBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-11/12 max-w-md animate-in slide-in-from-top-6 duration-300">
          <div className="p-4 rounded-3xl bg-slate-900/95 text-white backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] text-white/70">
                  <span className="font-black uppercase tracking-wider text-emerald-400">
                    MESSAGES
                  </span>
                  <span>•</span>
                  <span>Just Now</span>
                </div>
                <p className="text-xs font-bold truncate">
                  CRAVEWAVE: Your OTP is <span className="text-amber-300 font-mono text-sm underline">{generatedOtp}</span>
                </p>
                <p className="text-[10px] text-white/80 truncate">
                  Valid for 10 minutes. Do not share this OTP.
                </p>
              </div>
            </div>

            <button
              onClick={handleAutoFillOtp}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shrink-0 shadow transition-colors"
            >
              Auto-Fill
            </button>
          </div>
        </div>
      )}

      {/* Main Auth Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-6 text-white">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 shadow-inner">
              <Smartphone className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black">
              {step === 'phone' ? 'Log in or Register' : 'Verify Mobile OTP'}
            </h2>
            <p className="text-xs text-white/90 mt-1">
              {step === 'phone'
                ? 'Unlock delicious cravings, live tracking & member discounts'
                : `Verification code sent to +91 ${phoneNumber.replace(/\D/g, '').slice(-10)}`}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mobile Number
                  </label>
                  <div className="flex rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:border-orange-500 transition-colors">
                    <div className="flex items-center gap-1 px-3 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full px-3.5 py-3 text-sm font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Khyathi K Singam"
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. foodie@example.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black text-sm shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Send OTP via SMS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  By continuing, you agree to CraveWave Terms of Service & Privacy Policy.
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                {/* Clear Verification OTP Box */}
                <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-2 border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-emerald-600 dark:text-emerald-400 block">
                        Official Verification Code
                      </span>
                      <h4 className="text-xl font-mono font-black text-slate-900 dark:text-white tracking-widest">
                        {generatedOtp}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Sent to +91 {phoneNumber.replace(/\D/g, '').slice(-10)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tap to Fill {generatedOtp}</span>
                  </button>
                </div>

                {/* 4 Digit Boxes */}
                <div className="flex justify-center gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-12 h-14 text-center text-2xl font-black rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all shadow-inner"
                      required
                    />
                  ))}
                </div>

                {/* Resend timer & Change Number */}
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
                  >
                    Change Number
                  </button>
                  {timer > 0 ? (
                    <span className="text-slate-400">Resend OTP in {timer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const fresh = Math.floor(1000 + Math.random() * 9000).toString();
                        setGeneratedOtp(fresh);
                        setTimer(30);
                        setShowSmsBanner(true);
                        playSmsTone();
                      }}
                      className="text-orange-600 dark:text-orange-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <RotateCw className="w-3 h-3" /> Resend OTP
                    </button>
                  )}
                </div>

                {/* Submit Verification Button */}
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white font-black text-sm shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <span>Verifying Mobile Number...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify Mobile Number</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

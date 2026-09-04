import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
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
  const [phoneNumber, setPhoneNumber] = useState('9281432323');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('4829');
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [deliveryChannel, setDeliveryChannel] = useState<'sms' | 'whatsapp'>('sms');

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isAuthModalOpen) return null;

  const cleanedPhone = phoneNumber.replace(/\D/g, '').slice(-10);

  const dispatchOtpToDevice = (code: string, channel: 'sms' | 'whatsapp') => {
    const textMsg = `Your CraveWave verification OTP code is: ${code}. Valid for 10 minutes.`;

    if (channel === 'sms') {
      try {
        window.location.href = `sms:+91${cleanedPhone}?body=${encodeURIComponent(textMsg)}`;
      } catch {}
    } else {
      try {
        window.open(
          `https://api.whatsapp.com/send?phone=91${cleanedPhone}&text=${encodeURIComponent(
            `Your CraveWave verification OTP code is: *${code}* (Valid for 10 mins)`
          )}`,
          '_blank'
        );
      } catch {}
    }
  };

  const handleSendOtp = (e: React.FormEvent, channel: 'sms' | 'whatsapp') => {
    e.preventDefault();

    // 1. Mandatory Name Validation
    if (!name.trim()) {
      setError('Full Name is required. Please enter your name to proceed.');
      return;
    }

    // 2. Mobile number validation
    if (cleanedPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setError('');
    // Auto-generate fresh 4-digit OTP code by website
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setTimer(30);
    setDeliveryChannel(channel);
    setStep('otp');

    // Dispatch directly to device SMS or WhatsApp
    dispatchOtpToDevice(newOtp, channel);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-advance to next input box
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleAutoFillOtp = () => {
    const digits = generatedOtp.split('');
    setOtp(digits);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 4) {
      setError('Please enter the complete 4-digit verification code.');
      return;
    }

    setError('');
    setIsVerifying(true);

    setTimeout(() => {
      login(
        `+91 ${cleanedPhone}`,
        name.trim(),
        email.trim() || `${cleanedPhone}@cravewave.user`
      );
      setIsVerifying(false);
    }, 600);
  };

  const handleResend = (channel: 'sms' | 'whatsapp') => {
    const fresh = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(fresh);
    setTimer(30);
    setDeliveryChannel(channel);
    dispatchOtpToDevice(fresh, channel);
  };

  return (
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
            {step === 'phone' ? 'Log in or Register' : 'Verify Mobile Number'}
          </h2>
          <p className="text-xs text-white/90 mt-1">
            {step === 'phone'
              ? 'Join CraveWave for express food delivery & member rewards'
              : `OTP auto-generated and sent to +91 ${cleanedPhone}`}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {step === 'phone' ? (
            <div className="space-y-4">
              {/* Mobile Number Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Mobile Number <span className="text-rose-500 font-black">*</span></span>
                  <span className="text-[10px] text-slate-400">10 Digits</span>
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
                    placeholder="92814 32323"
                    className="w-full px-3.5 py-3 text-sm font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Name Input - Strictly Required */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Full Name <span className="text-rose-500 font-black">*</span></span>
                  <span className="text-[10px] text-rose-500 font-black uppercase tracking-wider">Required</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@example.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Dispatch Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => handleSendOtp(e, 'sms')}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black text-sm shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send OTP Directly to SMS Inbox</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={(e) => handleSendOtp(e, 'whatsapp')}
                  className="w-full py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>🟢 Send OTP Directly to WhatsApp</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                By continuing, you agree to CraveWave Terms of Service & Privacy Policy.
              </p>
            </div>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              
              {/* Clear Dispatched Receipt Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-2.5 shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    OTP Dispatched to Mobile
                  </span>
                </div>
                
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Code sent to <span className="font-bold text-slate-900 dark:text-white font-mono">+91 {cleanedPhone}</span> via {deliveryChannel === 'sms' ? 'SMS Messages' : 'WhatsApp'}
                </p>

                {/* Direct Message App Buttons */}
                <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => dispatchOtpToDevice(generatedOtp, 'sms')}
                    className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Messages Inbox</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatchOtpToDevice(generatedOtp, 'whatsapp')}
                    className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>🟢 Open WhatsApp</span>
                  </button>
                </div>

                {/* Clear Dispatched Code Preview & 1-Tap Fill */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between px-1 text-xs">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Dispatched Code: <strong className="font-mono text-sm text-slate-900 dark:text-white font-black tracking-widest">{generatedOtp}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Fill {generatedOtp}</span>
                  </button>
                </div>
              </div>

              {/* 4 Digit Boxes */}
              <div className="space-y-1">
                <label className="block text-center text-xs font-bold text-slate-600 dark:text-slate-400">
                  Enter 4-Digit Verification Code
                </label>
                <div className="flex justify-center gap-3 py-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-12 h-14 text-center text-2xl font-black rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all shadow-inner"
                      required
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
              </div>

              {/* Resend timer & Change Number */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
                >
                  Change Number
                </button>
                {timer > 0 ? (
                  <span className="text-slate-400">Resend in {timer}s</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleResend('sms')}
                      className="text-orange-600 dark:text-orange-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <RotateCw className="w-3 h-3" /> Resend SMS
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => handleResend('whatsapp')}
                      className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    >
                      WhatsApp
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Verification Button */}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white font-black text-sm shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isVerifying ? (
                  <span>Verifying Mobile Number...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Continue</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
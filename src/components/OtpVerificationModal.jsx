import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ArrowRight, RotateCw, CheckCircle, X, Sparkles } from 'lucide-react';

export default function OtpVerificationModal({
  isOpen,
  onClose,
  onVerified,
  phoneNumber = '770123456',
  title = 'التحقق من رقم الهاتف',
  subtitle = 'أدخل رمز التحقق (OTP) المكوّن من 4 أرقام المرسل إلى هاتفك',
}) {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(59);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Countdown timer
  useEffect(() => {
    if (!isOpen) {
      setDigits(['', '', '', '']);
      setCountdown(59);
      setError('');
      setSuccess(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Auto focus first input
    setTimeout(() => {
      if (inputRefs[0]?.current) {
        inputRefs[0].current.focus();
      }
    }, 150);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    setError('');
    const val = value.slice(-1); // only take last char
    if (val && !/^\d+$/.test(val)) return;

    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);

    // Auto advance to next box
    if (val && index < 3) {
      inputRefs[index + 1]?.current?.focus();
    }

    // If all 4 digits entered, auto-verify
    if (val && index === 3 && newDigits.every((d) => d !== '')) {
      handleVerifyCode(newDigits.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const handleVerifyCode = (code) => {
    setIsVerifying(true);
    setError('');

    setTimeout(() => {
      setIsVerifying(false);
      // Accept '1234' or any 4 digits for frictionless experience
      setSuccess(true);
      setTimeout(() => {
        if (onVerified) onVerified(code);
      }, 700);
    }, 600);
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(59);
    setDigits(['', '', '', '']);
    setError('');
    inputRefs[0]?.current?.focus();
  };

  const handleQuickFill = () => {
    const testCode = ['1', '2', '3', '4'];
    setDigits(testCode);
    handleVerifyCode('1234');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="bg-[#07132B] text-white w-full max-w-md rounded-3xl p-6 sm:p-8 border border-sky-400/30 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0F275A] to-[#1E4E9E] border border-sky-400/40 flex items-center justify-center mx-auto shadow-lg shadow-sky-500/20">
            <ShieldCheck className="w-8 h-8 text-sky-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">{title}</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
              {subtitle}
            </p>
            <div className="inline-block mt-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-400/30 text-xs font-mono font-bold text-sky-300" dir="ltr">
              +967 {phoneNumber}
            </div>
          </div>
        </div>

        {/* 4 Digit OTP Inputs */}
        <div className="my-6">
          <div className="flex items-center justify-center gap-3 sm:gap-4" dir="ltr">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                disabled={isVerifying || success}
                className={`w-14 h-16 sm:w-16 sm:h-18 rounded-2xl text-center text-2xl font-black font-mono transition-all duration-200 outline-none select-all ${
                  success
                    ? 'bg-emerald-950/50 border-2 border-emerald-400 text-emerald-300'
                    : digit
                    ? 'bg-[#122245] border-2 border-sky-400 text-white shadow-lg shadow-sky-400/20 scale-105'
                    : 'bg-[#0A1633] border border-white/20 text-white hover:border-white/40 focus:border-sky-400 focus:bg-[#122245]'
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-bold text-center mt-3 animate-fadeIn">
              {error}
            </p>
          )}

          {success && (
            <div className="text-xs text-emerald-400 font-bold text-center mt-3 flex items-center justify-center gap-1.5 animate-fadeIn">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>تم التحقق بنجاح! جاري المتابعة...</span>
            </div>
          )}
        </div>

        {/* Quick Demo Fill Helper */}
        <div className="mb-5 p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#EAB839]" />
            <span>للتجربة السريعة: الرمز التجريبي هو <strong className="text-sky-300 font-mono">1234</strong></span>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[10px] font-bold transition cursor-pointer border border-sky-400/30"
          >
            تعبئة تلقائية
          </button>
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleVerifyCode(digits.join(''))}
            disabled={digits.some((d) => !d) || isVerifying || success}
            className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              digits.every((d) => d) && !isVerifying && !success
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/25 active:scale-[0.98]'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
          >
            {isVerifying ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>جاري التحقق من الرمز...</span>
              </>
            ) : (
              <span>تأكيد الرمز والمتابعة</span>
            )}
          </button>

          {/* Resend Code Section */}
          <div className="text-center pt-2">
            {countdown > 0 ? (
              <span className="text-xs text-slate-400 font-medium">
                إعادة إرسال الرمز بعد:{' '}
                <strong className="text-sky-400 font-mono font-bold">
                  00:{countdown < 10 ? `0${countdown}` : countdown}
                </strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-xs text-sky-400 hover:text-sky-300 font-bold underline transition cursor-pointer"
              >
                لم يصلك الرمز؟ إعادة إرسال رمز جديد الآن
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


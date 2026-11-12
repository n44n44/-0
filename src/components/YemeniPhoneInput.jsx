import React from 'react';
import { Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { cleanYemeniPhone, validateYemeniPhone } from '../utils/phoneValidation';

export default function YemeniPhoneInput({
  value,
  onChange,
  required = false,
  label = 'رقم الهاتف اليمني',
  placeholder = '77xxxxxxx',
  disabled = false,
  className = '',
  id = 'yemeni-phone-input',
}) {
  const validation = validateYemeniPhone(value);
  const isDirty = Boolean(value && String(value).trim().length > 0);

  const handleInputChange = (e) => {
    const raw = e.target.value;
    const cleaned = cleanYemeniPhone(raw);
    onChange(cleaned);
  };

  return (
    <div className={`space-y-1 text-right ${className}`} dir="rtl">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input container with fixed +967 international badge */}
      <div className="relative flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200 transition overflow-hidden">
        {/* Country Code Fixed Badge (+967 Yemen) */}
        <div className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 border-l border-slate-200 text-slate-700 select-none shrink-0 font-mono text-xs font-bold">
          <span className="text-sm">🇾🇪</span>
          <span dir="ltr">+967</span>
        </div>

        {/* 9-Digit Local Phone Input */}
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={9}
          required={required}
          disabled={disabled}
          value={value || ''}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 text-xs font-mono font-bold text-[#172A46] placeholder-slate-400 focus:outline-none bg-transparent"
        />

        {/* Validation Icon Indicator */}
        <div className="px-3 shrink-0">
          {isDirty && validation.valid && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" title="رقم يمني صحيح (9 أرقام)" />
          )}
          {isDirty && !validation.valid && (
            <AlertCircle className="w-4 h-4 text-amber-500" title={validation.error} />
          )}
          {!isDirty && <Phone className="w-4 h-4 text-slate-300" />}
        </div>
      </div>

      {/* Helper & Validation Messages */}
      <div className="flex items-center justify-between text-[11px] pt-0.5">
        {isDirty && !validation.valid ? (
          <span className="text-amber-600 font-bold flex items-center gap-1">
            <span>{validation.error}</span>
          </span>
        ) : isDirty && validation.valid ? (
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <span>رقم معتمد: {validation.formatted}</span>
          </span>
        ) : (
          <span className="text-slate-400">يتكون من 9 أرقام محلية تبدأ بـ (77, 78, 73, 71, 70)</span>
        )}

        {/* Digits counter: X/9 */}
        <span
          className={`font-mono text-[10px] px-1.5 py-0.2 rounded ${
            (value || '').length === 9
              ? 'bg-emerald-100 text-emerald-800 font-bold'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {(value || '').length}/9 أرقام
        </span>
      </div>
    </div>
  );
}


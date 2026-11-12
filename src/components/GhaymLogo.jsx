import React from 'react';
import { LOGO_DATA_URI } from '../data/logoBase64';

export default function GhaymLogo({
  variant = 'horizontal', // 'horizontal' | 'vertical' | 'icon'
  subtitle = 'Ghaym Space',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  showSubtitle = true,
  onClick = null,
  className = '',
}) {
  const sizeMap = {
    sm: { img: 'w-8 h-8', text: 'text-base', sub: 'text-[9px]' },
    md: { img: 'w-11 h-11', text: 'text-xl', sub: 'text-xs' },
    lg: { img: 'w-14 h-14', text: 'text-2xl', sub: 'text-sm' },
    xl: { img: 'w-20 h-20', text: 'text-3xl', sub: 'text-base' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      dir="rtl"
    >
      {/* Official Unmodified Logo Image */}
      <div className="relative shrink-0 rounded-2xl overflow-hidden border border-sky-500/40 shadow-lg shadow-sky-950/60 hover:scale-105 transition-all duration-300 bg-[#0c1a30]">
        <img
          src={LOGO_DATA_URI}
          alt="شعار غيم سبيس الرسمي - Ghaym Space"
          className={`${currentSize.img} object-cover`}
        />
      </div>

      {variant !== 'icon' && (
        <div className="flex flex-col text-right">
          <span className={`font-black tracking-tight text-white leading-tight ${currentSize.text}`}>
            غيم سبيس
          </span>
          {showSubtitle && (
            <span className={`font-medium tracking-wide text-sky-400/90 leading-none ${currentSize.sub}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

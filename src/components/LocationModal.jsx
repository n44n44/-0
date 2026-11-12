import React from 'react';
import { X, MapPin, Check } from 'lucide-react';
import { NEIGHBORHOODS_MUKALLA, CITIES } from '../data/mockData';

export default function LocationModal({ isOpen, onClose, selectedLocation, onSelectLocation }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div onClick={onClose} className="fixed inset-0 transition-opacity bg-slate-950/70 backdrop-blur-sm"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-3xl text-right overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-slate-100">
          <div className="p-4 bg-[#081226] text-white flex items-center justify-between border-b border-sky-950">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-extrabold">تحديد موقع التوصيل</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <h4 className="text-xs font-bold text-slate-500 mb-2">أحياء المكلا الأكثر طلباً:</h4>
              <div className="space-y-1.5">
                {NEIGHBORHOODS_MUKALLA.map((loc) => {
                  const isSelected = selectedLocation === loc;
                  return (
                    <button
                      key={loc}
                      onClick={() => {
                        onSelectLocation(loc);
                        onClose();
                      }}
                      className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                        isSelected
                          ? 'bg-sky-50 text-sky-700 border-sky-300'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span>{loc}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 mb-2">مدن ومحافظات أخرى:</h4>
              <div className="grid grid-cols-2 gap-2">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onSelectLocation(city);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-slate-50 text-xs font-bold text-slate-700 text-center transition"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


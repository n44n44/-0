import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  UploadCloud,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
  syncLocalDataToSupabase,
} from '../lib/supabaseClient';
import { usePlatform } from '../context/PlatformContext';

export default function SupabaseModal({ isOpen, onClose }) {
  const { db, refreshFromSupabase, isSupabaseConnected, setIsSupabaseConnected } = usePlatform();

  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'sql' | 'guide'

  useEffect(() => {
    if (isOpen) {
      const cfg = getSupabaseConfig();
      setUrl(cfg.url || '');
      setAnonKey(cfg.anonKey || '');
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async (e) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'يرجى إدخال رابط المشروع (Project URL) ومفتاح الـ Anon Key أولاً.',
      });
      return;
    }

    setIsTesting(true);
    setStatusMessage(null);

    const res = await testSupabaseConnection(url.trim(), anonKey.trim());
    setIsTesting(false);

    if (res.success) {
      saveSupabaseConfig(url.trim(), anonKey.trim());
      if (setIsSupabaseConnected) setIsSupabaseConnected(true);
      setStatusMessage({
        type: 'success',
        text: res.message,
      });
      if (refreshFromSupabase) {
        refreshFromSupabase();
      }
    } else {
      setStatusMessage({
        type: 'error',
        text: res.message,
      });
    }
  };

  const handleDisconnect = () => {
    clearSupabaseConfig();
    setUrl('');
    setAnonKey('');
    if (setIsSupabaseConnected) setIsSupabaseConnected(false);
    setStatusMessage({
      type: 'info',
      text: 'تم فصل الربط مع سوبابيز والعودة إلى وضع التخزين المحلي الآمن.',
    });
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    setStatusMessage(null);
    try {
      const res = await syncLocalDataToSupabase(db);
      setIsSyncing(false);
      setStatusMessage({
        type: 'success',
        text: `تم رفع ومزامنة البيانات بنجاح: (${res.stores} متجر، ${res.products} منتج، ${res.categories} تصنيف)!`,
      });
    } catch (err) {
      setIsSyncing(false);
      setStatusMessage({
        type: 'error',
        text: `فشلت المزامنة: ${err.message || 'تأكد من إنشاء الجداول عبر كود الـ SQL أولاً'}`,
      });
    }
  };

  const sqlSchemaCode = `-- كود إنشاء جداول منصة غيم سبيس على Supabase
CREATE TABLE IF NOT EXISTS public.stores (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    rating NUMERIC(3,2) DEFAULT 4.9,
    reviews_count INT DEFAULT 0,
    location TEXT DEFAULT 'المكلا، حضرموت',
    phone TEXT DEFAULT '773058707',
    cover_url TEXT,
    avatar_url TEXT,
    description TEXT,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    store_id TEXT REFERENCES public.stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    price NUMERIC(12,2) NOT NULL DEFAULT 0,
    original_price NUMERIC(12,2),
    rating NUMERIC(3,2) DEFAULT 4.9,
    reviews_count INT DEFAULT 0,
    image_url TEXT,
    badge TEXT,
    description TEXT,
    in_stock INT DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    city TEXT DEFAULT 'المكلا',
    neighborhood TEXT,
    delivery_address TEXT,
    store_id TEXT,
    store_name TEXT,
    subtotal NUMERIC(12,2) DEFAULT 0,
    shipping_fee NUMERIC(12,2) DEFAULT 1200,
    total_amount NUMERIC(12,2) NOT NULL,
    payment_method TEXT DEFAULT 'كاش عند الاستلام',
    payment_ref TEXT,
    status TEXT DEFAULT 'pending',
    status_label TEXT DEFAULT 'قيد المراجعة والتحضير ⏳',
    items JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on stores" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on orders" ON public.orders FOR SELECT USING (true);
`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlSchemaCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div className="bg-[#0b172a] border border-[#1e3456] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-l from-[#07132b] via-[#0d224d] to-[#07132b]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">إعداد والربط بقاعدة بيانات Supabase</h2>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isSupabaseConnected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {isSupabaseConnected ? 'متصل 🟢' : 'محلي (أوفلاين) ⚪'}
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-0.5">
                ربط سحابي فوري لمزامنة المنتجات، المتاجر، والطلبات في الوقت الفعلي
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/10 bg-[#07132b]/60">
          {[
            { id: 'settings', label: 'إعدادات الاتصال (API)' },
            { id: 'sql', label: 'كود إنشاء الجداول (SQL)' },
            { id: 'guide', label: 'دليل الخطوات السريعة' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs font-bold border-b-2 transition cursor-pointer px-3 ${
                activeTab === tab.id
                  ? 'border-sky-400 text-sky-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-right flex-1 scrollbar-none">
          {/* TAB 1: SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleTestAndSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>رابط مشروع سوبابيز (Project URL)</span>
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>لوحة تحكم Supabase</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://xyzcompany.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full text-xs font-mono p-3 rounded-xl bg-[#12233c] border border-slate-700 focus:border-sky-400 focus:outline-none text-white dir-ltr text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>المفتاح العام (anon public key)</span>
                  <span className="text-slate-400 text-[11px]">من إعدادات المشروع &gt; API</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full text-xs font-mono p-3 rounded-xl bg-[#12233c] border border-slate-700 focus:border-sky-400 focus:outline-none text-white dir-ltr text-left"
                />
              </div>

              {/* Status Alert Box */}
              {statusMessage && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 leading-relaxed ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                      : statusMessage.type === 'info'
                      ? 'bg-sky-500/15 border border-sky-500/30 text-sky-300'
                      : 'bg-red-500/15 border border-red-500/30 text-red-300'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isTesting}
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>جاري فحص الاتصال...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>اختبار وحفظ الاتصال بسوبابيز</span>
                    </>
                  )}
                </button>

                {isSupabaseConnected && (
                  <button
                    type="button"
                    onClick={handleSyncData}
                    disabled={isSyncing}
                    className="py-3 px-5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>جاري الرفع...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>مزامنة البيانات الحالية لسوبابيز</span>
                      </>
                    )}
                  </button>
                )}

                {isSupabaseConnected && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="py-3 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold transition cursor-pointer"
                  >
                    فصل الاتصال
                  </button>
                )}
              </div>
            </form>
          )}

          {/* TAB 2: SQL SCHEMA */}
          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">
                  انسخ هذا الكود والصقه في تبويب <strong>SQL Editor</strong> في لوحة تحكم سوبابيز:
                </span>
                <button
                  onClick={copySqlToClipboard}
                  className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'تم النسخ!' : 'نسخ كود الـ SQL'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl bg-[#07132b] border border-slate-800 p-4 font-mono text-[11px] text-sky-200 max-h-72 overflow-y-auto dir-ltr text-left">
                <pre>{sqlSchemaCode}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: STEP-BY-STEP GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-500 text-black font-bold flex items-center justify-center text-[10px]">1</span>
                  <span>إنشاء مشروع مجاني في Supabase</span>
                </h4>
                <p className="text-slate-400 pr-7">
                  توجه إلى <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-sky-400 underline">supabase.com</a> وسجل دخول، ثم انقر على "New Project" واختر اسم المشروع وكلمة مرور قاعدة البيانات.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-500 text-black font-bold flex items-center justify-center text-[10px]">2</span>
                  <span>إنشاء الجداول بنقرة واحدة</span>
                </h4>
                <p className="text-slate-400 pr-7">
                  اذهب إلى <strong>SQL Editor</strong> في القائمة الجانبية في سوبابيز، انسخ كود الـ SQL من التبويب السابق، ثم اضغط على زر <strong>RUN</strong> الأخضر.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-500 text-black font-bold flex items-center justify-center text-[10px]">3</span>
                  <span>نسخ مفاتيح الـ API</span>
                </h4>
                <p className="text-slate-400 pr-7">
                  من إعدادات المشروع (Project Settings) &gt; (API)، انسخ <strong>Project URL</strong> و <strong>anon public key</strong>، والصقهما هنا واضغط على "اختبار وحفظ الاتصال".
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#07132b]/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>يدعم التخزين المحلي الآمن والمزامنة المباشرة مع سوبابيز</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}


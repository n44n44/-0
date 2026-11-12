import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Building2,
  Copy,
  Check,
  Upload,
  AlertCircle,
  FileText,
  Calendar,
  Phone,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

export default function MerchantPaymentModal({
  isOpen,
  onClose,
  invoice = null,
}) {
  const {
    currentMerchantUser,
    currentMerchantStore,
    platformBankAccounts,
    submitPaymentProof,
  } = usePlatform();

  const activeBanks = (platformBankAccounts || []).filter((b) => b.isActive !== false);

  const [selectedBankId, setSelectedBankId] = useState(() => activeBanks[0]?.id || 'bank-kuraimi');
  const [senderName, setSenderName] = useState(() => currentMerchantUser?.name || '');
  const [senderPhone, setSenderPhone] = useState(() => currentMerchantUser?.phone || '');
  const [transferRef, setTransferRef] = useState('');
  const [transferDate, setTransferDate] = useState(() =>
    new Intl.DateTimeFormat('ar-YE', { dateStyle: 'medium' }).format(new Date())
  );
  const [notes, setNotes] = useState('');
  const [receiptImage, setReceiptImage] = useState(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
  );
  const [copiedField, setCopiedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const selectedBank = activeBanks.find((b) => b.id === selectedBankId) || activeBanks[0];
  const payableAmount = invoice?.amount || 25000;

  const handleCopy = (text, fieldName) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transferRef.trim()) {
      setErrorMessage('يرجى إدخال رقم الحوالة أو الإشعار المصرفي');
      return;
    }
    if (!receiptImage) {
      setErrorMessage('يرجى إرفاق صورة إيصال التحويل');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      submitPaymentProof({
        invoiceId: invoice?.id || `INV-${Date.now()}`,
        amount: payableAmount,
        bankId: selectedBank?.id || 'bank-kuraimi',
        bankName: selectedBank?.name || 'بنك الكريمي',
        senderName: senderName || currentMerchantUser?.name,
        senderPhone: senderPhone || currentMerchantUser?.phone,
        transferRef: transferRef.trim(),
        transferDate,
        receiptImage,
        notes,
      });

      setIsSubmitting(false);
      setSubmittedSuccess(true);
      if (window.confetti) {
        window.confetti({ particleCount: 80, spread: 60 });
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage('حدث خطأ أثناء إرسال الإيصال، يرجى المحاولة مرة أخرى.');
    }
  };

  const handleResetAndClose = () => {
    setSubmittedSuccess(false);
    setTransferRef('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={handleResetAndClose}
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center p-4">
        <div className="inline-block w-full max-w-2xl bg-white rounded-3xl text-right overflow-hidden shadow-2xl transform transition-all border border-slate-100 my-8 relative z-10">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-[#0d1e3d] to-[#172A46] text-white flex items-center justify-between border-b border-sky-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black">سداد الاشتراك عبر الحسابات المصرفية اليمنية</h3>
                <p className="text-[11px] text-sky-200">
                  {currentMerchantStore?.name} • الفاتورة: {invoice?.invoiceNumber || '#INV-1001'}
                </p>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submittedSuccess ? (
            /* Success State */
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <ShieldCheck className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900">
                  تم استلام إيصال التحويل بنجاح!
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  حالة الدفع الحالية: <span className="font-bold text-amber-600">قيد المراجعة والتدقيق ⏳</span>
                  <br />
                  يقوم الفريق المالي بمطابقة كشف الحساب البنكي واعتماد التجديد وتمديد فترة الاشتراك فور التحقق.
                </p>
              </div>

              <div className="bg-[#F3F6FB] p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 max-w-md mx-auto space-y-1 text-right">
                <div className="flex justify-between">
                  <span>المبلغ المحول:</span>
                  <span className="font-bold text-[#172A46] font-mono">{payableAmount.toLocaleString()} ر.ي</span>
                </div>
                <div className="flex justify-between">
                  <span>البنك المحول إليه:</span>
                  <span className="font-bold text-[#172A46]">{selectedBank?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>رقم الإشعار / الحوالة:</span>
                  <span className="font-bold text-sky-600 font-mono">{transferRef}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResetAndClose}
                  className="px-8 py-2.5 rounded-xl bg-[#172A46] hover:bg-[#223d63] text-white font-bold text-xs shadow-md transition"
                >
                  إغلاق ومتابعة لوحة التحكم
                </button>
              </div>
            </div>
          ) : (
            /* Payment Form */
            <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs text-slate-700">
              {/* Due Amount Highlight Card */}
              <div className="rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-500 font-medium block">
                    {invoice?.periodLabel || 'رسوم اشتراك المنصة'} • {invoice?.planName || 'باقة المتجر'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#172A46] font-mono">
                      {payableAmount.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-sky-600">ريال يمني (ر.ي)</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block">تاريخ الاستحقاق:</span>
                  <span className="text-xs font-bold text-[#172A46]">
                    {invoice?.dueDate || 'خلال 7 أيام'}
                  </span>
                </div>
              </div>

              {/* 1. SELECT YEMENI BANK */}
              <div className="space-y-2">
                <label className="font-black text-[#172A46] block text-xs">
                  1. اختر الحساب البنكي المعتمد لمنصة غيم سبيس:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeBanks.map((bank) => {
                    const isSelected = selectedBankId === bank.id;
                    return (
                      <div
                        key={bank.id}
                        onClick={() => setSelectedBankId(bank.id)}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50/60 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-[#172A46] text-xs flex items-center gap-1.5">
                            <Building2 className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                            {bank.name}
                          </span>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-sky-500"></span>}
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate">
                          الفرع: {bank.branch || 'المكلا'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. BANK ACCOUNT DETAILS BOX (Copyable) */}
              {selectedBank && (
                <div className="rounded-2xl bg-slate-900 text-white p-4 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      <span>بيانات التحويل إلى: {selectedBank.name}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      معتمد رسمي
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Account Holder */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 block">اسم صاحب الحساب:</span>
                      <span className="font-bold text-white block">{selectedBank.accountName}</span>
                    </div>

                    {/* Account Number */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 block">رقم الحساب:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-400 text-sm">
                          {selectedBank.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedBank.accountNumber, 'acc')}
                          className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition"
                          title="نسخ رقم الحساب"
                        >
                          {copiedField === 'acc' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* IBAN */}
                    {selectedBank.iban && (
                      <div className="sm:col-span-2 space-y-0.5 pt-1 border-t border-slate-800/80">
                        <span className="text-[10px] text-slate-400 block">رقم الآيبان / مرجع التحويل:</span>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] text-slate-300 select-all">
                            {selectedBank.iban}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(selectedBank.iban, 'iban')}
                            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition"
                          >
                            {copiedField === 'iban' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed pt-1">
                    ℹ️ {selectedBank.instructions}
                  </p>
                </div>
              )}

              {/* 3. SENDER TRANSFER DETAILS */}
              <div className="space-y-3 pt-1">
                <label className="font-black text-[#172A46] block text-xs">
                  2. بيانات الحوالة وإثبات السداد:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">
                      اسم المحوّل (المودع) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="الاسم الكامل كما في سند التحويل"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">
                      رقم هاتف المحوّل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="77xxxxxxx"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">
                      رقم الحوالة / السند / الإشعار <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={transferRef}
                      onChange={(e) => setTransferRef(e.target.value)}
                      placeholder="مثال: KR-902148 أو 889012"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-xs font-mono font-bold text-[#172A46]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">تاريخ التحويل</label>
                    <input
                      type="text"
                      value={transferDate}
                      onChange={(e) => setTransferDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-xs"
                    />
                  </div>
                </div>

                {/* Upload Receipt Image */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] text-slate-600 block font-bold">
                    صورة إيصال التحويل أو لقطة شاشة الإشعار المصرفي <span className="text-red-500">*</span>
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-dashed border-sky-400 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4 text-sky-600" />
                      <span>اختيار صورة الإيصال</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>أو جرب إشعاراً سريعاً:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptImage(
                            'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
                          );
                          setTransferRef(`KR-${Math.floor(100000 + Math.random() * 900000)}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px]"
                      >
                        إيصال تجريبي للكريمي
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail preview */}
                  {receiptImage && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-[#F3F6FB] rounded-xl border border-slate-200">
                      <img
                        src={receiptImage}
                        alt="إيصال التحويل"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-300 shadow-sm"
                      />
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-[#172A46] block">
                          تم إرفاق صورة إيصال التحويل
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold block">
                          جاهز للإرسال والمراجعة
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">
                    ملاحظات إضافية (اختياري)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="أي توضيحات للمشرف المالي"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-xs"
                  />
                </div>
              </div>

              {/* Crucial Security Disclaimer Alert */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-right">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                  <strong>تنبيه أمني هام:</strong> لا يعتبر الاشتراك مدفوعاً بمجرد رفع صورة الإيصال.
                  ستقوم الإدارة المالية بمراجعة الإشعار البنكي ومطابقته بحساب المنصة، وسيتم تمديد اشتراكك
                  واعتماد السداد فور التأكيد.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200 text-center">
                  {errorMessage}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال إيصال التحويل للاعتماد 📤'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


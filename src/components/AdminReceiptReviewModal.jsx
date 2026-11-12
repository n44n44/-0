import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  Phone,
  User,
  AlertTriangle,
  ExternalLink,
  Eye,
} from 'lucide-react';

export default function AdminReceiptReviewModal({
  isOpen,
  onClose,
  payment,
  onApprove,
  onReject,
}) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !payment) return null;

  const handleApprove = () => {
    setIsProcessing(true);
    try {
      onApprove(payment.id);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('يرجى كتابة سبب رفض إثبات الدفع لإشعار التاجر');
      return;
    }
    setIsProcessing(true);
    try {
      onReject(payment.id, rejectionReason.trim());
      setShowRejectInput(false);
      setRejectionReason('');
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center p-4">
        <div className="inline-block w-full max-w-2xl bg-white rounded-3xl text-right overflow-hidden shadow-2xl transform transition-all border border-slate-100 my-8 relative z-10">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-[#0d1e3d] to-[#172A46] text-white flex items-center justify-between border-b border-sky-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-400 text-slate-950 flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black">مراجعة وتدقيق إيصال التحويل البنكي</h3>
                <p className="text-[11px] text-sky-200">
                  مرجع العملية: {payment.id} • الفاتورة: {payment.invoiceId}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 text-xs text-slate-700">
            {/* Merchant and Amount Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F3F6FB] border border-slate-200">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block">المتجر والتاجر:</span>
                <h4 className="font-bold text-sm text-[#172A46]">
                  {payment.storeName || 'متجر مسجل'}
                </h4>
                <span className="text-[11px] text-slate-600 block">
                  المرسل: {payment.senderName} ({payment.senderPhone})
                </span>
              </div>

              <div className="space-y-1 sm:text-left">
                <span className="text-[10px] text-slate-400 block">المبلغ المحول:</span>
                <span className="text-xl font-black text-emerald-600 font-mono block">
                  {payment.amount?.toLocaleString()} ر.ي
                </span>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full inline-block">
                  {payment.bankName}
                </span>
              </div>
            </div>

            {/* Transfer Reference Details */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">رقم الحوالة / الإشعار:</span>
                  <span className="font-mono font-bold text-[#172A46] text-xs">
                    {payment.transferRef}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">تاريخ التحويل:</span>
                  <span className="font-bold text-[#172A46]">{payment.transferDate || 'اليوم'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">الحالة الحالية:</span>
                  <span className="font-bold text-amber-600">
                    {payment.status === 'pending_verification' ? 'قيد المراجعة ⏳' : payment.status}
                  </span>
                </div>
              </div>

              {payment.notes && (
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-500">ملاحظات التاجر:</span> {payment.notes}
                </div>
              )}
            </div>

            {/* Receipt Image Preview */}
            <div className="space-y-1.5">
              <span className="font-bold text-xs text-[#172A46] block flex items-center justify-between">
                <span>صورة إيصال التحويل المرفقة:</span>
                <a
                  href={payment.receiptImage}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-600 hover:text-sky-700 font-normal flex items-center gap-1 text-[11px]"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>فتح الصورة بالحجم الكامل</span>
                </a>
              </span>

              <div className="max-h-72 overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-900 flex items-center justify-center p-2 shadow-inner">
                <img
                  src={payment.receiptImage}
                  alt="إيصال التحويل"
                  className="max-h-64 object-contain rounded-lg shadow-md"
                />
              </div>
            </div>

            {/* Rejection Form Input */}
            {showRejectInput && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2 text-right">
                <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>سبب رفض إثبات الدفع (سيظهر للتاجر لتعديله):</span>
                </div>
                <textarea
                  rows="2"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="مثال: رقم الإشعار غير مطابق لكشف الحساب البنكي، أو المبلغ المحول ناقص..."
                  className="w-full p-2.5 rounded-xl border border-red-300 text-xs focus:ring-2 focus:ring-red-400 focus:outline-none"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowRejectInput(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleReject}
                    className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm"
                  >
                    تأكيد الرفض وإشعار التاجر
                  </button>
                </div>
              </div>
            )}

            {/* Actions Bar */}
            {!showRejectInput && (
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition"
                >
                  إغلاق
                </button>

                <div className="w-full sm:w-auto flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRejectInput(true)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>رفض الإثبات</span>
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleApprove}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>اعتماد وقبول السداد ✅</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


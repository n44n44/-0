import React, { useState } from 'react';
import {
  X,
  Store,
  CheckCircle,
  Sparkles,
  Building2,
  Phone,
  User,
  Mail,
  Lock,
  Tag,
  FileText,
  Image as ImageIcon,
  MapPin,
  MessageSquare,
  Upload,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import YemeniPhoneInput from './YemeniPhoneInput';
import { validateYemeniPhone } from '../utils/phoneValidation';

export default function SellerModal({ isOpen, onClose, onRegisterSuccess }) {
  const { registerMerchant, categories = [] } = usePlatform();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    storeName: '',
    category: 'صناعات يدوية',
    description: '',
    logo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
    city: 'المكلا',
    neighborhood: '',
    whatsapp: '',
    bankName: 'الكريمي إكسبرس (كريمي جوال)',
    bankAccount: '',
  });

  const [validationError, setValidationError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // Strict 9-digit Yemeni Phone Validation
    const phoneVal = validateYemeniPhone(formData.phone);
    if (!phoneVal.valid) {
      setValidationError(`رقم هاتف التاجر: ${phoneVal.error}`);
      return;
    }

    // Strict WhatsApp Validation if provided
    const wa = formData.whatsapp || formData.phone;
    const waVal = validateYemeniPhone(wa);
    if (!waVal.valid) {
      setValidationError(`رقم الواتساب: ${waVal.error}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = registerMerchant({
        ...formData,
        phone: phoneVal.cleaned,
        whatsapp: waVal.cleaned,
      });

      setSuccessData(result);
    } catch (err) {
      setValidationError('حدث خطأ أثناء حفظ البيانات، يرجى المحاولة ثانية.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishAndGoToDashboard = () => {
    setSuccessData(null);
    onClose();
    if (onRegisterSuccess) {
      onRegisterSuccess(successData);
    }
  };

  const handleImageUpload = (field, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormData((prev) => ({
          ...prev,
          [field]: uploadEvent.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          onClick={onClose}
          className="fixed inset-0 transition-opacity bg-slate-950/75 backdrop-blur-sm"
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-3xl text-right overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-slate-100">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-[#172A46] via-[#1c3355] to-[#172A46] text-white flex items-center justify-between border-b border-sky-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#54B9F2]/20 border border-[#54B9F2]/40 flex items-center justify-center text-[#54B9F2] shadow-sm">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black">انضم كتاجر في غيم سبيس</h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                    30 يوماً مجاناً ✨
                  </span>
                </div>
                <p className="text-xs text-sky-200">
                  سجل متجرك الآن واستمتع بشهر تجريبي مجاني لبيع إبداعاتك وحرفك للأسر في حضرموت واليمن
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Screen */}
          {successData ? (
            <div className="p-8 text-center space-y-5 bg-[#F3F6FB]">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
                <CheckCircle className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-black text-[#172A46]">
                  مرحباً بك في أسرة تجار غيم سبيس! 🎉
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  تم استلام طلب تسجيل متجرك{' '}
                  <strong className="text-slate-900 font-bold">
                    "{formData.storeName}"
                  </strong>{' '}
                  بنجاح، وتفعيل باقة الشهر التجريبي المجاني (30 يوماً).
                </p>
              </div>

              {/* Status Notice Card */}
              <div className="bg-white rounded-2xl p-4 border border-amber-200 text-right space-y-2 shadow-sm max-w-lg mx-auto">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>حالة المتجر: بانتظار المراجعة والاعتماد النهائي من الإدارة</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pr-6">
                  يمكنك الدخول مباشرة إلى لوحة التحكم الخاصة بك للبدء في تجهيز متجرك، وإضافة المنتجات، والصور، والأسعار. ستصبح منتجاتك مرئية للجميع فور اعتماد الإدارة.
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleFinishAndGoToDashboard}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-md transition transform hover:scale-105 inline-flex items-center justify-center gap-2"
                >
                  <span>الانتقال إلى لوحة تحكم متجرك الآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-bold text-xs flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* SECTION 1: التاجر والحساب */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-[#172A46] border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#54B9F2]" />
                  <span>أولاً: بيانات صاحب المتجر أو الحرفي</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      الاسم الكامل للمالك <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="مثال: سالم سعيد باوزير"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#54B9F2] pr-9 text-slate-800 bg-[#F3F6FB]"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <YemeniPhoneInput
                      label="رقم الهاتف اليمني"
                      required={true}
                      value={formData.phone}
                      onChange={(cleaned) => setFormData({ ...formData, phone: cleaned })}
                      id="seller-phone-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#54B9F2] pr-9 text-slate-800 bg-[#F3F6FB]"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      كلمة المرور للدخول <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#54B9F2] pr-9 text-slate-800 bg-[#F3F6FB]"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: المتجر والنشاط */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black text-[#172A46] border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-[#54B9F2]" />
                  <span>ثانياً: تفاصيل المتجر والعلامة التجارية</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      اسم المتجر أو العلامة التجارية <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="مثال: متجر وردة الأناقة"
                        value={formData.storeName}
                        onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#54B9F2] pr-9 text-slate-800 bg-[#F3F6FB]"
                      />
                      <Store className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      التصنيف الرئيسي للنشاط <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#54B9F2] text-slate-800 bg-[#F3F6FB]"
                    >
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="صناعات يدوية">صناعات يدوية وتراثية</option>
                          <option value="أسر منتجة">أسر منتجة ومأكولات</option>
                          <option value="بخور وعطور">بخور وعطور ومخلطات</option>
                          <option value="ديكور وهدايا">ديكور وهدايا وتنسيق</option>
                          <option value="ملابس وأزياء">ملابس وأزياء ومخاوير</option>
                          <option value="حلويات ومخبوزات">حلويات ومخبوزات</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    نبذة ووصف المتجر والمنتجات
                  </label>
                  <textarea
                    rows={2}
                    placeholder="اكتب نبذة تصف هوية متجرك ومنتجاتك وطريقة صناعتها..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#54B9F2] text-slate-800 bg-[#F3F6FB]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      المدينة / المحافظة <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#54B9F2] text-slate-800 bg-[#F3F6FB]"
                    >
                      <option value="المكلا">المكلا - ساحل حضرموت</option>
                      <option value="سيئون">سيئون - وادي حضرموت</option>
                      <option value="الشحر">الشحر - حضرموت</option>
                      <option value="تريم">تريم الغناء - حضرموت</option>
                      <option value="عدن">عدن</option>
                      <option value="صنعاء">صنعاء</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الحي أو المنطقة</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="مثال: حي الورد، الشرج، الديس..."
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#54B9F2] pr-9 text-slate-800 bg-[#F3F6FB]"
                      />
                      <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                    </div>
                  </div>
                </div>

                <div>
                  <YemeniPhoneInput
                    label="رقم الواتساب المعتمد للطلبات (اختياري، إن كان يختلف عن الهاتف)"
                    required={false}
                    value={formData.whatsapp}
                    onChange={(cleaned) => setFormData({ ...formData, whatsapp: cleaned })}
                    placeholder="77xxxxxxx"
                    id="seller-whatsapp-input"
                  />
                </div>
              </div>

              {/* SECTION 3: الحسابات البنكية لاستلام مستحقات المبيعات */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black text-[#172A46] border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#54B9F2]" />
                  <span>ثالثاً: الحساب البنكي لاستلام الأرباح</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      البنك أو الصراف المعتمد لديك <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#54B9F2] text-slate-800 bg-[#F3F6FB]"
                    >
                      <option value="الكريمي إكسبرس (كريمي جوال)">الكريمي إكسبرس (كريمي جوال)</option>
                      <option value="شركة العمقي وإخوانه للصرافة">شركة العمقي وإخوانه للصرافة</option>
                      <option value="بنك القطيبي الإسلامي (بنكي)">بنك القطيبي الإسلامي (بنكي)</option>
                      <option value="شركة بن دول للصرافة">شركة بن دول للصرافة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      رقم الحساب أو المحفظة <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="مثال: 3029182741 أو رقم الهاتف"
                        value={formData.bankAccount}
                        onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#54B9F2] pr-9 text-slate-800 bg-[#F3F6FB] font-mono"
                      />
                      <Building2 className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: الصور والشعار */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black text-[#172A46] border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#54B9F2]" />
                  <span>رابعاً: صور المتجر والشعار</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">شعار المتجر (Logo)</label>
                    <div className="flex items-center gap-3">
                      <img
                        src={formData.logo}
                        alt="Logo Preview"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                      />
                      <label className="flex-1 cursor-pointer py-2 px-3 rounded-xl border border-dashed border-sky-400 bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-bold text-center flex items-center justify-center gap-1.5 transition">
                        <Upload className="w-3.5 h-3.5 text-sky-600" />
                        <span>رفع شعار جديد</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload('logo', e)}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">غلاف المتجر (Cover)</label>
                    <div className="flex items-center gap-3">
                      <img
                        src={formData.cover}
                        alt="Cover Preview"
                        className="w-16 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                      />
                      <label className="flex-1 cursor-pointer py-2 px-3 rounded-xl border border-dashed border-sky-400 bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-bold text-center flex items-center justify-center gap-1.5 transition">
                        <Upload className="w-3.5 h-3.5 text-sky-600" />
                        <span>رفع غلاف المتجر</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload('cover', e)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-md transition flex items-center justify-center gap-2 transform active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'جاري حفظ وتسجيل المتجر...'
                      : 'تسجيل المتجر وبدء الشهر التجريبي المجاني (30 يوماً)'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

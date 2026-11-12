import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Clock,
  CheckCircle,
  Truck,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  Save,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { NEIGHBORHOODS_MUKALLA } from '../data/mockData';
import YemeniPhoneInput from './YemeniPhoneInput';

export default function CustomerProfileModal({
  isOpen,
  onClose,
  onTrackOrder,
}) {
  const {
    customerUser,
    updateCustomerProfile,
    addCustomerAddress,
    deleteCustomerAddress,
    logoutCustomer,
    orders,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'addresses'

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: customerUser?.name || '',
    phone: customerUser?.phone || '',
    email: customerUser?.email || '',
    city: customerUser?.city || 'المكلا',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // New Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: 'المنزل',
    neighborhood: NEIGHBORHOODS_MUKALLA[0].name,
    street: '',
    phone: customerUser?.phone || '',
  });

  if (!isOpen || !customerUser) return null;

  // Filter orders made by this customer
  const customerOrders = orders.filter(
    (o) =>
      o.customerName === customerUser.name ||
      o.phone === customerUser.phone ||
      o.id.startsWith('GS-')
  );

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateCustomerProfile(profileForm);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.street.trim()) {
      alert('يرجى إدخال اسم الشارع أو المعلم البارز.');
      return;
    }
    addCustomerAddress(newAddress);
    setShowAddAddress(false);
    setNewAddress({
      title: 'المنزل',
      neighborhood: NEIGHBORHOODS_MUKALLA[0].name,
      street: '',
      phone: customerUser?.phone || '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#172A46] p-6 text-white flex items-center justify-between border-b border-[#24416a] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#54B9F2]/20 border border-[#54B9F2]/40 flex items-center justify-center text-[#54B9F2] text-xl font-black">
              {customerUser.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">{customerUser.name}</h3>
              <p className="text-xs text-sky-200 flex items-center gap-2 mt-0.5">
                <span>{customerUser.phone}</span>
                <span>•</span>
                <span>حضرموت - {customerUser.city}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logoutCustomer();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 text-xs font-bold transition flex items-center gap-1"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-3 transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'orders'
                ? 'border-[#54B9F2] text-[#172A46]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4 text-[#54B9F2]" />
            <span>طلباتي ({customerOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 px-3 transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'addresses'
                ? 'border-[#54B9F2] text-[#172A46]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#54B9F2]" />
            <span>عناوين التوصيل ({customerUser.addresses?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3 transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'profile'
                ? 'border-[#54B9F2] text-[#172A46]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4 text-[#54B9F2]" />
            <span>بيانات الحساب</span>
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {customerOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Package className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="text-sm font-bold text-slate-600">لا توجد طلبات سابقة حتى الآن</p>
                  <p className="text-xs">تصفح المنتجات الحرفية وأضفها إلى سلتك لإتمام أول طلب.</p>
                </div>
              ) : (
                customerOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:border-[#54B9F2] transition space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                      <div>
                        <span className="text-xs font-mono font-black text-[#172A46]">
                          {order.id}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{order.date} • {order.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-sky-100 text-[#172A46] text-[11px] font-bold">
                          {order.statusLabel}
                        </span>
                        <button
                          onClick={() => {
                            onClose();
                            if (onTrackOrder) onTrackOrder(order);
                          }}
                          className="px-3 py-1 rounded-xl bg-[#172A46] hover:bg-[#54B9F2] hover:text-[#172A46] text-white text-[11px] font-bold transition flex items-center gap-1"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>تتبع الشحنة</span>
                        </button>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-1.5">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-slate-700">
                            {item.name} × {item.quantity || 1}
                          </span>
                          <span className="font-bold text-slate-900 font-mono">
                            {(item.price * (item.quantity || 1)).toLocaleString()} ر.ي
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total & Payment */}
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        طريقة الدفع: <strong className="text-slate-800">{order.paymentMethod}</strong>
                      </span>
                      <div className="text-left font-black text-sm text-[#172A46]">
                        الإجمالي: <span className="text-[#54B9F2] font-mono">{order.total?.toLocaleString()} ر.ي</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  العناوين المسجلة للتوصيل السريع بالمكلا
                </span>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="px-3 py-1.5 rounded-xl bg-[#172A46] hover:bg-[#24416a] text-white text-xs font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-[#54B9F2]" />
                  <span>إضافة عنوان جديد</span>
                </button>
              </div>

              {/* Add Address Form */}
              {showAddAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="p-4 rounded-2xl bg-[#F3F6FB] border border-[#54B9F2]/40 space-y-3 text-xs animate-fadeIn"
                >
                  <h4 className="font-bold text-[#172A46]">إضافة عنوان توصيل جديد</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">اسم العنوان (تسمية)</label>
                      <input
                        type="text"
                        required
                        value={newAddress.title}
                        onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                        placeholder="مثال: البيت، المكتب، بيت الأهل"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#54B9F2]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">الحي / المنطقة بالمكلا</label>
                      <select
                        value={newAddress.neighborhood}
                        onChange={(e) => setNewAddress({ ...newAddress, neighborhood: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#54B9F2]"
                      >
                        {NEIGHBORHOODS_MUKALLA.map((n) => (
                          <option key={n.name} value={n.name}>
                            {n.name} ({n.fee} ر.ي توصيل)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">الشارع أو المعلم البارز</label>
                      <input
                        type="text"
                        required
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        placeholder="مثال: بجانب فندق البستان، عمارة الأمل، الدور الثاني"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#54B9F2]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#54B9F2] text-[#172A46] font-bold hover:bg-sky-400 transition"
                    >
                      حفظ العنوان
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Addresses List */}
              <div className="space-y-2.5">
                {(customerUser.addresses || []).map((addr) => (
                  <div
                    key={addr.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-[#54B9F2] transition flex items-center justify-between text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#54B9F2] shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900">{addr.title}</strong>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                              افتراضي
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 mt-0.5">
                          {addr.neighborhood} - {addr.street}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteCustomerAddress(addr.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                      title="حذف العنوان"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#54B9F2]"
                  />
                </div>

                <YemeniPhoneInput
                  label="رقم الهاتف (واتساب)"
                  required={true}
                  value={profileForm.phone}
                  onChange={(cleaned) => setProfileForm({ ...profileForm, phone: cleaned })}
                  id="customer-profile-phone-input"
                />

                <div>
                  <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#54B9F2]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">المدينة</label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#54B9F2]"
                  />
                </div>
              </div>

              {profileSaved && (
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-1.5 font-bold animate-fadeIn">
                  <CheckCircle className="w-4 h-4" />
                  <span>تم حفظ وتحديث بيانات حسابك بنجاح!</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#54B9F2] hover:bg-sky-400 text-[#172A46] font-black text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


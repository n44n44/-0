import React, { useState } from 'react';
import { Star, MessageSquare, X, CheckCircle, ThumbsUp, Sparkles, MapPin, Heart } from 'lucide-react';

export default function PlatformReviewModal({ isOpen, onClose }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [location, setLocation] = useState('المكلا - الديس');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Initial authentic customer reviews for Ghaym Space platform
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      name: 'فاطمة باوزير',
      location: 'المكلا - فوه',
      rating: 5,
      date: 'منذ يومين',
      comment: 'أفضل منصة تسوق في حضرموت! دعم حقيقي للأسر المنتجة وسرعة توصيل خيالية، المنتجات وصلت مغلفة بكل عناية وإتقان 🤍',
      likes: 24,
    },
    {
      id: 'rev-2',
      name: 'عبدالله بن مهري',
      location: 'المكلا - الشرج',
      rating: 5,
      date: 'منذ 4 أيام',
      comment: 'البخور والعود الدوعني من متجر بخور وعطور المكلا كان فخم جداً. تجربة دفع سهلة عبر محفظة جوالي وتتبع دقيق للمندوب.',
      likes: 19,
    },
    {
      id: 'rev-3',
      name: 'نور سالمين',
      location: 'المكلا - المساكن',
      rating: 5,
      date: 'منذ أسبوع',
      comment: 'فخورة بوجود منصة يمنية بهذا المستوى الراقي والتصميم الأنيق. وفرت علينا عناء البحث عن الحرفيات والمشاريع المنزلية.',
      likes: 31,
    },
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim() || !authorName.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      name: authorName.trim(),
      location,
      rating,
      date: 'الآن',
      comment: comment.trim(),
      likes: 1,
    };

    setReviews([newRev, ...reviews]);
    setSubmitted(true);

    if (window.confetti) {
      window.confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    setTimeout(() => {
      setSubmitted(false);
      setComment('');
      setAuthorName('');
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07132B]/80 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#07132B] to-[#122245] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 left-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAB839]/20 border border-[#EAB839]/40 flex items-center justify-center text-[#EAB839]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">تقييم منصة غيم سبيس</h3>
              <p className="text-xs text-sky-200 mt-0.5">آراء وانطباعات مجتمع حضرموت في منصتنا</p>
            </div>
          </div>

          {/* Platform Rating Overview Score */}
          <div className="mt-5 grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
            <div>
              <div className="text-2xl font-black text-[#EAB839] flex items-center justify-center gap-1">
                <span>4.9</span>
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div className="text-[11px] text-gray-300">التقييم العام (1,480+ تقييم)</div>
            </div>
            <div className="border-r border-l border-white/10">
              <div className="text-2xl font-black text-sky-400">99%</div>
              <div className="text-[11px] text-gray-300">رضا عن جودة الحرفيين</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">98%</div>
              <div className="text-[11px] text-gray-300">سرعة التوصيل بالمكلا</div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Add Review Form */}
          <div className="bg-[#F8FAFC] border border-sky-100 rounded-2xl p-4">
            <h4 className="text-sm font-bold text-[#07132B] mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#38BDF8]" />
              <span>شاركينا تجربتك ورأيك في المنصة:</span>
            </h4>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h5 className="font-bold text-sm">شكراً جزيلاً لتقييمك الراقي! ✨</h5>
                  <p className="text-xs text-emerald-700">رأيك يسهم في تطوير ودعم أسر وحرفيي غيم سبيس.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Star Picker */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 font-semibold">تقييمك:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-2xl transition hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            (hoverRating || rating) >= star
                              ? 'text-[#EAB839] fill-[#EAB839]'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#EAB839] mr-2">
                    {rating === 5 ? 'ممتاز جدًا ★★★★★' : `${rating} نجوم`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="اسمك الكريم / اللقب"
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
                  />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] bg-white"
                  >
                    <option value="المكلا - الديس">المكلا - الديس</option>
                    <option value="المكلا - فوه">المكلا - فوه</option>
                    <option value="المكلا - الشرج">المكلا - الشرج</option>
                    <option value="المكلا - الريان">المكلا - الريان</option>
                    <option value="المكلا - المساكن">المكلا - المساكن</option>
                    <option value="المكلا - روكب">المكلا - روكب</option>
                  </select>
                </div>

                <textarea
                  rows="2"
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="اكتبي رأيك بكل صراحة في المنتجات، التوصيل، أو تعامل المتاجر..."
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
                ></textarea>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#07132B] hover:bg-[#122245] text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>نشر التقييم</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#EAB839]" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Testimonials List */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#07132B]">أحدث تقييمات العملاء والزبائن:</h4>
            {reviews.map((rev) => (
              <div key={rev.id} className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#38BDF8] to-[#07132B] text-white flex items-center justify-center font-bold text-xs">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#07132B]">{rev.name}</div>
                      <div className="text-[10px] text-gray-400 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-[#38BDF8]" />
                        <span>{rev.location}</span>
                        <span>•</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex text-[#EAB839]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>

                <div className="flex items-center justify-end text-[10px] text-gray-400 gap-1">
                  <ThumbsUp className="w-3 h-3 text-[#38BDF8]" />
                  <span>مفيد ({rev.likes})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1 text-[#07132B] font-bold">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>معاً لدعم وتمكين الأسر المنتجة بحضرموت</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}


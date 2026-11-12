-- ==============================================================
-- ☁️ GHAYM SPACE (منصة غيم سبيس) - SUPABASE MASTER DATABASE SCHEMA
-- ==============================================================
-- المشروع: https://cwefmpzazvwtdnhxvnif.supabase.co
-- تعليمات: انسخ هذا الكود بالكامل وافتحه في SQL Editor في سوبابيز واضغط (RUN)
-- ==============================================================

-- 1. جدول التصنيفات والأقسام (Categories)
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    is_visible BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. جدول المتاجر والبوتيكات (Stores) مع تمييز المتاجر النموذجية (is_demo)
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
    is_demo BOOLEAN DEFAULT true, -- علامة المتاجر النموذجية لحذفها عند الإطلاق
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. جدول المنتجات (Products) مع تمييز المنتجات النموذجية (is_demo)
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
    is_demo BOOLEAN DEFAULT true, -- علامة المنتجات النموذجية لحذفها عند الإطلاق
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. جدول الطلبات وسلات المشتريات (Orders)
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

-- 5. جدول ملفات المستخدمين والتجار (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT DEFAULT 'customer',
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    city TEXT DEFAULT 'المكلا',
    store_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================
-- 🔐 صلاحيات الأمان (Row Level Security - RLS)
-- ==============================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- حذف أي سياسات سابقة لتجنب التكرار
DROP POLICY IF EXISTS "Allow public read on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public read on stores" ON public.stores;
DROP POLICY IF EXISTS "Allow public read on products" ON public.products;
DROP POLICY IF EXISTS "Allow public read on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public all on stores" ON public.stores;
DROP POLICY IF EXISTS "Allow public all on products" ON public.products;

-- تفعيل سياسات القراءة والكتابة
CREATE POLICY "Allow public read on categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public all on categories" ON public.categories FOR ALL USING (true);

CREATE POLICY "Allow public read on stores" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Allow public all on stores" ON public.stores FOR ALL USING (true);

CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public all on products" ON public.products FOR ALL USING (true);

CREATE POLICY "Allow public read on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public all on orders" ON public.orders FOR ALL USING (true);

CREATE POLICY "Allow public read on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public all on profiles" ON public.profiles FOR ALL USING (true);

-- ==============================================================
-- 📦 إدخال كافة التصنيفات (Categories)
-- ==============================================================
INSERT INTO public.categories (id, name, description, icon, sort_order) VALUES
('decor', 'ديكور وهدايا', 'تحف كونكريت وإطارات خشبية وهدايا تذكارية مصممة يدوياً', 'vase', 1),
('pottery', 'صناعات يدوية', 'فخاريات تريم، مشغولات سف النخيل، وخزف حضرمي تقليدي', 'pottery', 2),
('fashion', 'ملابس وأزياء', 'مخاوير حضرمية مطرزة، عبايات راقية، وأثواب يمنية أصيلة', 'shirt', 3),
('kitchen', 'أسر منتجة', 'مأكولات شعبية، بهارات مكلاوية معتقة، وطبخ منزلي طازج', 'cooking', 4),
('incense', 'بخور وعطور', 'أجود أنواع البخور المكلاوي المسقى واللبان الحوجري ودهن العود', 'flame', 5),
('sweets', 'حلويات ومخبوزات', 'حلوى مكلاوية حمراء، معجنات منزلية، وبسكويت التمور', 'cupcake', 6)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- ==============================================================
-- 🏪 إدخال كافة متاجر المنصة الـ 10 (Stores)
-- ==============================================================
INSERT INTO public.stores (id, name, category, rating, reviews_count, location, phone, description, is_verified, is_demo) VALUES
('store-1', 'متجر غيم الهدايا والديكور', 'هدايا وديكور', 4.9, 142, 'حضرموت، المكلا - فوه', '773058707', 'متجر متخصص بالتحف اليدوية والشموع المعطرة وديكورات المنازل الفاخرة.', true, true),
('store-2', 'بخور وعطور المكلا', 'بخور وعطور', 4.9, 219, 'حضرموت، المكلا - الشرج', '773058707', 'أعرق خلطات البخور المكلاوي والعود ودهن المسك واللبان الحوجري.', true, true),
('store-3', 'بخور وعطور المكلا (الفرع الذهبي)', 'بخور وعطور', 4.9, 178, 'حضرموت، المكلا - الكورنيش', '773058707', 'مخلطات دهن العود المعتق واللبان الحضرمي الفاخر والعطور الشرقية.', true, true),
('store-4', 'سمر المكلا للحرف اليدوية', 'صناعات يدوية', 4.9, 96, 'حضرموت، المكلا - حي السلام', '773058707', 'هدايا تذكارية وحرف حضرمية ومشغولات خوص وتطريز يدوي متقن.', true, true),
('store-jaziza', 'متجر جازيزا (JAZIZA)', 'حلويات ومخبوزات', 4.9, 128, 'حضرموت، المكلا - حي السلام', '773058707', 'متجر متخصص في إعداد أرقى أنواع الكيك المنزلي، الحلويات وتنسيق هدايا المناسبات.', true, true),
('store-samar', 'سمر المكلا للأزياء التراثية', 'ملابس وأزياء', 4.9, 87, 'حضرموت، المكلا - الديس', '773058707', 'خياطة وتطريز أرقى المخاوير والجلابيات والعبايات الحضرمية الأصيلة.', true, true),
('store-5', 'سر المنتجات المنزلية', 'أسر منتجة', 4.7, 42, 'حضرموت - سيئون', '773058707', 'مأكولات وحلويات منزلية شهية ومخبوزات طازجة تعد يومياً بحب وإتقان.', true, true),
('store-6', 'إبداعات يدوية', 'صناعات يدوية', 4.9, 76, 'حضرموت - الشحر', '773058707', 'تحف خشبية وفخاريات تريمية أصيلة مصنوعة بأيدي حرفيات ماهرات.', true, true),
('store-7', 'مطبخ حضرموت المنزلي', 'أسر منتجة', 4.9, 150, 'حضرموت، المكلا - بويش', '773058707', 'طبخ حضرمي منزلي وأطباق تراثية ومعجنات وبهارات مكلاوية معتقة.', true, true),
('store-8', 'لمسات حريرية للأزياء', 'ملابس وأزياء', 4.8, 68, 'حضرموت، المكلا - حي الورد', '773058707', 'أرقى المخاوير والفساتين المطرزة يدوياً بخيوط القصب والحرير الطبيعي.', true, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, is_demo = EXCLUDED.is_demo;

-- ==============================================================
-- 🛍️ إدخال كافة منتجات المنصة الـ 16 (Products)
-- ==============================================================
INSERT INTO public.products (id, store_id, name, category, price, original_price, rating, reviews_count, badge, description, in_stock, is_demo) VALUES
-- منتجات متجر غيم للديكور
('prod-bags-home', 'store-1', 'حقائب يمنية قماشية وتطريز حضرمي', 'صناعات يدوية', 24000, 30000, 4.9, 84, 'تراث أصيل', 'حقيبة قماشية تراثية مصنوعة يدوياً من القطن الطبيعي وتطريز حضرمي أصيل مناسبة للإهداء والاستخدام اليومي الفاخر.', 14, true),
('prod-3', 'store-1', 'شموع معطرة معملية', 'ديكور وهدايا', 24000, 26000, 4.9, 29, 'زيوت طبيعية', 'شموع صويا طبيعية 100% معطرة بخلاصة اللبان الحوجري الحضرمي واللافندر وخشب الصندل، مسكوبة في كؤوس أنيقة.', 22, true),
('prod-concrete-home', 'store-1', 'أواني وتشكيلات كونكريت رخامية', 'ديكور وهدايا', 15000, 19000, 4.8, 45, 'تصميم حديث', 'أواني وديكورات كونكريت عصرية بتأثير رخامي مدمجة بلمسات من الذهب والنحاس لإضفاء لمسة جمالية راقية على منزلك.', 12, true),

-- منتجات بخور وعطور المكلا
('prod-burner-home', 'store-2', 'مباخر بتطريز تقليدي وفخامة البخور', 'بخور وعطور', 18500, 22000, 4.9, 92, 'الأكثر طلباً', 'مبخرة فخارية حضرمية مصنوعة بأيدي حرفيين محليين مع نقوش تراثية يدوية وتفاصيل دقيقة تجسد أصالة حضرموت.', 18, true),
('prod-5', 'store-2', 'بخور مكلاوي ملكي مسقى بالعود والمسك', 'بخور وعطور', 18000, 22000, 5.0, 64, 'مكلاوي أصيل', 'دقة بخور مكلاوي منزلي معتق بدهن العود الكمبودي ومسك الغزال وماء الورد والزعفران، برائحة تدوم لأيام.', 20, true),

-- منتجات متجر جازيزا للكيك والحلويات والهدايا
('prod-cake-jaziza', 'store-jaziza', 'كيكة الفراولة والشوكولاتة الملكية', 'حلويات ومخبوزات', 18000, 22000, 4.9, 120, 'طازج يومياً', 'كيكة احتفالية فاخرة بالفراولة الطازجة والشوكولاتة البلجيكية الغنية، محضرة يدوياً يوم التوصيل من متجر جازيزا بالمكلا.', 15, true),
('jaz-1', 'store-jaziza', 'كيكة الشوكولاتة الفاخرة', 'حلويات ومخبوزات', 18000, 21000, 4.9, 88, 'الأكثر مبيعاً', 'كيكة الشوكولاتة الفاخرة بطبقات الشوكولاتة البلجيكية الغنية مع كريمة الفدج الناعمة والتزيين اليدوي الراقي.', 10, true),
('jaz-2', 'store-jaziza', 'كب كيك ميني باستيل (12 قطعة)', 'حلويات ومخبوزات', 8500, 10000, 4.8, 54, 'جديد', 'تشكيلة ميني كب كيك باستيل هشة محضرة طازجة من الفانيليا والرد فيلفت مع لمسات كريمة ملونة لجميع الاحتفالات.', 25, true),
('jaz-3', 'store-jaziza', 'كيكة الفراولة والكريمة الملكية', 'حلويات ومخبوزات', 22000, 26000, 5.0, 73, 'مميز', 'كيكة الفراولة الطازجة المحشوة بطبقات الكريمة المخفوقة وقطع الفراولة الطبيعية مع جليز لامع وفاخر.', 8, true),
('jaz-4', 'store-jaziza', 'كيكة عيد ميلاد مميزة مع التزيين', 'حلويات ومخبوزات', 25000, 30000, 4.9, 110, 'حسب الطلب', 'كيكة عيد ميلاد مصممة ومزينة حسب الطلب بدقة متناهية مع مجسمات كرتونية وشريط ساتان فاخر يدوي الصنع.', 12, true),
('jaz-5', 'store-jaziza', 'باقة ورد وردية فاخرة للإهداء', 'هدايا وتغليف', 15000, 18000, 4.8, 49, 'إهداء', 'باقة ورد طبيعي جوري وردي منسقة يدوياً مع ورق تغليف كرافت فاخر وشريط حريري متناسق للإهداء الراقي.', 16, true),
('jaz-6', 'store-jaziza', 'دب لطيف مع بالونات وتغليف إهداء', 'هدايا وتغليف', 12000, 14000, 4.9, 38, 'إهداء', 'دمية دب قطنية فائقة النعومة مع بالونات هيليوم وكرت إهداء أنيق بتغليف شفاف لجميع المناسبات السعيدة.', 20, true),

-- منتجات الحرف اليدوية والأزياء
('prod-6', 'store-6', 'فخار يمني أصيل مزخرف بنقوش تريمية', 'صناعات يدوية', 16000, 20000, 4.8, 22, 'صناعة تريم', 'جرار وأوانٍ فخارية من طين حضرموت الأحمر بتشطيب يدوي آمن لحفظ الماء وتبريده بنكهة ترابية عذبة.', 10, true),
('prod-7', 'store-8', 'مخاوير حضرمية حريرية مطرزة يدوياً', 'ملابس وأزياء', 45000, 52000, 4.9, 31, 'تطريز يدوي', 'مخاوير نسائية مصنوعة من أرقى أقمشة الحرير الطبيعي، ومطرزة بخيوط القصب الذهبي والفضة الحضرمية.', 8, true),
('prod-8', 'store-5', 'صندوق حلوى مكلاوية مشكلة فاخرة', 'حلويات ومخبوزات', 15000, 18000, 4.8, 47, 'طازج يومياً', 'تشكيلة حلوى مكلاوية حمراء وبيضاء بالهيل والسمن البلدي والمكسرات، مغلفة بأناقة للهدايا والمناسبات.', 30, true)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    price = EXCLUDED.price, 
    description = EXCLUDED.description,
    is_demo = EXCLUDED.is_demo;

-- ==============================================================
-- 🧹 كيفية حذف المتاجر والمنتجات الوهمية بضغطة زر عند الإطلاق:
-- ==============================================================
-- عندما تطلق المنصة رسمياً وتريد تفريغ المتاجر التجريبية بالكامل لتبدأ مع التجار الحقيقيين،
-- قم بتشغيل هذين السطرين فقط في SQL Editor في سوبابيز:
--
-- DELETE FROM public.products WHERE is_demo = true;
-- DELETE FROM public.stores WHERE is_demo = true;
-- ==============================================================

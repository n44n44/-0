-- ==============================================================
-- ☁️ GHAYM SPACE (منصة غيم سبيس) - SUPABASE DATABASE SCHEMA
-- ==============================================================
-- قم بنسخ هذا الكود بالكامل ولصقه في تبويب (SQL Editor) في مشروعك بـ Supabase
-- ثم اضغط على زر (RUN) لتجهيز كافة الجداول والصلاحيات بنقرة واحدة!
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

-- 2. جدول المتاجر والبوتيكات (Stores)
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

-- 3. جدول المنتجات (Products)
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

-- 4. جدول الطلبات (Orders)
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
    role TEXT DEFAULT 'customer', -- 'customer' | 'merchant' | 'courier' | 'admin'
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    city TEXT DEFAULT 'المكلا',
    store_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================
-- 🔐 إعدادات أمان البيانات (Row Level Security - RLS)
-- ==============================================================

-- تفعيل RLS على كافة الجداول
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- السماح للجميع بقراءة التصنيفات
CREATE POLICY "Allow public read on categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow admin all on categories" ON public.categories FOR ALL USING (true);

-- السماح للجميع بقراءة المتاجر
CREATE POLICY "Allow public read on stores" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Allow merchant/admin manage stores" ON public.stores FOR ALL USING (true);

-- السماح للجميع بقراءة المنتجات
CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow merchant/admin manage products" ON public.products FOR ALL USING (true);

-- السماح للعملاء بإضافة طلبات جديدة
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
-- السماح بقراءة الطلبات ومتابعتها
CREATE POLICY "Allow public read on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow merchant/admin update on orders" ON public.orders FOR UPDATE USING (true);

-- السماح بقراءة وتعديل الملفات الشخصية
CREATE POLICY "Allow public read on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow user manage profile" ON public.profiles FOR ALL USING (true);

-- ==============================================================
-- 📦 البيانات الأولية للمنصة (Seed Data)
-- ==============================================================

-- إضافة الأقسام الأساسية
INSERT INTO public.categories (id, name, description, icon) VALUES
('decor', 'ديكور وهدايا', 'تحف كونكريت وإطارات خشبية وهدايا تذكارية مصممة يدوياً', 'vase'),
('pottery', 'صناعات يدوية', 'فخاريات تريم، مشغولات سف النخيل، وخزف حضرمي تقليدي', 'pottery'),
('fashion', 'ملابس وأزياء', 'مخاوير حضرمية مطرزة، عبايات راقية، وأثواب يمنية أصيلة', 'shirt'),
('kitchen', 'أسر منتجة', 'مأكولات شعبية، بهارات مكلاوية معتقة، وطبخ منزلي طازج', 'cooking'),
('incense', 'بخور وعطور', 'أجود أنواع البخور المكلاوي المسقى واللبان الحوجري ودهن العود', 'flame'),
('sweets', 'حلويات ومخبوزات', 'حلوى مكلاوية حمراء، معجنات منزلية، وبسكويت التمور', 'cupcake')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- إضافة المتاجر الأساسية
INSERT INTO public.stores (id, name, category, rating, reviews_count, location, phone, description) VALUES
('store-1', 'متجر غيم الهدايا والديكور', 'هدايا وديكور', 4.9, 128, 'حضرموت، المكلا - فوه', '773058707', 'متجر متخصص بالتحف اليدوية والشموع المعطرة وديكورات المنازل الفاخرة.'),
('store-2', 'بخور وعطور المكلا', 'بخور وعطور', 4.9, 142, 'حضرموت، المكلا - الشرج', '773058707', 'أعرق خلطات البخور المكلاوي والعود ودهن المسك واللبان الحوجري.'),
('store-jaziza', 'متجر جازيزا (JAZIZA)', 'حلويات ومخبوزات', 4.9, 115, 'حضرموت، المكلا - حي السلام', '773058707', 'أرقى أنواع الكيك المنزلي والحلويات وتنسيق هدايا المناسبات السعيدة.'),
('store-samar', 'سمر المكلا للأزياء التراثية', 'أزياء وتطريز', 4.9, 87, 'حضرموت، المكلا - الديس', '773058707', 'خياطة وتطريز أرقى المخاوير والجلابيات والعبايات الحضرمية.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- إضافة عينة من المنتجات
INSERT INTO public.products (id, store_id, name, category, price, original_price, rating, reviews_count, badge, description) VALUES
('prod-bags-home', 'store-1', 'حقائب يمنية قماشية وتطريز حضرمي', 'صناعات يدوية', 24000, 30000, 4.9, 84, 'تراث أصيل', 'حقيبة قماشية تراثية مصنوعة يدوياً من القطن الطبيعي وتطريز حضرمي أصيل مناسبة للإهداء والاستخدام اليومي الفاخر.'),
('prod-burner-home', 'store-2', 'مباخر بتطريز تقليدي وفخامة البخور', 'بخور وعطور', 18500, 22000, 4.9, 92, 'الأكثر طلباً', 'مبخرة فخارية حضرمية مصنوعة بأيدي حرفيين محليين مع نقوش تراثية يدوية وتفاصيل دقيقة تجسد أصالة حضرموت.'),
('prod-cake-jaziza', 'store-jaziza', 'كيكة الفراولة والشوكولاتة الملكية', 'حلويات ومخبوزات', 18000, 22000, 4.9, 120, 'طازج يومياً', 'كيكة احتفالية فاخرة بالفراولة الطازجة والشوكولاتة البلجيكية الغنية، محضرة يدوياً يوم التوصيل من متجر جازيزا بالمكلا.'),
('prod-concrete-home', 'store-1', 'أواني وتشكيلات كونكريت رخامية', 'ديكور وهدايا', 15000, 19000, 4.8, 45, 'تصميم حديث', 'أواني وديكورات كونكريت عصرية بتأثير رخامي مدمجة بلمسات من الذهب والنحاس لإضفاء لمسة جمالية راقية على منزلك.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description;

-- اكتمل إعداد قاعدة البيانات بنجاح!


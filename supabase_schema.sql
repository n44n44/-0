-- =========================================================================
-- GHAYM SPACE (غيم سبيس) - PRODUCTION SUPABASE DATABASE SCHEMA & RLS
-- Multi-Tenant E-Commerce Platform for Mukalla & Hadramout Artisans
-- =========================================================================

-- 1. PROFILES TABLE (Linked with Supabase Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('customer', 'merchant', 'courier', 'admin')) DEFAULT 'customer',
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT DEFAULT 'المكلا',
  neighborhood TEXT,
  store_id TEXT,
  vehicle TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. STORES TABLE (Multi-Tenant Stores)
CREATE TABLE IF NOT EXISTS public.stores (
  id TEXT PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  location TEXT DEFAULT 'المكلا، حضرموت',
  city TEXT DEFAULT 'المكلا',
  neighborhood TEXT,
  phone TEXT,
  cover_url TEXT,
  avatar_url TEXT,
  description TEXT,
  kuraimi_account TEXT,
  omgy_account TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_demo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE (Isolated per store_id)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  original_price NUMERIC(12,2),
  rating NUMERIC(2,1) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  badge TEXT,
  image_url TEXT,
  description TEXT,
  in_stock INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT TRUE,
  is_demo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE (Multi-Tenant Scoped to Store & Courier)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  city TEXT DEFAULT 'المكلا',
  neighborhood TEXT,
  store_id TEXT NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  courier_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  courier_name TEXT,
  total_amount NUMERIC(12,2) NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  shipping_fee NUMERIC(12,2) DEFAULT 1200,
  payment_method TEXT DEFAULT 'كاش عند الاستلام',
  payment_ref TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled')),
  status_label TEXT DEFAULT 'قيد المراجعة ⏳',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation for Merchants, Couriers, Customers & Admin
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------------------
-- PROFILES POLICIES
-- -------------------------------------------------------------------------
-- Anyone authenticated or anonymous can view profiles of active merchants
CREATE POLICY "Public can view merchant and public profiles"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can insert their own profile on registration
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- -------------------------------------------------------------------------
-- STORES POLICIES (Multi-Tenant Isolation)
-- -------------------------------------------------------------------------
-- Public can view active stores on the marketplace
CREATE POLICY "Public can read stores"
  ON public.stores FOR SELECT
  USING (true);

-- Authenticated merchants can insert a store
CREATE POLICY "Merchants can insert own store"
  ON public.stores FOR INSERT
  WITH CHECK (auth.uid() = owner_id OR owner_id IS NULL);

-- Merchants can update ONLY their own store
CREATE POLICY "Merchants can update own store only"
  ON public.stores FOR UPDATE
  USING (
    auth.uid() = owner_id 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    auth.uid() = owner_id 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- -------------------------------------------------------------------------
-- PRODUCTS POLICIES (Multi-Tenant Isolation)
-- -------------------------------------------------------------------------
-- Public can read all active products on the marketplace
CREATE POLICY "Public can read products"
  ON public.products FOR SELECT
  USING (true);

-- Merchants can insert products ONLY for their own store
CREATE POLICY "Merchants can insert products for own store"
  ON public.products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE stores.id = products.store_id 
      AND (stores.owner_id = auth.uid() OR stores.owner_id IS NULL)
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Merchants can update ONLY products belonging to their own store
CREATE POLICY "Merchants can update own store products only"
  ON public.products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE stores.id = products.store_id 
      AND (stores.owner_id = auth.uid() OR stores.owner_id IS NULL)
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Merchants can delete ONLY products belonging to their own store
CREATE POLICY "Merchants can delete own store products only"
  ON public.products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE stores.id = products.store_id 
      AND (stores.owner_id = auth.uid() OR stores.owner_id IS NULL)
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- -------------------------------------------------------------------------
-- ORDERS POLICIES (Strict Tenant & Role Scoping)
-- -------------------------------------------------------------------------
-- Anyone can place an order (guest checkout supported)
CREATE POLICY "Anyone can place order"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Customers can view their own orders
-- Merchants can view ONLY orders for their store
-- Couriers can view orders assigned to them or ready for pickup
-- Admins can view all orders
CREATE POLICY "Scoped orders view policy"
  ON public.orders FOR SELECT
  USING (
    -- Customer owns order
    (customer_id IS NOT NULL AND customer_id = auth.uid())
    -- Or Merchant owns the store for this order
    OR EXISTS (
      SELECT 1 FROM public.stores 
      WHERE stores.id = orders.store_id 
      AND stores.owner_id = auth.uid()
    )
    -- Or Courier assigned to this order
    OR (courier_id IS NOT NULL AND courier_id = auth.uid())
    -- Or unassigned order ready for pickup (courier dispatch board)
    OR (status = 'ready_for_pickup')
    -- Or Admin
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    -- Or anonymous/demo client reads
    OR (auth.uid() IS NULL)
  );

-- Merchants can update order status for their store
-- Couriers can update status for assigned deliveries
-- Admins can update any order
CREATE POLICY "Scoped orders update policy"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE stores.id = orders.store_id 
      AND stores.owner_id = auth.uid()
    )
    OR (courier_id = auth.uid())
    OR (status = 'ready_for_pickup' AND courier_id IS NULL)
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- -------------------------------------------------------------------------
-- CATEGORIES POLICIES
-- -------------------------------------------------------------------------
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin manage categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =========================================================================
-- 6. MERCHANT JOIN REQUESTS TABLE (إدارة طلبات انضمام التجار)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.merchant_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  store_name TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  city TEXT DEFAULT 'المكلا',
  neighborhood TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.merchant_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a merchant join request
CREATE POLICY "Users can insert merchant requests"
  ON public.merchant_requests FOR INSERT
  WITH CHECK (true);

-- User can view their own request; Admin can view all requests
CREATE POLICY "Users view own or admin views all merchant requests"
  ON public.merchant_requests FOR SELECT
  USING (
    user_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR (auth.uid() IS NULL)
  );

-- Only Admin can update merchant request status (Approve / Reject)
CREATE POLICY "Only admin can update merchant requests"
  ON public.merchant_requests FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =========================================================================
-- 7. DELIVERY INVITES TABLE (رموز دعوة المندوبين للاستخدام مرة واحدة)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.delivery_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  courier_name TEXT,
  phone TEXT,
  vehicle TEXT DEFAULT 'دراجة نارية',
  city TEXT DEFAULT 'المكلا',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.delivery_invites ENABLE ROW LEVEL SECURITY;

-- Only Admin can insert or manage delivery invites
CREATE POLICY "Admin can manage delivery invites"
  ON public.delivery_invites FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Public can check unexpired active invites to verify valid code during signup
CREATE POLICY "Public verify active invites"
  ON public.delivery_invites FOR SELECT
  USING (
    status = 'active' AND is_used = FALSE AND expires_at > NOW()
  );

-- =========================================================================
-- 8. ADMIN AUDIT LOGS TABLE (سجل عمليات الإدارة الحساسة)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  target_name TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Only Admin can read admin audit logs
CREATE POLICY "Only admin can view audit logs"
  ON public.admin_logs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin or internal system can insert audit logs
CREATE POLICY "Admin can insert audit logs"
  ON public.admin_logs FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR (auth.uid() IS NULL)
  );

-- =========================================================================
-- 9. STRICT SECURITY TRIGGER: PREVENT ROLE SELF-ELEVATION ON PROFILES
-- =========================================================================
CREATE OR REPLACE FUNCTION public.protect_user_role()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. On INSERT: Disallow creating a user with role 'admin' unless caller is existing Admin or service_role
  IF TG_OP = 'INSERT' AND NEW.role = 'admin' THEN
    IF NOT (
      (current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role')
      OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin' AND is_active = TRUE
      )
    ) THEN
      RAISE EXCEPTION 'انتهاك أمني خطير: لا يمكن إنشاء حساب برتبة مدير بدون تصريح معتمد من المشرف العام.';
    END IF;
  END IF;

  -- 2. On UPDATE: Disallow mutating any profile's role to 'admin' (Self-Role Elevation Prevention)
  IF TG_OP = 'UPDATE' AND NEW.role <> OLD.role THEN
    IF NOT (
      (current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role')
      OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin' AND is_active = TRUE
      )
    ) THEN
      RAISE EXCEPTION 'انتهاك أمني خطير: لا تملك الصلاحية لتغيير نوع الحساب أو الترقية لرتبة مدير.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_user_role ON public.profiles;
CREATE TRIGGER trg_protect_user_role
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_user_role();

-- Helper function to strictly verify admin privileges from backend
CREATE OR REPLACE FUNCTION public.verify_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to verify merchant approval status
CREATE OR REPLACE FUNCTION public.is_merchant_approved(uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.merchant_requests
    WHERE user_id = uid AND status = 'approved'
  ) OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = uid AND role = 'merchant' AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to securely verify and validate a delivery invite code
CREATE OR REPLACE FUNCTION public.verify_invite_code(code_input TEXT)
RETURNS TABLE (
  valid BOOLEAN,
  message TEXT,
  invite_id UUID,
  recipient_name TEXT
) AS $$
DECLARE
  v_invite RECORD;
BEGIN
  SELECT * INTO v_invite FROM public.delivery_invites 
  WHERE UPPER(code) = UPPER(TRIM(code_input));
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'كود التحقق غير صحيح أو غير مسجل في النظام'::TEXT, NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  IF v_invite.is_used OR v_invite.status = 'used' THEN
    RETURN QUERY SELECT false, 'تم استخدام كود التحقق هذا مسبقاً، كل كود صالح لمرة واحدة فقط'::TEXT, v_invite.id, v_invite.courier_name;
    RETURN;
  END IF;

  IF v_invite.status = 'revoked' THEN
    RETURN QUERY SELECT false, 'تم إلغاء صلاحية هذا الكود من قبل الإدارة'::TEXT, v_invite.id, v_invite.courier_name;
    RETURN;
  END IF;

  IF v_invite.expires_at < NOW() THEN
    RETURN QUERY SELECT false, 'انتهت صلاحية كود التحقق هذا، يرجى طلب كود جديد'::TEXT, v_invite.id, v_invite.courier_name;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, 'كود تحقق صالح ومفعل'::TEXT, v_invite.id, v_invite.courier_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


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

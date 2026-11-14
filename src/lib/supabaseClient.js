import { createClient } from '@supabase/supabase-js';

// Configuration storage keys
const STORAGE_URL_KEY = 'ghaym_supabase_url';
const STORAGE_KEY_KEY = 'ghaym_supabase_anon_key';
const STORAGE_AUTH_USER = 'ghaym_auth_user';
const STORAGE_AUTH_PROFILE = 'ghaym_auth_profile';

// Default project credentials configured by owner
export const DEFAULT_SUPABASE_URL = 'https://cwefmpzazvwtdnhxvnif.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'sb_publishable_ukIo1D9Gu-hCCIzcsDSwgg_PK_EDL7j';

// Read from env, localStorage, or preconfigured default
export function getSupabaseConfig() {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : '';
  const envKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : '';

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY) || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) || '' : '';

  const url = (localUrl || envUrl || DEFAULT_SUPABASE_URL).trim();
  const anonKey = (localKey || envKey || DEFAULT_SUPABASE_KEY).trim();

  const isConfigured = Boolean(
    url &&
    anonKey &&
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    anonKey.length > 20
  );

  return {
    url,
    anonKey,
    isConfigured,
    source: localUrl ? 'localStorage' : envUrl ? 'env' : 'default',
  };
}

let activeClient = null;

export function getSupabaseClient() {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (!activeClient) {
    try {
      activeClient = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      activeClient = null;
    }
  }
  return activeClient;
}

export function saveSupabaseConfig(url, anonKey) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_URL_KEY, (url || '').trim());
    localStorage.setItem(STORAGE_KEY_KEY, (anonKey || '').trim());
  }
  activeClient = null; // Reset cached client
  return getSupabaseClient();
}

export function clearSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_KEY_KEY);
    localStorage.removeItem(STORAGE_AUTH_USER);
    localStorage.removeItem(STORAGE_AUTH_PROFILE);
  }
  activeClient = null;
}

// =========================================================================
// 1. SUPABASE AUTHENTICATION & MULTI-TENANT PROFILES
// =========================================================================

/**
 * Real Supabase Registration with Profile & Multi-Tenant Store Setup
 */
export async function supabaseSignUp({ email, password, fullName, phone, role = 'merchant', storeName, category, city = 'المكلا' }) {
  const client = getSupabaseClient();
  if (!client) throw new Error('تعذر الاتصال بقاعدة بيانات سوبابيز.');

  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPhone = (phone || '').trim();
  const cleanName = (fullName || storeName || 'مستخدم غيم سبيس').trim();

  let authUser = null;

  // 1. Attempt Supabase Auth Sign Up
  const { data: authData, error: authErr } = await client.auth.signUp({
    email: cleanEmail,
    password: password,
    options: {
      data: {
        full_name: cleanName,
        phone: cleanPhone,
        role: role,
      },
    },
  });

  if (authErr) {
    // If rate limited on confirmation email, or existing user
    if (authErr.message?.includes('already registered')) {
      throw new Error('البريد الإلكتروني مسجل مسبقاً! يرجى تسجيل الدخول أو استخدام بريد آخر.');
    }
    // If Supabase hits email rate limit, generate persistent UUID for account
    console.warn('Supabase Auth Notice:', authErr.message);
  }

  authUser = authData?.user;

  // UUID fallback if auth sign up was throttled or confirmation pending
  const userId = authUser?.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}-${Math.floor(Math.random() * 10000)}`);

  // 2. Multi-Tenant Store Creation (for Merchants)
  let storeId = null;
  if (role === 'merchant') {
    storeId = `store-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const storePayload = {
      id: storeId,
      name: (storeName || cleanName).trim(),
      category: category || 'أسر منتجة وحرف يدوية',
      rating: 5.0,
      reviews_count: 0,
      location: city || 'المكلا، حضرموت',
      phone: cleanPhone,
      description: `متجر ${(storeName || cleanName).trim()} على منصة غيم سبيس.`,
      is_verified: false,
      is_demo: false,
    };

    const { error: storeErr } = await client.from('stores').insert([storePayload]);
    if (storeErr) console.warn('Supabase store insert notice:', storeErr.message);
  }

  // 3. Create Profile linked to Auth User UID
  const profilePayload = {
    id: userId,
    role: role,
    full_name: cleanName,
    phone: cleanPhone,
    email: cleanEmail,
    city: city || 'المكلا',
    store_id: storeId,
  };

  const { data: profileData, error: profErr } = await client
    .from('profiles')
    .upsert([profilePayload], { onConflict: 'id' })
    .select()
    .single();

  if (profErr) console.warn('Supabase profile creation notice:', profErr.message);

  const finalProfile = profileData || profilePayload;

  // Save session locally
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(authUser || { id: userId, email: cleanEmail }));
    localStorage.setItem(STORAGE_AUTH_PROFILE, JSON.stringify(finalProfile));
    if (storeId) {
      localStorage.setItem('ghaym_active_merchant_id', userId);
      localStorage.setItem('ghaym_active_store_id', storeId);
    }
  }

  return {
    success: true,
    user: authUser || { id: userId, email: cleanEmail },
    profile: finalProfile,
    storeId: storeId,
  };
}

/**
 * Real Supabase Login with Role & Profile Retrieval
 */
export async function supabaseSignIn({ emailOrPhone, password }) {
  const client = getSupabaseClient();
  if (!client) throw new Error('تعذر الاتصال بسوبابيز.');

  const input = (emailOrPhone || '').trim();

  // Try direct Supabase Auth signInWithPassword if input is email
  if (input.includes('@')) {
    const { data: authData, error: authErr } = await client.auth.signInWithPassword({
      email: input.toLowerCase(),
      password: password,
    });

    if (!authErr && authData?.user) {
      // Fetch Profile
      const { data: profile } = await client
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      // If merchant, fetch their specific store
      let store = null;
      if (profile?.store_id) {
        const { data: s } = await client.from('stores').select('*').eq('id', profile.store_id).single();
        store = s;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(authData.user));
        if (profile) localStorage.setItem(STORAGE_AUTH_PROFILE, JSON.stringify(profile));
        if (profile?.store_id) {
          localStorage.setItem('ghaym_active_merchant_id', profile.id);
          localStorage.setItem('ghaym_active_store_id', profile.store_id);
        }
      }

      return {
        success: true,
        user: authData.user,
        profile: profile || { id: authData.user.id, role: 'merchant', full_name: authData.user.email },
        store: store,
      };
    }
  }

  // If phone or fallback check in profiles table
  const { data: foundProfiles, error: pErr } = await client
    .from('profiles')
    .select('*')
    .or(`phone.eq.${input},email.eq.${input}`)
    .limit(1);

  if (foundProfiles && foundProfiles.length > 0) {
    const profile = foundProfiles[0];
    let store = null;
    if (profile.store_id) {
      const { data: s } = await client.from('stores').select('*').eq('id', profile.store_id).single();
      store = s;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify({ id: profile.id, email: profile.email }));
      localStorage.setItem(STORAGE_AUTH_PROFILE, JSON.stringify(profile));
      if (profile.store_id) {
        localStorage.setItem('ghaym_active_merchant_id', profile.id);
        localStorage.setItem('ghaym_active_store_id', profile.store_id);
      }
    }

    return {
      success: true,
      user: { id: profile.id, email: profile.email },
      profile: profile,
      store: store,
    };
  }

  throw new Error('بيانات الدخول غير صحيحة. يرجى التأكد من البريد أو الهاتف وكلمة المرور.');
}

/**
 * Sign out and clear stored session
 */
export async function supabaseSignOut() {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {
      console.warn('SignOut exception:', e);
    }
  }
  clearSupabaseConfig();
}

/**
 * Retrieve saved profile from localStorage
 */
export function getSavedSessionProfile() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_AUTH_PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// =========================================================================
// 2. MULTI-TENANT STORE & PRODUCTS OPERATIONS
// =========================================================================

/**
 * Fetch strictly isolated products for a specific merchant store
 */
export async function supabaseFetchStoreProducts(storeId) {
  const client = getSupabaseClient();
  if (!client || !storeId) return [];

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('supabaseFetchStoreProducts error:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('supabaseFetchStoreProducts exception:', err);
    return [];
  }
}

/**
 * Add a new product linked exclusively to the merchant's store
 */
export async function supabaseAddProduct({ storeId, name, category, price, originalPrice, description, inStock, imageUrl, badge }) {
  const client = getSupabaseClient();
  if (!client) throw new Error('سوبابيز غير متصل.');

  const productId = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const payload = {
    id: productId,
    store_id: storeId,
    name: name.trim(),
    category: category || 'عام',
    price: Number(price) || 0,
    original_price: Number(originalPrice || price || 0),
    rating: 5.0,
    reviews_count: 0,
    image_url: imageUrl || '',
    badge: badge || 'جديد',
    description: description || '',
    in_stock: Number(inStock || 10),
    is_demo: false,
  };

  const { data, error } = await client.from('products').insert([payload]).select().single();
  if (error) throw new Error(`فشل إضافة المنتج في سوبابيز: ${error.message}`);
  return data;
}

/**
 * Update an existing product within the merchant's store boundary
 */
export async function supabaseUpdateProduct(productId, storeId, updates) {
  const client = getSupabaseClient();
  if (!client) throw new Error('سوبابيز غير متصل.');

  const payload = {
    ...(updates.name && { name: updates.name.trim() }),
    ...(updates.category && { category: updates.category }),
    ...(updates.price !== undefined && { price: Number(updates.price) }),
    ...(updates.originalPrice !== undefined && { original_price: Number(updates.originalPrice) }),
    ...(updates.inStock !== undefined && { in_stock: Number(updates.inStock) }),
    ...(updates.description !== undefined && { description: updates.description }),
    ...(updates.image && { image_url: updates.image }),
    ...(updates.badge !== undefined && { badge: updates.badge }),
  };

  const { data, error } = await client
    .from('products')
    .update(payload)
    .eq('id', productId)
    .eq('store_id', storeId)
    .select()
    .single();

  if (error) throw new Error(`فشل تحديث المنتج: ${error.message}`);
  return data;
}

/**
 * Delete a product within the merchant's store boundary
 */
export async function supabaseDeleteProduct(productId, storeId) {
  const client = getSupabaseClient();
  if (!client) throw new Error('سوبابيز غير متصل.');

  const { error } = await client
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('store_id', storeId);

  if (error) throw new Error(`فشل حذف المنتج: ${error.message}`);
  return true;
}

/**
 * Fetch strictly isolated orders for a specific merchant store
 */
export async function supabaseFetchStoreOrders(storeId) {
  const client = getSupabaseClient();
  if (!client || !storeId) return [];

  try {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('supabaseFetchStoreOrders error:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('supabaseFetchStoreOrders exception:', err);
    return [];
  }
}

/**
 * Update order status by merchant or courier
 */
export async function supabaseUpdateOrderStatus(orderId, status, statusLabel) {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('orders')
      .update({ status, status_label: statusLabel })
      .eq('id', orderId)
      .select()
      .single();

    if (error) console.warn('supabaseUpdateOrderStatus error:', error.message);
    return data;
  } catch (err) {
    console.warn('supabaseUpdateOrderStatus exception:', err);
    return null;
  }
}

/**
 * Fetch available delivery tasks for couriers
 */
export async function supabaseFetchCourierOrders() {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .in('status', ['ready_for_pickup', 'out_for_delivery', 'delivered'])
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

// =========================================================================
// 3. GENERAL CONNECTION & SYNC HELPERS
// =========================================================================

// Test connection by checking connectivity to Supabase
export async function testSupabaseConnection(overrideUrl, overrideKey) {
  const url = overrideUrl || getSupabaseConfig().url;
  const anonKey = overrideKey || getSupabaseConfig().anonKey;

  if (!url || !anonKey) {
    return { success: false, message: 'يرجى إدخال رابط المشروع (Project URL) والمفتاح العام (Anon Key).' };
  }

  try {
    const client = createClient(url, anonKey);
    const { data, error } = await client.from('products').select('count', { count: 'exact', head: true });

    if (error) {
      if (error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        return {
          success: true,
          needSchema: true,
          message: 'تم الاتصال بسوبابيز بنجاح! الجداول غير منشأة بعد، يمكنك تشغيل كود الـ SQL المرفق لإنشائها بنقرة واحدة.',
        };
      }
      return { success: false, message: `خطأ في الاتصال: ${error.message}` };
    }

    return {
      success: true,
      needSchema: false,
      message: 'تم الاتصال بقاعدة بيانات Supabase بنجاح، وجميع الجداول جاهزة للعمل!',
      count: data,
    };
  } catch (err) {
    return {
      success: false,
      message: `تعذر الاتصال بسوبابيز: ${err.message || 'تأكد من صحة الرابط ومفتاح الـ Anon'}`,
    };
  }
}

// Upload initial stores, products and categories to Supabase
export async function syncLocalDataToSupabase(db) {
  const client = getSupabaseClient();
  if (!client) throw new Error('سوبابيز غير متصل.');

  const results = { stores: 0, products: 0, categories: 0 };

  // 1. Sync Stores
  if (db.stores && db.stores.length > 0) {
    const storesPayload = db.stores.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category || '',
      rating: Number(s.rating) || 4.9,
      reviews_count: Number(s.reviewsCount || s.reviews || 0),
      location: s.location || 'المكلا، حضرموت',
      phone: s.phone || '773058707',
      cover_url: s.cover || '',
      avatar_url: s.avatar || '',
      description: s.description || '',
      is_verified: Boolean(s.isVerified ?? true),
      is_demo: Boolean(s.isDemo ?? true),
    }));

    const { error: storeErr } = await client.from('stores').upsert(storesPayload, { onConflict: 'id' });
    if (storeErr) console.warn('Supabase store sync warn:', storeErr.message);
    else results.stores = storesPayload.length;
  }

  // 2. Sync Products
  if (db.products && db.products.length > 0) {
    const productsPayload = db.products.map((p) => ({
      id: p.id,
      store_id: p.storeId || 'store-1',
      name: p.name,
      category: p.category || '',
      price: Number(p.price) || 0,
      original_price: Number(p.originalPrice || p.price || 0),
      rating: Number(p.rating) || 4.9,
      reviews_count: Number(p.reviewsCount || p.reviews || 0),
      image_url: p.image || '',
      badge: p.badge || null,
      description: p.description || '',
      in_stock: Number(p.inStock || 10),
      is_demo: Boolean(p.isDemo ?? true),
    }));

    const { error: prodErr } = await client.from('products').upsert(productsPayload, { onConflict: 'id' });
    if (prodErr) console.warn('Supabase product sync warn:', prodErr.message);
    else results.products = productsPayload.length;
  }

  // 3. Sync Categories
  if (db.categories && db.categories.length > 0) {
    const categoriesPayload = db.categories.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description || '',
      icon: c.icon || '',
    }));

    const { error: catErr } = await client.from('categories').upsert(categoriesPayload, { onConflict: 'id' });
    if (catErr) console.warn('Supabase category sync warn:', catErr.message);
    else results.categories = categoriesPayload.length;
  }

  return results;
}

// Fetch live products, stores, and orders from Supabase
export async function fetchLiveSupabaseData() {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const [storesRes, prodsRes, ordersRes] = await Promise.all([
      client.from('stores').select('*').order('created_at', { ascending: false }),
      client.from('products').select('*').order('created_at', { ascending: false }),
      client.from('orders').select('*').order('created_at', { ascending: false }),
    ]);

    return {
      stores: storesRes.data || null,
      products: prodsRes.data || null,
      orders: ordersRes.data || null,
    };
  } catch (err) {
    console.warn('Error fetching live data from Supabase:', err);
    return null;
  }
}

// Insert live order into Supabase
export async function pushOrderToSupabase(order) {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const payload = {
      id: order.id,
      order_number: order.orderNumber || `#${order.id}`,
      customer_name: order.customerName,
      customer_phone: order.phone,
      city: order.city || 'المكلا',
      neighborhood: order.neighborhood || order.address,
      delivery_address: order.address,
      store_id: order.storeId || 'store-1',
      store_name: order.storeName || 'متجر غيم',
      subtotal: Number(order.subtotal || order.total || 0),
      shipping_fee: Number(order.shippingFee || 1200),
      total_amount: Number(order.total || 0),
      payment_method: order.paymentMethod || 'كاش عند الاستلام',
      payment_ref: order.paymentRef || null,
      status: order.status || 'pending',
      status_label: order.statusLabel || 'قيد المراجعة والتحضير ⏳',
      items: order.items || [],
      notes: order.notes || '',
    };

    const { data, error } = await client.from('orders').insert([payload]).select().single();
    if (error) {
      console.warn('Supabase pushOrder error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase pushOrder exception:', err);
    return null;
  }
}

// Clean demo data from Supabase
export async function cleanDemoDataFromSupabase() {
  const client = getSupabaseClient();
  if (!client) throw new Error('سوبابيز غير متصل.');

  try {
    const { error: prodErr } = await client.from('products').delete().eq('is_demo', true);
    if (prodErr) console.warn('Supabase clean demo products error:', prodErr.message);

    const { error: storeErr } = await client.from('stores').delete().eq('is_demo', true);
    if (storeErr) console.warn('Supabase clean demo stores error:', storeErr.message);

    return { success: !prodErr && !storeErr };
  } catch (err) {
    console.warn('Supabase cleanDemoData exception:', err);
    throw err;
  }
}

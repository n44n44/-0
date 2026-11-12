import { createClient } from '@supabase/supabase-js';

// Configuration storage keys
const STORAGE_URL_KEY = 'ghaym_supabase_url';
const STORAGE_KEY_KEY = 'ghaym_supabase_anon_key';

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
  }
  activeClient = null;
}

// Test connection by checking connectivity to Supabase
export async function testSupabaseConnection(overrideUrl, overrideKey) {
  const url = overrideUrl || getSupabaseConfig().url;
  const anonKey = overrideKey || getSupabaseConfig().anonKey;

  if (!url || !anonKey) {
    return { success: false, message: 'يرجى إدخال رابط المشروع (Project URL) والمفتاح العام (Anon Key).' };
  }

  try {
    const client = createClient(url, anonKey);
    // Ping products table or run simple query
    const { data, error } = await client.from('products').select('count', { count: 'exact', head: true });

    if (error) {
      // If table doesn't exist yet, it's still connected!
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

// Clean and delete all demo/dummy stores and products from Supabase on official launch
export async function cleanDemoDataFromSupabase() {
  const client = getSupabaseClient();
  if (!client) throw new Error('سوبابيز غير متصل.');

  try {
    // 1. Delete all demo products
    const { error: prodErr } = await client.from('products').delete().eq('is_demo', true);
    if (prodErr) console.warn('Supabase clean demo products error:', prodErr.message);

    // 2. Delete all demo stores
    const { error: storeErr } = await client.from('stores').delete().eq('is_demo', true);
    if (storeErr) console.warn('Supabase clean demo stores error:', storeErr.message);

    return { success: !prodErr && !storeErr };
  } catch (err) {
    console.warn('Supabase cleanDemoData exception:', err);
    throw err;
  }
}



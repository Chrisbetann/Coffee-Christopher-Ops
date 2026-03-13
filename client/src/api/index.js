import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach JWT for admin requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Menu ────────────────────────────────────────────────────
export const getCategories   = ()   => api.get('/menu/categories');
export const getMenuItems    = (cat) => api.get('/menu/items', { params: cat ? { category: cat } : {} });
export const getMenuItem     = (id) => api.get(`/menu/items/${id}`);

// ── Orders ───────────────────────────────────────────────────
export const placeOrder  = (data) => api.post('/orders', data);
export const getOrder    = (id)   => api.get(`/orders/${id}`);

// ── Admin Auth ───────────────────────────────────────────────
export const adminLogin  = (email, password) => api.post('/admin/login', { email, password });

// ── Admin Orders ─────────────────────────────────────────────
export const getAdminOrders    = ()            => api.get('/admin/orders');
export const updateOrderStatus = (id, status)  => api.patch(`/admin/orders/${id}/status`, { status });

// ── Admin Menu ───────────────────────────────────────────────
export const getAdminItems     = ()       => api.get('/admin/menu/items');
export const createItem        = (data)   => api.post('/admin/menu/items', data);
export const updateItem        = (id, d)  => api.put(`/admin/menu/items/${id}`, d);
export const deleteItem        = (id)     => api.delete(`/admin/menu/items/${id}`);
export const toggleItem        = (id)     => api.patch(`/admin/menu/items/${id}/toggle`);

export const getAdminCategories = ()      => api.get('/admin/categories');
export const createCategory     = (data)  => api.post('/admin/categories', data);
export const updateCategory     = (id, d) => api.put(`/admin/categories/${id}`, d);
export const deleteCategory     = (id)    => api.delete(`/admin/categories/${id}`);

// ── Dashboard ────────────────────────────────────────────────
export const getDashboardSummary = (period, date) => api.get('/dashboard/summary', { params: { period, date } });
export const getSalesData        = (period, date) => api.get('/dashboard/sales',   { params: { period, date } });
export const getTopItems         = (period, date) => api.get('/dashboard/top-items', { params: { period, date } });
export const getVolumeData       = (period, date) => api.get('/dashboard/volume',  { params: { period, date } });

// ── Inventory ────────────────────────────────────────────────
export const getIngredients    = ()       => api.get('/inventory');
export const getAlerts         = ()       => api.get('/inventory/alerts');
export const getAuditLog       = (id)     => api.get(`/inventory/${id}/log`);
export const createIngredient  = (data)   => api.post('/inventory', data);
export const updateIngredient  = (id, d)  => api.put(`/inventory/${id}`, d);
export const deleteIngredient  = (id)     => api.delete(`/inventory/${id}`);

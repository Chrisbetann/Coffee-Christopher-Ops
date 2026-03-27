import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  getPromotions, createPromotion, updatePromotion,
  togglePromotion, deletePromotion, getAdminItems,
  getLoyaltyCustomers,
} from '../../api';

const EMPTY_FORM = {
  code: '',
  name: '',
  description: '',
  type: 'percent_off',
  value: '',
  applies_to: 'all',
  item_ids: [],
  min_order_amount: '',
  active: true,
  expires_at: '',
};

export default function PromotionsManagement() {
  const [promos, setPromos] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('promotions'); // 'promotions' | 'members'

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [promosRes, itemsRes] = await Promise.all([getPromotions(), getAdminItems()]);
      setPromos(promosRes.data);
      setMenuItems(itemsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCustomers = useCallback(async () => {
    try {
      const { data } = await getLoyaltyCustomers();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { if (tab === 'members') loadCustomers(); }, [tab, loadCustomers]);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  }

  function openEdit(promo) {
    setEditingId(promo.id);
    setForm({
      code: promo.code,
      name: promo.name,
      description: promo.description || '',
      type: promo.type,
      value: String(promo.value),
      applies_to: promo.applies_to,
      item_ids: promo.item_ids || [],
      min_order_amount: promo.min_order_amount ? String(promo.min_order_amount) : '',
      active: promo.active,
      expires_at: promo.expires_at ? promo.expires_at.slice(0, 16) : '',
    });
    setFormError('');
    setShowForm(true);
  }

  function handleFieldChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleItemId(id) {
    setForm((prev) => {
      const ids = prev.item_ids.includes(id)
        ? prev.item_ids.filter((i) => i !== id)
        : [...prev.item_ids, id];
      return { ...prev, item_ids: ids };
    });
  }

  async function handleSave() {
    if (!form.code.trim() || !form.name.trim() || !form.value) {
      setFormError('Code, name, and value are required');
      return;
    }
    const numVal = parseFloat(form.value);
    if (isNaN(numVal) || numVal <= 0) {
      setFormError('Value must be a positive number');
      return;
    }
    if (form.type === 'percent_off' && numVal > 100) {
      setFormError('Percent off cannot exceed 100%');
      return;
    }
    if (form.applies_to === 'specific_items' && form.item_ids.length === 0) {
      setFormError('Select at least one item for a specific-item promotion');
      return;
    }

    setSaving(true);
    setFormError('');
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        type: form.type,
        value: numVal,
        applies_to: form.applies_to,
        item_ids: form.applies_to === 'specific_items' ? form.item_ids : undefined,
        min_order_amount: form.min_order_amount ? parseFloat(form.min_order_amount) : undefined,
        active: form.active,
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      };

      if (editingId) {
        const { data } = await updatePromotion(editingId, payload);
        setPromos((prev) => prev.map((p) => (p.id === editingId ? data : p)));
      } else {
        const { data } = await createPromotion(payload);
        setPromos((prev) => [data, ...prev]);
      }
      setShowForm(false);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to save promotion');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id) {
    try {
      const { data } = await togglePromotion(id);
      setPromos((prev) => prev.map((p) => (p.id === id ? data : p)));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this promotion?')) return;
    try {
      await deletePromotion(id);
      setPromos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <AdminLayout title="Loyalty & Promotions">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['promotions', 'members'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === t ? 'bg-brand-brown text-white' : 'bg-white text-brand-brown border border-brand-tan hover:bg-brand-cream'
            }`}
          >
            {t === 'promotions' ? '🏷️ Promotions' : '⭐ Loyalty Members'}
          </button>
        ))}
      </div>

      {tab === 'promotions' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">{promos.length} promotion{promos.length !== 1 ? 's' : ''}</p>
            <button
              onClick={openCreate}
              className="bg-brand-brown text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition"
            >
              + New Promotion
            </button>
          </div>

          {loading ? (
            <p className="text-gray-400 text-sm">Loading…</p>
          ) : promos.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <p className="text-4xl mb-2">🏷️</p>
              <p className="text-gray-500">No promotions yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {promos.map((promo) => (
                <div key={promo.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-brand-brown text-sm bg-brand-cream px-2 py-0.5 rounded">
                        {promo.code}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${promo.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {promo.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                        {promo.type === 'percent_off' ? `${Number(promo.value)}% off` : `$${Number(promo.value).toFixed(2)} off`}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {promo.applies_to === 'all' ? 'All items' : 'Specific items'}
                      </span>
                    </div>
                    <p className="font-semibold text-brand-dark mt-1">{promo.name}</p>
                    {promo.description && <p className="text-sm text-gray-500">{promo.description}</p>}
                    <div className="flex gap-4 text-xs text-gray-400 mt-1">
                      {promo.min_order_amount && <span>Min order: ${Number(promo.min_order_amount).toFixed(2)}</span>}
                      {promo.expires_at && <span>Expires: {new Date(promo.expires_at).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggle(promo.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition ${
                        promo.active
                          ? 'border-gray-300 text-gray-500 hover:bg-gray-50'
                          : 'border-green-300 text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {promo.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => openEdit(promo)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium border border-brand-tan text-brand-brown hover:bg-brand-cream transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium border border-red-200 text-red-500 hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'members' && (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-500">{customers.length} loyalty member{customers.length !== 1 ? 's' : ''}</p>
          </div>
          {customers.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <p className="text-4xl mb-2">⭐</p>
              <p className="text-gray-500">No loyalty members yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Points</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Orders</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-brand-dark">{c.name}</td>
                      <td className="px-4 py-3 text-gray-500">{c.email}</td>
                      <td className="px-4 py-3 text-right font-bold text-brand-brown">{c.points}</td>
                      <td className="px-4 py-3 text-right text-gray-500">{c._count?.orders ?? 0}</td>
                      <td className="px-4 py-3 text-right text-gray-400">{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-brand-brown">
                {editingId ? 'Edit Promotion' : 'New Promotion'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Code *</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => handleFieldChange('code', e.target.value.toUpperCase())}
                    placeholder="SAVE10"
                    maxLength={50}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-1 focus:ring-brand-brown"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => handleFieldChange('active', !form.active)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${form.active ? 'bg-brand-brown' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${form.active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className="text-sm text-gray-600">{form.active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="10% Off Everything"
                  maxLength={150}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Optional description for staff"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Discount Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => handleFieldChange('type', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown"
                  >
                    <option value="percent_off">% Off</option>
                    <option value="dollar_off">$ Off</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Value * {form.type === 'percent_off' ? '(%)' : '($)'}
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    max={form.type === 'percent_off' ? 100 : undefined}
                    step="0.01"
                    value={form.value}
                    onChange={(e) => handleFieldChange('value', e.target.value)}
                    placeholder={form.type === 'percent_off' ? '10' : '5.00'}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Applies To</label>
                  <select
                    value={form.applies_to}
                    onChange={(e) => handleFieldChange('applies_to', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown"
                  >
                    <option value="all">All Items</option>
                    <option value="specific_items">Specific Items</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Min Order ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.min_order_amount}
                    onChange={(e) => handleFieldChange('min_order_amount', e.target.value)}
                    placeholder="0.00"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown"
                  />
                </div>
              </div>

              {form.applies_to === 'specific_items' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Select Items * ({form.item_ids.length} selected)
                  </label>
                  <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto divide-y divide-gray-50">
                    {menuItems.map((item) => (
                      <label key={item.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.item_ids.includes(item.id)}
                          onChange={() => toggleItemId(item.id)}
                          className="accent-brand-brown"
                        />
                        <span className="text-sm flex-1">{item.name}</span>
                        <span className="text-xs text-gray-400">${Number(item.price).toFixed(2)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Expiry Date (optional)</label>
                <input
                  type="datetime-local"
                  value={form.expires_at}
                  onChange={(e) => handleFieldChange('expires_at', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown"
                />
              </div>

              {formError && <p className="text-sm text-red-500">{formError}</p>}
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 rounded-lg text-sm font-medium bg-brand-brown text-white hover:bg-brand-dark disabled:opacity-50 transition"
              >
                {saving ? 'Saving…' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminItems, getAdminCategories, createItem, updateItem, deleteItem, toggleItem } from '../../api';

const EMPTY_FORM = { name: '', description: '', price: '', category_id: '', available: true };

export default function MenuManagement() {
  const [items, setItems]           = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCat, setFilterCat]   = useState('all');
  const [search, setSearch]         = useState('');
  const [modal, setModal]           = useState(null); // null | 'add' | item obj
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');

  async function load() {
    const [itemRes, catRes] = await Promise.all([getAdminItems(), getAdminCategories()]);
    setItems(itemRes.data);
    setCategories(catRes.data);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(EMPTY_FORM);
    setError('');
    setModal('add');
  }

  function openEdit(item) {
    setForm({
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      category_id: String(item.category_id),
      available: item.available,
    });
    setError('');
    setModal(item);
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.category_id) {
      setError('Name, price, and category are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        category_id: parseInt(form.category_id),
        available: form.available,
      };
      if (modal === 'add') {
        await createItem(payload);
      } else {
        await updateItem(modal.id, payload);
      }
      await load();
      setModal(null);
    } catch {
      setError('Failed to save item.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this item?')) return;
    await deleteItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function handleToggle(id) {
    await toggleItem(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, available: !i.available } : i)));
  }

  const displayed = items
    .filter((i) => filterCat === 'all' || i.category_id === parseInt(filterCat))
    .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="Menu Management">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <input
          placeholder="Search items…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-brand-tan rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown"
        />
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="border border-brand-tan rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={openAdd} className="ml-auto bg-brand-brown text-white px-4 py-2 rounded-lg text-sm font-semibold">
          + Add Item
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-brand-cream text-brand-brown">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Item</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 font-semibold">Price</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-right px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((item) => (
              <tr key={item.id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-brand-dark">{item.name}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{item.category?.name}</td>
                <td className="px-4 py-3 font-semibold text-brand-brown">${Number(item.price).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggle(item.id)}
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'
                    }`}
                  >
                    {item.available ? 'Available' : 'Sold Out'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(item)} className="text-brand-brown hover:underline text-xs font-medium">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:underline text-xs font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayed.length === 0 && (
          <p className="text-center text-gray-400 py-8">No items found</p>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-brand-brown mb-4">
              {modal === 'add' ? 'Add New Item' : `Edit: ${modal.name}`}
            </h2>
            <div className="space-y-3">
              <input
                placeholder="Item name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown"
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown"
              />
              <input
                placeholder="Price *"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown"
              />
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown"
              >
                <option value="">Select category *</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                  className="accent-brand-brown"
                />
                Available on menu
              </label>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setModal(null)}
                className="flex-1 border border-brand-tan text-brand-dark py-2 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-brand-brown text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save & Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

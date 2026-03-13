import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getIngredients, createIngredient, updateIngredient, deleteIngredient, getAuditLog } from '../../api';

const EMPTY_FORM = { name: '', unit: '', count: '', par_level: '', supplier: '', supplier_contact: '', cost_per_unit: '' };

export default function InventoryTracking() {
  const [ingredients, setIngredients] = useState([]);
  const [modal, setModal]             = useState(null); // null | 'add' | ingredient obj
  const [form, setForm]               = useState(EMPTY_FORM);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState('');
  const [logModal, setLogModal]       = useState(null);
  const [logs, setLogs]               = useState([]);

  async function load() {
    const { data } = await getIngredients();
    setIngredients(data);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm(EMPTY_FORM);
    setError('');
    setModal('add');
  }

  function openEdit(ing) {
    setForm({
      name: ing.name,
      unit: ing.unit,
      count: String(ing.count),
      par_level: String(ing.par_level),
      supplier: ing.supplier || '',
      supplier_contact: ing.supplier_contact || '',
      cost_per_unit: ing.cost_per_unit ? String(ing.cost_per_unit) : '',
    });
    setError('');
    setModal(ing);
  }

  async function openLog(ing) {
    const { data } = await getAuditLog(ing.id);
    setLogs(data);
    setLogModal(ing);
  }

  async function handleSave() {
    if (!form.name || !form.unit || form.count === '' || form.par_level === '') {
      setError('Name, unit, count, and par level are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        unit: form.unit,
        count: parseFloat(form.count),
        par_level: parseFloat(form.par_level),
        supplier: form.supplier || null,
        supplier_contact: form.supplier_contact || null,
        cost_per_unit: form.cost_per_unit ? parseFloat(form.cost_per_unit) : null,
      };
      if (modal === 'add') {
        await createIngredient(payload);
      } else {
        await updateIngredient(modal.id, payload);
      }
      await load();
      setModal(null);
    } catch {
      setError('Failed to save ingredient.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this ingredient?')) return;
    await deleteIngredient(id);
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  }

  const lowCount = ingredients.filter((i) => i.low_stock).length;

  return (
    <AdminLayout title="Inventory Tracking">
      {/* Alert banner */}
      {lowCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
          <span className="text-red-500 font-bold">⚠️</span>
          <span className="text-red-600 text-sm font-medium">{lowCount} ingredient{lowCount > 1 ? 's' : ''} below par level</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{ingredients.length} ingredients tracked</p>
        <button onClick={openAdd} className="bg-brand-brown text-white px-4 py-2 rounded-lg text-sm font-semibold">
          + Add Ingredient
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-brand-cream text-brand-brown">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Ingredient</th>
              <th className="text-left px-4 py-3 font-semibold">Count</th>
              <th className="text-left px-4 py-3 font-semibold">Par</th>
              <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Supplier</th>
              <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Cost/Unit</th>
              <th className="text-right px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ing) => (
              <tr key={ing.id} className={`border-t border-gray-50 transition ${ing.low_stock ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {ing.low_stock && <span className="text-red-500 text-xs">⚠️</span>}
                    <span className="font-medium text-brand-dark">{ing.name}</span>
                    <span className="text-xs text-gray-400">({ing.unit})</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${ing.low_stock ? 'text-red-500' : 'text-brand-dark'}`}>
                    {Number(ing.count)}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{Number(ing.par_level)}</td>
                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{ing.supplier || '—'}</td>
                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                  {ing.cost_per_unit ? `$${Number(ing.cost_per_unit).toFixed(2)}` : '—'}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(ing)}  className="text-brand-brown hover:underline text-xs font-medium">Edit</button>
                  <button onClick={() => openLog(ing)}   className="text-gray-400 hover:underline text-xs font-medium">Log</button>
                  <button onClick={() => handleDelete(ing.id)} className="text-red-400 hover:underline text-xs font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ingredients.length === 0 && (
          <p className="text-center text-gray-400 py-8">No ingredients yet</p>
        )}
      </div>

      {/* Add/Edit modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-bold text-brand-brown mb-4">
              {modal === 'add' ? 'Add Ingredient' : `Update: ${modal.name}`}
            </h2>
            <div className="space-y-3">
              <input placeholder="Name *"                 value={form.name}             onChange={(e) => setForm({ ...form, name: e.target.value })}             className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown" />
              <input placeholder="Unit (e.g. gallon, lb)" value={form.unit}             onChange={(e) => setForm({ ...form, unit: e.target.value })}             className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown" />
              <input placeholder="Current count *"  type="number" step="0.5" min="0"   value={form.count}        onChange={(e) => setForm({ ...form, count: e.target.value })}        className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown" />
              <input placeholder="Par level *"       type="number" step="0.5" min="0"  value={form.par_level}    onChange={(e) => setForm({ ...form, par_level: e.target.value })}    className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown" />
              <input placeholder="Supplier (optional)"             value={form.supplier}          onChange={(e) => setForm({ ...form, supplier: e.target.value })}         className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown" />
              <input placeholder="Supplier contact (optional)"     value={form.supplier_contact}  onChange={(e) => setForm({ ...form, supplier_contact: e.target.value })} className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown" />
              <input placeholder="Cost per unit (optional)" type="number" step="0.01" min="0" value={form.cost_per_unit} onChange={(e) => setForm({ ...form, cost_per_unit: e.target.value })} className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown" />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex gap-3 mt-4">
              <button onClick={() => setModal(null)} className="flex-1 border border-brand-tan text-brand-dark py-2 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-brand-brown text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-60">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit log modal */}
      {logModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-brand-brown mb-4">Audit Log — {logModal.name}</h2>
            {logs.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No changes recorded yet</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="bg-brand-cream rounded-lg px-3 py-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">{Number(log.old_count)} → {Number(log.new_count)} {logModal.unit}</span>
                      <span className="text-gray-400 text-xs">{new Date(log.changed_at).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">by {log.changed_by}</p>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setLogModal(null)} className="mt-4 w-full border border-brand-tan text-brand-dark py-2 rounded-lg text-sm">Close</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

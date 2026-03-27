import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Helper: build SMS link for Mac Messages
function smsLink(phone, message) {
  const clean = phone.replace(/\D/g, '');
  const num = clean.startsWith('1') ? `+${clean}` : `+1${clean}`;
  return `sms:${num}&body=${encodeURIComponent(message)}`;
}

function promoSmsMessage(member, promo) {
  const discountText = promo.type === 'percent_off'
    ? `${Number(promo.value)}% off`
    : `$${Number(promo.value).toFixed(2)} off`;
  return `Hey ${member.name}! ☕ Use code ${promo.code} for ${discountText} at Coffee Christopher. See you soon!`;
}

const EMPTY_FORM = { name: '', email: '', phone: '', points: '0' };

export default function LoyaltyMembers() {
  const [members, setMembers] = useState([]);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add / Edit modal
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Send promo modal
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedPromoId, setSelectedPromoId] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  const token = localStorage.getItem('cc_token');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const loadMembers = useCallback(async (q = '') => {
    setLoading(true);
    try {
      const url = `${API_BASE}/admin/loyalty${q ? `?search=${encodeURIComponent(q)}` : ''}`;
      const res = await fetch(url, { headers });
      setMembers(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPromos = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/promotions`, { headers });
      const data = await res.json();
      setPromos(data.filter((p) => p.active));
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { loadMembers(); loadPromos(); }, [loadMembers, loadPromos]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => loadMembers(search), 300);
    return () => clearTimeout(t);
  }, [search, loadMembers]);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  }

  function openEdit(m) {
    setEditingId(m.id);
    setForm({ name: m.name, email: m.email, phone: m.phone || '', points: String(m.points) });
    setFormError('');
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Name and email are required');
      return;
    }
    setSaving(true);
    setFormError('');
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      points: parseInt(form.points) || 0,
    };
    try {
      const url = editingId
        ? `${API_BASE}/admin/loyalty/${editingId}`
        : `${API_BASE}/admin/loyalty`;
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || 'Failed to save'); return; }
      setShowForm(false);
      loadMembers(search);
    } catch (err) {
      setFormError('Network error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Remove ${name} from loyalty program?`)) return;
    await fetch(`${API_BASE}/admin/loyalty/${id}`, { method: 'DELETE', headers });
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function openSendModal() {
    setSendResult(null);
    setSelectedPromoId(promos[0]?.id ? String(promos[0].id) : '');
    setShowSendModal(true);
  }

  async function handleSendEmail() {
    if (!selectedPromoId || selectedIds.length === 0) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch(`${API_BASE}/admin/loyalty/send-promo`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          customer_ids: selectedIds,
          promotion_id: parseInt(selectedPromoId),
        }),
      });
      const data = await res.json();
      setSendResult(data);
    } catch (err) {
      setSendResult({ error: 'Network error' });
    } finally {
      setSending(false);
    }
  }

  const selectedPromo = promos.find((p) => String(p.id) === selectedPromoId);

  const toggleSelect = (id) =>
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const toggleSelectAll = () =>
    setSelectedIds(selectedIds.length === members.length ? [] : members.map((m) => m.id));

  return (
    <AdminLayout title="Loyalty Members">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="search"
          placeholder="Search by name, email, or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown"
        />
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={openSendModal}
              className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition"
            >
              Send Promo ({selectedIds.length})
            </button>
          )}
          <button
            onClick={openCreate}
            className="bg-brand-brown text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition"
          >
            + Add Member
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Members', value: members.length },
          { label: 'Total Points Issued', value: members.reduce((s, m) => s + m.points, 0).toLocaleString() },
          { label: 'With Phone Number', value: members.filter((m) => m.phone).length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-brand-brown">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <p className="text-4xl mb-2">⭐</p>
          <p className="text-gray-500">
            {search ? 'No members match your search.' : 'No loyalty members yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox"
                    checked={selectedIds.length === members.length && members.length > 0}
                    onChange={toggleSelectAll}
                    className="accent-brand-brown"
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Phone</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Points</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Orders</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Joined</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className={`border-b border-gray-50 hover:bg-gray-50 ${selectedIds.includes(m.id) ? 'bg-amber-50' : ''}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.includes(m.id)} onChange={() => toggleSelect(m.id)} className="accent-brand-brown" />
                  </td>
                  <td className="px-4 py-3 font-medium text-brand-dark">{m.name}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${m.email}`} className="text-blue-500 hover:underline">{m.email}</a>
                  </td>
                  <td className="px-4 py-3">
                    {m.phone ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{m.phone}</span>
                        {selectedPromo ? (
                          <a
                            href={smsLink(m.phone, promoSmsMessage(m, selectedPromo))}
                            title="Open in Messages with promo pre-filled"
                            className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full hover:bg-green-200 transition"
                          >
                            💬 Text
                          </a>
                        ) : (
                          <a
                            href={`sms:${m.phone.replace(/\D/g, '').startsWith('1') ? `+${m.phone.replace(/\D/g, '')}` : `+1${m.phone.replace(/\D/g, '')}`}`}
                            className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full hover:bg-green-200 transition"
                          >
                            💬 Text
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-brand-brown">{m.points}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{m._count?.orders ?? 0}</td>
                  <td className="px-4 py-3 text-right text-gray-400 text-xs">{new Date(m.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(m)} className="text-xs text-brand-brown hover:underline">Edit</button>
                      <button onClick={() => handleDelete(m.id, m.name)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Promo selector for SMS (shown when promos exist) */}
      {promos.length > 0 && members.some((m) => m.phone) && (
        <div className="mt-4 bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
          <p className="text-sm text-gray-600">Preview SMS with promo:</p>
          <select
            value={selectedPromoId}
            onChange={(e) => setSelectedPromoId(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown"
          >
            <option value="">— Select promo —</option>
            {promos.map((p) => (
              <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400">Click 💬 Text next to any phone number to open Mac Messages</p>
        </div>
      )}

      {/* Add / Edit Member Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-brand-brown">
                {editingId ? 'Edit Member' : 'Add Loyalty Member'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Smith"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="jane@example.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Points Balance</label>
                <input
                  type="number"
                  min="0"
                  value={form.points}
                  onChange={(e) => setForm((f) => ({ ...f, points: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown"
                />
              </div>
              {formError && <p className="text-sm text-red-500">{formError}</p>}
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 rounded-lg text-sm font-medium bg-brand-brown text-white hover:bg-brand-dark disabled:opacity-50">
                {saving ? 'Saving…' : editingId ? 'Update' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Promo Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-brand-brown">Send Promotion</h2>
              <p className="text-sm text-gray-500 mt-1">{selectedIds.length} member{selectedIds.length !== 1 ? 's' : ''} selected</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Choose Promotion *</label>
                {promos.length === 0 ? (
                  <p className="text-sm text-gray-400">No active promotions. Create one first.</p>
                ) : (
                  <div className="space-y-2">
                    {promos.map((p) => (
                      <label key={p.id} className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer transition ${selectedPromoId === String(p.id) ? 'border-brand-brown bg-brand-cream' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <input
                          type="radio"
                          name="promo"
                          value={p.id}
                          checked={selectedPromoId === String(p.id)}
                          onChange={() => setSelectedPromoId(String(p.id))}
                          className="accent-brand-brown"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-brand-brown text-sm">{p.code}</span>
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                              {p.type === 'percent_off' ? `${Number(p.value)}% off` : `$${Number(p.value).toFixed(2)} off`}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{p.name}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {selectedPromo && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">📧 Email Preview</p>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                    <p>Subject: <span className="font-medium">{selectedPromo.type === 'percent_off' ? `${Number(selectedPromo.value)}% off` : `$${Number(selectedPromo.value).toFixed(2)} off`} just for you — {selectedPromo.code} ☕</span></p>
                    <p className="mt-1 text-xs text-gray-400">Branded HTML email with promo code, details, and expiry (if set)</p>
                  </div>

                  {members.some((m) => selectedIds.includes(m.id) && m.phone) && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-600 mb-2">💬 SMS Links (click to open Mac Messages)</p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {members
                          .filter((m) => selectedIds.includes(m.id) && m.phone)
                          .map((m) => (
                            <a
                              key={m.id}
                              href={smsLink(m.phone, promoSmsMessage(m, selectedPromo))}
                              className="flex items-center gap-2 text-sm text-green-700 hover:text-green-900 bg-green-50 rounded-lg px-3 py-1.5 hover:bg-green-100 transition"
                            >
                              <span>💬</span>
                              <span className="font-medium">{m.name}</span>
                              <span className="text-xs text-gray-400">{m.phone}</span>
                            </a>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {sendResult && (
                <div className={`rounded-xl p-3 text-sm ${sendResult.error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                  {sendResult.error
                    ? `Error: ${sendResult.error}`
                    : `✓ Sent to ${sendResult.sent} member${sendResult.sent !== 1 ? 's' : ''}${sendResult.failed > 0 ? ` · ${sendResult.failed} failed` : ''}`
                  }
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => { setShowSendModal(false); setSendResult(null); }} className="px-4 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50">
                {sendResult ? 'Close' : 'Cancel'}
              </button>
              {!sendResult && (
                <button
                  onClick={handleSendEmail}
                  disabled={sending || !selectedPromoId || selectedIds.length === 0}
                  className="px-6 py-2 rounded-lg text-sm font-medium bg-brand-brown text-white hover:bg-brand-dark disabled:opacity-50"
                >
                  {sending ? 'Sending…' : `Send Email to ${selectedIds.length}`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

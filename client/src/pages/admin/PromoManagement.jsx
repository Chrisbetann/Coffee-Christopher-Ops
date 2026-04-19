import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  getPromos,
  createPromo,
  deletePromo,
  getPromoRecipients,
  markPromoSent,
} from '../../api';

const EMPTY = { title: '', description: '', discount_type: 'percent', discount_value: '', item_name: '' };

function describePromo(p) {
  const v = Number(p.discount_value);
  if (p.discount_type === 'percent') return `${v}% off`;
  if (p.discount_type === 'amount')  return `$${v.toFixed(2)} off`;
  return `$${v.toFixed(2)} off ${p.item_name || 'item'}`;
}

export default function PromoManagement() {
  const [promos, setPromos]         = useState([]);
  const [selected, setSelected]     = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [form, setForm]             = useState(EMPTY);
  const [showForm, setShowForm]     = useState(false);
  const [formError, setFormError]   = useState('');
  const [search, setSearch]         = useState('');

  async function load() {
    try {
      const { data } = await getPromos();
      setPromos(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function loadRecipients(p) {
    setSelected(p);
    setRecipients([]);
    try {
      const { data } = await getPromoRecipients(p.id);
      setRecipients(data);
    } catch {
      alert('Failed to load recipients');
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');
    try {
      await createPromo({
        title: form.title,
        description: form.description || null,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        item_name: form.discount_type === 'item' ? form.item_name : null,
      });
      setForm(EMPTY);
      setShowForm(false);
      await load();
    } catch (err) {
      setFormError(err.response?.data?.error?.[0]?.message || 'Failed to create promo');
    }
  }

  async function handleDelete(p) {
    if (!confirm(`Delete promo "${p.title}"? This cannot be undone.`)) return;
    try {
      await deletePromo(p.id);
      if (selected?.id === p.id) setSelected(null);
      await load();
    } catch {
      alert('Failed to delete');
    }
  }

  async function handleMarkSent(recipient, channel) {
    try {
      const { data } = await markPromoSent(selected.id, recipient.customer.id, {
        [channel === 'email' ? 'email_sent' : 'sms_sent']: !recipient[channel === 'email' ? 'email_sent' : 'sms_sent'],
      });
      setRecipients((prev) => prev.map((r) =>
        r.customer.id === recipient.customer.id
          ? { ...r, email_sent: data.email_sent, sms_sent: data.sms_sent, sent_at: data.sent_at }
          : r
      ));
    } catch {
      alert('Failed to update');
    }
  }

  function mailtoForRecipient(r) {
    const offer = describePromo(selected);
    const subject = encodeURIComponent(`☕ ${selected.title} — just for you!`);
    const body = encodeURIComponent(
      `Hey ${r.customer.first_name},\n\n${selected.description || `Here's a special offer: ${offer}`}\n\nShow this email (or your loyalty card) at the counter to redeem.\n\n— Coffee Christopher`
    );
    return `mailto:${r.customer.email}?subject=${subject}&body=${body}`;
  }

  function smsForRecipient(r) {
    const offer = describePromo(selected);
    const body = encodeURIComponent(
      `Hey ${r.customer.first_name}! ${selected.title}: ${offer}. Show this at the counter to redeem. — Coffee Christopher`
    );
    return `sms:${r.customer.phone}?body=${body}`;
  }

  const filteredRecipients = recipients.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.customer.first_name.toLowerCase().includes(q) ||
      r.customer.last_name.toLowerCase().includes(q) ||
      r.customer.email.toLowerCase().includes(q) ||
      r.customer.phone.includes(q)
    );
  });

  return (
    <AdminLayout title="Promotions">
      <div className="grid md:grid-cols-[320px,1fr] gap-6">
        {/* Left column: promo list */}
        <div>
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-brand-brown text-white py-2.5 rounded-lg font-medium mb-4"
          >
            + New Promotion
          </button>

          {loading ? (
            <p className="text-gray-400">Loading…</p>
          ) : promos.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center text-gray-400 text-sm">
              No promotions yet. Create one above.
            </div>
          ) : (
            <div className="space-y-2">
              {promos.map((p) => (
                <button
                  key={p.id}
                  onClick={() => loadRecipients(p)}
                  className={`w-full text-left bg-white rounded-xl p-4 shadow-sm border-2 transition ${
                    selected?.id === p.id ? 'border-brand-brown' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-brand-dark truncate">{p.title}</p>
                      <p className="text-xs text-brand-brown font-medium">{describePromo(p)}</p>
                      {p.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {p._count?.sends || 0} sent
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column: recipients checklist */}
        <div>
          {!selected ? (
            <div className="bg-white rounded-xl p-12 text-center text-gray-400">
              Select a promotion on the left to see recipients and send it out.
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="text-lg font-bold text-brand-brown">{selected.title}</h2>
                    <p className="text-sm font-medium text-brand-dark">{describePromo(selected)}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(selected)}
                    className="text-red-600 text-xs font-medium bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
                {selected.description && <p className="text-sm text-gray-500 mt-1">{selected.description}</p>}
                <p className="text-xs text-gray-400 mt-2">
                  {recipients.length} members · {recipients.filter((r) => r.email_sent).length} emails marked sent · {recipients.filter((r) => r.sms_sent).length} SMS marked sent
                </p>
              </div>

              <input
                type="text"
                placeholder="Search recipients…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-brand-tan rounded-xl px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-brand-brown"
              />

              <div className="space-y-2">
                {filteredRecipients.map((r) => (
                  <div key={r.customer.id} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-brand-dark">{r.customer.first_name} {r.customer.last_name}</p>
                        <p className="text-xs text-gray-500 truncate">{r.customer.email}</p>
                        <p className="text-xs text-gray-500">{r.customer.phone}</p>
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <div className="flex items-center gap-2">
                          <a
                            href={mailtoForRecipient(r)}
                            className="bg-brand-brown text-white px-2.5 py-1 rounded text-xs font-medium"
                          >
                            📧 Email
                          </a>
                          <label className="flex items-center gap-1 text-xs text-gray-500">
                            <input
                              type="checkbox"
                              checked={r.email_sent}
                              onChange={() => handleMarkSent(r, 'email')}
                            />
                            sent
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={smsForRecipient(r)}
                            className="bg-brand-tan text-brand-dark px-2.5 py-1 rounded text-xs font-medium"
                          >
                            📱 SMS
                          </a>
                          <label className="flex items-center gap-1 text-xs text-gray-500">
                            <input
                              type="checkbox"
                              checked={r.sms_sent}
                              onChange={() => handleMarkSent(r, 'sms')}
                            />
                            sent
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* New promo modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-brand-brown mb-4">New Promotion</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                required
                placeholder="Title (e.g. Spring Flash Sale)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-brand-tan rounded-lg px-3 py-2"
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full border border-brand-tan rounded-lg px-3 py-2"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.discount_type}
                  onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                  className="border border-brand-tan rounded-lg px-3 py-2"
                >
                  <option value="percent">% off</option>
                  <option value="amount">$ off</option>
                  <option value="item">$ off item</option>
                </select>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={form.discount_type === 'percent' ? '20' : '2.00'}
                  value={form.discount_value}
                  onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                  className="border border-brand-tan rounded-lg px-3 py-2"
                />
              </div>
              {form.discount_type === 'item' && (
                <input
                  required
                  placeholder="Item name (e.g. Muffin)"
                  value={form.item_name}
                  onChange={(e) => setForm({ ...form, item_name: e.target.value })}
                  className="w-full border border-brand-tan rounded-lg px-3 py-2"
                />
              )}
              {formError && <p className="text-red-500 text-sm">{formError}</p>}
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setFormError(''); setForm(EMPTY); }}
                  className="flex-1 border border-brand-tan text-brand-brown py-2.5 rounded-lg font-medium">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 bg-brand-brown text-white py-2.5 rounded-lg font-bold">
                  Create Promo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

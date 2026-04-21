import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  getLoyaltyCustomers,
  addStamp,
  redeemFree,
  adminAddCustomer,
  adminDeleteCustomer,
  buildWeeklyReminder,
} from '../../api';

const EMPTY_FORM = { first_name: '', last_name: '', email: '', phone: '', birthday: '' };

export default function LoyaltyManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [actionMsg, setActionMsg] = useState({});
  const [showAdd, setShowAdd]     = useState(false);
  const [addForm, setAddForm]     = useState(EMPTY_FORM);
  const [addError, setAddError]   = useState('');
  const [adding, setAdding]       = useState(false);

  async function load() {
    try {
      const { data } = await getLoyaltyCustomers();
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function flash(id, msg, isError = false) {
    setActionMsg((prev) => ({ ...prev, [id]: { msg, isError } }));
    setTimeout(() => setActionMsg((prev) => { const n = { ...prev }; delete n[id]; return n; }), 3000);
  }

  async function handleStamp(c) {
    try {
      const { data } = await addStamp(c.qr_code);
      setCustomers((prev) => prev.map((x) => x.id === c.id ? data : x));
      flash(c.id, `+1 stamp! Now ${data.stamps} total`);
    } catch {
      flash(c.id, 'Failed to add stamp', true);
    }
  }

  async function handleRedeem(c) {
    if (!confirm(`Redeem 1 free drink for ${c.first_name}?`)) return;
    try {
      const { data } = await redeemFree(c.qr_code);
      setCustomers((prev) => prev.map((x) => x.id === c.id ? data : x));
      flash(c.id, 'Free drink redeemed!');
    } catch (err) {
      flash(c.id, err.response?.data?.error || 'No free drinks available', true);
    }
  }

  async function handleDelete(c) {
    if (!confirm(`Delete ${c.first_name} ${c.last_name}? This cannot be undone.`)) return;
    try {
      await adminDeleteCustomer(c.id);
      setCustomers((prev) => prev.filter((x) => x.id !== c.id));
    } catch {
      flash(c.id, 'Failed to delete', true);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    setAdding(true);
    setAddError('');
    try {
      const { data } = await adminAddCustomer(addForm);
      setCustomers((prev) => [data, ...prev]);
      setAddForm(EMPTY_FORM);
      setShowAdd(false);
    } catch (err) {
      setAddError(err.response?.data?.error || 'Failed to add customer');
    } finally {
      setAdding(false);
    }
  }

  async function handleWeeklyReminder() {
    try {
      const { data } = await buildWeeklyReminder();
      if (data.sent === 0 && data.total === 0) {
        alert('No members with stamps yet — no reminder needed.');
        return;
      }
      const msg = data.failed > 0
        ? `Sent ${data.sent} of ${data.total} reminders. ${data.failed} failed — check server SMTP settings.`
        : `Sent ${data.sent} reminder email${data.sent === 1 ? '' : 's'} successfully!`;
      alert(msg);
    } catch {
      alert('Failed to send reminders');
    }
  }

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.first_name.toLowerCase().includes(q) ||
      c.last_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  const totalStamps   = customers.reduce((sum, c) => sum + c.stamps, 0);
  const totalMembers  = customers.length;
  const readyForFree  = customers.filter((c) => Math.floor(c.stamps / 6) > 0).length;

  return (
    <AdminLayout title="Loyalty Program">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-3xl font-bold text-brand-brown">{totalMembers}</p>
          <p className="text-sm text-gray-500 mt-1">Members</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-3xl font-bold text-brand-brown">{totalStamps}</p>
          <p className="text-sm text-gray-500 mt-1">Total Stamps</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-3xl font-bold text-yellow-500">{readyForFree}</p>
          <p className="text-sm text-gray-500 mt-1">Free Drinks Ready</p>
        </div>
      </div>

      {/* Action toolbar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setShowAdd(true)}
          className="bg-brand-brown text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add Customer
        </button>
        <button
          onClick={handleWeeklyReminder}
          className="bg-brand-tan text-brand-dark px-4 py-2 rounded-lg text-sm font-medium"
        >
          📧 Send Weekly Reminder
        </button>
        <button
          onClick={() => {
            const rows = ['First Name,Last Name,Email,Phone,Stamps,Birthday'];
            customers.forEach((c) => rows.push(`${c.first_name},${c.last_name},${c.email},${c.phone},${c.stamps},${c.birthday || ''}`));
            const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'loyalty-members.csv'; a.click();
            URL.revokeObjectURL(url);
          }}
          disabled={totalMembers === 0}
          className="bg-white border border-brand-tan text-brand-brown px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          ⬇️ Export CSV
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email, or phone…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-brand-tan rounded-xl px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-brand-brown"
      />

      {loading ? (
        <p className="text-gray-400">Loading members…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-400">
          {search ? 'No members match your search.' : 'No loyalty members yet.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => {
            const freeDrinks = Math.floor(c.stamps / 6);
            const stampsOnCard = c.stamps % 6;
            const msg = actionMsg[c.id];

            return (
              <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-brand-dark">
                        {c.first_name} {c.last_name}
                      </p>
                      {freeDrinks > 0 && (
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-bold">
                          🎉 {freeDrinks} Free Drink{freeDrinks > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{c.email}</p>
                    <p className="text-sm text-gray-500">{c.phone}</p>

                    {/* Stamp mini-card */}
                    <div className="flex gap-1 mt-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            i < stampsOnCard ? 'bg-brand-brown text-white' : 'bg-gray-100 text-gray-300'
                          }`}
                        >
                          {i < stampsOnCard ? '☕' : '○'}
                        </div>
                      ))}
                      <span className="text-xs text-gray-400 ml-1 self-center">{c.stamps} total</span>
                    </div>

                    {msg && (
                      <p className={`text-xs mt-1 font-medium ${msg.isError ? 'text-red-500' : 'text-green-600'}`}>
                        {msg.msg}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleStamp(c)}
                      className="bg-brand-brown text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap"
                    >
                      + Stamp
                    </button>
                    {freeDrinks > 0 && (
                      <button
                        onClick={() => handleRedeem(c)}
                        className="bg-yellow-400 text-brand-dark px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap"
                      >
                        Redeem 🎉
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(c)}
                      className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add-customer modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-brand-brown mb-4">Force Add Customer</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="First name" value={addForm.first_name}
                  onChange={(e) => setAddForm({ ...addForm, first_name: e.target.value })}
                  className="border border-brand-tan rounded-lg px-3 py-2" />
                <input required placeholder="Last name" value={addForm.last_name}
                  onChange={(e) => setAddForm({ ...addForm, last_name: e.target.value })}
                  className="border border-brand-tan rounded-lg px-3 py-2" />
              </div>
              <input required type="email" placeholder="Email" value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                className="w-full border border-brand-tan rounded-lg px-3 py-2" />
              <input required type="tel" inputMode="tel" placeholder="Phone" value={addForm.phone}
                onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                className="w-full border border-brand-tan rounded-lg px-3 py-2" />
              <input type="date" placeholder="Birthday (optional)" value={addForm.birthday}
                onChange={(e) => setAddForm({ ...addForm, birthday: e.target.value })}
                className="w-full border border-brand-tan rounded-lg px-3 py-2" />
              {addError && <p className="text-red-500 text-sm">{addError}</p>}
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => { setShowAdd(false); setAddError(''); setAddForm(EMPTY_FORM); }}
                  className="flex-1 border border-brand-tan text-brand-brown py-2.5 rounded-lg font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={adding}
                  className="flex-1 bg-brand-brown text-white py-2.5 rounded-lg font-bold disabled:opacity-60">
                  {adding ? 'Adding…' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

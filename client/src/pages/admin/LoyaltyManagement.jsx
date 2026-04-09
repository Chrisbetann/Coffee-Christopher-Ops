import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getLoyaltyCustomers, addStamp, redeemFree } from '../../api';

export default function LoyaltyManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [actionMsg, setActionMsg] = useState({});

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

  async function handleStamp(customer) {
    try {
      const { data } = await addStamp(customer.qr_code);
      setCustomers((prev) => prev.map((c) => c.id === customer.id ? data : c));
      flash(customer.id, `+1 stamp! Now ${data.stamps} total`);
    } catch {
      flash(customer.id, 'Failed to add stamp', true);
    }
  }

  async function handleRedeem(customer) {
    if (!confirm(`Redeem 1 free drink for ${customer.first_name}?`)) return;
    try {
      const { data } = await redeemFree(customer.qr_code);
      setCustomers((prev) => prev.map((c) => c.id === customer.id ? data : c));
      flash(customer.id, 'Free drink redeemed!');
    } catch (err) {
      flash(customer.id, err.response?.data?.error || 'No free drinks available', true);
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
      {/* Summary cards */}
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

      {/* Promotions note */}
      <div className="bg-brand-tan bg-opacity-30 border border-brand-tan rounded-xl p-4 mb-6">
        <p className="font-semibold text-brand-dark text-sm mb-1">📣 Send a Promotion</p>
        <p className="text-xs text-gray-600">
          Export customer contacts below to reach your members via email or SMS.
          {totalMembers > 0 && ` You have ${totalMembers} members with ${customers.filter(c => c.email).length} emails and ${customers.filter(c => c.phone).length} phone numbers on file.`}
        </p>
        {totalMembers > 0 && (
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
            className="mt-2 bg-brand-brown text-white px-4 py-1.5 rounded-lg text-xs font-medium"
          >
            Export CSV
          </button>
        )}
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
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                            ${i < stampsOnCard ? 'bg-brand-brown text-white' : 'bg-gray-100 text-gray-300'}`}
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}

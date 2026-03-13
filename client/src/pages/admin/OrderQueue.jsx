import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminOrders, updateOrderStatus } from '../../api';

const STATUS_COLOR = { sent: 'bg-yellow-100 text-yellow-700', preparing: 'bg-orange-100 text-orange-700', ready: 'bg-green-100 text-green-700' };
const NEXT_STATUS  = { sent: 'preparing', preparing: 'ready' };
const NEXT_LABEL   = { sent: 'Mark Preparing', preparing: 'Mark Ready' };

export default function OrderQueue() {
  const [orders, setOrders]   = useState([]);
  const [filter, setFilter]   = useState('active'); // active | all
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await getAdminOrders();
    setOrders(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // Poll every 5 seconds for new orders
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  async function advance(order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    await updateOrderStatus(order.id, next);
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: next } : o)));
  }

  const displayed = filter === 'active'
    ? orders.filter((o) => o.status !== 'ready')
    : orders;

  return (
    <AdminLayout title="Order Queue">
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[['active', 'Active Orders'], ['all', 'All Orders']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === val ? 'bg-brand-brown text-white' : 'bg-white border border-brand-tan text-brand-brown'}`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 self-center">Auto-refreshing…</span>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading orders…</p>
      ) : displayed.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-400">
          {filter === 'active' ? 'No active orders right now 🎉' : 'No orders found'}
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-brand-dark text-lg">#{order.order_num}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[order.status]}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-brown">${Number(order.total).toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleTimeString()}</p>
                </div>
              </div>

              {/* Items */}
              <div className="text-sm text-gray-600 mb-3 space-y-1">
                {order.items?.map((i) => (
                  <div key={i.id} className="flex items-start gap-2">
                    <span className="font-medium">{i.quantity}×</span>
                    <span>{i.item?.name}</span>
                    {i.modifiers && Object.keys(i.modifiers).length > 0 && (
                      <span className="text-xs text-gray-400">
                        ({Object.entries(i.modifiers).map(([k, v]) =>
                          `${k}: ${Array.isArray(v) ? (v.length ? v.join(', ') : 'None') : v}`
                        ).join(' · ')})
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Action button */}
              {NEXT_STATUS[order.status] && (
                <button
                  onClick={() => advance(order)}
                  className="w-full bg-brand-brown text-white py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark transition"
                >
                  {NEXT_LABEL[order.status]}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

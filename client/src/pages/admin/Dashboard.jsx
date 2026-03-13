import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { getDashboardSummary, getAlerts } from '../../api';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts]   = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardSummary('day').then(({ data }) => setSummary(data));
    getAlerts().then(({ data }) => setAlerts(data));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Today's Revenue" value={summary ? `$${summary.revenue.toFixed(2)}` : '…'} color="bg-green-50 border-green-200" />
        <KpiCard label="Today's Orders"  value={summary ? summary.orderCount : '…'}            color="bg-blue-50 border-blue-200" />
        <KpiCard label="Pending Orders"  value={summary ? summary.pendingOrders : '…'}         color="bg-yellow-50 border-yellow-200" />
        <KpiCard
          label="Low Stock Alerts"
          value={summary ? summary.lowStockCount : '…'}
          color={summary?.lowStockCount > 0 ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'}
        />
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: '📋 Order Queue',  to: '/admin/orders' },
          { label: '🍽️ Menu Mgmt',    to: '/admin/menu' },
          { label: '💰 Sales',        to: '/admin/sales' },
          { label: '📦 Inventory',    to: '/admin/inventory' },
        ].map(({ label, to }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="bg-white border border-brand-tan rounded-xl p-4 text-brand-brown font-semibold hover:bg-brand-cream transition text-left"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Low stock alerts */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-xl border border-red-200 p-4">
          <p className="font-bold text-red-500 mb-3">⚠️ Low Stock Alerts ({alerts.length})</p>
          <div className="space-y-2">
            {alerts.map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm bg-red-50 rounded-lg px-3 py-2">
                <span className="font-medium text-brand-dark">{a.name}</span>
                <span className="text-red-500">
                  {Number(a.count)} {a.unit} (par: {Number(a.par_level)})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function KpiCard({ label, value, color }) {
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-brand-dark mt-1">{value}</p>
    </div>
  );
}

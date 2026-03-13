import { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import AdminLayout from '../../components/AdminLayout';
import { getDashboardSummary, getSalesData, getTopItems, getVolumeData } from '../../api';

const PERIODS = ['day', 'week', 'month', 'year'];
const PIE_COLORS = ['#6B3F1E', '#C9A96E', '#8B5E3C', '#D4A853', '#4A2C0A'];

export default function SalesDashboard() {
  const [period, setPeriod]     = useState('week');
  const [summary, setSummary]   = useState(null);
  const [salesData, setSales]   = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [volume, setVolume]     = useState([]);

  async function load(p) {
    const [sumRes, salesRes, topRes, volRes] = await Promise.all([
      getDashboardSummary(p),
      getSalesData(p),
      getTopItems(p),
      getVolumeData(p),
    ]);
    setSummary(sumRes.data);
    setSales(salesRes.data.data);
    setTopItems(topRes.data);
    setVolume(volRes.data.data);
  }

  useEffect(() => { load(period); }, [period]);

  return (
    <AdminLayout title="Sales Dashboard">
      {/* Period selector */}
      <div className="flex gap-2 mb-6">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
              period === p ? 'bg-brand-brown text-white' : 'bg-white border border-brand-tan text-brand-brown'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-sm text-gray-500 capitalize">{period} Revenue</p>
          <p className="text-3xl font-bold text-brand-brown mt-1">
            {summary ? `$${summary.revenue.toFixed(2)}` : '…'}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-sm text-gray-500 capitalize">{period} Orders</p>
          <p className="text-3xl font-bold text-brand-brown mt-1">
            {summary ? summary.orderCount : '…'}
          </p>
        </div>
      </div>

      {/* Revenue trend chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <p className="font-semibold text-brand-brown mb-4">Revenue Trend</p>
        {salesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salesData} margin={{ top: 0, right: 8, bottom: 0, left: -10 }}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#6B3F1E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-sm text-center py-8">No data for this period</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top 5 items */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="font-semibold text-brand-brown mb-4">Top 5 Items</p>
          {topItems.length > 0 ? (
            <>
              <div className="space-y-2 mb-4">
                {topItems.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-brand-tan text-white text-xs flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-brand-dark">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-brand-brown">${item.revenue.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{item.qty} sold</p>
                    </div>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={topItems} dataKey="qty" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({ name }) => name}>
                    {topItems.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
            </>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">No orders in this period</p>
          )}
        </div>

        {/* Order volume */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="font-semibold text-brand-brown mb-4">Order Volume</p>
          {volume.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={volume} margin={{ top: 0, right: 8, bottom: 0, left: -10 }}>
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip formatter={(v) => [v, 'Orders']} />
                <Line type="monotone" dataKey="count" stroke="#6B3F1E" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">No data for this period</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

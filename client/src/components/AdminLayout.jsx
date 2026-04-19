import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/admin/dashboard', label: '📊 Dashboard' },
  { to: '/admin/orders',    label: '📋 Orders' },
  { to: '/admin/menu',      label: '🍽️ Menu' },
  { to: '/admin/sales',     label: '💰 Sales' },
  { to: '/admin/inventory', label: '📦 Inventory' },
  { to: '/admin/reviews',   label: '⭐ Reviews' },
  { to: '/admin/loyalty',   label: '🎟️ Loyalty' },
  { to: '/admin/promos',    label: '📣 Promotions' },
];

export default function AdminLayout({ children, title }) {
  const { logout, email } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-brand-dark text-white flex flex-col fixed top-0 bottom-0">
        <div className="px-4 py-5 border-b border-white/10">
          <p className="font-bold text-lg">☕ CC Admin</p>
          <p className="text-xs text-white/50 truncate">{email}</p>
        </div>
        <nav className="flex-1 py-4">
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-brand-brown text-white' : 'text-white/70 hover:bg-white/10'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <button onClick={handleLogout} className="text-sm text-white/60 hover:text-white transition">
            Sign Out →
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 p-6">
        {title && <h1 className="text-2xl font-bold text-brand-brown mb-6">{title}</h1>}
        {children}
      </main>
    </div>
  );
}

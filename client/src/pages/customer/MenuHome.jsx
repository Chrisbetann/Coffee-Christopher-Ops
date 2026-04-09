import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getMenuItems } from '../../api';
import { useCart } from '../../context/CartContext';

const CATEGORY_EMOJI = {
  'Coffee & Core Drinks': '☕',
  'Refreshers': '🥤',
  'Energy Drinks': '⚡',
  'Breakfast Items': '🥐',
  'Hot Food': '🍟',
  'Drinks': '🍺',
  'Combos': '🎉',
};

export default function MenuHome() {
  const [categories, setCategories] = useState([]);
  const [items, setItems]           = useState([]);
  const [activecat, setActiveCat]   = useState(null);
  const [loading, setLoading]       = useState(true);
  const { itemCount } = useCart();

  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [catRes, itemRes] = await Promise.all([getCategories(), getMenuItems()]);
        setCategories(catRes.data);
        setItems(itemRes.data);
      } catch (err) {
        setError('Unable to load menu. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const displayed = activecat ? items.filter((i) => i.category_id === activecat) : items;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-brand-brown text-lg">Loading menu…</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-600 text-lg text-center px-4">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-brand-brown text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow">
        <h1 className="text-xl font-bold tracking-wide">☕ Coffee Christopher</h1>
        <div className="flex items-center gap-3">
          <Link to="/loyalty" className="text-sm text-white font-semibold bg-white/20 border border-white/30 px-3 py-1.5 rounded-full flex items-center gap-1">
            🎟️ Rewards
          </Link>
          <Link to="/cart" className="relative">
            <span className="text-2xl">🛒</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-brand-tan text-brand-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
        <button
          onClick={() => setActiveCat(null)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition ${
            activecat === null ? 'bg-brand-brown text-white border-brand-brown' : 'bg-white text-brand-brown border-brand-tan'
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCat(activecat === c.id ? null : c.id)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              activecat === c.id ? 'bg-brand-brown text-white border-brand-brown' : 'bg-white text-brand-brown border-brand-tan'
            }`}
          >
            {CATEGORY_EMOJI[c.name] || '•'} {c.name}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="px-4 pb-24">
        {categories
          .filter((c) => !activecat || c.id === activecat)
          .map((c) => {
            const catItems = displayed.filter((i) => i.category_id === c.id);
            if (catItems.length === 0) return null;
            return (
              <div key={c.id} className="mb-6">
                <h2 className="text-brand-brown font-bold text-lg mb-3">
                  {CATEGORY_EMOJI[c.name] || '•'} {c.name}
                </h2>
                <div className="grid gap-3">
                  {catItems.map((item) => (
                    <Link
                      key={item.id}
                      to={`/menu/item/${item.id}`}
                      className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-brand-dark">{item.name}</p>
                        {item.description && <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{item.description}</p>}
                      </div>
                      <div className="ml-4 text-right">
                        <p className="font-bold text-brand-brown">${Number(item.price).toFixed(2)}</p>
                        <span className="text-xs text-brand-tan">Tap to customize →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
      </div>

      {/* Floating cart button */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-20">
          <Link
            to="/cart"
            className="bg-brand-brown text-white px-8 py-3 rounded-full shadow-lg font-semibold flex items-center gap-2"
          >
            🛒 View Cart ({itemCount})
          </Link>
        </div>
      )}
    </div>
  );
}

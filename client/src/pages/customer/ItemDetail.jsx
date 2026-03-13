import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMenuItem } from '../../api';
import { useCart } from '../../context/CartContext';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [item, setItem]                 = useState(null);
  const [loading, setLoading]           = useState(true);
  const [quantity, setQuantity]         = useState(1);
  const [selectedMods, setSelectedMods] = useState({});

  useEffect(() => {
    getMenuItem(id).then(({ data }) => {
      setItem(data);
      // Init each modifier to first option (or empty for multi-select)
      const init = {};
      data.modifiers.forEach((mod) => {
        if (mod.name === 'Extras') init[mod.name] = [];
        else init[mod.name] = mod.options[0];
      });
      setSelectedMods(init);
      setLoading(false);
    });
  }, [id]);

  function toggleExtra(modName, option) {
    setSelectedMods((prev) => {
      const current = prev[modName] || [];
      return {
        ...prev,
        [modName]: current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option],
      };
    });
  }

  function handleAdd() {
    addItem(item, quantity, selectedMods);
    navigate('/menu');
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-brand-brown">Loading…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-brand-brown text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10 shadow">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <h1 className="font-bold text-lg">{item.name}</h1>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto pb-32">
        {/* Price */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <p className="text-2xl font-bold text-brand-brown">${Number(item.price).toFixed(2)}</p>
          {item.description && <p className="text-gray-600 mt-1">{item.description}</p>}
          <p className="text-xs text-gray-400 mt-1">{item.category?.name}</p>
        </div>

        {/* Modifiers */}
        {item.modifiers.map((mod) => (
          <div key={mod.id} className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <p className="font-semibold text-brand-brown mb-3">{mod.name}</p>
            {mod.name === 'Extras' ? (
              // Multi-select checkboxes
              <div className="flex flex-wrap gap-2">
                {mod.options.map((opt) => {
                  const selected = (selectedMods[mod.name] || []).includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleExtra(mod.name, opt)}
                      className={`px-4 py-2 rounded-full text-sm border font-medium transition ${
                        selected ? 'bg-brand-brown text-white border-brand-brown' : 'bg-white text-brand-dark border-brand-tan'
                      }`}
                    >
                      {selected ? '✓ ' : ''}{opt}
                    </button>
                  );
                })}
              </div>
            ) : (
              // Single select
              <div className="flex flex-wrap gap-2">
                {mod.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedMods((prev) => ({ ...prev, [mod.name]: opt }))}
                    className={`px-4 py-2 rounded-full text-sm border font-medium transition ${
                      selectedMods[mod.name] === opt
                        ? 'bg-brand-brown text-white border-brand-brown'
                        : 'bg-white text-brand-dark border-brand-tan'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Quantity */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4 flex items-center justify-between">
          <span className="font-semibold text-brand-brown">Quantity</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full bg-brand-tan text-white font-bold flex items-center justify-center"
            >−</button>
            <span className="text-lg font-bold w-4 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              className="w-8 h-8 rounded-full bg-brand-brown text-white font-bold flex items-center justify-center"
            >+</button>
          </div>
        </div>
      </div>

      {/* Add to cart */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-brand-cream border-t border-brand-tan">
        <button
          onClick={handleAdd}
          className="w-full bg-brand-brown text-white py-4 rounded-xl font-bold text-lg shadow"
        >
          Add to Cart — ${(Number(item.price) * quantity).toFixed(2)}
        </button>
      </div>
    </div>
  );
}

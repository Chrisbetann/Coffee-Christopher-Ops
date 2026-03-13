import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { placeOrder } from '../../api';
import { useState } from 'react';

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal, tax, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handlePlaceOrder() {
    if (items.length === 0) return;
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        items: items.map((i) => ({
          item_id: i.item.id,
          quantity: i.quantity,
          unit_price: Number(i.item.price),
          modifiers: i.selectedModifiers,
        })),
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      };
      const { data } = await placeOrder(payload);
      clearCart();
      navigate(`/order/${data.id}/confirmed`, { state: { order: data } });
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center gap-4">
      <p className="text-2xl">🛒</p>
      <p className="text-brand-brown font-semibold">Your cart is empty</p>
      <button onClick={() => navigate('/menu')} className="bg-brand-brown text-white px-6 py-2 rounded-full">
        Browse Menu
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="bg-brand-brown text-white px-4 py-4 flex items-center gap-3 sticky top-0 z-10 shadow">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <h1 className="font-bold text-lg">Your Order</h1>
      </header>

      <div className="px-4 py-4 max-w-lg mx-auto pb-56">
        {items.map((cartItem) => (
          <div key={cartItem.id} className="bg-white rounded-xl p-4 shadow-sm mb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-brand-dark">{cartItem.item.name}</p>
                {cartItem.selectedModifiers && Object.keys(cartItem.selectedModifiers).length > 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    {Object.entries(cartItem.selectedModifiers).map(([k, v]) => (
                      <span key={k} className="mr-2">
                        {k}: {Array.isArray(v) ? (v.length ? v.join(', ') : 'None') : v}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="font-bold text-brand-brown ml-4">
                ${(Number(cartItem.item.price) * cartItem.quantity).toFixed(2)}
              </p>
            </div>

            <div className="flex items-center justify-between mt-3">
              <button onClick={() => removeItem(cartItem.id)} className="text-sm text-red-400 hover:text-red-600">
                Remove
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-brand-tan text-white font-bold flex items-center justify-center"
                >−</button>
                <span className="w-4 text-center font-bold">{cartItem.quantity}</span>
                <button
                  onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-brand-brown text-white font-bold flex items-center justify-center"
                >+</button>
              </div>
            </div>
          </div>
        ))}

        {/* Order summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Tax (7%)</span><span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-brand-brown text-lg border-t border-brand-tan pt-2 mt-2">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-brand-cream border-t border-brand-tan space-y-2">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          onClick={handlePlaceOrder}
          disabled={submitting}
          className="w-full bg-brand-brown text-white py-4 rounded-xl font-bold text-lg shadow disabled:opacity-60"
        >
          {submitting ? 'Placing Order…' : `Place Order — $${total.toFixed(2)}`}
        </button>
        <button
          onClick={() => navigate('/menu')}
          className="w-full text-brand-brown py-2 text-sm font-medium"
        >
          + Add More Items
        </button>
      </div>
    </div>
  );
}

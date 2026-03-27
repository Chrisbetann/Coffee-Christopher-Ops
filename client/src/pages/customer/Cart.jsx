import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { placeOrder, applyPromo, loyaltySignup, loyaltyLookup } from '../../api';
import { useState } from 'react';

export default function Cart() {
  const {
    items, updateQuantity, removeItem, subtotal, tax, total, clearCart,
    promoCode, promoDiscount, promoInfo, applyPromoResult, clearPromo,
    customerEmail, setCustomerEmail, customerName, setCustomerName,
  } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Promo code state
  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');

  // Loyalty state
  const [loyaltyEmail, setLoyaltyEmail] = useState(customerEmail);
  const [loyaltyName, setLoyaltyName] = useState(customerName);
  const [loyaltyLookupDone, setLoyaltyLookupDone] = useState(!!customerEmail);
  const [loyaltyLoading, setLoyaltyLoading] = useState(false);
  const [loyaltyError, setLoyaltyError] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  async function handleApplyPromo() {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const itemIds = items.map((i) => i.item.id);
      const { data } = await applyPromo({ code: promoInput.trim(), subtotal, item_ids: itemIds });
      applyPromoResult(data.promo.code, data.discount, data.promo);
      setPromoInput('');
    } catch (err) {
      setPromoError(err.response?.data?.error || 'Invalid promo code');
    } finally {
      setPromoLoading(false);
    }
  }

  async function handleLoyaltyLookup() {
    if (!loyaltyEmail.trim()) return;
    setLoyaltyLoading(true);
    setLoyaltyError('');
    try {
      const { data } = await loyaltyLookup(loyaltyEmail.trim());
      setCustomerEmail(loyaltyEmail.trim());
      setCustomerName(data.name);
      setLoyaltyPoints(data.points);
      setLoyaltyLookupDone(true);
      setShowSignup(false);
    } catch (err) {
      if (err.response?.status === 404) {
        setShowSignup(true);
        setLoyaltyError('No loyalty account found. Sign up below!');
      } else {
        setLoyaltyError('Failed to look up account');
      }
    } finally {
      setLoyaltyLoading(false);
    }
  }

  async function handleLoyaltySignup() {
    if (!loyaltyEmail.trim() || !loyaltyName.trim()) return;
    setLoyaltyLoading(true);
    setLoyaltyError('');
    try {
      await loyaltySignup({ email: loyaltyEmail.trim(), name: loyaltyName.trim() });
      setCustomerEmail(loyaltyEmail.trim());
      setCustomerName(loyaltyName.trim());
      setLoyaltyPoints(0);
      setLoyaltyLookupDone(true);
      setShowSignup(false);
      setLoyaltyError('');
    } catch (err) {
      setLoyaltyError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoyaltyLoading(false);
    }
  }

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
        discount: parseFloat(promoDiscount.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        promo_code: promoCode || null,
        customer_email: customerEmail || null,
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

      <div className="px-4 py-4 max-w-lg mx-auto pb-72">
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

        {/* Loyalty Program */}
        <div className="bg-white rounded-xl p-4 shadow-sm mt-4">
          <p className="font-semibold text-brand-brown mb-2">☕ Loyalty Rewards</p>
          {loyaltyLookupDone ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brand-dark">{customerName}</p>
                <p className="text-xs text-gray-500">{customerEmail} · {loyaltyPoints ?? 0} pts</p>
              </div>
              <button
                onClick={() => { setLoyaltyLookupDone(false); setCustomerEmail(''); setCustomerName(''); setLoyaltyPoints(null); setLoyaltyEmail(''); setLoyaltyError(''); }}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={loyaltyEmail}
                  onChange={(e) => setLoyaltyEmail(e.target.value)}
                  className="flex-1 border border-brand-tan rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-brown"
                  onKeyDown={(e) => e.key === 'Enter' && handleLoyaltyLookup()}
                />
                <button
                  onClick={handleLoyaltyLookup}
                  disabled={loyaltyLoading || !loyaltyEmail.trim()}
                  className="bg-brand-brown text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {loyaltyLoading ? '…' : 'Apply'}
                </button>
              </div>
              {loyaltyError && <p className="text-xs text-amber-600 mt-1">{loyaltyError}</p>}

              {showSignup && (
                <div className="mt-3 border-t border-brand-tan pt-3">
                  <p className="text-sm font-medium text-brand-brown mb-2">Join Loyalty — Earn 1 pt per $1</p>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={loyaltyName}
                    onChange={(e) => setLoyaltyName(e.target.value)}
                    className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-brand-brown"
                  />
                  <button
                    onClick={handleLoyaltySignup}
                    disabled={loyaltyLoading || !loyaltyName.trim()}
                    className="w-full bg-brand-brown text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    {loyaltyLoading ? 'Signing up…' : 'Sign Up & Earn Points'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Promo Code */}
        <div className="bg-white rounded-xl p-4 shadow-sm mt-3">
          <p className="font-semibold text-brand-brown mb-2">🏷️ Promo Code</p>
          {promoInfo ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">{promoInfo.code} — {promoInfo.name}</p>
                <p className="text-xs text-green-600">
                  {promoInfo.type === 'percent_off' ? `${promoInfo.value}% off` : `$${promoInfo.value} off`} · Saving ${promoDiscount.toFixed(2)}
                </p>
              </div>
              <button onClick={clearPromo} className="text-xs text-red-400 hover:text-red-600">Remove</button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  className="flex-1 border border-brand-tan rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-1 focus:ring-brand-brown"
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={promoLoading || !promoInput.trim()}
                  className="bg-brand-brown text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {promoLoading ? '…' : 'Apply'}
                </button>
              </div>
              {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
            </>
          )}
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm mt-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          {promoDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600 mb-1">
              <span>Discount ({promoCode})</span><span>−${promoDiscount.toFixed(2)}</span>
            </div>
          )}
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

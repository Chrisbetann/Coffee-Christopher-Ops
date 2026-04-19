import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { lookupByPhone } from '../../api';

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function LoyaltyHome() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLookup(e) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Please enter your full 10-digit phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await lookupByPhone(digits);
      navigate(`/loyalty/${data.qr_code}`);
    } catch (err) {
      setError(err.response?.data?.error || "We couldn't find a card for that number");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream px-4 py-8">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-6xl mb-2">☕</p>
          <h1 className="text-3xl font-bold text-brand-brown">Rewards Club</h1>
          <p className="text-gray-500 mt-1">Every 6th drink is on us</p>
        </div>

        {/* Preview stamp card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center ${
                  n < 6 ? 'bg-brand-brown' : 'bg-yellow-400'
                }`}
              >
                <span className="text-2xl">{n < 6 ? '☕' : '⭐'}</span>
                <span className={`text-xs font-bold mt-1 ${n < 6 ? 'text-white' : 'text-brand-dark'}`}>
                  {n < 6 ? `#${n}` : 'FREE!'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400">Collect 6 stamps — 6th drink free!</p>
        </div>

        {/* Existing member — phone login */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <p className="font-bold text-brand-dark text-center mb-1">Already a member?</p>
          <p className="text-xs text-gray-400 text-center mb-3">Sign in with your phone number</p>
          <form onSubmit={handleLookup} className="flex flex-col gap-3">
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={(e) => { setPhone(formatPhone(e.target.value)); setError(''); }}
              className="w-full border border-brand-tan rounded-xl px-4 py-3 text-center text-lg tracking-wide focus:outline-none focus:ring-2 focus:ring-brand-brown"
            />
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-brown text-white py-3 rounded-xl font-bold text-base disabled:opacity-60"
            >
              {loading ? 'Looking up…' : 'View My Stamp Card →'}
            </button>
          </form>
        </div>

        {/* Join button */}
        <button
          onClick={() => navigate('/loyalty/register')}
          className="w-full bg-brand-tan text-brand-dark py-4 rounded-xl font-bold text-base shadow-sm mb-4"
        >
          New here? Join the Club ☕
        </button>

        <button
          onClick={() => navigate('/menu')}
          className="w-full text-brand-brown py-3 text-sm font-medium"
        >
          ← Back to Menu
        </button>
      </div>
    </div>
  );
}

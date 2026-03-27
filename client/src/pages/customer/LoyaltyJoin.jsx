import { useState } from 'react';
import { loyaltySignup } from '../../api';

export default function LoyaltyJoin() {
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [member, setMember] = useState(null);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setServerError('');
    try {
      const { data } = await loyaltySignup({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
      });
      setMember(data.customer);
      setStep('success');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-sm w-full text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h1 className="text-2xl font-bold text-brand-brown mb-2">You're In!</h1>
          <p className="text-gray-500 mb-6">Welcome to the Coffee Christopher Rewards Program</p>

          <div className="bg-brand-cream rounded-xl p-4 mb-6">
            <p className="font-bold text-brand-dark text-lg">{member?.name}</p>
            <p className="text-sm text-gray-500">{member?.email}</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-brand-brown">{member?.points ?? 0}</span>
              <span className="text-gray-500 text-sm">points</span>
            </div>
          </div>

          <div className="text-left bg-amber-50 rounded-xl p-4 mb-6 space-y-2">
            <p className="text-sm font-semibold text-amber-800">How to earn points:</p>
            <p className="text-sm text-amber-700">☕ Enter your email at checkout</p>
            <p className="text-sm text-amber-700">⭐ Earn 1 point for every $1 spent</p>
            <p className="text-sm text-amber-700">🏷️ Receive exclusive promo codes</p>
          </div>

          <button
            onClick={() => window.location.href = '/menu'}
            className="w-full bg-brand-brown text-white py-3 rounded-xl font-semibold"
          >
            Start Ordering →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full overflow-hidden">
        {/* Header */}
        <div className="bg-brand-brown px-6 py-8 text-center">
          <p className="text-white text-4xl font-bold mb-1">☕</p>
          <h1 className="text-white text-xl font-bold">Coffee Christopher</h1>
          <p className="text-white/70 text-sm mt-1">Loyalty Rewards Program</p>
        </div>

        <div className="px-6 py-6">
          <p className="text-center text-gray-600 text-sm mb-6">
            Sign up to earn points on every order and receive exclusive promos!
          </p>

          {/* Perks */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { icon: '⭐', text: '1 pt per $1' },
              { icon: '🏷️', text: 'Exclusive deals' },
              { icon: '☕', text: 'Free rewards' },
            ].map(({ icon, text }) => (
              <div key={text} className="bg-brand-cream rounded-xl p-3 text-center">
                <p className="text-xl">{icon}</p>
                <p className="text-xs text-brand-brown font-medium mt-1">{text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setErrors((e) => ({ ...e, name: '' })); }}
                placeholder="Jane Smith"
                autoComplete="name"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => { setForm((f) => ({ ...f, email: e.target.value })); setErrors((e) => ({ ...e, email: '' })); }}
                placeholder="jane@example.com"
                autoComplete="email"
                inputMode="email"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Phone Number <span className="text-gray-400 font-normal">(optional — for SMS promos)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="(555) 123-4567"
                autoComplete="tel"
                inputMode="tel"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-brown"
              />
            </div>

            {serverError && (
              <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-brown text-white py-4 rounded-xl font-bold text-base shadow disabled:opacity-60 mt-2"
            >
              {submitting ? 'Joining…' : 'Join & Start Earning ⭐'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            Already a member? Just enter your email at checkout to earn points.
          </p>
        </div>
      </div>
    </div>
  );
}

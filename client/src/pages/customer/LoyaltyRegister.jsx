import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerLoyalty } from '../../api';

export default function LoyaltyRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', birthday: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await registerLoyalty(form);
      navigate(`/loyalty/${data.qr_code}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream px-4 py-8">
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-8">
          <p className="text-5xl mb-3">☕</p>
          <h1 className="text-2xl font-bold text-brand-brown">Join the Club</h1>
          <p className="text-gray-500 mt-1">Earn a free drink every 6 stamps</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-lg
                  ${n < 6 ? 'bg-brand-brown text-white' : 'bg-yellow-400 text-brand-dark font-bold'}`}
              >
                {n < 6 ? '☕' : '★'}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400">Every 6th drink is free!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">First Name</label>
              <input
                type="text"
                required
                value={form.first_name}
                onChange={(e) => set('first_name', e.target.value)}
                className="w-full border border-brand-tan rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown"
                placeholder="Chris"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Last Name</label>
              <input
                type="text"
                required
                value={form.last_name}
                onChange={(e) => set('last_name', e.target.value)}
                className="w-full border border-brand-tan rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown"
                placeholder="Smith"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className="w-full border border-brand-tan rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              className="w-full border border-brand-tan rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">
              Birthday <span className="text-gray-400 font-normal">(optional — get a bonus stamp!)</span>
            </label>
            <input
              type="date"
              value={form.birthday}
              onChange={(e) => set('birthday', e.target.value)}
              className="w-full border border-brand-tan rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-brown text-white py-3 rounded-xl font-bold text-lg disabled:opacity-60"
          >
            {loading ? 'Creating your card…' : 'Get My Stamp Card ☕'}
          </button>
        </form>

        <button
          onClick={() => navigate('/menu')}
          className="w-full text-brand-brown py-3 text-sm font-medium mt-2"
        >
          ← Back to Menu
        </button>
      </div>
    </div>
  );
}

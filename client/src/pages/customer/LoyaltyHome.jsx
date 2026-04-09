import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoyaltyHome() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  function handleLookup(e) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    if (trimmed.length !== 8) {
      setError('Card code is 8 characters — check your card and try again.');
      return;
    }
    navigate(`/loyalty/${trimmed}`);
  }

  return (
    <div className="min-h-screen bg-brand-cream px-4 py-10">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-6xl mb-3">☕</p>
          <h1 className="text-3xl font-bold text-brand-brown">Rewards Club</h1>
          <p className="text-gray-500 mt-2">Every 6th drink is on us</p>
        </div>

        {/* Preview stamp card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-8">
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[1,2,3,4,5,6].map((n) => (
              <div key={n} className={`aspect-square rounded-2xl flex flex-col items-center justify-center
                ${n < 6 ? 'bg-brand-brown' : 'bg-yellow-400'}`}>
                <span className="text-2xl">{n < 6 ? '☕' : '⭐'}</span>
                <span className={`text-xs font-bold mt-1 ${n < 6 ? 'text-white' : 'text-brand-dark'}`}>
                  {n < 6 ? `#${n}` : 'FREE!'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400">Collect 6 stamps — 6th drink free!</p>
        </div>

        {/* Join button */}
        <button
          onClick={() => navigate('/loyalty/register')}
          className="w-full bg-brand-brown text-white py-4 rounded-xl font-bold text-lg shadow-md mb-4"
        >
          Join the Club ☕
        </button>

        {/* Existing member lookup */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-semibold text-brand-dark mb-3 text-center">Already a member?</p>
          <form onSubmit={handleLookup} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Enter your 8-character card code"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(''); }}
              maxLength={8}
              className="w-full border border-brand-tan rounded-lg px-3 py-2 text-center font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-brand-brown"
            />
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-brand-tan text-brand-dark py-2.5 rounded-xl font-semibold"
            >
              View My Card →
            </button>
          </form>
        </div>

        <button
          onClick={() => navigate('/menu')}
          className="w-full text-brand-brown py-3 text-sm font-medium mt-4"
        >
          ← Back to Menu
        </button>
      </div>
    </div>
  );
}

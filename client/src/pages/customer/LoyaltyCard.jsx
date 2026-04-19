import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { getLoyaltyCard } from '../../api';

const STAMPS_FOR_FREE = 6;
const API_BASE = import.meta.env.VITE_API_URL || '/api';

function formatPhoneDisplay(digits) {
  const d = String(digits || '').replace(/\D/g, '');
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return digits;
}

// Rough heuristic — used to choose default wallet button
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isAndroid = /Android/.test(navigator.userAgent);

export default function LoyaltyCard() {
  const { qrCode } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState('');
  const [animStamp, setAnimStamp] = useState(null);
  const [walletNote, setWalletNote] = useState('');

  useEffect(() => {
    let prevStamps = null;

    async function load() {
      try {
        const { data } = await getLoyaltyCard(qrCode);
        if (prevStamps !== null && data.stamps > prevStamps) {
          const newIdx = (data.stamps - 1) % STAMPS_FOR_FREE;
          setAnimStamp(newIdx);
          setTimeout(() => setAnimStamp(null), 800);
        }
        prevStamps = data.stamps;
        setCustomer(data);
      } catch {
        setError('Loyalty card not found.');
      }
    }

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [qrCode]);

  async function handleAddToWallet(platform) {
    setWalletNote('');
    const url = `${API_BASE}/loyalty/${qrCode}/${platform}-wallet`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        // When fully configured, server will serve .pkpass or redirect
        window.location.href = url;
        return;
      }
      const data = await res.json();
      if (res.status === 501) {
        setWalletNote(`Wallet isn't fully set up yet — see server/wallet/SETUP.md. (${data.platform})`);
      } else {
        setWalletNote(data.error || 'Unable to add to wallet.');
      }
    } catch {
      setWalletNote('Network error — please try again.');
    }
  }

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream gap-4 px-4">
      <p className="text-5xl">☕</p>
      <p className="text-red-500 font-medium">{error}</p>
      <button
        onClick={() => navigate('/loyalty/register')}
        className="bg-brand-brown text-white px-8 py-3 rounded-full font-semibold"
      >
        Join the Loyalty Club
      </button>
      <button onClick={() => navigate('/menu')} className="text-brand-brown text-sm">
        ← Back to Menu
      </button>
    </div>
  );

  if (!customer) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <p className="text-brand-brown text-lg">Loading your card…</p>
    </div>
  );

  const stampsOnCard = customer.stamps % STAMPS_FOR_FREE;
  const freeDrinksAvailable = Math.floor(customer.stamps / STAMPS_FOR_FREE);
  const cardUrl = `${window.location.origin}/loyalty/${qrCode}`;

  return (
    <div className="min-h-screen bg-brand-cream px-4 py-6 pb-10">
      <style>{`
        @keyframes stamp-pop {
          0%   { transform: scale(0.3) rotate(-15deg); opacity: 0; }
          60%  { transform: scale(1.3) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes celebrate {
          0%, 100% { transform: scale(1); }
          25%       { transform: scale(1.05) rotate(-2deg); }
          75%       { transform: scale(1.05) rotate(2deg); }
        }
        .stamp-animate { animation: stamp-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .celebrate     { animation: celebrate 0.5s ease-in-out 2; }
      `}</style>

      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-5">
          <p className="text-4xl mb-1">☕</p>
          <h1 className="text-2xl font-bold text-brand-brown">Coffee Christopher</h1>
          <p className="text-gray-500 text-sm">Loyalty Card</p>
        </div>

        {/* Customer banner */}
        <div className={`bg-brand-brown text-white rounded-2xl p-5 mb-4 shadow-lg ${freeDrinksAvailable > 0 ? 'celebrate' : ''}`}>
          <p className="text-xl font-bold">{customer.first_name} {customer.last_name}</p>
          <p className="text-brand-tan text-sm mt-0.5">{formatPhoneDisplay(customer.phone)}</p>
          <p className="text-brand-tan text-sm">{customer.stamps} total stamp{customer.stamps !== 1 ? 's' : ''} earned</p>
          {freeDrinksAvailable > 0 && (
            <div className="mt-3 bg-yellow-400 text-brand-dark px-4 py-2 rounded-full inline-flex items-center gap-2 font-bold text-sm">
              🎉 {freeDrinksAvailable} Free Drink{freeDrinksAvailable > 1 ? 's' : ''} Ready!
            </div>
          )}
        </div>

        {/* Stamp card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold text-brand-dark">Stamp Card</p>
            <p className="text-sm text-gray-400">{stampsOnCard}/{STAMPS_FOR_FREE} to free drink</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: STAMPS_FOR_FREE }).map((_, i) => {
              const filled = i < stampsOnCard;
              const isNew = i === animStamp;
              const isLast = i === STAMPS_FOR_FREE - 1;
              return (
                <div
                  key={i}
                  className={`
                    aspect-square rounded-2xl flex flex-col items-center justify-center
                    transition-all duration-300
                    ${filled
                      ? isLast
                        ? 'bg-yellow-400 shadow-lg'
                        : 'bg-brand-brown shadow-md'
                      : 'bg-gray-50 border-2 border-dashed border-gray-200'}
                    ${isNew ? 'stamp-animate' : ''}
                  `}
                >
                  {filled ? (
                    <>
                      <span className="text-2xl">{isLast ? '⭐' : '☕'}</span>
                      <span className={`text-xs font-bold mt-1 ${isLast ? 'text-brand-dark' : 'text-white'}`}>
                        {isLast ? 'FREE!' : `#${i + 1}`}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl text-gray-200">○</span>
                      <span className="text-xs text-gray-300 mt-1">#{i + 1}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              {stampsOnCard === 0 && customer.stamps > 0
                ? '🎉 Free drink earned! Show the card above to your cashier.'
                : `${STAMPS_FOR_FREE - stampsOnCard} more stamp${STAMPS_FOR_FREE - stampsOnCard !== 1 ? 's' : ''} until your next free drink!`}
            </p>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4 text-center">
          <p className="font-semibold text-brand-dark mb-1">Show to Cashier</p>
          <p className="text-xs text-gray-400 mb-4">They'll scan this to add your stamp</p>
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-white rounded-xl border border-gray-100 inline-block">
              <QRCode value={cardUrl} size={180} fgColor="#5C3A1E" bgColor="#FFFFFF" level="M" />
            </div>
          </div>
          <p className="text-xs font-mono text-gray-400 tracking-widest mt-2">{qrCode}</p>
        </div>

        {/* Add to Wallet */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <p className="font-semibold text-brand-dark mb-1 text-center">Add to Wallet</p>
          <p className="text-xs text-gray-400 text-center mb-3">Keep your card on your lock screen — we'll remind you when you're nearby.</p>
          <div className="flex flex-col gap-2">
            {(isIOS || !isAndroid) && (
              <button
                onClick={() => handleAddToWallet('apple')}
                className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm active:scale-95 transition"
              >
                 Add to Apple Wallet
              </button>
            )}
            {(isAndroid || !isIOS) && (
              <button
                onClick={() => handleAddToWallet('google')}
                className="w-full bg-white border-2 border-gray-900 text-gray-900 py-3 rounded-xl font-semibold text-sm active:scale-95 transition"
              >
                Save to Google Wallet
              </button>
            )}
          </div>
          {walletNote && <p className="text-xs text-red-500 text-center mt-2">{walletNote}</p>}
        </div>

        <button onClick={() => navigate('/menu')} className="w-full bg-brand-brown text-white py-3 rounded-xl font-bold">
          ← Back to Menu
        </button>
      </div>
    </div>
  );
}

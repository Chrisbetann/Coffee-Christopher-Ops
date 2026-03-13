import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder } from '../../api';

const STEPS = ['sent', 'preparing', 'ready'];
const STEP_LABELS = { sent: 'Order Sent', preparing: 'Preparing', ready: 'Ready for Pickup!' };
const STEP_EMOJI  = { sent: '📨', preparing: '☕', ready: '✅' };
const STEP_COLOR  = { sent: 'bg-yellow-400', preparing: 'bg-orange-400', ready: 'bg-green-500' };

export default function OrderStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  async function fetchOrder() {
    try {
      const { data } = await getOrder(id);
      setOrder(data);
    } catch {
      setError('Could not load order status.');
    }
  }

  useEffect(() => {
    fetchOrder();
    // Poll every 5 seconds per risk mitigation R-03
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <p className="text-red-500">{error}</p>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <p className="text-brand-brown">Loading order…</p>
    </div>
  );

  const currentStep = STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen bg-brand-cream px-4 py-8">
      <div className="max-w-sm mx-auto">
        {/* Order number */}
        <div className="text-center mb-8">
          <p className="text-4xl mb-2">{STEP_EMOJI[order.status]}</p>
          <h1 className="text-2xl font-bold text-brand-brown">{STEP_LABELS[order.status]}</h1>
          <p className="text-gray-500 mt-1">Order <span className="font-bold text-brand-dark">#{order.order_num}</span></p>
          {order.status !== 'ready' && (
            <p className="text-xs text-gray-400 mt-1">Auto-refreshing every 5 seconds…</p>
          )}
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all ${
                  i <= currentStep ? STEP_COLOR[STEPS[currentStep]] : 'bg-gray-200'
                }`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <p className={`text-xs mt-1 text-center ${i <= currentStep ? 'text-brand-brown font-semibold' : 'text-gray-400'}`}>
                  {STEP_LABELS[step]}
                </p>
                {i < STEPS.length - 1 && (
                  <div className="hidden" />
                )}
              </div>
            ))}
          </div>
          {/* Connector line */}
          <div className="flex mt-2 px-5">
            <div className={`h-1 flex-1 rounded transition-all ${currentStep >= 1 ? STEP_COLOR[STEPS[currentStep]] : 'bg-gray-200'}`} />
            <div className={`h-1 flex-1 rounded ml-2 transition-all ${currentStep >= 2 ? STEP_COLOR[STEPS[currentStep]] : 'bg-gray-200'}`} />
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <p className="font-semibold text-brand-brown mb-3">Your Items</p>
          {order.items?.map((i) => (
            <div key={i.id} className="flex justify-between text-sm py-1 border-b border-gray-100">
              <span>{i.quantity}× {i.item?.name}</span>
              <span>${(Number(i.unit_price) * i.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-brand-brown mt-2">
            <span>Total</span><span>${Number(order.total).toFixed(2)}</span>
          </div>
        </div>

        {order.status === 'ready' ? (
          <button
            onClick={() => navigate('/menu')}
            className="w-full bg-brand-brown text-white py-3 rounded-xl font-bold"
          >
            Order Again ☕
          </button>
        ) : null}
      </div>
    </div>
  );
}

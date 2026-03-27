import { useNavigate, useParams, useLocation } from 'react-router-dom';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const order = state?.order;
  const pointsEarned = order?.loyalty_points_earned ?? 0;
  const customerName = order?.customer_name ?? null;

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-sm w-full text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-brand-brown mb-1">Order Placed!</h1>
        <p className="text-gray-500 mb-2">Your order is being processed</p>

        {order && (
          <>
            <div className="bg-brand-cream rounded-xl p-3 my-4">
              <p className="text-sm text-gray-500">Order #</p>
              <p className="text-3xl font-bold text-brand-brown tracking-widest">{order.order_num}</p>
            </div>

            <div className="text-left mb-4">
              {order.items?.map((i) => (
                <div key={i.id} className="flex justify-between text-sm py-1 border-b border-gray-100">
                  <span>{i.quantity}× {i.item?.name}</span>
                  <span className="text-brand-brown">${(Number(i.unit_price) * i.quantity).toFixed(2)}</span>
                </div>
              ))}
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-sm text-green-600 mt-1">
                  <span>Discount{order.promo_code ? ` (${order.promo_code})` : ''}</span>
                  <span>−${Number(order.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-brand-brown mt-2">
                <span>Total</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
            </div>

            {pointsEarned > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-center">
                <p className="text-amber-800 font-semibold text-sm">
                  ⭐ +{pointsEarned} loyalty points earned{customerName ? `, ${customerName}` : ''}!
                </p>
              </div>
            )}
          </>
        )}

        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={() => navigate(`/order/${id}`)}
            className="w-full bg-brand-brown text-white py-3 rounded-xl font-semibold"
          >
            Track Order Status →
          </button>
          <button
            onClick={() => navigate('/menu')}
            className="w-full text-brand-brown text-sm"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}

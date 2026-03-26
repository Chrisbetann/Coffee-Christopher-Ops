import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminReviews, deleteReview } from '../../api';

export default function ReviewModeration() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await getAdminReviews();
    setReviews(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    if (!confirm('Delete this review?')) return;
    await deleteReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <AdminLayout title="Review Moderation">
      <p className="text-sm text-gray-500 mb-4">{reviews.length} total reviews</p>

      {loading ? (
        <p className="text-gray-400">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-400">No reviews yet</div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-brand-dark">{r.item?.name}</span>
                    <span className="text-yellow-400 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600 mb-1">{r.comment}</p>}
                  <p className="text-xs text-gray-400">
                    Order #{r.order?.order_num} — {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="text-red-400 hover:text-red-600 text-xs font-medium shrink-0 ml-4"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login, isAuth } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (isAuth) navigate('/admin/dashboard');
  }, [isAuth, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-sm">
        <div className="text-center mb-6">
          <p className="text-4xl mb-2">☕</p>
          <h1 className="text-2xl font-bold text-brand-brown">Coffee Christopher</h1>
          <p className="text-gray-500 text-sm">Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-brand-tan rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown"
              placeholder="admin@coffeechristopher.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-brand-tan rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-brown"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-brown text-white py-3 rounded-xl font-bold disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

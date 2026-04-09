import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import MenuHome          from './pages/customer/MenuHome';
import ItemDetail        from './pages/customer/ItemDetail';
import Cart              from './pages/customer/Cart';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import OrderStatus       from './pages/customer/OrderStatus';
import LoyaltyHome     from './pages/customer/LoyaltyHome';
import LoyaltyRegister  from './pages/customer/LoyaltyRegister';
import LoyaltyCard      from './pages/customer/LoyaltyCard';

import Login             from './pages/admin/Login';
import Dashboard         from './pages/admin/Dashboard';
import OrderQueue        from './pages/admin/OrderQueue';
import MenuManagement    from './pages/admin/MenuManagement';
import SalesDashboard    from './pages/admin/SalesDashboard';
import InventoryTracking from './pages/admin/InventoryTracking';
import ReviewModeration  from './pages/admin/ReviewModeration';
import LoyaltyManagement from './pages/admin/LoyaltyManagement';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Customer routes */}
            <Route path="/"            element={<Navigate to="/menu" replace />} />
            <Route path="/menu"        element={<MenuHome />} />
            <Route path="/menu/item/:id" element={<ItemDetail />} />
            <Route path="/cart"        element={<Cart />} />
            <Route path="/order/:id/confirmed" element={<OrderConfirmation />} />
            <Route path="/order/:id"   element={<OrderStatus />} />
            <Route path="/loyalty"           element={<LoyaltyHome />} />
            <Route path="/loyalty/register" element={<LoyaltyRegister />} />
            <Route path="/loyalty/:qrCode"  element={<LoyaltyCard />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin"       element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/orders"    element={<ProtectedRoute><OrderQueue /></ProtectedRoute>} />
            <Route path="/admin/menu"      element={<ProtectedRoute><MenuManagement /></ProtectedRoute>} />
            <Route path="/admin/sales"     element={<ProtectedRoute><SalesDashboard /></ProtectedRoute>} />
            <Route path="/admin/inventory" element={<ProtectedRoute><InventoryTracking /></ProtectedRoute>} />
            <Route path="/admin/reviews"   element={<ProtectedRoute><ReviewModeration /></ProtectedRoute>} />
            <Route path="/admin/loyalty"   element={<ProtectedRoute><LoyaltyManagement /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

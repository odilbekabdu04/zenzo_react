import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import SuperAdminLogin from './pages/SuperAdminLogin';   // ✅ BU IMPORT SHART
import Users from './pages/dashboard/Users';
import Products from './pages/dashboard/Products';
import Orders from './pages/dashboard/Orders';
import Stats from './pages/dashboard/Stats';
import Settings from './pages/dashboard/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 🔐 SUPER ADMIN LOGIN ROUTE */}
            <Route path="/super-admin" element={<SuperAdminLogin />} />

            {/* DASHBOARD */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard/overview" replace />} />
              <Route path="overview" element={<Dashboard.Overview />} />
              <Route path="users" element={<Users />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="stats" element={<Stats />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* MARKET */}
            <Route
              path="/market"
              element={
                <ProtectedRoute allowedRoles={['admin', 'customer']}>
                  <Market />
                </ProtectedRoute>
              }
            />

            <Route
              path="/product/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'customer']}>
                  <ProductDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={['admin', 'customer']}>
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
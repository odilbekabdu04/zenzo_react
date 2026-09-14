import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import SplashScreen from './components/SplashScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import SuperAdminLogin from './pages/SuperAdminLogin';
import Users from './pages/dashboard/Users';
import Products from './pages/dashboard/Products';
import Orders from './pages/dashboard/Orders';
import Stats from './pages/dashboard/Stats';
import Settings from './pages/dashboard/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Sessiyada bir marta ko'rsatamiz
    const seen = sessionStorage.getItem('zenzo_splash_shown');
    if (!seen) {
      setShowSplash(true);
    }
  }, []);

  const handleSplashFinish = () => {
    sessionStorage.setItem('zenzo_splash_shown', 'true');
    setShowSplash(false);
  };

  // Splash ko'rsatish
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Asosiy ilova
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/super-admin" element={<SuperAdminLogin />} />

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